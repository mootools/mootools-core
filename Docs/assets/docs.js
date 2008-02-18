var Docs = {

	anchorsPath: '../Docs/index.html',

	start: function(){
		if (location.protocol == 'file:') Docs.local();
		var menu = $('menu-wrapper'), elements = [], files;
		var request = new Request({ link: 'cancel', onSuccess: Docs.update });

		Docs.Scripts.each(function(scripts, folder){
			var head = new Element('h2', { 'text': folder });
			var list = new Element('ul', { 'class': 'folder' });

			list.adopt(scripts.map(function(script){
				var file = new Element('h3').adopt(new Element('a', {
					'text': script,
					'href': '#' + folder + '/' + script,
					'events': {
						'click': function(){
							$('docs-wrapper').empty().set('html', '<h2>Loading...</h2>');
							files.removeClass('selected');
							file.addClass('selected');
							request.get(this.get('href').split('#')[1] + '.md');
						}
					}
				}));
				return new Element('li').adopt(file);
			}));

			elements.push(head);
			elements.push(list);
		});

		files = menu.adopt(elements).getElements('h3');
		(document.getElement('#menu a[href=' + window.location.hash + ']') || document.getElement('#menu a')).fireEvent('click');
	},

	local: function() {
		Request.implement({
			getXHR: function(){
				return (window.ActiveXObject) ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
			},
			isSuccess: function() {
				return (!this.status || (this.status >= 200) && (this.status < 300));
			}
		});
	},

	update: function(markdown){
		var wrapper = $('docs-wrapper'), submenu = $('submenu');
		if (!submenu) submenu = new Element('div').set('id', 'submenu');

		var parse = Docs.parse(markdown);
		wrapper.set('html', parse.innerHTML);
		document.getElement('#menu-wrapper h3.selected').getParent().grab(submenu.empty());	

		var methods = Docs.methods(parse, submenu);
		Docs.scroll();
	},

	parse: function(markdown){
		var html = ShowDown(markdown);
		var temp = new Element('div').set('html', html);
		var anchor = (/\{#(.*)\}/);

		temp.getElements('h1, h2, h3, h4, h5, h6').each(function(h){
			var matches = h.innerHTML.match(anchor);
			if (matches) h.set('id', matches[1]);
			h.innerHTML = h.innerHTML.replace(anchor, '');
		});

		var heading = temp.getElement('h1');
		if (heading) heading.set('class', 'first');
		return temp;
	},

	methods: function(parse, wrapper) {
		var headers = parse.getElements('h1');
		var anchors = parse.getElements('h2[id]');

		headers.each(function(header, i) {
			var group = new Element('ul').inject(wrapper);
			var head = header.get('text').split(':');
			head = (head.length == 1) ? head[0] : head[1];
			var section = header.id.split(':')[0];

			var lnk = '<a href="' + Docs.anchorsPath + '#' + header.id+ '">' + head + '</a>';
			new Element('li').set('html', lnk).inject(group);
			var subgroup = new Element('ul', {'class': 'subgroup'}).inject(group);

			anchors.each(function(anchor) {
				var sep = anchor.id.match(':');
				var subSection = anchor.id.split(':')[0];
				if (section == subSection || (!i && !sep)) {
					var method = anchor.get('text').replace(section, '');
					lnk = '<a href="' + Docs.anchorsPath + '#' + anchor.id + '">' + method + '</a>';
					new Element('li').set('html', lnk).inject(subgroup);
				}
			});
		});
	},

	scroll: function() {
		if (!Docs.scrolling) Docs.scrolling = new Fx.Scroll('docs', {'offset': {x: 0, y: -4}});

		$$('#submenu a').each(function(anchor) {
			anchor.addEvent('click', function(e) {
				e.stop();
				var lnk = $(anchor.href.split('#')[1]);
				Docs.scrolling.toElement(lnk);
			});
		});
	}

};

Docs.Scripts = new Hash({
	'Core':      ['Core', 'Browser'],
	'Native':    ['Array', 'Function', 'Number', 'String', 'Hash', 'Event'],
	'Class':     ['Class', 'Class.Extras'],
	'Element':   ['Element', 'Element.Event', 'Element.Style'],
	'Selectors': ['Selectors'],
	'Fx':        ['Fx', 'Fx.CSS', 'Fx.Tween', 'Fx.Morph', 'Fx.Slide', 'Fx.Scroll', 'Fx.Transitions'],
	'Request':   ['Request', 'Request.HTML', 'Request.JSON'],
	'Utilities': ['JSON', 'Cookie', 'Dimensions', 'Swiff', 'Color', 'Group'],
	'Drag':      ['Drag', 'Drag.Move'],
	'Plugins':   ['Selectors.Children', 'Hash.Cookie', 'Sortables', 'Tips', 'SmoothScroll', 'Slider', 'Scroller', 'Assets', 'Fx.Elements', 'Accordion']
});

var ShowDown = function(text){
	return new Showdown.converter().makeHtml(text);
};

window.addEvent('domready', Docs.start);