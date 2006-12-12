/*
Script: Fx.js
	Applies visual transitions to any element. Contains Fx.Base, Fx.Style and Fx.Styles

Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

var Fx = fx = {};

/*
Class: Fx.Base
	Base class for the Mootools fx library.
	
Options:
	onStart - the function to execute as the effect begins; nothing (<Class.empty>) by default.
	onComplete - the function to execute after the effect has processed; nothing (<Class.empty>) by default.
	transition - the equation to use for the effect see <Fx.Transitions>; default is <Fx.Transitions.sineInOut>
	duration - the duration of the effect in ms; 500 is the default.
	unit - the unit is 'px' by default (other values include things like 'em' for fonts or '%').
	wait - boolean: to wait or not to wait for a current transition to end before running another of the same instance. defaults to true.
	fps - the frames per second for the transition; default is 30
*/

Fx.Base = new Class({

	setOptions: function(options){
		this.options = Object.extend({
			onStart: Class.empty,
			onComplete: Class.empty,
			transition: Fx.Transitions.sineInOut,
			duration: 500,
			unit: 'px',
			wait: true,
			fps: 50
		}, options || {});
	},

	step: function(){
		var time = new Date().getTime();
		if (time < this.time + this.options.duration){
			this.cTime = time - this.time;
			this.setNow();
		} else {
			this.options.onComplete.pass(this.element, this).delay(10);
			this.clearTimer();
			this.callChain();
			this.now = this.to;
		}
		this.increase();
	},
	
	/*	
	Property: set
		Immediately sets the value with no transition.
	
	Arguments:
		to - the point to jump to
	
	Example:
		>var myFx = new Fx.Style('myElement', 'opacity').set(0); //will make it immediately transparent
	*/
	
	set: function(to){
		this.now = to;
		this.increase();
		return this;
	},
	
	setNow: function(){
		this.now = this.compute(this.from, this.to);
	},

	compute: function(from, to){
		return this.options.transition(this.cTime, from, (to - from), this.options.duration);
	},
	
	/*
	Property: custom
		Executes an effect from one position to the other.
	
	Arguments:
		from - integer:  staring value
		to - integer: the ending value
	
	Examples:
		>var myFx = new Fx.Style('myElement', 'opacity').custom(0,1); //display a transition from transparent to opaque.
	*/
	
	custom: function(from, to){
		if (!this.options.wait) this.clearTimer();
		if (this.timer) return;
		this.options.onStart.pass(this.element, this).delay(10);
		this.from = from;
		this.to = to;
		this.time = new Date().getTime();
		this.timer = this.step.periodical(Math.round(1000/this.options.fps), this);
		return this;
	},
	
	/*
	Property: clearTimer
		Stops processing the transition.
	*/
	clearTimer: function(){
		this.timer = $clear(this.timer);
		return this;
	},
	
	setStyle: function(element, property, value){
		element.setStyle(property, value + this.options.unit);
	}

});

Fx.Base.implement(new Chain);

/*	
Class: Fx.Style
	The Style effect; Extends <Fx.Base>, inherits all its properties. Used to transition any css property from one value to another.

Arguments:
	el - the $(element) to apply the style transition to
	property - the property to transition
	options - the Fx.Base options (see: <Fx.Base>)
	
Example:
	>var marginChange = new fx.Style('myElement', 'margin-top', {duration:500});
	>marginChange.custom(10, 100);
*/

Fx.Style = Fx.Base.extend({

	initialize: function(el, property, options){
		this.element = $(el);
		this.setOptions(options);
		this.property = property.camelCase();
	},
	
	/*	
	Property: hide
		Same as <Fx.Base.set>(0)
	*/
	
	hide: function(){
		return this.set(0);
	},

	/*	
	Property: goTo
		will apply <Fx.Base.custom>, setting the starting point to the current position.
		
	Arguments:
		val - the ending value
	*/

	goTo: function(val){
		return this.custom(this.now || 0, val);
	},

	increase: function(){
		this.setStyle(this.element, this.property, this.now);
	}

});

/*
Class: Fx.Styles
	Allows you to animate multiple css properties at once; Extends <Fx.Base>, inherits all its properties.
	
Arguments:
	el - the $(element) to apply the styles transition to
	options - the fx options (see: <Fx.Base>)

Example:
	>var myEffects = new fx.Styles('myElement', {duration: 1000, transition: fx.linear});
	>myEffects.custom({
	>	'height': [10, 100],
	>	'width': [900, 300]
	>});
*/

Fx.Styles = Fx.Base.extend({

	initialize: function(el, options){
		this.element = $(el);
		this.setOptions(options);
		this.now = {};
	},

	setNow: function(){
		for (var p in this.from) this.now[p] = this.compute(this.from[p], this.to[p]);
	},
	
	/*
	Property:	custom
		The function you'll actually use to execute a transition.
	
	Arguments:
		an object
		
	Example:
		see <Fx.Styles>
	*/

	custom: function(objFromTo){
		if (this.timer && this.options.wait) return;
		var from = {};
		var to = {};
		for (var p in objFromTo){
			from[p] = objFromTo[p][0];
			to[p] = objFromTo[p][1];
		}
		return this.parent(from, to);
	},

	increase: function(){
		for (var p in this.now) this.setStyle(this.element, p, this.now[p]);
	}

});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: effect
		Applies an <Fx.Style> to the Element; This a shortcut for <Fx.Style>.

	Example:
		>var myEffect = $('myElement').effect('height', {duration: 1000, transition: Fx.Transitions.linear});
		>myEffect.custom(10, 100);
	*/
	
	effect: function(property, options){
		return new Fx.Style(this, property, options);
	},
	
	/*	
	Property: effects
		Applies an <Fx.Styles> to the Element; This a shortcut for <Fx.Styles>.
		
	Example:
		>var myEffects = $(myElement).effects({duration: 1000, transition: Fx.Transitions.sineInOut});
 		>myEffects.custom({'height': [10, 100], 'width': [900, 300]});
	*/

	effects: function(options){
		return new Fx.Styles(this, options);
	}

});

/*
Class: Fx.Transitions
	A collection of transition equations for use with the <Fx> Class.
		
See Also:
	<Fxtransitions.js> for a whole bunch of transitions.
		
Credits:
	Easing Equations, (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), Open Source BSD License.
*/

Fx.Transitions = {
	
	/* Property: linear */
	linear: function(t, b, c, d){
		return c*t/d + b;
	},
	
	/* Property: sineInOut */
	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

};