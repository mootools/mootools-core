/*
Script: Fx.Utils.js
	Contains Fx.Height, Fx.Width, Fx.Opacity. Only useful if you really, really need to toggle those values, and toggling only works in STRICT DOCTYPE.
	See <Fx.Style> for a better alternative.

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Fx.Height
	Alters the height of an element. Extends <Fx.Style> (and consequentially <Fx.Base>), and inherits all its methods.

Arguments:
	el - the $(element) to apply the style transition to
	options - the Fx.Base options (see: <Fx.Base>)

Example:
	>var myEffect = new Fx.Height('myElementId', {duration: 500});
	>myEffect.toggle(); //will close the element if open, and vice-versa.
*/

Fx.Height = Fx.Style.extend({

	initialize: function(el, options){
		$(el).setStyle('overflow', 'hidden');
		this.parent(el, 'height', options);
	},

	/*
	Property: toggle
		Toggles the height of an element from zero to it's scrollHeight, and vice-versa.
	*/

	toggle: function(){
		var style = this.element.getStyle('height').toInt();
		if (style > 0) return this.start(style, 0);
		else return this.start(0, this.element.scrollHeight);
	},

	/*
	Property: show
		Size the element to its full scrollHeight immediatly, without applying a transition.
	*/

	show: function(){
		return this.set(this.element.scrollHeight);
	}

});

/*
Class: Fx.Width
	Same as Fx.Height, but uses Width. It always toggles from its initial width to zero, and vice versa.
*/

Fx.Width = Fx.Style.extend({

	initialize: function(el, options){
		this.element = $(el);
		this.element.setStyle('overflow', 'hidden');
		this.iniWidth = this.element.getStyle('width').toInt();
		this.parent(this.element, 'width', options);
	},

	toggle: function(){
		var style = this.element.getStyle('width').toInt();
		if (style > 0) return this.start(style, 0);
		else return this.start(0, this.iniWidth);
	},

	show: function(){
		return this.set(this.iniWidth);
	}

});

/*
Class: Fx.Opacity
	Same as Fx.Height, but uses Opacity. It always toggles from opaque to transparent, and vice versa.
*/

Fx.Opacity = Fx.Style.extend({

	initialize: function(el, options){
		this.now = 1;
		this.parent(el, 'opacity', options);
	},

	toggle: function(){
		if (this.now > 0) return this.start(1, 0);
		else return this.start(0, 1);
	},

	show: function(){
		return this.set(1);
	}

});