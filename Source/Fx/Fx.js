/*
Script: Fx.js
	Contains the basic animation logic to be extended by all other Fx Classes.

License:
	MIT-style license.
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
		duration: 500,
		equation: 'default',
		link: 'ignore'
	},
	
	initialize: function(options){
		this.setOptions(options);
	}.protect(),
	
	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.equation = Fx.lookupEquation(this.getOption('equation'));
		this.duration = Fx.lookupDuration(this.getOption('duration'));
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
		if (time < this.time + this.duration){
			var delta = this.equation((time - this.time) / this.duration);
			this.render(this.compute(delta));
		} else {
			this.render(this.compute(this.equation(1)));
			this.complete();
		}
	},
	
	render: function(now){}.protect(),

	compute: function(delta){
		return Fx.compute(this.from, this.to, delta);
	}.protect(),

	check: function(){
		if (!this.timer) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	}.protect(),

	onStart: function(){
		this.fireEvent('start', this.item);
	}.protect(),

	onComplete: function(){
		this.fireEvent('complete', this.item);
		if (!this.callChain()) this.fireEvent('chainComplete', this.item);
	}.protect(),

	onCancel: function(){
		this.fireEvent('cancel', this.item).clearChain();
	}.protect(),

	stopTimer: function(){
		if (!this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = Fx.remove(this);
		return true;
	}.protect(),

	startTimer: function(){
		if (this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = Fx.add(this);
		return true;
	}.protect()

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};
	
var equations = {
	'linear': Function.argument(0),
	'default': function(p){
		return -(Math.cos(Math.PI * p) - 1) / 2;
	}
};

var durations = {'short': 250, 'normal': 500, 'long': 1000};

var fps = 60, instances = [], timer;

var loop = function(){
	for (var i = 0; i < instances.length; i++) instances[i].step();
};

Fx.extend({
	
	// timer
	
	add: function(instance){
		instances.push(instance);
		if (!timer) timer = loop.periodical(Math.round(1000 / fps));
		return true;
	},
	
	remove: function(instance){
		instances.erase(instance);
		if (!instances.length && timer) timer = Function.clear(timer);
		return false;
	},
	
	setFPS: function(f){
		fps = f;
	},
	
	// duration accessors
	
	defineDuration: function(name, value){
		durations[name] = value;
		return this;
	},
	
	lookupDuration: function(name){
		return durations[name] || Number(name) || 0;
	},
	
	// equations accessors
	
	defineEquation: function(name, equation, param){
		var end = equation(1);
		
		equations[name] = equation;

		equations[name + '.in'] = function(pos){
			return equation(pos, param);
		};
		
		equations[name + '.out'] = function(pos){
			return end - equation(1 - pos, param);
		};
		
		equations[name + '.in.out'] = function(pos){
			return (pos <= 0.5) ? equation(2 * pos, param) / 2 : (2 * end - equation(2 * (1 - pos), param)) / 2;
		};

		return this;
	},
	
	defineEquations: Function.setMany('defineEquation'),
	
	lookupEquation: function(name){
		return equations[name];
	}
	
});
	
})();
