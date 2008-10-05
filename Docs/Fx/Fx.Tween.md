Class: Fx.Tween {#Fx-Tween}
===========================

Contains [Fx.Tween][] and the Element shortcut [Element.tween][].

### Extends:

[Fx][]



Fx.Tween Method: constructor {#Fx-Tween:constructor}
----------------------------------------------------

The Tween effect, used to transition any CSS property from one value to another.

### Syntax:

	var myFx = new Fx.Tween(element, [, options]);

### Arguments:

1. element  - (*mixed*) An Element or the string id of an Element to apply the transition to.
2. options  - (*object*, optional) The [Fx][] options object, plus the options described below:

### Options:

* property - (*string*) The CSS property to transition to, for example 'width', 'color', 'font-size', 'border', etc. If this option is omitted, you are required to use the property as a first argument for the start and set methods. Defaults to null.


### Notes:

- Any CSS property that can be set with Element:setStyle can be transitioned with Fx.Tween.
- If a property is not mathematically calculable, like border-style or background-image, it will be set immediately upon start of the transition.
- If you use the property option, you must not use the property argument in the start and set methods.

### See Also:

- [Fx][]



Fx.Tween Method: set {#Fx-Tween:set}
------------------------------------

Sets the Element's CSS property to the specified value immediately.

### Syntax:

	myFx.set(property, value);

### Arguments:

1. property - (*string*) The css property to set the value to. Omit this if you use the property option.
2. value - (*mixed*) The value to set the CSS property of this instance to.

### Returns:

* (*object*) This Fx.Tween instance.

### Examples:

	var myFx = new Fx.Tween(element);
	//Immediately sets the background color of the element to red:
	myFx.set('background-color', '#f00');

### Note:

If you use the property option, you must not use the property argument in the start and set methods.


Fx.Tween Method: start {#Fx-Tween:start}
----------------------------------------

Transitions the Element's CSS property to the specified value.

### Syntax:

	myFx.start([property,] [from,] to);

### Arguments:

1. property - (*string*, if not in options) The css property to tween. Omit this if you use the property option.
2. from     - (*mixed*, optional) The starting CSS property value for the effect.
3. to       - (*mixed*) The target CSS property value for the effect.

### Returns:

* (*object*) This Fx.Tween instance.

### Examples:

	var myFx = new Fx.Tween(element);
	//Transitions the background color of the Element from black to red:
	myFx.start('background-color', '#000', '#f00');
	//Transitions the background color of the Element from its current color to blue:
	myFx.start('background-color', '#00f');

### Notes:

- If only one argument is provided, other than the property argument, the first argument to start will be used as the target value, and the initial value will be calculated from the current state of the element.
- When using colors, either RGB or Hex values may be used.
- If you use the property option, you must not use the property argument in the start and set methods.



Hash: Element.Properties {#Element-Properties}
==============================================

see [Element.Properties](/Element/Element/#Element-Properties)

Element Property: tween {#Element-Properties:tween}
---------------------------------------------------

Sets and gets default options for the Fx.Tween instance of an Element.

### Setter:

#### Syntax:

	el.set('tween'[, options]);

#### Arguments:

* options - (*object*) the Fx.Tween options.

#### Returns:

* (*element*) This Element.

#### Examples:

	el.set('tween', {duration: 'long'});
	el.tween('color', '#f00');

### Getter:

#### Syntax:

	el.get('tween', [options]);

#### Arguments:

1. property - (*string*) the Fx.Tween property argument.
2. options  - (*object*) the Fx.Tween options.

#### Returns:

* (*object*) The Element's internal Fx.Tween instance.

#### Examples:

	el.get('tween', {property: 'opacity', duration: 'long'}).start(0);

### Notes:

- When initializing the Element's tween instance with Element:set, the property to tween SHOULD NOT be passed.
- The property must be specified when using Element:get to retrieve the actual Fx.Tween instance, and in calls to Element:tween.
- When options are passed to either the setter or the getter, the instance will be recreated.
- As with the other Element shortcuts, the difference between a setter and a getter is that the getter returns the instance, while the setter returns the element (for chaining and initialization).



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: tween {#Element:tween}
--------------------------------------

Element shortcut method which immediately transitions any single CSS property of an Element from one value to another.

### Syntax:

	myElement.tween(property, startvalue[, endvalue]);

### Arguments:

1. property   - (*string*) the css property you want to animate. Omit this if you previously set the property option.
2. startvalue - (*mixed*) The start value for the transition.
2. endvalue   - (*mixed*) The end value for the transition. If this is omitted, startvalue will be used as endvalue.

### Returns:

* (*element*) This Element.

### Examples:

    //Transitions the width of "myElement" from its current width to 100px:
	$('myElement').tween('width', '100');
	//Transitions the height of "myElement" from 20px to 200px:
	$('myElement').tween('height', [20, 200]);
	//Transitions the border of "myElement" from its current to "6px solid blue":
	$('myElement').tween('border', '6px solid #36f');

### See Also:

- [Fx.Tween][]



Element Method: fade {#Element:fade}
------------------------------------

Element shortcut method for tween with opacity.  Useful for fading an Element in and out or to a certain opacity level.

### Syntax:

	myElement.fade([how]);

### Arguments:

1. how - (*mixed*, optional: defaults to 'toggle') The opacity level as a number or string representation.  Possible values include:
 * 'in'     - Fade the element to 100% opacity.
 * 'out'    - Fade the element to 0% opacity.
 * 'show'   - Immediately set the element's opacity to 100%.
 * 'hide'   - Immediately set the element's opacity to 0%.
 * 'toggle' - If visible, fade the element out, otherwise, fade it in.
 * (*number*)  - A float value between 0 and 1. Will fade the element to this opacity.

### Returns:

* This Element.

### Examples:

	$('myElement').fade('out'); //Fades "myElement" out.
	$('myElement').fade(0.7); //Fades "myElement" to 70% opacity.



Element Method: highlight {#Element:highlight}
----------------------------------------------

Element shortcut method for tweening the background color.  Immediately transitions an Element's background color to a specified highlight color then back to its set background color.

### Syntax:

	myElement.highlight([start, end]);

### Arguments:

1. start - (*string*, optional: defaults to '#ff8') The color from which to start the transition.
2. end - (*string*, optional: defaults to Element's set background-color) The background color to return to after the highlight effect.

### Note:

If no background color is set on the Element, or its background color is set to 'transparent', the default end value will be white.

### Returns:

* (*element*) This Element.

### Examples:

    //Will immediately change the background to light blue, then back to its original color (or white):
	$('myElement').highlight('#ddf');

	//Will immediately change the background to light blue, then fade to grey:
	$('myElement').highlight('#ddf', '#ccc');


[$]: /Element/Element#dollar
[Fx]: /Fx/Fx
[Fx.Tween]: #Fx-Tween
[Element.tween]: #Element-Properties:tween
