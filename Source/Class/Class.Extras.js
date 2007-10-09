/*
Script: Class.Extras.js
	Contains common implementations for custom classes.
	In MooTools these Utilities are implemented in <Ajax>, <XHR>, <Fx> and many other Classes to provide rich functionality.

License:
	MIT-style license.
*/

/*
Class: Chain
	A "Utility" Class which executes functions one after another, with each function firing after completion of the previous.
	Its methods can be implemented with <Class.implement> into any <Class>, and it is currently implemented in <Fx>, <XHR> and <Ajax>.
	In <Fx>, for example, it is used to create custom, complex animations.

Syntax:
	For new classes:
	>var MyClass = new Class({ Implements: Chain });

	For existing classes:
	>MyClass.implement(new Chain);

Example:
	[javascript]
		var Todo = new Class({
			Implements: Chain,
			initialize: function(){
				this.chain.apply(this, arguments);
			}
		});

		var myTodoList = new Todo(
			function(){ alert('get groceries');	},
			function(){ alert('go workout'); },
			function(){ alert('code mootools documentation until eyes close involuntarily'); },
			function(){ alert('sleep');	}
		);
	[/javascript]

See Also:
	<Class>
*/

var Chain = new Class({

	/*
	Method: chain
		Adds functions to the end of the call stack of the Chain instance.

	Syntax:
		>myClass.chain(fn[, fn2[, fn3[, ...]]]);

	Arguments:
		Any number of functions.

	Returns:
		(object) This Class instance. Calls to chain can also be chained.

	Example:
		[javascript]
			//will fade the element in and out three times
			var myFx = new Fx.Style('myElement', 'opacity'); //Fx.Style has implemented class Chain because of inheritance.
			myFx.start(1,0).chain(
				function(){ this.start(0,1); }, //notice that "this" refers to the calling object. In this case: myFx object.
				function(){ this.start(1,0); },
				function(){ this.start(0,1); }
			);
		[/javascript]

	See Also:
		<Fx>, <Fx.Style>
	*/

	chain: function(){
		this.$chain = (this.$chain || []).extend(arguments);
		return this;
	},

	/*
	Method: callChain
		Removes the first function of the Chain instance stack and executes it. The next function will then become first in the array.

	Syntax:
		>myClass.callChain();

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var Queue = new Class({
				Implements: Chain,
				initialize: function(){
					this.chain.apply(this, arguments);
				}
			});
			var myQueue = new Queue();
			myQueue.chain(
				function(){ alert('do dishes'); },
				function(){ alert('put away clean dishes'); }
			);
			myQueue.callChain(); //alerts 'do dishes'
			myQueue.callChain(); //alerts 'put away clean dishes'
		[/javascript]
	*/

	callChain: function(){
		if (this.$chain && this.$chain.length) this.$chain.shift().call(this);
		return this;
	},

	/*
	Method: clearChain
		Clears the stack of a Chain instance.

	Syntax:
		>myClass.clearChain();

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var myFx = Fx.Style('myElement', 'color'); //Fx.Style inherited Fx's implementation of Chain see <Fx>
			myFx.chain(function(){ while(true) alert('doh!'); }); //don't try this at home, kids.
			myFx.clearChain(); // .. that was a close one ...
		[/javascript]

	See Also:
		<Fx>, <Fx.Style>
	*/

	clearChain: function(){
		if (this.$chain) this.$chain.empty();
		return this;
	}

});

/*
Class: Events
	A "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	In <Fx>, for example, this Class is used to allow any number of functions to be added to the Fx events, like onComplete, onStart, and onCancel.
	Events in a Class that implements <Events> must be either added as an option or with addEvent, not directly through .options.onEventName.

Syntax:
	For new classes:
	>var MyClass = new Class({ Implements: Events });

	For existing classes:
	>MyClass.implement(new Events);

Implementing:
	This class can be implemented into other classes to add its functionality to them.
	It has been designed to work well with the <Options> class.

Example:
	[javascript]
		var Widget = new Class({
			Implements: Events,
			initialize: function(element){
				...
			},
			complete: function(){
				this.fireEvent('onComplete');
			}
		});

		var myWidget = new Widget();
		myWidget.addEvent('onComplete', myFunction);
	[/javascript]

See Also:
	<Class>, <Options>
*/

