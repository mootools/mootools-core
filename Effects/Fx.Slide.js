/*
Script: Fx.Slide.js
	Contains <Fx.Slide>

License:
	MIT-style license.
*/

/*
Class: Fx.Slide
	The slide effect; slides an element in horizontally or vertically, the contents will fold inside.
	Inherits methods, properties, options and events from <Fx.Base>.
	
Note:
	Fx.Slide requires an XHTML doctype.

Options:
	mode - set it to vertical or horizontal. Defaults to vertical.
	options - all the <Fx.Base> options

Example:
	(start code)
	var mySlider = new Fx.Slide('myElement', {duration: 500});
	mySlider.toggle() //toggle the slider up and down.
	(end)
*/

Fx.Slide = Fx.Base.extend({

	options: {
		mode: 'vertical'
	},

	initialize: function(el, options){
		this.element = $(el);
		this.wrapper = new Element('div', {'styles': $extend(this.element.getStyles('margin'), {'overflow': 'hidden'})}).injectAfter(this.element).adopt(this.element);
		this.element.setStyle('margin', 0);
		this.setOptions(options);
		this.now = [];
		this.parent(this.options);
		this.open = true;
		this.addEvent('onComplete', function(){
			this.open = (this.now[0] === 0);
		});
		if (window.webkit419) this.addEvent('onComplete', function(){
			if (this.open) this.element.remove().inject(this.wrapper);
		});
	},

	setNow: function(){
		for (var i = 0; i < 2; i++) this.now[i] = this.compute(this.from[i], this.to[i]);
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	/*
	Property: slideIn
		Slides the elements in view horizontally or vertically.

	Arguments:
		mode - (optional, string) 'horizontal' or 'vertical'; defaults to options.mode.
	*/

	slideIn: function(mode){
		this[mode || this.options.mode]();
		return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [0, this.offset]);
	},

	/*
	Property: slideOut
		Sides the elements out of view horizontally or vertically.

	Arguments:
		mode - (optional, string) 'horizontal' or 'vertical'; defaults to options.mode.
	*/

	slideOut: function(mode){
		this[mode || this.options.mode]();
		return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [-this.offset, 0]);
	},

	/*
	Property: hide
		Hides the element without a transition.

	Arguments:
		mode - (optional, string) 'horizontal' or 'vertical'; defaults to options.mode.
	*/

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	/*
	Property: show
		Shows the element without a transition.

	Arguments:
		mode - (optional, string) 'horizontal' or 'vertical'; defaults to options.mode.
	*/

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	/*
	Property: toggle
		Slides in or Out the element, depending on its state

	Arguments:
		mode - (optional, string) 'horizontal' or 'vertical'; defaults to options.mode.

	*/

	toggle: function(mode){
		if (this.wrapper.offsetHeight == 0 || this.wrapper.offsetWidth == 0) return this.slideIn(mode);
		return this.slideOut(mode);
	},

	increase: function(){
		this.element.setStyle(this.margin, this.now[0] + this.options.unit);
		this.wrapper.setStyle(this.layout, this.now[1] + this.options.unit);
	}

});