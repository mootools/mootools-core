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
	el      - (mixed) A string ID of the Element or an Element to apply the style transitions to.
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
		properties - (mixed) An object of properties/values pair or a string representing a css selector that can be found on one of the css files.

	Returns:
		(class) This Fx.Morph instance.

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
		if (this.timer && this.options.wait) return this;
		if ($type(properties) == 'string') properties = Fx.CSS.search(properties);
		this.now = {};
		var from = {}, to = {};
		for (var p in properties){
			var parsed = Fx.CSS.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return arguments.callee.parent(from, to);
	},

	increase: function(){
		for (var p in this.now) this.element.setStyle(p, Fx.CSS.serve(this.now[p], this.options.unit));
	}

});

Fx.CSS.search = function(selector){
	var to = {};
	Array.each(document.styleSheets, function(sheet, j){
		var rules = sheet.rules || sheet.cssRules;
		Array.each(rules, function(rule, i){
			if (!rule.style || !rule.selectorText || !rule.selectorText.test('^' + selector + '$')) return;
			Element.Styles.each(function(value, style){
				if (!rule.style[style] || Element.ShortStyles[style]) return;
				value = rule.style[style];
				to[style] = (value.test(/^rgb/)) ? value.rgbToHex() : value;
			});
		});
	});
	return to;
};

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

/*
Element Setter: morph
	sets a default Fx.Morph instance for an element
	
Syntax:
	>el.set('morph'[, options]);
	
Arguments: 
	options - (object) the Fx.Morph options.
	
Returns:
	(element) this element
	
Example:
	[javascript]
		el.set('morph', {duration: 'long', transition: 'bounce:out'});
		el.morph({height: 100, width: 100});
	[/javascript]
*/

Element.Set.morph = function(options){
	if (this.$attributes.$morph) this.$attributes.$morph.stop();
	this.$attributes.$morph = new Fx.Morph(this, options);
	return this;
};

/*
Element Getter: morph
	gets the previously setted Fx.Morph instance or a new one with default options
	
Syntax:
	>el.get('morph');
	
Returns:
	(object) the Fx.Morph instance
	
Example:
	[javascript]
		el.set('morph', {duration: 'long', transition: 'bounce:out'});
		el.morph({height: 100, width: 100});
		
		el.get('morph'); //the Fx.Morph instance
	[/javascript]
*/

Element.Get.morph = function(){
	if (!this.$attributes.$morph) this.set('morph');
	return this.$attributes.$morph;
};

Element.implement({
	
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

	morph: function(props, options){
		if (options) this.set('morph', options);
		this.get('morph').stop().start(props);
		return this;
	}

});