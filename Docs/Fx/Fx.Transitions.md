[Fx]: /Fx/Fx

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

Fx.Transitions {#Fx.Transitions}
================================

Effects transitions, to be used with all the effects.

### Credits:

Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.


Class: Fx {#Fx}
===============

Fx.Transitions overrides the base [Fx][] constructor, and adds the possibility to use the transition option as string.

transition option:

The equation to use for the effect. See [Fx.Transitions][]. It accepts both a function (ex: Fx.Transitions.Sine.easeIn) or a string ('sine:in', 'bounce:out' or 'quad:in:out') that will map to Fx.Transitions.Sine.easeIn / Fx.Transitions.Bounce.easeOut / Fx.Transitions.Quad.easeInOut



Class: Fx.Transition {#Fx.Transition}
=====================================

Returns a [Fx][] transition function with 'easeIn', 'easeOut', and 'easeInOut' methods.

### Syntax:

	var myTransition = new Fx.Transition(transition[, params]);

### Arguments:

1. transition - (function) Can be a <Fx.Transitions> function or a user-provided function which will be extended with easing functions.
2. params     - (mixed, optional) Single value or an array for multiple values to pass as the second parameter for the transition function.

### Returns:

* (function) A function with easing functions.

### Example:

	//Elastic.easeOut with user-defined value for elasticity.
	var myTransition = new Fx.Transition(Fx.Transitions.Elastic, 3);
	var myFx = $('myElement').effect('margin', {transition: myTransition.easeOut});

### See Also:

[Fx.Transitions](#Fx.Transitions)

Hash: Fx.Transitions {#Fx.Transitions}
--------------------------------------

A collection of tweening transitions for use with the [Fx][] classes.

### Example:

	//Elastic.easeOut with default values:
	var myFx = $('myElement').effect('margin', {transition: Fx.Transitions.Elastic.easeOut});

### See also:

- <http://www.robertpenner.com/easing/>, <Element.effect>


Fx.Transitions Method: linear {#Fx.Transitions#linear}
------------------------------------------------------

Displays a linear transition.

### Graph:

![][Linear]

Fx.Transitions Method: quad {#Fx.Transitions#quad}
--------------------------------------------------

Displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut.

### Graph:

![][Quad]

Fx.Transitions Method: cubic {#Fx.Transitions#cubic}
----------------------------------------------------

Displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut.

### Graph:

![][Cubic]

Fx.Transitions Method: quart {#Fx.Transitions#quart}
----------------------------------------------------

Displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut.

### Graph:

![][Quart]

Fx.Transitions Method: quint {#Fx.Transitions#quint}
----------------------------------------------------

Displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut.

### Graph:

![][Quint]

Fx.Transitions Method: pow {#Fx.Transitions#pow}
------------------------------------------------

Used to generate Quad, Cubic, Quart and Quint.

### Note:

-By default is p^6.

### Graph:

![][Pow]

Fx.Transitions Method: expo {#Fx.Transitions#expo}
--------------------------------------------------

Displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut.

### Graph:

![][Expo]

Fx.Transitions Method: circ {#Fx.Transitions#circ}
--------------------------------------------------

Displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut.

### Graph:

![][Circ]

Fx.Transitions Method: sine {#Fx.Transitions#sine}
--------------------------------------------------

Displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut.

### Graph:

![][Sine]

Fx.Transitions Method: back {#Fx.Transitions#back}
--------------------------------------------------

Makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut.

### Graph:

![][Back]

Fx.Transitions Method: bounce {#Fx.Transitions#bounce}
------------------------------------------------------

Makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut.

### Graph:

![][Bounce]

Fx.Transitions Method: elastic {#Fx.Transitions#elastic}
--------------------------------------------------------

Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut

### Graph:

![][Elastic]