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

Syntax:
	>var myFx = new Fx.Style(element, property[, options]);

Arguments:
	el - (mixed) A string ID of the Element or an Element to apply the style transitions to.
	property - (string) The property to transition.
	options - (object, optional) The <Fx> options object.

Returns:
	(class) A new Fx.Style instance.

Example:
	(start code)
	var marginFx = new Fx.Style('myElement', 'margin-top', {duration:500}).start(10, 100);
	(end)

Note:
	Colors must be in hex format.

See Also:
	<Fx>
*/

Fx.Style = new Class({

	Extends: Fx,

	initialize: function(element, property, options){
		this.parent($(element), options);
		this.property = property;
	},

	/*
	Property: hide
		Same as <Fx.set>(0). Hides the element immediately without transition.

	Syntax:
		>myFx.hide();

	Returns:
		(class) This Fx.Style instance.

	Example:
		(start code)
		var myFx = new Fx.Style('myElement', 'opacity').hide(); // *poof*
		(end)

	Note:
		Due to inheritance the Event 'onSet' will be fired.
	*/

	hide: function(){
		return this.set(0);
	},

	setNow: function(){
		this.now = Fx.CSS.compute(this.from, this.to, this);
	},

	/*
	Property: set
		Sets the Element's css property to the specified value immediately.

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (mixed) Sets the Element to the value.

	Returns:
		(class) This Fx.Style instance.

	Example:
		(start code)
		var marginFx = new Fx.Style('myElement', 'margin-top').set(10); //margin-top is set to 10px immediately
		(end)
	*/

	set: function(to){
		return this.parent(Fx.CSS.set(to));
	},

	/*
	Property: start
		Displays the transition to the value/values passed in

	Syntax:
		>myFx.start([from,] to);

	Arguments:
		from - (integer, optional) The starting value for the transition.
		to - (integer) The ending value for the transition.

	Returns:
		(class) This Fx.Style instance.

	Example:
		(start code)
		var marginFx = new Fx.Style('myElement', 'margin-top').start(10); //tries to read current margin top value and goes from current to 10
		(end)

	Note:
		If you provide only one argument, the transition will use the current css value for its starting value.
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
		Applies an <Fx.Style> to the Element. This a shortcut for <Fx.Style>.

	Syntax:
		>var myFx = myElement.effect(property[, options]);

	Arguments:
		property - (string) The css property to alter.
		options - (object, optional) The <Fx> options object.

	Returns:
		(class) A new Fx.Style instance.

	Example:
		(start code)
		var myEffect = $('myElement').effect('height', {duration: 1000, transition: Fx.Transitions.Sine.easeOut}).start(10, 100);
		(end)

	See Also:
		<Fx.Style>
	*/

	effect: function(property, options){
		return new Fx.Style(this, property, options);
	}

});