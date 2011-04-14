/*
---
name: Fx
description: Contains the basic animation logic to be extended by all other Fx Classes.
requires: [Type, Array, String, Number, Function, Class, Chain, Events, Options]
provides: Fx
...
*/

(function(){

var Fx = this.Fx = new Class({

	Extends: Timer,

	options: {
		duration: '500ms',
		equation: 'default'
	},

	initialize: function(options){
		this.parent(options);
		this.setOption('fps', fps);
	},

	/* private methods */

	'protected onStart': function(from, to){
		this.from = from;
		this.to = to;

		this.equation = Fx.parseEquation(this.getOption('equation'));
		this.duration = Fx.parseDuration(this.getOption('duration'));

		this.frameInterval = 1000 / fps;
		this.frame = this.getOption('frameSkip') ? 0 : -1;
		this.frames = this.getOption('frames') || Math.round(this.duration / this.frameInterval);
	},

	'protected onStep': function(dt){
		this.frame += this.getOption('frameSkip')
			? dt / this.frameInterval : 1;

		if (this.frame < this.frames){
			var delta = this.equation(this.frame / this.frames);
			this.render(this.compute(delta));
		} else {
			this.frame = this.frames;
			this.render(this.compute(1));
			this.complete();
		}
	},

	'protected render': function(now){},

	'protected compute': function(delta){
		return Fx.compute(this.from, this.to, delta);
	}

});

Fx.extend('compute', function(from, to, delta){
	return (to - from) * delta + from;
});

Fx.extend(new Accessor('Duration')).extend(new Accessor('Equation'));

// duration

Fx.defineDurations({'short': 250, 'normal': 500, 'long': 1000});

Fx.extend('parseDuration', function(duration){
	if (typeOf(duration) == 'number') return duration;
	var n = parseFloat(duration);
	if (n == duration) return n;
	var d = Fx.lookupDuration(duration);
	if (d != null) return d;
	d = duration.match(/^[\d.]+([ms]{1,2})?$/);
	if (!d) return 0;
	if (d[1] == 's') return n * 1000;
	return n;
});

// fps

var fps = 60;

Fx.extend('setFPS', function(value){
	fps = value;
	return this;
});

// equations

Fx.defineEquations({
	
	'linear': function(p){
		return p;
	},
	
	'default': function(p){
		return -(Math.cos(Math.PI * p) - 1) / 2;
	},

	'pow': function(p, x){
		x = (x && x[0] || 6);
		return Math.pow(p, x);
	},

	'expo': function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	'circ': function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	'sine': function(p){
		return 1 - Math.cos(p * Math.PI / 2);
	},

	'back': function(p, x){
		x = (x && x[0] || 1.618);
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	'bounce': function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	'elastic': function(p, x){
		x = (x && x[0] || 1);
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * x / 3);
	}

});

['quad', 'cubic', 'quart', 'quint'].each(function(name, i){
	Fx.defineEquation(name, function(pos){
		return Math.pow(pos, i + 2);
	});
});

// Fx.parseEquation, preliminary parameter support (1 parameter)

Fx.extend('parseEquation', function(name){
	var t = typeOf(name);
	if (t == 'function') return name;
	if (t != 'string') name = 'linear';
	var match = name.match(/^([\w]+)([:inout]+)?(\(([\d.]+)\))?$/);
	var equation = Fx.lookupEquation(match[1]) || Fx.lookupEquation('default');
	var end = equation(1), param = parseFloat(match[4]), type = match[2];
	switch (type){
		case ':out': return function(pos){
			return end - equation(1 - pos, param);
		};
		case ':in:out': return function(pos){
			return (pos <= 0.5) ? equation(2 * pos, param) / 2 : (2 * end - equation(2 * (1 - pos), param)) / 2;
		};
		default: return (param != null) ? function(pos){
			return equation(pos, param);
		} : equation;
	}
});
	
})();
