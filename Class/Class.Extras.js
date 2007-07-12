/*
Script: Class.Extras.js
	Contains common implementations for custom classes. In Mootools these Utilities are implemented in <Ajax>, <XHR>, <Fx.Base> and many other Classes to provide rich functionality.

License:
	MIT-style license.
*/

/*
Class: Chain
	A "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	Currently implemented in <Fx.Base>, <XHR> and <Ajax>. In <Fx.Base> for example, is used to execute a list of functions, one after another, once an effect has completed.
	The functions will not be fired all at once, but rather in succession upon completion of the one before to create custom complex animations.

Syntax:
	>MyClass.implement(new Chain);

Example:
	(start code)
	var myFx = new Fx.Style('element', 'opacity');
	myFx.start(1,0).chain(function(){
		myFx.start(0,1);
	}).chain(function(){
		myFx.start(1,0);
	}).chain(function(){
		myFx.start(0,1);
	});	//this will fade the element in and out three times
	(end)
*/

var Chain = new Class({

	/*
	Property: chain
		Adds a function to the Chain instance stack.

	Arguments:
		fn - (function) The function to append to the call stack.
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
	A "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	In <Fx.Base>, for example, this Class is used to allow any number of functions to be added to the Fx events, like onComplete, onStart, and onCancel.
	Events in a Class that implements <Events> must be either added as an option or with addEvent, not directly through .options.onEventName.

Syntax:
	>MyClass.implement(new Events);

Example:
	(start code)
	var myFx = new Fx.Style('element', 'opacity');
	myFx.addEvent('onStart', function(){
		alert('the effect has started');
	}).addEvent('onComplete', function(){
		alert('the effect has completed');
	});

	//will display an alert on start, and another on complete.
	myFx.start(0,1);
	(end)

Implementing:
	This class can be implemented into other classes to add its functionality to them.
	It has been designed to work well with the <Options> class.

Example:
	(start code)
	var Widget = new Class({
		initialize: function(element){
			...
		},
		complete: function(){
			this.fireEvent('onComplete');
		}
	});
	Widget.implement(new Events);
	//later...
	var myWidget = new Widget();
	myWidget.addEvent('onComplete', myFunction);
	(end)
*/

var Events = new Class({

	/*
	Property: addEvent
		Adds an event to the Class instance's event stack.

	Syntax:
		>myClass.addEvent(type, fn);

	Arguments:
		type - (string)   The type of event (e.g. 'onComplete').
		fn   - (function) The function to execute.

	Example:
		(start code)
		var myFx = new Fx.Style('element', 'opacity');
		myFx.addEvent('onStart', myStartFunction);
		(end)
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

	/*
	Property: addEvents
		Works as <addEvent>, but accepts an object to add multiple events at once.

	Syntax:
		>myClass.addEvents(events);

	Arguments:
		events - (object) An object containing the event type / function pairs.

	Example:
		(start code)
		var myFx = new Fx.Style('element', 'opacity');
		myFx.addEvents({
			'onStart': myStartFunction,
			'onComplete': myCompleteFunction
		});
		(end)
	*/

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	/*
	Property: fireEvent
		Fires all events of the specified type in the Class instance.

	Syntax:
		>myClass.fireEvent(type[, args[, delay]]);

	Arguments:
		type  - (string) The type of event (e.g. 'onComplete').
		args  - (mixed, optional) The argument(s) to pass to the function. To pass more than one argument, the arguments must be in an array.
		delay - (integer, optional) Delay in miliseconds to wait before executing the event (defaults to 0).

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
		Removes an event from the stack of events of the Class instance.

	Syntax:
		>myClass.removeEvent(type, fn);

	Arguments:
		type - (string) The type of event (e.g. 'onComplete').
		fn   - (function) The function to remove.
	*/

	removeEvent: function(type, fn){
		if (this.$events && this.$events[type]){
			if (!fn.internal) this.$events[type].remove(fn);
		}
		return this;
	},

	/*
	Property: removeEvents
		Works as <removeEvent>, but removes all events of the given type. If no type is specified, removes all events of all types.

	Syntax:
		>myClass.removeEvents([type]);

	Arguments:
		type - (string, optional) The type of event to remove (e.g. 'onComplete'). If no type is specified, removes all events of all types.

	Example:
		(start code)
		var myFx = new Fx.Style('element', 'opacity');
		myFx.removeEvents('onComplete');
		(end)
	*/

	removeEvents: function(type){
		for (var e in this.$events){
			if (type && type != e) continue;
			this.$events[e].each(function(fn){
				this.removeEvent(e, fn);
			}, this);
		}
		return this;
	}

});

/*
Class: Options
	A "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	Used to automate the setting of a Class instance's options. Will also add Class <Events> when the option begins with on, followed by a capital letter (e.g. 'onComplete').

Syntax:
	>MyClass.implement(new Options);

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
	//myWidget.options is now {color: #f00, size: {width: 200, height: 100}}
	(end)
*/

var Options = new Class({

	/*
	Property: setOptions
		Merges the default options of the Class with the options passed in.

	Syntax:
		>myClass.setOptions([options]);

	Arguments:
		options - (object, optional) The user defined options to merge with the defaults.

	Note:
		Your Class must have its default options defined in its options object.
		If your Class has <Events> implemented, every option beginning with on, followed by a capital letter (e.g. 'onComplete') becomes a Class instance event.
	*/

	setOptions: function(options){
		this.options = $merge(this.options, options);
		if (this.addEvent){
			for (var option in this.options){
				if ((/^on[A-Z]/).test(option) && $type(this.options[option] == 'function')) this.addEvent(option, this.options[option]);
			}
		}
		return this;
	}

});
