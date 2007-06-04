/*
Script: Fx.Transitions.js
	Effects transitions, to be used with all the effects.

License:
	MIT-style license.

Credits:
	Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified & optimized to be used with mootools.
*/

/*
Class: Fx.Transitions
	A collection of tweening transitions for use with the <Fx.Base> classes.

Example:
	>//Elastic.easeOut with default values:
	>new Fx.Style('margin', {transition: Fx.Transitions.Elastic.easeOut});
	>//Elastic.easeOut with user-defined value for elasticity.
	> var myTransition = new Fx.Transition(Fx.Transitions.Elastic, 3);
	>new Fx.Style('margin', {transition: myTransition.easeOut});

See also:
	http://www.robertpenner.com/easing/
*/

Fx.Transition = function(transition, params){
	params = params || [];
	if ($type(params) != 'array') params = [params];
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

Fx.Transitions = new Abstract({

	/*
	Property: linear
		displays a linear transition.

	Graph:
		(see Linear.png)
	*/

	linear: function(p){
		return p;
	}

});

Fx.Transitions.extend = function(transitions){
	for (var transition in transitions){
		Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
		/*compatibility*/
		Fx.Transitions.compat(transition);
		/*end compatibility*/
	}
};

/*compatibility*/

Fx.Transitions.compat = function(transition){
	['In', 'Out', 'InOut'].each(function(easeType){
		Fx.Transitions[transition.toLowerCase() + easeType] = Fx.Transitions[transition]['ease' + easeType];
	});
};

/*end compatibility*/

Fx.Transitions.extend({

	/*
	Property: Quad
		displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut

	Graph:
		(see Quad.png)
	*/

	//auto generated

	/*
	Property: Cubic
		displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut

	Graph:
		(see Cubic.png)
	*/

	//auto generated

	/*
	Property: Quart
		displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut

	Graph:
		(see Quart.png)
	*/

	//auto generated

	/*
	Property: Quint
		displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut

	Graph:
		(see Quint.png)
	*/

	//auto generated

	/*
	Property: Pow
		Used to generate Quad, Cubic, Quart and Quint.
		By default is p^6.

	Graph:
		(see Pow.png)
	*/

	Pow: function(p, x){
		return Math.pow(p, x[0] || 6);
	},

	/*
	Property: Expo
		displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut

	Graph:
		(see Expo.png)
	*/

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	/*
	Property: Circ
		displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut

	Graph:
		(see Circ.png)
	*/

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},


	/*
	Property: Sine
		displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut

	Graph:
		(see Sine.png)
	*/

	Sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	/*
	Property: Back
		makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut

	Graph:
		(see Back.png)
	*/

	Back: function(p, x){
		x = x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	/*
	Property: Bounce
		makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut

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
	Property: Elastic
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
	
	/*compatibility*/
	Fx.Transitions.compat(transition);
	/*end compatibility*/
});