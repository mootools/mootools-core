Fx.Morph.js
-----------


### License:

MIT-style license.



Class: Fx.Morph {#Fx.Morph}
===========================

**Allows you to animate multiple css properties at once, even by a css selector. Inherits methods, properties, options and events from [Fx][].**

### Extends:

- [Fx][]

### Syntax:

	var myFx = new Fx.Morph(element[, options]);

### Arguments:

1. **element** - (*mixed*) A string ID of the Element or an Element to apply the style transitions to.
2. **options** - (*object*, optional) The [Fx][] options object.

### Returns:

* (*object*) A new Fx.Morph instance.

### Examples:

**From and To values, with an object:**

	var myEffect = new Fx.Morph('myElement', {duration: 'long', transition: Fx.Transitions.Sine.easeOut});

	//height from 10 to 100 and width from 900 to 300
	myEffect.start({
		'height': [10, 100],
		'width': [900, 300]
	});


**Only To value, with an object:**

	var myEffect = new Fx.Morph('myElement', {duration: 'short', transition: Fx.Transitions.Sine.easeOut});

	//or height from current height to 100 and width from current width to 300
	myEffect.start({
		'height': 100,
		'width': 300
	});


**With a className:**

	var myEffect = new Fx.Morph('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

	//will get myClassName styles and morph the element to it.
	myEffect.start('.myClassName');


### See Also:

- [Fx][]



Fx.Morph Method: set {#Fx.Morph:set}
------------------------------------

**Sets the Element's css properties to the specified values immediately.**

### Syntax:

	myFx.set(to);

### Arguments:

1. **to** - (*object*) An object containing keys that specify css properties to alter with their respected values.

### Returns:

* (*object*) This Fx.Morph instance.

### Examples:

	var myFx = new Fx.Morph('myElement').set({
		'height': 200,
		'width': 200,
		'background-color': '#f00',
		'opacity': 0
	});



Fx.Morph Method: start {#Fx.Morph:start}
----------------------------------------

**Executes a transition for any number of css properties in tandem.**

### Syntax:

	myFx.start(obj);

### Arguments:

1. **properties** - (*mixed*) An object of properties/values pair or a string representing a css selector that can be found on one of the css files.

### Returns:

* (*object*) This Fx.Morph instance.

### Examples:

	var myEffects = new Fx.Morph('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});

	myEffects.start({
		'height': [10, 100],
		'width': [900, 300],
		'opacity': 0,
		'background-color': '#00f'
	});

### Notes:

- If you pass a string with the css selector, make sure you write the selector exactly as written in your css.
- Multiple selectors (with commas) are not supported.



Native: Element {#Element}
==========================

**Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].**



Element Property: morph {#Element:morph}
----------------------------------------

**Sets / gets a default Fx.Morph instance for an element**

### Set

#### Syntax:

	el.set('morph'[, options]);

#### Arguments:

1. **options** - (*object*) the Fx.Morph options.

#### Returns:

* (*element*) This element

#### Examples:

	el.set('morph', {duration: 'long', transition: 'bounce:out'});
	el.morph({height: 100, width: 100});

### Get

#### Syntax:

	el.get('morph');

#### Arguments:

1. **options** - (*object*, optional) the Fx.Morph options. if passed in will generate a new instance.

#### Returns:

* (*object*) The Fx.Morph instance

#### Examples:

	el.set('morph', {duration: 'long', transition: 'bounce:out'});
	el.morph({height: 100, width: 100});
	el.get('morph'); //the Fx.Morph instance



Element Method: morph {#Element:morph}
--------------------------------------

**Animate an element given the properties you pass in.**

### Syntax:

	myElement.morph(properties);

### Arguments:

1. **properties** - (*mixed*) the css properties you want to animate. Can be an Object of css properties or a string representing a css selector.

### Returns:

* (*element*) This Element.

### Example:

**With object:**

	$('myElement').morph({height: 100, width: 200});

**With selector:**

	$('myElement').morph('.class1');

### See Also:

- [Fx.Morph][]



[$]: /Element/#dollar
[Fx]: /Fx/Fx
[Fx.Morph]: #Fx.Morph