/*
---
name: Fx
description: Contains the basic animation logic to be extended by all other Fx Classes.
requires: [typeOf, Array, String, Number, Function, Class, Chain, Events, Options]
provides: Fx
...
*/

(function(){

this.Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: nil,
		onCancel: nil,
		onComplete: nil,
		*/
		duration: '500ms',
		equation: 'default',
		link: 'ignore'
	},
	
	'protected initialize': function(options){
		this.setOptions(options);
	},
	
	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.equation = Fx.parseEquation(this.getOption('equation'));
		this.duration = Fx.parseDuration(this.getOption('duration'));
		this.startTimer();
		this.onStart();
		return this;
	},
	
	cancel: function(){
		if (this.stopTimer()) this.onCancel();
		return this;
	},
	
	pause: function(){
		this.stopTimer();
		return this;
	},

	resume: function(){
		this.startTimer();
		return this;
	},
	
	complete: function(){
		this.stopTimer();
		this.onComplete();
		return this;
	},
	
	step: function(){
		var time = Date.now();
		var factor = (time - this.time) / this.duration;
		var delta = this.equation((factor < 1) ? factor : 1);
		this.render(this.compute(delta));
		if (factor == 1) this.complete();
	},
	
	'protected render': function(now){},

	'protected compute': function(delta){
		return Fx.compute(this.from, this.to, delta);
	},

	'protected check': function(){
		if (!this.timer) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	'protected onStart': function(){
		this.fireEvent('start', this.item || null);
	},

	'protected onComplete': function(){
		this.fireEvent('complete', this.item || null);
		if (!this.callChain()) this.fireEvent('chainComplete', this.item || null);
	},

	'protected onCancel': function(){
		this.fireEvent('cancel', this.item || null).clearChain();
	},

	'protected stopTimer': function(){
		if (!this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = removeInstance(this);
		return true;
	},

	'protected startTimer': function(){
		if (this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = addInstance(this);
		return true;
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

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
	else if (d[1] == 's') return n * 1000;
	else return n;
});

// global timer

var fps = 60, instances = [], timer;

var loop = function(){
	for (var i = 0; i < instances.length; i++) instances[i].step();
};

var addInstance = function(instance){
	instances.push(instance);
	if (!timer) timer = loop.periodical(Math.round(1000 / fps));
	return true;
};

var removeInstance = function(instance){
	instances.erase(instance);
	if (!instances.length && timer) timer = Function.clear(timer);
	return false;
};

// fps set

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

	pow: function(p, x){
		return Math.pow(p, (x != null) ? x : 6);
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
		x = (x != null) ? x : 1.618;
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
		x = (x != null) ? x : 1;
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
	var n = match[1], equation = Fx.lookupEquation(n);
	if (!equation) return null;
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
