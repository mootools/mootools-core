/*
Script: Fx.Equations.js
	Contains a set of advanced easing equations to be used with any of the Fx Classes.

License:
	MIT-style license.

Credits:
	Original Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>.
	Modified and optimized for MooTools by Olmo Maldonado <http://ibolmo.com>.
*/

(function(){

var defineEquation = Fx.defineEquation;

Fx.defineEquation = function(name, equation, param){
	var end = equation(1);

	defineEquation(name, equation);
	defineEquation(name + ':in', function(pos){
		return equation(pos, param);
	});
	defineEquation(name + ':out', function(pos){
		return end - equation(1 - pos, param);
	});
	defineEquation(name + ':in:out', function(pos){
		return (pos <= 0.5) ? equation(2 * pos, param) / 2 : (2 * end - equation(2 * (1 - pos), param)) / 2;
	});
	
	return this;
};

Fx.defineEquation({

	pow: function(p, x){
		return Math.pow(p, x || 6);
	},

	expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	back: function(p, x){
		x = x || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x || 1) / 3);
	}

});

['quad', 'cubic', 'quart', 'quint'].forEach(function(transition, i){
	Fx.defineEquation(transition, function(p){
		return Math.pow(p, i + 2);
	});
});

})();
