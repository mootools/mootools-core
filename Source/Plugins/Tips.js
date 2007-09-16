/*
Script: Tips.js
	Tooltips, BubbleTips, whatever they are, they will appear on mouseover.

License:
	MIT-style license.

Credits:
	The idea behind Tips.js is based on Bubble Tooltips (<http://web-graphics.com/mtarchive/001717.php>) by Alessandro Fulcitiniti <http://web-graphics.com/>

Note:
	Tips requires an XHTML doctype.
*/

/*
Class: Tips
	Display a tip on any element with a title and/or href.

Implements:
	<Events>, <Options>

Arguments:
	elements - (mixed) A collection of elements, a string Selector, or an Element to apply the tooltips to on mouseover.
	options  - (object) An object to customize this Tips instance.

	options (continued):
		maxTitleChars - (number: defaults to 30) The maximum number of characters to display in the title of the tip.
		showDelay     - (number: defaults to 100) The delay the onShow method is called.
		hideDelay     - (number: defaults to 100) The delay the onHide method is called.
		className     - (string: defaults to 'tool') The prefix for your tooltip classNames.
		offsets       - (object: defaults to {'x': 16, 'y': 16}) The distance of your tooltip from the mouse.
		fixed         - (boolean: defaults to false) If set to true, the toolTip will not follow the mouse.

		className (continued):
			- The whole tooltip will have as classname: tool-tip
			- The title will have as classname: tool-title
			- The text will have as classname: tool-text

Properties:
	toolTip - (element) The Element containing the tip content; this element is the one positioned around the document relative to the target.
	wrapper - (element) An Element inside the toolTip Element that contains the body of the tip.
	title   - (element) The Element generated each time a tip is shown for the title of each tooltip.
	text    - (element) The Element generated each time a tip is shown for the body of each tooltip.

Events:
	onShow - (function) Fires when the Tip is starting to show and by default sets the tip visible.
		Signature:
			>onShow(tip)

		Arguments:
			tip - (element) The Tip Element that is showing.

	onHide - (function) Fires when the Tip is starting to hide and by default sets the tip hidden.
		Signature:
			>onHide(tip)

		Arguments:
			tip - (element) The Tip Element that is hiding.

Returns:
	(class) A new Tips class instance.

Example:
	[html]
		<img src="/images/i.png" title="The body of the tooltip is stored in the title" class="toolTipImg"/>
	[/html]

	[javascript]
		var myTips = new Tips($$('.toolTipImg'), {
			maxTitleChars: 50	//I like my captions a little long
		});
	[/javascript]

Note:
	The title of the element will always be used as the tooltip body. If you put :: on your title, the text before :: will become the tooltip title.
*/

var Tips = new Class({
	
	Implements: [Events, Options],

	options: {
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
		fixed: false,
		window: window
	},

	initialize: function(elements, options){
		this.setOptions(options);
		elements = $$(elements);
		this.document = elements[0].ownerDocument;
		this.window = this.document.window;
		this.toolTip = new Element('div', {
			'class': this.options.className + '-tip',
			'styles': {
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'visibility': 'hidden'
			}
		}, this.document).inject(this.document.body);
		this.wrapper = new Element('div').inject(this.toolTip);
		elements.each(this.build, this);
	},

	build: function(el){
		el.$attributes.myTitle = (el.href && el.getTag() == 'a') ? el.href.replace('http://', '') : (el.rel || false);
		if (el.title){
			var dual = el.title.split('::');
			if (dual.length > 1){
				el.$attributes.myTitle = dual[0].trim();
				el.$attributes.myText = dual[1].trim();
			} else {
				el.$attributes.myText = el.title;
			}
			el.removeProperty('title');
		} else {
			el.$attributes.myText = false;
		}
		if (el.$attributes.myTitle && el.$attributes.myTitle.length > this.options.maxTitleChars)
			el.$attributes.myTitle = el.$attributes.myTitle.substr(0, this.options.maxTitleChars - 1) + "&hellip;";
		el.addEvent('mouseenter', function(event){
			this.start(el);
			if (!this.options.fixed) this.locate(event);
			else this.position(el);
		}.bind(this));
		if (!this.options.fixed) el.addEvent('mousemove', this.locate.bind(this));
		var end = this.end.bind(this);
		el.addEvent('mouseleave', end);
		el.addEvent('trash', end);
	},

	start: function(el){
		this.wrapper.empty();
		if (el.$attributes.myTitle){
			this.title = new Element('span').inject(
				new Element('div', {'class': this.options.className + '-title'}
			).inject(this.wrapper)).setHTML(el.$attributes.myTitle);
		}
		if (el.$attributes.myText){
			this.text = new Element('span').inject(
				new Element('div', {'class': this.options.className + '-text'}
			).inject(this.wrapper)).setHTML(el.$attributes.myText);
		}
		$clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);
	},

	end: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
	},

	position: function(element){
		var pos = element.getPosition();
		this.toolTip.setStyles({
			'left': pos.x + this.options.offsets.x,
			'top': pos.y + this.options.offsets.y
		});
	},

	locate: function(event){
		var win = {'x': this.window.getWidth(), 'y': this.window.getHeight()};
		var scroll = {'x': this.window.getScrollLeft(), 'y': this.window.getScrollTop()};
		var tip = {'x': this.toolTip.offsetWidth, 'y': this.toolTip.offsetHeight};
		var prop = {'x': 'left', 'y': 'top'};
		for (var z in prop){
			var pos = event.page[z] + this.options.offsets[z];
			if ((pos + tip[z] - scroll[z]) > win[z]) pos = event.page[z] - this.options.offsets[z] - tip[z];
			this.toolTip.setStyle(prop[z], pos);
		};
	},

	show: function(){
		if (this.options.timeout) this.timer = this.hide.delay(this.options.timeout, this);
		this.fireEvent('onShow', [this.toolTip]);
	},

	hide: function(){
		this.fireEvent('onHide', [this.toolTip]);
	}

});