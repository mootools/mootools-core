/*
Script: Fx.Style.js
	Contains <Fx.Style>

License:
	MIT-style license.
*/

/*
Class: Fx.Style
	The Style effect, used to transition any css property from one value to another. Includes colors.
	Colors must be in hex format.
	Inherits methods, properties, options and events from <Fx>.

Arguments:
	el - the $(element) to apply the style transition to
	property - the property to transition
	options - the Fx options (see: <Fx>)

Example:
	>var marginChange = new Fx.Style('myElement', 'margin-top', {duration:500});
	>marginChange.start(10, 100);
*/

Fx.Style = new Class({
	
	Extends: Fx,

	initialize: function(element, property, options){
		this.parent($(element), options);
		this.property = property;
	},

	/*
	Property: hide
		Same as <Fx.set> (0); hides the element immediately without transition.
	*/

	hide: function(){
		return this.set(0);
	},

	setNow: function(){
		this.now = Fx.CSS.compute(this.from, this.to, this);
	},

	/*
	Property: set
		Sets the element's css property (specified at instantiation) to the specified value immediately.

	Example:
		(start code)
		var marginChange = new Fx.Style('myElement', 'margin-top', {duration:500});
		marginChange.set(10); //margin-top is set to 10px immediately
		(end)
	*/

	set: function(to){
		return this.parent(Fx.CSS.set(to));
	},

	/*
	Property: start
		Displays the transition to the value/values passed in

	Arguments:
		from - (integer; optional) the starting position for the transition
		to - (integer) the ending position for the transition

	Note:
		If you provide only one argument, the transition will use the current css value for its starting value.

	Example:
		(start code)
		var marginChange = new Fx.Style('myElement', 'margin-top', {duration:500});
		marginChange.start(10); //tries to read current margin top value and goes from current to 10
		(end)
	*/

	start: function(from, to){
		if (this.timer && this.options.wait) return this;
		var parsed = Fx.CSS.prepare(this.element, this.property, [from, to]);
		return this.parent(parsed.from, parsed.to);
	},

	increase: function(){
		this.element.setStyle(this.property, Fx.CSS.serve(this.now, this.options.unit));
	}

});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: effect
		Applies an <Fx.Style> to the Element; This a shortcut for <Fx.Style>.

	Arguments:
		property - (string) the css property to alter
		options - (object; optional) key/value set of options (see <Fx.Style>)

	Example:
		>var myEffect = $('myElement').effect('height', {duration: 1000, transition: Fx.Transitions.linear});
		>myEffect.start(10, 100);
		>//OR
		>$('myElement').effect('height', {duration: 1000, transition: Fx.Transitions.linear}).start(10,100);
	*/

	effect: function(property, options){
		return new Fx.Style(this, property, options);
	}

});