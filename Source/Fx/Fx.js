/*
Script: Fx.js
	Contains the basic animation logic to be extended by all other Fx Classes.

License:
	MIT-style license.
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: nil,
		onCancel: nil,
		onComplete: nil,
		*/
		unit: false,
		duration: 500,
		transition: 'default',
		link: 'ignore'
	},
	
	set: function(now){
		return now;
	},
	
	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.transition = Fx.lookupTransition(this.getOption('transition'));
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
	
	step: function(){
		var time = Date.now();
		if (time < this.time + this.duration){
			var delta = this.transition((time - this.time) / this.duration);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, this.transition(1)));
			this.complete();
		}
	},

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
	}.protect(),

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	}.protect(),

	check: function(){
		if (!this.timer) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this[this.caller].bind(this, arguments)); return false;
		}
		return false;
	}.protect(),

	complete: function(){
		if (this.stopTimer()) this.onComplete();
		return this;
	}.protect(),

	onStart: function(){
		this.fireEvent('start', this.subject);
	}.protect(),

	onComplete: function(){
		this.fireEvent('complete', this.subject);
		if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
	}.protect(),

	onCancel: function(){
		this.fireEvent('cancel', this.subject).clearChain();
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

(function(){
	
	var transitions = {
		'linear': Function.argument(0),
		'default': function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		}
	};
	
	var durations = {'short': 250, 'normal': 500, 'long': 1000};
	
	var fps = 50, instances = [], timer;
	
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
		
		// transitions accessors
		
		defineTransition: function(name, transition, param){
			var end = transition(1);
			
			transitions[name] = transition;

			transitions[name + '.in'] = function(pos){
				return transition(pos, param);
			};
			
			transitions[name + '.out'] = function(pos){
				return end - transition(1 - pos, param);
			};
			
			transitions[name + '.in.out'] = function(pos){
				return (pos <= 0.5) ? transition(2 * pos, param) / 2 : (2 * end - transition(2 * (1 - pos), param)) / 2;
			};

			return this;
		},
		
		defineTransitions: Function.setMany('defineTransition'),
		
		lookupTransition: function(name){
			return transitions[name];
		}
		
	});
	
})();
