/*
Script: Fxpack.js
	More Specific Effects.

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
		
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>, <Fx.js>

*/

/*		
Class: Fx.Scroll
	The scroller effect; scrolls an element or the window to a location. Extends <Fx.Base>, inherits all its properties.

Arguments:
	el - the $(element) to apply the style transition to
	options - the Fx.Base options (see: <Fx.Base>)
*/

Fx.Scroll = Fx.Base.extend({

	initialize: function(el, options) {
		this.element = $(el);
		this.setOptions(options);
	},
	
	/*	
	Property: down
		Scrolls an element down to the bottom of its scroll height.
	*/

	down: function(){
		return this.custom(this.element.scrollTop, this.element.scrollHeight-this.element.offsetHeight);
	},
	
	/*
	Property: up
		Scrolls an element up to the top of its scroll height.
	*/

	up: function(){
		return this.custom(this.element.scrollTop, 0);
	},

	increase: function(){
		this.element.scrollTop = this.now;
	}
});

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
		this.element = $(el);
		this.wrapper = new Element('div').injectAfter(this.element).setStyle('overflow', 'hidden').adopt(this.element);
		this.setOptions(options);
		if (!this.options.mode) this.options.mode = 'vertical';
		this.now = [];
	},

	setNow: function(){
		[0,1].each(function(i){
			this.now[i] = this.compute(this.from[i], this.to[i]);
		}, this);
	},

	vertical: function(){
		this.margin = 'top';
		this.layout = 'height';
		this.startPosition = [this.element.scrollHeight, '0'];
		this.endPosition = ['0', -this.element.scrollHeight];
		return this;
	},

	horizontal: function(){
		this.margin = 'left';
		this.layout = 'width';
		this.startPosition = [this.element.scrollWidth, '0'];
		this.endPosition = ['0', -this.element.scrollWidth];
		return this;
	},
	
	/*
	Property: hide
		Hides the element without a transition.
	*/

	hide: function(){
		this[this.options.mode]();
		this.wrapper.setStyle(this.layout, '0');
		this.element.setStyle('margin-'+this.margin, -this.element['scroll'+this.layout.capitalize()]+this.options.unit);
		return this;
	},
	
	/*
	Property: show
		Shows the element without a transition.
	*/

	show: function(){
		this[this.options.mode]();
		this.wrapper.setStyle(this.layout, this.element['scroll'+this.layout.capitalize()]+this.options.unit);
		this.element.setStyle('margin-'+this.margin, '0');
		return this;
	},
	
	/*
	Property: toggle
		Hides or shows a slide element, depending on its state;
	*/

	toggle: function(mode){
		this[this.options.mode]();
		if (this.wrapper['offset'+this.layout.capitalize()] > 0) return this.custom(this.startPosition, this.endPosition);
		else return this.custom(this.endPosition, this.startPosition);
	},

	increase: function(){		
		this.wrapper.setStyle(this.layout, this.now[0]+this.options.unit);
		this.element.setStyle('margin-'+this.margin, this.now[1]+this.options.unit);
	}
	
});

/*
Class: Fx.Color
	Smoothly transitions the color of an element; Extends <Fx.Base>, inherits all its properties.
	
Credits:
	fx.Color, originally by Tom Jensen (http://neuemusic.com) MIT-style LICENSE.
	
Arguments:
	same arguments as <Fx.Style>, only accepts color based properties.
	
Example:
	(start code)
	var myColorFx = new Fx.Color('myElement', 'color', {duration: 500});
	myColorFx.custom('000000', 'FF0000') //fade from black to red
	(end)
*/

Fx.Color = Fx.Base.extend({

	initialize: function(el, property, options){
		this.element = $(el);
		this.setOptions(options);
		this.property = property;
		this.now = [];
	},

	/*	
	Property: custom
		Transitions one color of the element specified in class creation smoothly from one color to the next.
		
	Arguments:
		from - the starting color
		to - the ending color
		
	Note:
		Both values can be any of the following formats:
		'#333' - css shorthand with the hash
		'333' - or without the hash
		'#333333' - css longhand with the hash
		'333333' - without the hash
	*/

	custom: function(from, to){
		return this.parent(from.hexToRgb(true), to.hexToRgb(true));
	},

	setNow: function(){
		[0,1,2].each(function(i){
			this.now[i] = Math.round(this.compute(this.from[i], this.to[i]));
		}, this);
	},

	increase: function(){
		this.element.setStyle(this.property, "rgb("+this.now[0]+","+this.now[1]+","+this.now[2]+")");
	},
	
	/*	
	Property: fromColor
		Transitions from the color passed in to the current color of the element.
		
	Arguments:
		color - the color to transition *from* to the current color of the element.
		
	Example:
		>myColorFx.fromColor('F00') //transition from red to whatever color the element is currently
	*/

	fromColor: function(color){
		return this.custom(color, this.element.getStyle(this.property));
	},
	
	/*	
	Property: toColor
		Transitions to the color passed in from the current color of the element.
		
	Arguments:
		color - the color to transition *to* from the current color of the element.
		
	Example:
		>myColorFx.toColor('F00') //transition from whatever color the element is currently to red
	*/
	
	toColor: function(color){
		return this.custom(this.element.getStyle(this.property), color);
	}

});