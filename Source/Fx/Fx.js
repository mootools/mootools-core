/*
Script: Fx.js
	Contains the basic animation logic to be extended by all other Fx Classes.

License:
	MIT-style license.
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	Options: {
		/*
		onStart: Function.empty,
		onCancel: Function.empty,
		onComplete: Function.empty,
		*/
		unit: false,
		duration: 500,
		link: 'ignore'
	},

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
	},
	
	getDuration: function(){
		return Fx.Durations[this.getOption('duration')] || Number.asInteger(this.getOption('duration'));
	},

	getTransition: function(){
		return function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function(){
		var time = Date.now();
		if (time < this.time + this.duration){
			var delta = this.transition((time - this.time) / this.duration);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	set: function(now){
		return now;
	},

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.timer) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this[this.caller].bind(this, arguments)); return false;
		}
		return false;
	},

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.transition = this.getTransition();
		this.duration = this.getDuration();
		this.startTimer();
		this.onStart();
		return this;
	},

	complete: function(){
		if (this.stopTimer()) this.onComplete();
		return this;
	},

	cancel: function(){
		if (this.stopTimer()) this.onCancel();
		return this;
	},

	onStart: function(){
		this.fireEvent('start', this.subject);
	},

	onComplete: function(){
		this.fireEvent('complete', this.subject);
		if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
	},

	onCancel: function(){
		this.fireEvent('cancel', this.subject).clearChain();
	},

	pause: function(){
		this.stopTimer();
		return this;
	},

	resume: function(){
		this.startTimer();
		return this;
	},

	stopTimer: function(){
		if (!this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = Fx.Timer.remove(this);
		return true;
	},

	startTimer: function(){
		if (this.timer) return false;
		this.time = Date.now() - this.time;
		this.timer = Fx.Timer.add(this);
		return true;
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

Fx.Timer = (function(){
	
	var fps = 50, instances = [], timer;
	
	var loop = function(){
		for (var i = 0; i < instances.length; i++) instances[i].step();
	};
	
	return {

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
		}

	};
	
})();
