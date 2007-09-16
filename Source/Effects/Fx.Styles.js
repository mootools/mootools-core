/*
Script: Fx.Styles.js
	Contains <Fx.Styles>

License:
	MIT-style license.
*/

/*
Class: Fx.Styles
	Allows you to animate multiple css properties at once. Inherits methods, properties, options and events from <Fx>.

Extends:
	<Fx>

Syntax:
	>var myFx = new Fx.Styles(element[, options]);

Arguments:
	el      - (mixed) A string ID of the Element or an Element to apply the style transitions to.
	options - (object, optional) The <Fx> options object.

Properties:
	now - (object) An object containing keys that specify css properties being altered and values for their current state.

Returns:
	(class) A new Fx.Styles instance.

Examples:
	From, To:
	[javascript]
		var myEffects = new Fx.Styles('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

		//height from 10 to 100 and width from 900 to 300
		myEffects.start({
			'height': [10, 100],
			'width': [900, 300]
		});
	[/javascript]

	To:
	[javascript]
		var myEffects = new Fx.Styles('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

		//or height from current height to 100 and width from current width to 300
		myEffects.start({
			'height': 100,
			'width': 300
		});
	[/javascript]

See Also:
	<Fx>
*/

Fx.Styles = new Class({

	Extends: Fx,

	initialize: function(element, options){
		arguments.callee.parent($(element), options);
	},

	setNow: function(){
		for (var p in this.from) this.now[p] = Fx.CSS.compute(this.from[p], this.to[p], this);
	},

	/*
	Method: set
		Sets the Element's css properties to the specified values immediately.

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (object) An object containing keys that specify css properties to alter with their respected values.

	Returns:
		(class) This Fx.Style instance.

	Example:
		[javascript]
			var myFx = new Fx.Styles('myElement').set({
				'height': 200,
				'width': 200,
				'background-color': '#f00',
				'opacity': 0
			});
		[/javascript]
	*/

	set: function(to){
		var parsed = {};
		for (var p in to) parsed[p] = Fx.CSS.set(to[p]);
		return arguments.callee.parent(parsed);
	},

	/*
	Method: start
		Executes a transition for any number of css properties in tandem.

	Syntax:
		>myFx.start(obj);

	Arguments:
		obj - (object) An object containing keys that specify css properties to alter and values that specify either the to value, or an array with from/to values.

	Returns:
		(class) This Fx.Styles instance.

	Example:
		[javascript]
			var myEffects = new Fx.Styles('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

			myEffects.start({
				'height': [10, 100],
				'width': [900, 300],
				'opacity': 0,
				'background-color': '#00f'
			});
		[/javascript]
	*/

	start: function(obj){
		if (this.timer && this.options.wait) return this;
		this.now = {};
		var from = {}, to = {};
		for (var p in obj){
			var parsed = Fx.CSS.prepare(this.element, p, obj[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return arguments.callee.parent(from, to);
	},

	increase: function(){
		for (var p in this.now) this.element.setStyle(p, Fx.CSS.serve(this.now[p], this.options.unit));
	}

});

/*
Native: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.implement({

	/*
	Method: effects
		Applies an <Fx.Styles> to the Element. This a shortcut for <Fx.Styles>.

	Syntax:
		>var myFx = myElement.effects([options]);

	Arguments:
		options - (object, optional) The <Fx.Styles> options object.

	Returns:
		(class) A new Fx.Styles instance.

	Example:
		[javascript]
			var myEffects = $(myElement).effects({
				duration: 1000,
				transition: Fx.Transitions.Sine.easeInOut,
				wait: false
			}).set({
				'opacity': 0
				'width': 0
			}).start({
				'height': [10, 100],
				'width': 300
			});
		[/javascript]

	See Also:
		<Fx>, <Fx.Styles>
	*/

	effects: function(options){
		return new Fx.Styles(this, options);
	}

});
