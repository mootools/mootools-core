/*
Script: Fx.js
	Contains <Fx>, the foundamentals of the MooTools Effects. Only use this directly if you plan to develop some sort of custom effect.
	All the other effects inherit from this one.

License:
	MIT-style license.
*/

/*
Class: Fx
	Base class for the Effects.

Implements:
	<Chain>, <Events>, <Options>

Syntax:
	>var myFx = new Fx([el[, options]]);

Arguments:
	options - (object, optional) An object with options for the effect. See below.

	options (continued):
		transition - (function: defaults to <Fx.Transitions.Sine.easeInOut>) The equation to use for the effect see <Fx.Transitions>.
		             You cannot change the transition if you havent included Fx.Transitions.js, unless you plan on developing your own curve. ;)
		duration   - (number: defaults to 500) The duration of the effect in ms. can also be 'normal', 'long', or 'short'.
		unit       - (string: defaults to false) The unit, e.g. 'px', 'em' for fonts or '%'. See <Element.setStyle>.
		link       - (string: defaults to ignore) Can be 'ignore', 'cancel' and 'link'.
		fps        - (number: defaults to 50) The frames per second for the transition.

		link option (continued):
			cancel - Cancels the effect if two or more start are run.
			ignore - Ignores any call to start other than the first, if the effect has not completed.
			chain  - Chain all the start calls, if the effect has not completed.

Events:
	onStart - (function) The function to execute when the effect begins.
	onComplete - (function) The function to execute after the effect has processed.
	onCancel - (function) The function to execute when you manually stop the effect.

Returns:
	(object) A new FX instance.

Note:
	The Fx Class is just a skeleton for other Classes to extend the original functionality.

See Also:
	<Fx.Tween>, <Fx.Morph>
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*onStart: $empty,
		onComplete: $empty,
		onCancel: $empty,*/
		fps: 50,
		unit: false,
		duration: 500,
		link: 'ignore',
		transition: function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		}
	},

	initialize: function(options){
		this.setOptions(options);
		this.options.duration = parseInt(Fx.Durations[this.options.duration] || this.options.duration);
	},

	step: function(){
		var time = $time();
		if (time < this.time + this.options.duration){
			var delta = this.options.transition((time - this.time) / this.options.duration);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	/*
	Method: set
		Action that fire every step of the Fx.
	*/

	set: function(now){
		return now;
	},

	/*
	Method: compute
		Action to compute from and to values with the delta.
	*/

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.timer) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.start.bind(this, arguments)); return false;
		}
		return false;
	},

	/*
	Method: start
		Executes an effect from one mixed value to the other and fires the 'onStart' Event.
	*/

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.startTimer();
		this.onStart();
		return this;
	},

	/*
	Method: complete
		Stops the timer and launches the onComplete event.
	*/

	complete: function(){
		return (!this.stopTimer()) ? this : this.onComplete();
	},

	/*
	Method: cancel
		Stops the timer and launches the onCancel event.
	*/

	cancel: function(){
		return (!this.stopTimer()) ? this : this.onCancel();
	},

	/*
	Method: pause
		Stops the timer.
	*/

	pause: function(){
		this.stopTimer();
		return this;
	},

	/*
	Method: resume
		Resumes the timer if previously stopped.
	*/

	resume: function(){
		this.startTimer();
		return this;
	},

	/*
	Method: onStart
		Fires the onStart event. Intended to be overridden in implementations.
	*/

	onStart: function(){
		return this.fireEvent('onStart', arguments);
	},

	/*
	Method: onComplete
		Fires the onComplete event and the callChain. Intended to be overridden in implementations.
	*/

	onComplete: function(){
		return this.fireEvent('onComplete', arguments).callChain();
	},

	/*
	Method: onCancel
		Fires the onCancel event. Intended to be overridden in implementations.
	*/

	onCancel: function(){
		return this.fireEvent('onCancel', arguments).clearChain();
	},

	/*
	Method: stopTimer
		Stops the timer. Returns true on success, false if there was no timer to stop.
	*/

	stopTimer: function(){
		if (!this.timer) return false;
		this.time = $time() - this.time;
		this.timer = $clear(this.timer);
		return true;
	},

	/*
	Method: startTimer
		Starts the timer. Returns true on success, false if there was already a timer.
	*/

	startTimer: function(){
		if (this.timer) return false;
		this.time = $time() - this.time;
		this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
		return true;
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'long': 750, 'short': 250, 'normal': 500};
