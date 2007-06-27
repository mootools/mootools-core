/*
Script: Class.Extras.js
	Contains common implementations for custom classes. In Mootools is implemented in <Ajax>, <XHR> and <Fx.Base> and many more.

License:
	MIT-style license.
*/

/*
Class: Chain
	An "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	Currently implemented in <Fx.Base>, <XHR> and <Ajax>. In <Fx.Base> for example, is used to execute a list of functions, one after another, once an effect has completed.
	The functions will not be fired all at once, but rather in succession upon completion of the one before to create custom complex animations.

Example:
	(start code)
	var myFx = new Fx.Style('element', 'opacity');

	myFx.start(1,0).chain(function(){
		myFx.start(0,1);
	}).chain(function(){
		myFx.start(1,0);
	}).chain(function(){
		myFx.start(0,1);
	});
	//the element will fade in and out three times
	(end)
*/

var Chain = new Class({

	/*
	Property: chain
		Adds a function to the Chain instance stack.

	Arguments:
		fn - the function to append to the call stack
	*/

	chain: function(fn){
		this.chains = this.chains || [];
		this.chains.push(fn);
		return this;
	},

	/*
	Property: callChain
		Executes the first function of the Chain instance stack, then removes it. The first function will then become the second.
	*/

	callChain: function(){
		if (this.chains && this.chains.length) this.chains.shift().delay(10, this);
	},

	/*
	Property: clearChain
		Clears the stack of a Chain instance.
	*/

	clearChain: function(){
		this.chains = [];
	}

});

/*
Class: Events
	An "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	In <Fx.Base>, for example, this Class is used to allow any number of functions to be added to the Fx events, like onComplete, onStart, onCancel.
	Events in a Class that implements <Events> can be either added as an option, or with addEvent, but never directly through .options.onEventName.

Example:
	(start code)
	var myFx = new Fx.Style('element', 'opacity').addEvent('onComplete', function(){
		alert('the effect is completed');
	}).addEvent('onComplete', function(){
		alert('I told you the effect is completed');
	});

	myFx.start(0,1);
	//upon completion it will display the 2 alerts, in order.
	(end)

Implementing:
	This class can be implemented into other classes to add the functionality to them.
	Goes well with the <Options> class.

Example:
	(start code)
	var Widget = new Class({
		initialize: function(){},
		finish: function(){
			this.fireEvent('onComplete');
		}
	});
	Widget.implement(new Events);
	//later...
	var myWidget = new Widget();
	myWidget.addEvent('onComplete', myfunction);
	(end)
*/

var Events = new Class({

	/*
	Property: addEvent
		Adds an event to the stack of events of the Class instance.

	Arguments:
		type - string; the event name (e.g. 'onComplete')
		fn - the function to execute
	*/

	addEvent: function(type, fn, internal){
		if (fn != $empty){
			this.$events = this.$events || {};
			this.$events[type] = this.$events[type] || [];
			this.$events[type].include(fn);
			if (internal) fn.internal = true;
		}
		return this;
	},
	
	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	/*
	Property: fireEvent
		Fires all events of the specified type in the Class instance.

	Arguments:
		type - string; the event name (e.g. 'onComplete')
		args - array or single object; arguments to pass to the function; if more than one argument, must be an array
		delay - integer; delay (in ms) to wait before executing the event

	Example:
		(start code)
		var Widget = new Class({
			initialize: function(arg1, arg2){
				...
				this.fireEvent("onInitialize", [arg1, arg2], 50);
			}
		});
		Widget.implement(new Events);
		(end)
	*/

	fireEvent: function(type, args, delay){
		if (this.$events && this.$events[type]){
			this.$events[type].each(function(fn){
				fn.create({'bind': this, 'delay': delay, 'arguments': args})();
			}, this);
		}
		return this;
	},

	/*
	Property: removeEvent
		removes an event from the stack of events of the Class instance.

	Arguments:
		type - string; the event name (e.g. 'onComplete')
		fn - the function that was added
	*/

	removeEvent: function(type, fn){
		if (this.$events && this.$events[type]){
			if (!fn.internal) this.$events[type].remove(fn);
		}
		return this;
	},
	
	removeEvents: function(evType){
		for (var type in this.$events){
			if (evType && evType != type) continue;
			this.$events[type].each(function(fn){
				this.removeEvent(type, fn);
			}, this);
		}
		return this;
	}

});

/*
Class: Options
	An "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	Used to automate the options settings, also adding Class <Events> when the option begins with on, followed by a capital letter (e.g. 'onComplete').

	Example:
		(start code)
		var Widget = new Class({
			options: {
				color: '#fff',
				size: {
					width: 100
					height: 100
				}
			},
			initialize: function(options){
				this.setOptions(options);
			}
		});
		Widget.implement(new Options);
		//later...
		var myWidget = new Widget({
			color: '#f00',
			size: {
				width: 200
			}
		});
		//myWidget.options = {color: #f00, size: {width: 200, height: 100}}
		(end)
*/

var Options = new Class({

	/*
	Property: setOptions
		Sets this.options.

	Arguments:
		defaults - object; the default set of options
		options - object; the user defined options, may be empty as well

	Note:
		If your Class has <Events> implemented, every option beginning with on, followed by a capital letter (e.g. 'onComplete') becomes a Class instance event.
	*/

	setOptions: function(){
		this.options = $merge.apply(null, [this.options].extend(arguments));
		if (this.addEvent){
			for (var option in this.options){
				if ($type(this.options[option] == 'function') && (/^on[A-Z]/).test(option)) this.addEvent(option, this.options[option]);
			}
		}
		return this;
	}

});