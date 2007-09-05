/*
Script: Fx.Transitions.js
	Effects transitions, to be used with all the effects.

License:
	MIT-style license.

Credits:
	Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.
*/

/*
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
*/

Fx.Transition = function(transition, params){
	params = $splat(params) || [];
	return $extend(transition, {
		easeIn: function(pos){
			return transition(pos, params);
		},
		easeOut: function(pos){
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos){
			return (pos <= 0.5) ? transition(2 * pos, params) / 2 : (2 - transition(2 * (1 - pos), params)) / 2;
		}
	});
};


/*
Class: Fx.Transitions
	A collection of tweening transitions for use with the <Fx> classes.

Example:
	[javascript]
		//Elastic.easeOut with default values:
		var myFx = $('myElement').effect('margin', {transition: Fx.Transitions.Elastic.easeOut});
	[/javascript]

See also:
	<http://www.robertpenner.com/easing/>, <Element.effect>
*/

Fx.Transitions = new Abstract({

	/*
	Method: linear
		Displays a linear transition.

	Graph:
		(see Linear.png)
	*/

	linear: function(p){
		return p;
	}

});

Fx.Transitions.extend = function(transitions){
	for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

	/*
	Method: Quad
		Displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut.

	Graph:
		(see Quad.png)
	*/

	//auto generated

	/*
	Method: Cubic
		Displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut.

	Graph:
		(see Cubic.png)
	*/

	//auto generated

	/*
	Method: Quart
		Displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut.

	Graph:
		(see Quart.png)
	*/

	//auto generated

	/*
	Method: Quint
		Displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut.

	Graph:
		(see Quint.png)
	*/

	//auto generated

	/*
	Method: Pow
		Used to generate Quad, Cubic, Quart and Quint.

	Note:
		By default is p^6.

	Graph:
		(see Pow.png)
	*/

	Pow: function(p, x){
		return Math.pow(p, x[0] || 6);
	},

	/*
	Method: Expo
		Displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut.

	Graph:
		(see Expo.png)
	*/

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	/*
	Method: Circ
		Displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut.

	Graph:
		(see Circ.png)
	*/

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	/*
	Method: Sine
		Displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut.

	Graph:
		(see Sine.png)
	*/

	Sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	/*
	Method: Back
		Makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut.

	Graph:
		(see Back.png)
	*/

	Back: function(p, x){
		x = x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	/*
	Method: Bounce
		Makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut.

	Graph:
		(see Bounce.png)
	*/

	Bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = - Math.pow((11 - 6 * a - 11 * p) / 4, 2) + b * b;
				break;
			}
		}
		return value;
	},

	/*
	Method: Elastic
		Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut

	Graph:
		(see Elastic.png)
	*/

	Elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	Fx.Transitions[transition] = new Fx.Transition(function(p){
		return Math.pow(p, [i + 2]);
	});
});
