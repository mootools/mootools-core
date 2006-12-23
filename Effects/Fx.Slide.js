/*
Script: Fx.Slide.js
	Contains <Fx.Slide>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Fx.Slide
	The slide effect; slides an element in horizontally or vertically, the contents will fold inside. Extends <Fx.Base>, inherits all its properties.

Note:
	This effect works on any block element, but the element *cannot be positioned*; no margins or absolute positions. To position the element, put it inside another element (a wrapper div, for instance) and position that instead.

Options:
	mode - set it to vertical or horizontal. Defaults to vertical.
	and all the <Fx.Base> options

Example:
	(start code)
	var mySlider = new Fx.Slide('myElement', {duration: 500});
	mySlider.toggle() //toggle the slider up and down.
	(end)
*/

Fx.Slide = Fx.Base.extend({

	initialize: function(el, options){
		this.element = $(el).setStyle('margin', 0);
		this.wrapper = new Element('div').injectAfter(this.element).setStyle('overflow', 'hidden').adopt(this.element);
		this.setOptions({'mode': 'vertical'}, options);
		this.now = [];
		this.parent(this.options);
	},

	setNow: function(){
		for (var i = 0; i < 2; i++) this.now[i] = this.compute(this.from[i], this.to[i]);
	},

	vertical: function(){
		this.margin = 'top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
		return [this.element.getStyle('margin-top').toInt(), this.wrapper.getStyle('height').toInt()];
	},

	horizontal: function(){
		this.margin = 'left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
		return [this.element.getStyle('margin-left').toInt(), this.wrapper.getStyle('width').toInt()];
	},

	/*
	Property: slideIn
		slides the elements in view horizontally or vertically, depending on the mode parameter or options.mode.
	*/

	slideIn: function(mode){
		return this.start(this[mode || this.options.mode](), [0, this.offset]);
	},

	/*
	Property: slideOut
		slides the elements out of the view horizontally or vertically, depending on the mode parameter or options.mode.
	*/

	slideOut: function(mode){
		return this.start(this[mode || this.options.mode](), [-this.offset, 0]);
	},

	/*
	Property: hide
		Hides the element without a transition.
	*/

	hide: function(mode){
		this[mode || this.options.mode]();
		return this.set([-this.offset, 0]);
	},

	/*
	Property: show
		Shows the element without a transition.
	*/

	show: function(mode){
		this[mode || this.options.mode]();
		return this.set([0, this.offset]);
	},

	/*
	Property: toggle
		Slides in or Out the element, depending on its state
	*/

	toggle: function(mode){
		if (this.wrapper.offsetHeight == 0 || this.wrapper.offsetWidth == 0) return this.slideIn(mode);
		else return this.slideOut(mode);
	},

	increase: function(){
		this.element.setStyle('margin-'+this.margin, this.now[0]+this.options.unit);
		this.wrapper.setStyle(this.layout, this.now[1]+this.options.unit);
	}

});