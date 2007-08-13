/*
Script: Accordion.js
	Contains <Accordion>

License:
	MIT-style license.
*/

/*
Class: Accordion
	The Accordion class creates a group of Elements that are toggled when their handles are clicked. When one Element toggles into view, the others toggle out.
	Inherits methods, properties, options and events from <Fx.Elements>.

Note:
	The Accordion requires an XHTML doctype.

Arguments:
	togglers - (array) [required] The collection of Elements representing the Elements which will be clickable and trigger the opening of sections of the Accordion.
	elements - (array) [required] The collection of Elements the transitions will be applied to.
	options - (object) [optional] See "Options" below.  Also utilizes <Fx> options and events.

Options:
	show - (integer) [0] The index of the element to be shown initially.
	display - (integer) [0] The index of the element to show at start (with a transition). defaults to 0.
	fixedHeight - (boolean) [false] If set to false, displayed elements will have a fixed height.
	fixedWidth - (boolean) [false] If set to true, displayed elements will have a fixed width.
	height - (boolean) [true] If set to true, a height transition effect will take place when switching between displayed elements.
	opacity - (boolean) [true] If set to true, an opacity transition effect will take place when switching between displayed elements.
	width - (boolean) [false]  If set to true, a width transition will take place when switching between displayed elements.  WARNING: CSS mastery is required to make this work!
	alwaysHide - (boolean) [false] If set to true, it will be possible to close all displayable elements.  Otherwise, one will remain open at all time.

Events:
	onActive - (function) Function to execute when an element starts to show.
	onBackground - (function) Function to execute when an element starts to hide.
*/

var Accordion = new Class({

	Extends: Fx.Elements,

	options: {
		/*onActive: $empty,
		onBackground: $empty,*/
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		fixedHeight: false,
		fixedWidth: false,
		wait: false,
		alwaysHide: false
	},

	initialize: function(){
		var params = Array.associate(arguments, {'container': 'element', 'options': 'object', 'togglers': true, 'elements': true});
		this.parent(params.elements, params.options);
		this.togglers = $$(params.togglers);
		this.container = $(params.container);
		this.previous = -1;
		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)){
			this.options.display = false;
			this.previous = this.options.show;
		}
		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}
		this.effects = {};
		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';
		for (var i = 0, l = this.togglers.length; i < l; i++) this.addSection(this.togglers[i], this.elements[i]);
		this.elements.each(function(el, i){
			if (this.options.show === i){
				this.fireEvent('onActive', [this.togglers[i], el]);
			} else {
				for (var fx in this.effects) el.setStyle(fx, 0);
			}
		}, this);
		if ($chk(this.options.display)) this.display(this.options.display);
	},

	/*
	Property: addSection
		Dynamically adds a new section into the Accordion at the specified position.

	Arguments:
		toggler - (Element) The Element that toggles the Accordion section open.
		element - (Element) The Element that should stretch open when the toggler is clicked.
		pos - (integer) The index at which these objects are to be inserted within the Accordion.
	*/

	addSection: function(toggler, element, pos){
		toggler = $(toggler);
		element = $(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		this.togglers.include(toggler);
		this.elements.include(element);
		if (len && (!test || pos)){
			pos = $pick(pos, len - 1);
			toggler.injectBefore(this.togglers[pos]);
			element.injectAfter(toggler);
		} else if (this.container && !test){
			toggler.inject(this.container);
			element.inject(this.container);
		}
		var idx = this.togglers.indexOf(toggler);
		toggler.addEvent('click', this.display.bind(this, idx));
		if (this.options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (this.options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});
		element.fullOpacity = 1;
		if (this.options.fixedWidth) element.fullWidth = this.options.fixedWidth;
		if (this.options.fixedHeight) element.fullHeight = this.options.fixedHeight;
		element.setStyle('overflow', 'hidden');
		if (!test){
			for (var fx in this.effects) element.setStyle(fx, 0);
		}
		return this;
	},

	/*
	Property: display
		Shows a specific section and hides all others. Useful when triggering an accordion from outside.

	Arguments:
		index - (mixed) [required] The index of the item to show, or the actual element to be displayed.
	*/

	display: function(index){
		index = ($type(index) == 'element') ? this.elements.indexOf(index) : index;
		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			var hide = (i != index) || (this.options.alwaysHide && (el.offsetHeight > 0));
			this.fireEvent(hide ? 'onBackground' : 'onActive', [this.togglers[i], el]);
			for (var fx in this.effects) obj[i][fx] = hide ? 0 : el[this.effects[fx]];
		}, this);
		return this.start(obj);
	},

	showThisHideOpen: function(index){return this.display(index);}

});

Fx.Accordion = Accordion;
