Class: Fx {#Fx}
===============

Fx.Transitions overrides the base [Fx][] constructor, and adds the possibility to use the transition option as string.

### Transition option:

The equation to use for the effect. See [Fx.Transitions][]. It accepts both a function (ex: Fx.Transitions.Sine.easeIn) or a string ('sine:in', 'bounce:out' or 'quad:in:out') that will map to Fx.Transitions.Sine.easeIn / Fx.Transitions.Bounce.easeOut / Fx.Transitions.Quad.easeInOut


Object: Fx.Transitions {#Fx-Transitions}
======================================

A collection of tweening transitions for use with the [Fx][] classes.

### Examples:

	$('myElement').set('tween', {transition: Fx.Transitions.Elastic.easeOut});
	$('myElement').tween('margin-top', 100);

### See also:

- [Robert Penner's Easing Equations](http://www.robertpenner.com/easing/)

### Note:

Since MooTools 1.3 this is a native JavaScript Object and not an instance of the deprecated Hash



Fx.Transitions Method: linear {#Fx-Transitions:linear}
------------------------------------------------------

Displays a linear transition.

Fx.Transitions Method: quad {#Fx-Transitions:quad}
--------------------------------------------------

Displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut.

Fx.Transitions Method: cubic {#Fx-Transitions:cubic}
----------------------------------------------------

Displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut.


Fx.Transitions Method: quart {#Fx-Transitions:quart}
----------------------------------------------------

Displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut.

Fx.Transitions Method: quint {#Fx-Transitions:quint}
----------------------------------------------------

Displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut

Fx.Transitions Method: pow {#Fx-Transitions:pow}
------------------------------------------------

Used to generate Quad, Cubic, Quart and Quint.

### Note:

- The default is `p^6`.

Fx.Transitions Method: expo {#Fx-Transitions:expo}
--------------------------------------------------

Displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut.



Fx.Transitions Method: circ {#Fx-Transitions:circ}
--------------------------------------------------

Displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut.



Fx.Transitions Method: sine {#Fx-Transitions:sine}
--------------------------------------------------

Displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut.



Fx.Transitions Method: back {#Fx-Transitions:back}
--------------------------------------------------

Makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut.



Fx.Transitions Method: bounce {#Fx-Transitions:bounce}
------------------------------------------------------

Makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut.



Fx.Transitions Method: elastic {#Fx-Transitions:elastic}
--------------------------------------------------------

Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut



Class: Fx.Transition {#Fx-Transition}
=====================================

This class is only useful for math geniuses who want to write their own easing equations.
Returns an [Fx][] transition function with 'easeIn', 'easeOut', and 'easeInOut' methods.

### Syntax:

	var myTransition = new Fx.Transition(transition[, params]);

### Arguments:

1. transition - (*function*) Can be a [Fx.Transitions][] function or a user-provided function which will be extended with easing functions.
2. params     - (*mixed*, optional) Single value or an array for multiple values to pass as the second parameter for the transition function. A single value will be transformed to an array.

### Returns:

* (*function*) A function with easing functions.

### Examples:

	// Your own function. Here overshoot is bigger (now 1.3) when base -> 1 and base != 1.
	var myTransition = new Fx.Transition(function(pos, x){
		return 1 - Math.pow(Math.abs(Math.log(pos) / Math.log(x && x[0] || Math.E)), pos);
	}, 1.3);

	var myFx = new Fx.Tween('myElement', {
		property: 'height',
		transition: myTransition.easeOut
	}).start(30, 100);

### See Also:

- [Fx.Transitions][]


[Fx]: /core/Fx/Fx
[Fx.Transitions]: #Fx-Transitions
[Element.effect]: /core/Element/#Element:effect
[Linear]: ../Docs/assets/images/Linear.png
[Quad]: ../Docs/assets/images/Quad.png
[Cubic]: ../Docs/assets/images/Cubic.png
[Quart]: ../Docs/assets/images/Quart.png
[Quint]: ../Docs/assets/images/Quint.png
[Expo]: ../Docs/assets/images/Expo.png
[Circ]: ../Docs/assets/images/Circ.png
[Sine]: ../Docs/assets/images/Sine.png
[Back]: ../Docs/assets/images/Back.png
[Bounce]: ../Docs/assets/images/Bounce.png
[Elastic]: ../Docs/assets/images/Elastic.png
