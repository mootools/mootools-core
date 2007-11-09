Script: Fx.Transitions.js
	Effects transitions, to be used with all the effects.

License:
	MIT-style license.

Credits:
	Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.



Class: Fx
	Fx.Transitions overrides the base Fx constructor, and adds the possibility to use the transition option as string.

transition option:
	The equation to use for the effect. See <Fx.Transitions>. It accepts both a function (ex: Fx.Transitions.Sine.easeIn)
	or a string ('sine:in', 'bounce:out' or 'quad:in:out') that will map to Fx.Transitions.Sine.easeIn / Fx.Transitions.Bounce.easeOut / Fx.Transitions.Quad.easeInOut



Class: Fx.Transition
	Returns a <Fx> transition function with 'easeIn', 'easeOut', and 'easeInOut' methods.

Syntax:
	>var myTransition = new Fx.Transition(transition[, params]);

Arguments:
	transition - (function) Can be a <Fx.Transitions> function or a user-provided function which will be extended with easing functions.
	params     - (mixed, optional) Single value or an array for multiple values to pass as the second parameter for the transition function.

Returns:
	(function) A function with easing functions.

Example:
	[javascript]
		//Elastic.easeOut with user-defined value for elasticity.
		var myTransition = new Fx.Transition(Fx.Transitions.Elastic, 3);
		var myFx = $('myElement').effect('margin', {transition: myTransition.easeOut});
	[/javascript]

See Also:
	<Fx.Transitions>



Hash: Fx.Transitions
	A collection of tweening transitions for use with the <Fx> classes.

Example:
	[javascript]
		//Elastic.easeOut with default values:
		var myFx = $('myElement').effect('margin', {transition: Fx.Transitions.Elastic.easeOut});
	[/javascript]

See also:
	<http://www.robertpenner.com/easing/>, <Element.effect>



Method: linear
	Displays a linear transition.

Graph:
	(see Linear.png)



Method: Quad
	Displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut.

Graph:
	(see Quad.png)


//auto generated


Method: Cubic
	Displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut.

Graph:
	(see Cubic.png)


//auto generated


Method: Quart
	Displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut.

Graph:
	(see Quart.png)


//auto generated


Method: Quint
	Displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut.

Graph:
	(see Quint.png)


//auto generated


Method: Pow
	Used to generate Quad, Cubic, Quart and Quint.

Note:
	By default is p^6.

Graph:
	(see Pow.png)



Method: Expo
	Displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut.

Graph:
	(see Expo.png)



Method: Circ
	Displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut.

Graph:
	(see Circ.png)



Method: Sine
	Displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut.

Graph:
	(see Sine.png)



Method: Back
	Makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut.

Graph:
	(see Back.png)



Method: Bounce
	Makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut.

Graph:
	(see Bounce.png)



Method: Elastic
	Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut

Graph:
	(see Elastic.png)