var Events = new Class({

	/*
	Method: addEvent
		Adds an event to the Class instance's event stack.

	Syntax:
		>myClass.addEvent(type, fn[, internal]);

	Arguments:
		type     - (string) The type of event (e.g. 'onComplete').
		fn       - (function) The function to execute.
		internal - (boolean, optional) Sets the function property: internal to true. Internal property is used to prevent removal.

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var myFx = new Fx.Style('element', 'opacity');
			myFx.addEvent('onStart', myStartFunction);
		[/javascript]
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
	Method: addEvents
		Works as <addEvent>, but accepts an object to add multiple events at once.

	Syntax:
		>myClass.addEvents(events);

	Arguments:
		events - (object) An object containing a collection of event type / function pairs.

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var myFx = new Fx.Style('element', 'opacity');
			myFx.addEvents({
				'onStart': myStartFunction,
				'onComplete': myCompleteFunction
			});
		[/javascript]
	*/

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	/*
	Method: fireEvent
		Fires all events of the specified type in the Class instance.

	Syntax:
		>myClass.fireEvent(type[, args[, delay]]);

	Arguments:
		type  - (string) The type of event (e.g. 'onComplete').
		args  - (mixed, optional) The argument(s) to pass to the function. To pass more than one argument, the arguments must be in an array.
		delay - (number, optional) Delay in miliseconds to wait before executing the event (defaults to 0).

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var Widget = new Class({
				Implements: Events,
				initialize: function(arg1, arg2){
					...
					this.fireEvent("onInitialize", [arg1, arg2], 50);
				}
			});
		[/javascript]
	*/

	fireEvent: function(type, args, delay){
		if (!this.$events || !this.$events[type]) return this;
		this.$events[type].each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	/*
	Method: removeEvent
		Removes an event from the stack of events of the Class instance.

	Syntax:
		>myClass.removeEvent(type, fn);

	Arguments:
		type - (string) The type of event (e.g. 'onComplete').
		fn   - (function) The function to remove.

	Returns:
		(object) This Class instance.

	Note:
		If the function has the property internal and is set to true, then the event will not be removed.
	*/

	removeEvent: function(type, fn){
		if (!this.$events) return this;
		if (this.$events && this.$events[type]){
			if (!fn.internal) this.$events[type].remove(fn);
		}
		return this;
	},

	/*
	Method: removeEvents
		Removes all events of the given type from the stack of events of a Class instance. If no type is specified, removes all events of all types.

	Syntax:
		>myClass.removeEvents([type]);

	Arguments:
		type - (string, optional) The type of event to remove (e.g. 'onComplete'). If no type is specified, removes all events of all types.

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var myFx = new Fx.Style('element', 'opacity');
			myFx.removeEvents('onComplete');
		[/javascript]

	Note:
		Will not remove internal events. See <Events.removeEvent>.
	*/

	removeEvents: function(type){
		for (var e in this.$events){
			if (type && type != e) continue;
			var fns = this.$events[e];
			for (var i = fns.length; i--; i) this.removeEvent(e, fns[i]);
		}
		return this;
	}

});

/*
Class: Options
	A "Utility" Class. Its methods can be implemented with <Class.implement> into any <Class>.
	Used to automate the setting of a Class instance's options.
	Will also add Class <Events> when the option property begins with on, followed by a capital letter (e.g. 'onComplete').

Syntax:
	For new classes:
	>var MyClass = new Class({Implements: Options});

	For existing classes:
	>MyClass.implement(Options);
*/

var Options = new Class({

	/*
	Method: setOptions
		Merges the default options of the Class with the options passed in.

	Syntax:
		>myClass.setOptions([options]);

	Arguments:
		options - (object, optional) The user defined options to merge with the defaults.

	Returns:
		(object) This Class instance.

	Example:
		[javascript]
			var Widget = new Class({
				Implements: Options,
				options: {
					color: '#fff',
					size: {
						width: 100,
						height: 100
					}
				},
				initialize: function(options){
					this.setOptions(options);
				}
			});

			var myWidget = new Widget({
				color: '#f00',
				size: {
					width: 200
				}
			});
			//myWidget.options is now {color: #f00, size: {width: 200, height: 100}}
		[/javascript]

	Note:
		Relies on the default options of a Class defined in its options property.
		If a Class has <Events> implemented, every option beginning with 'on' and followed by a capital letter (e.g. 'onComplete') becomes a Class instance event, assuming the value of the option is a function.
	*/

	setOptions: function(){
		this.options = $merge.run([this.options].extend(arguments));
		if (!this.addEvent) return this;
		for (var option in this.options){
			if ($type(this.options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, this.options[option]);
			delete this.options[option];
		}
		return this;
	}

});