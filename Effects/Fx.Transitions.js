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
	*/
	
	linear: function(t, c, d){
		return c * (t / d);
	}
	
});

Fx.Shared.CreateTransitionEases = function(transition, type){
	$extend(transition, {
		easeIn: function(t, c, d, x, y, z){
			return c - c * transition((d - t) / d, t, c, d, x, y, z);
		},

		easeOut: function(t, c, d, x, y, z){
			return c * transition(t / d, t, c, d, x, y, z);
		},

		easeInOut: function(t, c, d, x, y, z){
			d /= 2, c /= 2;
			var p = t / d;
			return (p < 1) ? transition.easeIn(t, c, d, x, y, z) : c * (transition(p - 1, t, c, d, x, y, z) + 1);
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
	Property: Sine
		displays a sineousidal transition. Must be used as Sine.easeIn or Sine.easeOut or Sine.easeInOut
	*/

	Sine: function(p){
		return Math.sin(p * (Math.PI / 2));
	},
	
	/*
	Property: Quad
		displays a quadratic transition. Must be used as Quad.easeIn or Quad.easeOut or Quad.easeInOut
	*/

	Quad: function(p){
		return -(Math.pow(p - 1, 2) - 1);
	},
	
	/*
	Property: Cubic
		displays a cubicular transition. Must be used as Cubic.easeIn or Cubic.easeOut or Cubic.easeInOut
	*/

	Cubic: function(p){
		return Math.pow(p - 1, 3) + 1;
	},
	
	/*
	Property: Quart
		displays a quartetic transition. Must be used as Quart.easeIn or Quart.easeOut or Quart.easeInOut
	*/

	Quart: function(p){
		return -(Math.pow(p - 1, 4) - 1);
	},
	
	/*
	Property: Quint
		displays a quintic transition. Must be used as Quint.easeIn or Quint.easeOut or Quint.easeInOut
	*/

	Quint: function(p){
		return Math.pow(p - 1, 5) + 1;
	},
	
	/*
	Property: Expo
		displays a exponential transition. Must be used as Expo.easeIn or Expo.easeOut or Expo.easeInOut
	*/

	Expo: function(p){
		return -Math.pow(2, -10 * p) + 1;
	},
	
	/*
	Property: Circ
		displays a circular transition. Must be used as Circ.easeIn or Circ.easeOut or Circ.easeInOut
	*/

	Circ: function(p){
		return Math.sqrt(1 - Math.pow(p - 1, 2));
	},
	
	/*
	Property: Bounce
		makes the transition bouncy. Must be used as Bounce.easeIn or Bounce.easeOut or Bounce.easeInOut
	*/

	Bounce: function(p){
		var b = 7.5625;
		if (p < (1 / 2.75)) return b * Math.pow(p, 2);
		else if (p < (2 / 2.75)) return b * (p -= (1.5 / 2.75)) * p + 0.75;
		else if (p < (2.5 / 2.75)) return b * (p -= (2.25 / 2.75)) * p + 0.9375;
		else return b * (p -= (2.625 / 2.75)) * p + 0.984375;
	},
	
	/*
	Property: Back
		makes the transition go back, then all forth. Must be used as Back.easeIn or Back.easeOut or Back.easeInOut
	*/

	Back: function(p, t, c, d, x){
		x = x || 1.70158;
		p -= 1;
		return Math.pow(p, 2) * ((x + 1) * p + x) + 1;
	},
	
	/*
	Property: Elastic
		Elastic curve. Must be used as Elastic.easeIn or Elastic.easeOut or Elastic.easeInOut
	*/

	Elastic: function(p, t, c, d, x){
		x = x || d * 0.3;
		return (c * Math.pow(2, -10 * p) * Math.sin((p * d - x / 4) * (2 * Math.PI) / x) + c) / c;
	}

});