/*
Script: Tips.js
	Tooltips, BubbleTips, whatever they are, they will appear on mouseover

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.

Credits:
	The idea behind Tips.js is based on Bubble Tooltips (<http://web-graphics.com/mtarchive/001717.php>) by Alessandro Fulcitiniti <http://web-graphics.com>
*/

/*
Class: Tips
	Display a tip on any element with a title and/or href.

Arguments: 
	elements - a collection of elements to apply the tooltips to on mouseover.
	options - an object. See options Below.

Options:
	maxTitleChars - the maximum number of characters to display in the title of the tip. defaults to 30.
	timeOut - the delay to wait to show the tip (how long the user must hover to have the tooltip appear). defaults to 100.

	onShow - optionally you can alter the default onShow behaviour with this option (like displaying a fade in effect);
	onHide - optionally you can alter the default onHide behaviour with this option (like displaying a fade out effect);

	showDelay - the delay the onShow method is called. (defaults to 100 ms)
	hideDelay - the delay the onHide method is called. (defaults to 100 ms)

	className - the prefix for your tooltip classNames. defaults to 'tool'. 
		the whole tooltip will have as classname: tool-tip
		the title will have as classname: tool-title
		the text will have as classname: tool-text

	offsets - the distance of your tooltip from the mouse. an Object with x/y properties.

	fixed - if set to true, the toolTip will not follow the mouse.

Example:
	(start code)
	<img src="/images/i.png" title="The body of the tooltip is stored in the title" class="toolTipImg"/>
	<script>
		var myTips = new Tips($$('.toolTipImg'), {
			maxTitleChars: 50	//I like my captions a little long
		});
	</script>
	(end)
*/

var Tips = new Class({

	getOptions: function(){
		return {
			onShow: function(tip){
				tip.setStyle('visibility', 'visible');
			},
			onHide: function(tip){
				tip.setStyle('visibility', 'hidden');
			},
			maxTitleChars: 30,
			showDelay: 100,
			hideDelay: 100,
			className: 'tool',
			offsets: {'x': 16, 'y': 16},
			fixed: false
		};
	},

	initialize: function(elements, options){
		this.setOptions(this.getOptions(), options);
		this.toolTip = new Element('div').addClass(this.options.className+'-tip').setStyles({
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'visibility': 'hidden'
		}).injectInside(document.body);
		this.wrapper = new Element('div').injectInside(this.toolTip);
		$each(elements, function(el){
			this.build($(el));
		}, this);
		if (this.options.initialize) this.options.initialize.call(this);
	},

	build: function(el){
		el.myTitle = el.href ? el.href.replace('http://', '') : (el.rel || false);
		if (el.title){
			var dual = el.title.split('::');
			if (dual.length > 1) {
				el.myTitle = dual[0].trim();
				el.myText = dual[1].trim();
			} else {
				el.myText = el.title;
			}
			el.removeAttribute('title');
		} else {
			el.myText = false;
		}
		if (el.myTitle && el.myTitle.length > this.options.maxTitleChars) el.myTitle = el.myTitle.substr(0, this.options.maxTitleChars - 1) + "&hellip;";
		el.addEvent('mouseover', function(event){
			this.start(el);
			this.locate(event);
		}.bindWithEvent(this));
		if (!this.options.fixed) el.addEvent('mousemove', this.locate.bindWithEvent(this));
		el.addEvent('mouseout', this.end.bindWithEvent(this));
	},

	start: function(el){
		this.wrapper.setHTML('');
		if (el.myTitle){
			new Element('span').injectInside(
				new Element('div').addClass(this.options.className+'-title').injectInside(this.wrapper)
			).setHTML(el.myTitle);
		}
		if (el.myText){
			new Element('span').injectInside(
				new Element('div').addClass(this.options.className+'-text').injectInside(this.wrapper)
			).setHTML(el.myText);
		}
		$clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);
	},

	end: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
		event.stop();
	},

	locate: function(event){
		var win = {'x': window.getWidth(), 'y': window.getHeight()};
		var scroll = {'x': window.getScrollLeft(), 'y': window.getScrollTop()};
		var tip = {'x': this.toolTip.offsetWidth, 'y': this.toolTip.offsetHeight};
		var prop = {'x': 'left', 'y': 'top'};
		for (var z in prop){
			var pos = event.page[z] + this.options.offsets[z];
			if ((pos + tip[z] - scroll[z]) > win[z]) pos = event.page[z] - this.options.offsets[z] - tip[z];
			this.toolTip.setStyle(prop[z], pos + 'px');
		};
		event.stop();
	},

	show: function(){
		this.fireEvent('onShow', [this.toolTip]);
	},

	hide: function(){
		this.fireEvent('onHide', [this.toolTip]);
	}

});

Tips.implement(new Events);
Tips.implement(new Options);