/*
---
name: Timer
description: Contains basic timing logic animation logic to be extended by Fx.
requires: [Function, Class, Events, Options, Chain]
provides: Timer
...
*/

(function(){

this.Timer = new Class({

	Implements: [Options, Events, Chain],

	options: {
		behavior: 'cancel',
		fps: 60
	},

	initialize: function(options){
		this.setOptions(options);
		this.items = [];
	},

	start: function(){
		if (this.paused) return this.resume();
		if (this.check.apply(this, arguments)){
			this.time = 0;
			this.onStart.apply(this, arguments);
			this.startTimer(this);
			this.fire('start', this.items);
		}
		return this;
	},

	cancel: function(){
		this.stopTimer(this);
		this.fire('cancel', this.items);
		this.elapsed = 0;
		return this;
	},

	pause: function(){
		if (!this.timer) return this;
		this.stopTimer(this);
		this.paused = true;
		return this.fire('pause', this.items);
	},

	resume: function(){
		if (this.paused){
			this.startTimer(this);
			this.paused = false;
			this.fire('resume', this.items);
		}
		return this;
	},

	complete: function(){
		this.stopTimer();
		this.fire('complete', this.items);
		if (!this.callChain()) this.fire('chainComplete', this.items);
		this.elapsed = 0;
		return this;
	},

	isRunning: function(){
		return !!this.timer;
	},

	/* private methods */

	step: function(){
		var now = Date.now(), previous = this.elapsed || 0;
		this.elapsed = now - this.time;
		this.onStep(this.elapsed - previous, this.elapsed, now);
	},

	'protected onStep': function(){},

	'protected onStart': function(){},

	'protected check': function(){
		if (!this.timer) return true;
		switch (this.getOption('behavior')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},

	'protected stopTimer': function(){
		if (!this.timer) return;
		this.time = Date.now() - this.time;
		this.timer = removeInstance(this);
	},

	'protected startTimer': function(){
		if (this.timer) return;
		this.time = Date.now() - this.time;
		this.timer = addInstance(this);
	}

});

// global timer

var instances = {}, timers = {};

var loop = function(fps){
	for (var i = 0; i < instances[fps].length; i++) instances[fps][i].step();
};

var addInstance = function(instance){
	var fps = instance.getOption('fps') || 60;
	(instances[fps] || (instances[fps] = [])).push(instance);
	if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), null, fps);
	return true;
};

var removeInstance = function(instance){
	var fps = instance.getOption('fps');
	if (instances[fps]) instances[fps].erase(instance);
	if (!instances[fps].length && timers[fps]) timers[fps] = clearInterval(timers[fps]);
	return false;
};

})();
