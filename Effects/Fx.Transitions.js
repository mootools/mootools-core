/*
Script: Fx.Transitions.js
	Effects transitions, to be used with all the effects.

Author:
	Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified & optimized to be used with mootools.

License:
	Easing Equations v1.5, (c) 2003 Robert Penner, all rights reserved. Open Source BSD License.
*/

/*
Class: Fx.Transitions
	A collection of tweening transitions for use with the <Fx.Base> classes.
	Some transitions accept additional parameters. You can set them using the .set property of each transition type.
	
Example:
	>new Fx.Style('margin', {transition: Fx.Transitions.Elastic.easeInOut});
	>//Elastic.easeInOut with default values
	>new Fx.Style('margin', {transition: Fx.Transitions.Elastic.easeInOut.set(3)});
	>//Elastic.easeInOut with user-defined value for elasticity.
	>p, t, c, d means: // p: current time / duration, t: current time, c: change in value (distance), d: duration

See also:
	http://www.robertpenner.com/easing/
*/

Fx.Transitions = new Abstract({
	
	/*
	Property: linear
		displays a linear transition.
		
	Graph:
		(see Linear.png)
	*/
	
	linear: function(t, c, d){
		return c * (t / d);
	}

});

Fx.Shared.CreateTransitionEases = function(transition, type){
	$extend(transition, {
		easeIn: function(t, c, d, x, y, z){
			return c * transition(t, c, d, x, y, z);
		},

		easeOut: function(t, c, d, x, y, z){
			return c * (1 - transition(d - t, c, d, x, y, z));
		},

		easeInOut: function(t, c, d, x, y, z){
			d /= 2, c /= 2;
			return (t <= d) ? c * transition(t, c, d, x, y, z) : c + c * (1 - transition(t, c, d, x, y, z));
		}
	});
	//compatibility
	['In', 'Out', 'InOut'].each(function(mode){
		transition['ease' + mode].set = Fx.Shared.SetTransitionValues(transition['ease' + mode]);
		Fx.Transitions[type.toLowerCase() + mode] = transition['ease' + mode];
	});
};

Fx.Shared.SetTransitionValues = function(transition){
	return function(){
		var args = $A(arguments);
		return function(){
			return transition.apply(Fx.Transitions, $A(arguments).concat(args));
		};
	}
};

Fx.Transitions.extend = function(transitions){
	for (var type in transitions){
		if (type.test(/^[A-Z]/)) Fx.Shared.CreateTransitionEases(transitions[type], type);
		else transitions[type].set = Fx.Shared.SetTransitionValues(transitions[type]);
		Fx.Transitions[type] = transitions[type];
	}
};

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
	
	Pow: function(t, c, d, x){
		x = x || 6;
		return Math.pow(t / d, x);
	},

	/*
	Property: Expo
		displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut
		
	Graph:
		(see Expo.png)
	*/
	
	Expo: function(t, c, d){
		return Math.pow(2, 8 * (t / d - 1));
	},

	/*
	Property: Circ
		displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut
		
	Graph:
		(see Circ.png)
	*/
	
	Circ: function(t, c, d){
		return -Math.sin(Math.acos(t / d)) + 1;
	},
	

	/*
	Property: Sine
		displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut
		
	Graph:
		(see Sine.png)
	*/
	
	Sine: function(t, c, d){
		return 1 - Math.sin((1 - t / d) * Math.PI / 2);
	},

	/*
	Property: Back
		makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut
		set(x) changes the way it overshoots the target, default is 1.61803398874989 (PHI - "The Golden Ratio")
		
	Graph:
		(see Back.png)
	*/

	Back: function(t, c, d, x){
		x = x || 1.6180;
		var p = t / d;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	/*
	Property: Bounce
		makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut
		
	Graph:
		(see Bounce.png)
	*/
	
	Bounce: function(t, c, d){
		var y, b = 7.5625, p = 1 - t / d;
		if (p < (1 / 2.75)) y = b * Math.pow(p, 2);
		else if (p < (2 / 2.75)) y = b * (p -= (1.5 / 2.75)) * p + 0.75;
		else if (p < (2.5 / 2.75)) y = b * (p -= (2.25 / 2.75)) * p + 0.9375;
		else y = b * (p -= (2.625 / 2.75)) * p + 0.984375;
		return - y + 1;
	},

	/*
	Property: Elastic
		Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut
		set(x) works as a multiplier of the elasicity effect. set(2) makes it twice as strong
		
	Graph:
		(see Elastic.png)
	*/
	
	Elastic: function(t, c, d, x, y){
		var p = t / d;
		x = y || 1 * 300 / (x || 1);
		return -Math.pow(2, 10 * (p -= 1)) * Math.sin((p * d - x / 4) * (2 * Math.PI) / x);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	var obj = {};
	obj[transition] = function(t, c, d){
		return Fx.Transitions.Pow(t, d, d, i + 2);
	};
	Fx.Transitions.extend(obj);
});