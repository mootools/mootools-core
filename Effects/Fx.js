/*
Script: Fx.js
	Contains <Fx>, the foundamentals of the MooTools Effects.

License:
	MIT-style license.
*/

/*
Class: Fx
	Base class for the Effects.

Implements:
	<Chain>, <Events>, <Options>
	Method:
Syntax:
	>var myFx = new Fx([el[, options]]);

Arguments:
	el      - (element, optional: defaults to this.element) The Element to apply an effect to.
	options - (object, optional) An object with options for the effect. See below.

	options (continued):
		transition - (function: defaults to <Fx.Transitions.Sine.easeInOut>) The equation to use for the effect see <Fx.Transitions>.
		duration   - (integer: defaults to 500) The duration of the effect in ms.
		unit       - (string: defaults to false) The unit, e.g. 'px', 'em' for fonts or '%'. See <Element.setStyle>.
		wait       - (boolean: defaults to true) Option to wait for a current transition to end before running another of the same instance.
		fps        - (number: defaults to 50) The frames per second for the transition.

Events:
	onStart - (function) The function to execute as the effect begins.	Method:
		Signature:
			>onStart(element)
	Method:
		Arguments:
			element - (element) This Element.
	Method:
	onSet - (function) The function to execute when value is setted without transition.
		Signature:
			>onSet(element)
	Method:
		Arguments:
			element - (element) This Element.
	Method:
	onComplete - (function) The function to execute after the effect has processed.
		Signature:
			>onComplete(element)
	Method:
		Arguments:
			element - (element) This Element.
	Method:
	onCancel - (function) The function to execute when you manually stop the effect.
		Signature:
			>onCancel(element)
	Method:
		Arguments:
			element - (element) This Element.

Returns:
	(class) A new FX instance.

Example:
	[javascript]
		var myFx = new Fx($('container'), {
			onComplete: function(){
				alert('woah it faded');
			}
		});
	Method:
		myFx.increase = function(){ // The Fx class is just a skeleton. We need to implement an increase method.
			this.element.setOpacity(this.now);
		};
	Method:
		myFx.start(1,0).chain(function(){
			this.start(0,1);
		});
	[/javascript]

Note:
	The Fx Class is just a skeleton for other Classes to extend the original functionality. Look at the example above to run the Fx Class directly.

See Also:
	<Fx.Style>
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		transition: function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		},
		duration: 500,
		unit: false,
		wait: true,
		fps: 50
	},

	initialize: function(){
		var params = Array.associate(arguments, {'options': 'object', 'element': true});
		this.element = this.element || params.element;
		this.setOptions(params.options);
	},

	step: function(){
		var time = $time();
		if (time < this.time + this.options.duration){
			this.delta = this.options.transition((time - this.time) / this.options.duration);
			this.setNow();
			this.increase();
		} else {
			this.stop(true);
			this.now = this.to;
			this.increase();
			this.fireEvent('onComplete', this.element, 10);
			this.callChain();
		}
	},

	/*
	Method: set
		Immediately sets the value with no transition and fires the 'onSet' Event.

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (integer) The value to set.

	Returns:
		(class) This Fx instance.

	Example:
		[javascript]
			var myFx = new Fx.Style('myElement', 'opacity', {
				onSet: function(){ // due to inheritence we can set the onSet Event
					alert("Woah! Where did it go?");
				}
			});
	Method:
			$('myElement').addEvents('mouseenter', function(){
				myFx.set(0); //will make it immediately transparent
			});
		[/javascript]

	See Also:
		<Fx.Style>
	*/

	set: function(to){
		this.now = to;
		this.increase();
		this.fireEvent('onSet', this.element);
		return this;
	},

	setNow: function(){
		this.now = this.compute(this.from, this.to);
	},

	compute: function(from, to){
		return (to - from) * this.delta + from;
	},

	/*
	Method: start
		Executes an effect from one position to the other and fires the 'onStart' Event.

	Syntax:
		>myFx.start(from, to);

	Arguments:
		from - (integer) A staring value.
		to   - (integer) An ending value for the effect.

	Returns:
		(object) This Fx instance.

	Example:
		[javascript]
			var myFx = $('myElement').effect('color').start('#000', '#f00');
		[/javascript]

	See Also:
		<Element.effect>
	*/

	start: function(from, to){
		if (!this.options.wait) this.stop();
		else if (this.timer) return this;
		this.from = from;
		this.to = to;
		this.change = this.to - this.from;
		this.time = $time();
		this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
		this.fireEvent('onStart', this.element);
		return this;
	},

	/*
	Method: stop
		Stops the transition and fires the 'onCancel' Event if ignore parameter is not supplied or is false.

	Syntax:
		>myFx.stop([end]);

	Arguments:
		ignore - (boolean, optional) If the true the 'onCancel' Event will not be fired.

	Returns:
		(object) This Fx instance.

	Example:
		[javascript]
			var myElement = $('myElement');
			var to = myElement.offsetLeft + myElement.offsetWidth;
			var myFx = myElement.setStyle('position', 'absolute').effect('left', {
				duration: 5000,
				onCancel: function(){
					alert("Doh! I've stopped.");
				}
			}).start(to);
	Method:
			(function(){ myFx.stop(true).start.delay(1000, myFx, to); }).delay(1000); // myFx is tired, let's be patient.
			(function(){ myFx.stop(); }).delay(3000); // Let's cancel the effect.
		[/javascript]
	*/

	stop: function(ignore){
		if (!this.timer) return this;
		this.timer = $clear(this.timer);
		if (!ignore) this.fireEvent('onCancel', this.element);
		return this;
	}

});