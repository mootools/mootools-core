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
	Inherits methods, properties, options and events from <Fx.Base>.

Arguments:
	el - the $(element) to apply the style transition to
	property - the property to transition
	options - the Fx.Base options (see: <Fx.Base>)

Example:
	>var marginChange = new Fx.Style('myElement', 'margin-top', {duration:500});
	>marginChange.start(10, 100);
*/

Fx.Style = Fx.Base.extend({

	initialize: function(el, property, options){
		this.element = $(el);
		this.property = property;
		this.parent(options);
	},

	/*
	Property: hide
		Same as <Fx.Base.set> (0); hides the element immediately without transition.
	*/

	hide: function(){
		return this.set(0);
	},

	setNow: function(){
		this.now = this.css.getNow(this.from, this.to, this);
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
		this.css = Fx.CSS.select(this.property, to);
		return this.parent(this.css.parse(to));
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
		var parsed = Fx.CSS.parse(this.element, this.property, [from, to]);
		this.css = parsed.css;
		return this.parent(parsed.from, parsed.to);
	},

	increase: function(){
		this.element.setStyle(this.property, this.css.getValue(this.now, this.options.unit, this.property));
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