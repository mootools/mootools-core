/*	
Script: Fxutils.js
		Contains Fx.Height, Fx.Width, Fx.Opacity. Only useful if you really, really need to toggle those values, and toggling only works in STRICT DOCTYPE.
		See <Fx.Style> for a better alternative.

Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>, <Fx.js>
	
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
		this.parent(el, 'height', options);
		this.element.setStyle('overflow', 'hidden');
	},
	
	/*
	Property: toggle
		Toggles the height of an element from zero to it's scrollHeight, and vice-versa.
	*/

	toggle: function(){
		if (this.element.offsetHeight > 0) return this.custom(this.element.offsetHeight, 0);
		else return this.custom(0, this.element.scrollHeight);
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
		this.parent(el, 'width', options);
		this.element.setStyle('overflow', 'hidden');
		this.iniWidth = this.element.offsetWidth;
	},

	toggle: function(){
		if (this.element.offsetWidth > 0) return this.custom(this.element.offsetWidth, 0);
		else return this.custom(0, this.iniWidth);
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
		this.parent(el, 'opacity', options);
		this.now = 1;
	},

	toggle: function(){
		if (this.now > 0) return this.custom(1, 0);
		else return this.custom(0, 1);
	},

	show: function(){
		return this.set(1);
	}

});