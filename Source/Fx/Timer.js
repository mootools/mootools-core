/*
---
name: Timer
description: Contains basic timing logic animation logic to be extended by Fx.
requires: [Date.now, Array, Function, Class, Events, Options, Chain]
provides: Timer
...
*/

(function(){

var Timer = this.Timer = new Class({

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
		if (this.check.apply(this, arguments)){
			this.time = 0;
			this.elapsed = 0;
			this.onStart.apply(this, arguments);
			this.startTimer(this);
			this.fire('start', this.items);
		}
		return this;
	},

	cancel: function(){
		this.stopTimer(this);
		this.fire('cancel', this.items);
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
		return this;
	},

	isRunning: function(){
		return !!this.timer;
	},

	/* private methods */

	step: function(){
		var now = Date.now(), previous = this.elapsed;
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
		this.timer = this.stepper && Timer.remove(this.stepper, this.getOption('fps'));
	},

	'protected startTimer': function(){
		if (this.timer) return;
		this.time = Date.now() - this.time;
		this.timer = Timer.add(this.stepper || (this.stepper = this.step.bind(this)), this.getOption('fps'));
	}

});

// global timer

var functions = {}, timers = {};

var loop = function(){
	for (var i = this.length, fn; i--;) (fn = this[i]) && fn();
};

Timer.extend({
	add: function(fn, fps){
		var list = (functions[fps] || (functions[fps] = []));
		list.push(fn);
		if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), list);
		return true;
	},
	remove: function(fn, fps){
		var list = functions[fps];
		if (list){
			list.erase(fn);
			if (!list.length && timers[fps]){
				delete functions[fps];
				timers[fps] = clearInterval(timers[fps]);
			}
		}
		return false;
	}
});

})();
