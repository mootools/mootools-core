/*
Script: Fx.Morph.js
	Contains <Fx.Morph>

License:
	MIT-style license.
*/

/*
Class: Fx.Morph
	Allows you to animate multiple css properties at once, even by a css selector. Inherits methods, properties, options and events from <Fx>.

Extends:
	<Fx>

Syntax:
	>var myFx = new Fx.Morph(element[, options]);

Arguments:
	element - (mixed) A string ID of the Element or an Element to apply the style transitions to.
	options - (object, optional) The <Fx> options object.

Returns:
	(object) A new Fx.Morph instance.

Examples:
	From and To values, with an object:
	[javascript]
		var myEffect = new Fx.Morph('myElement', {duration: 'long', transition: Fx.Transitions.Sine.easeOut});

		//height from 10 to 100 and width from 900 to 300
		myEffect.start({
			'height': [10, 100],
			'width': [900, 300]
		});
	[/javascript]

	only To value, with an object:
	[javascript]
		var myEffect = new Fx.Morph('myElement', {duration: 'short', transition: Fx.Transitions.Sine.easeOut});

		//or height from current height to 100 and width from current width to 300
		myEffect.start({
			'height': 100,
			'width': 300
		});
	[/javascript]

	with a className:
	[javascript]
		var myEffect = new Fx.Morph('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

		//will get myClassName styles and morph the element to it.
		myEffect.start('.myClassName');
	[/javascript]

See Also:
	<Fx>
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = $(element);
		arguments.callee.parent(options);
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = arguments.callee.parent(from[p], to[p], delta);
		return now;
	},

	/*
	Method: set
		Sets the Element's css properties to the specified values immediately.

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (object) An object containing keys that specify css properties to alter with their respected values.

	Returns:
		(object) This Fx.Morph instance.

	Example:
		[javascript]
			var myFx = new Fx.Morph('myElement').set({
				'height': 200,
				'width': 200,
				'background-color': '#f00',
				'opacity': 0
			});
		[/javascript]
	*/

	set: function(now){
		for (var p in now) this.render(this.element, p, now[p]);
		return this;
	},

	/*
	Method: start
		Executes a transition for any number of css properties in tandem.

	Syntax:
		>myFx.start(obj);

	Arguments:
		properties - (mixed) An object of properties/values pair or a string representing a css selector that can be found on one of the css files.

	Returns:
		(object) This Fx.Morph instance.

	Example:
		[javascript]
			var myEffects = new Fx.Morph('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

			myEffects.start({
				'height': [10, 100],
				'width': [900, 300],
				'opacity': 0,
				'background-color': '#00f'
			});
		[/javascript]

	Note:
		if you pass a string with the css selector, make sure you write the selector exactly as written in your css.
		Multiple selectors (with commas) are not supported.
	*/

	start: function(properties){
		if (!this.check(properties)) return this;
		if ($type(properties) == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return arguments.callee.parent(from, to);
	}

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

/*
Element Property: morph
	sets / gets a default Fx.Morph instance for an element

Set Syntax:
	>el.set('morph'[, options]);

Set Arguments:
	options - (object) the Fx.Morph options.

Set Returns:
	(element) this element

Set Example:
	[javascript]
		el.set('morph', {duration: 'long', transition: 'bounce:out'});
		el.morph({height: 100, width: 100});
	[/javascript]

Get Syntax:
	>el.get('morph');

Get Arguments:
	options - (object, optional) the Fx.Morph options. if passed in will generate a new instance.

Get Returns:
	(object) the Fx.Morph instance

Get Example:
	[javascript]
		el.set('morph', {duration: 'long', transition: 'bounce:out'});
		el.morph({height: 100, width: 100});

		el.get('morph'); //the Fx.Morph instance
	[/javascript]
*/

Element.Properties.morph = {

	set: function(options){
		var morph = this.retrieve('morph');
		if (morph) morph.cancel();
		return this.store('morph', new Fx.Morph(this, $extend({link: 'cancel'}, options)));
	},

	get: function(options){
		if (options || !this.retrieve('morph')) this.set('morph', options);
		return this.retrieve('morph');
	}

};

/*
Method: morph
	animate an element given the properties you pass in.

Syntax:
	>myElement.morph(className|object[, options]);

Arguments:
	properties - (mixed) the css properties you want to animate. Can be an Object of css properties or a string representing a css selector.
	options - (object, optional) The <Fx.Morph> options parameter.

Returns:
	(element) this Element.

Example:
	with object:
	[javascript]
		$('myElement').morph({height: 100, width: 200});
	[/javascript]

	with selector:
	[javascript]
		$('myElement').morph('.class1');
	[/javascript]

See Also:
	<Fx.Morph>
*/

Element.implement('morph', function(props){
	this.get('morph').start(props);
	return this;
});
