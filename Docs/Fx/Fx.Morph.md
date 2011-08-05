Class: Fx.Morph {#Fx-Morph}
===========================

Allows for the animation of multiple CSS properties at once, even by a simple CSS selector. Inherits methods, properties, options and events from [Fx][].

### Extends:

- [Fx][]

### Syntax:

	var myFx = new Fx.Morph(element[, options]);

### Arguments:

1. element - (*mixed*) A string ID of the Element or an Element to apply the style transitions to.
2. options - (*object*, optional) The [Fx][] options object.

### Returns:

* (*object*) A new Fx.Morph instance.

### Examples:

Multiple styles with start and end values using an object:

	var myEffect = new Fx.Morph('myElement', {
		duration: 'long',
		transition: Fx.Transitions.Sine.easeOut
	});

	myEffect.start({
		'height': [10, 100], // Morphs the 'height' style from 10px to 100px.
		'width': [900, 300]  // Morphs the 'width' style from 900px to 300px.
	});


Multiple styles with the start value omitted will default to the current Element's value:

	var myEffect = new Fx.Morph('myElement', {
		duration: 'short',
		transition: Fx.Transitions.Sine.easeOut
	});

	myEffect.start({
		'height': 100, // Morphs the height from the current to 100px.
		'width': 300   // Morphs the width from the current to 300px.
	});


Morphing one Element to match the CSS values within a CSS class. This is useful when
separating the logic and styles:

	var myEffect = new Fx.Morph('myElement', {
		duration: 1000,
		transition: Fx.Transitions.Sine.easeOut
	});

	// the styles of myClassName will be applied to the target Element.
	myEffect.start('.myClassName');

### Notes:

- This feature only works for simple selectors like a single class or id due to limited browser support for complex selectors.

### See Also:

- [Fx][]



Fx.Morph Method: set {#Fx-Morph:set}
------------------------------------

Sets the Element's CSS properties to the specified values immediately.

### Syntax:

	myFx.set(to);

### Arguments:

1. properties - (*mixed*) Either an *object* of key/value pairs of CSS attributes to change or a *string* representing a CSS selector which can be found within the CSS of the page.  If only one value is given for any CSS property, the transition will be from the current value of that property to the value given.

### Returns:

* (*object*) This Fx.Morph instance.

### Examples:

	var myFx = new Fx.Morph('myElement').set({
		'height': 200,
		'width': 200,
		'background-color': '#f00',
		'opacity': 0
	});
	var myFx = new Fx.Morph('myElement').set('.myClass');



Fx.Morph Method: start {#Fx-Morph:start}
----------------------------------------

Executes a transition for any number of CSS properties in tandem.

### Syntax:

	myFx.start(properties);

### Arguments:

1. properties - (*mixed*) An *object* of key/value pairs of CSS attributes to change or a *string* representing a CSS selector which can be found within the CSS of the page.
	If only one value is given for any CSS property, the transition will be from the current value of that property to the value given.

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

- If a string is passed as the CSS selector, the selector must be identical to the one within the CSS.
- Multiple selectors (with commas) are not supported.
- @import'ed CSS rules will not be available for Morph calls. All CSS selectors must be present in CSS directly loaded into the page.


Object: Element.Properties {#Element-Properties}
==============================================

see [Element.Properties][]

Element Property: morph {#Element-Properties:morph}
---------------------------------------------------

### Setter

Sets a default Fx.Morph instance for an Element.

#### Syntax:

	el.set('morph'[, options]);

#### Arguments:

1. options - (*object*, optional) The Fx.Morph options.

#### Returns:

* (*element*) This Element.

#### Examples:

	el.set('morph', {duration: 'long', transition: 'bounce:out'});
	el.morph({height: 100, width: 100});

### Getter

Gets the default Fx.Morph instance for the Element.

#### Syntax:

	el.get('morph');

#### Arguments:

1. property - (*string*) the Fx.Morph property argument.

#### Returns:

* (*object*) The Fx.Morph instance.

#### Examples:

	el.set('morph', {duration: 'long', transition: 'bounce:out'});
	el.morph({height: 100, width: 100});
	el.get('morph'); // the Fx.Morph instance.



Type: Element {#Element}
==========================

Element Method: morph {#Element:morph}
--------------------------------------

Animates an Element given the properties passed in.

### Syntax:

	myElement.morph(properties);

### Arguments:

1. properties - (*mixed*) The CSS properties to animate. Can be either an object of CSS properties or a string representing a CSS selector.  If only one value is given for any CSS property, the transition will be from the current value of that property to the value given.

### Returns:

* (*element*) This Element.

### Example:

With an object:

	$('myElement').morph({height: 100, width: 200});

With a selector:

	$('myElement').morph('.class1');

### See Also:

- [Fx.Morph][]



[$]: /core/Element/Element#Window:dollar
[Fx]: /core/Fx/Fx
[Fx.Morph]: #Fx-Morph
[Element.Properties]: /core/Element/Element/#Element-Properties
