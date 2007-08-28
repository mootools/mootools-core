/*
Script: Function.js
	Contains Function prototypes and utility functions.

License:
	MIT-style license.
*/

/*
Class: Function
	A collection of The Function Object prototype methods.

See Also:
	 <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Function>
*/

Function.extend({

	extend: $extend,

	/*
	Property: create
		Base function for creating functional closures which is used by all other Function prototypes.

	Syntax:
		>var createdFunction = myFunction.create([options]);

	Arguments:
		options - (object, optional) The options from which the function will be created. If options is not provided, then creates a copy of the function.  All members are optional, see below for details.

	Options:
		bind  - (object) The object that the "this" of the function will refer to. Default is the current function.
		event - (mixed) If set to true, the function will act as an event listener and receive an event as its first argument.
			If set to a class name, the function will receive a new instance of this class (with the event passed as argument's constructor) as first argument.
			Default is false.
		arguments - A single argument or array of arguments that will be passed as arguments to the function when called.
			If both the event and arguments options are set, the event is passed as first argument and the arguments array will follow.
			Default is no custom arguments; the function will receive the standard arguments when called.
		delay - (integer) if set, the returned function will delay the actual execution by this amount of milliseconds and return a timer handle when called.
			Default is no delay.
		periodical - Numeric value: if set, the returned function will periodically perform the actual execution with this specified interval
			and return a timer handle when called.
			Default is no periodical execution.
		attempt - If set to true, the returned function will try to execute and return either the results or false on error. Default is false.

	Returns:
		(function) The function that was created as a result of the options passed in.

	Example:
		(start code)
		var aFunction = function(){
			alert("I'm a function :)");
		};

		var aFn = aFunction.create(); //just a simple copy

		var advancedFn = aFunction.create({ //when called, this function will attempt
			arguments: [0,1,2,3],
			attempt: true,
			delay: 1000,
			bind: anElement
		});
		(end)
	*/

	create: function(options){
		var self = this;
		options = options || {};
		options.arguments = $splat(options.arguments || null);
		options.bind = $pick(options.bind || null, self);
		return function(event){
			var args = options.arguments || arguments;
			if (options.event) args = [event || window.event].extend(args);
			var returns = function(){
				return self.apply(options.bind, args);
			};
			if (options.delay) return setTimeout(returns, options.delay);
			if (options.periodical) return setInterval(returns, options.periodical);
			if (options.attempt) return $try(returns);
			return returns();
		};
	},

	/*
	Property: pass
		Returns a closure with arguments and bind.

	Syntax:
		>var newFunction = myFunction.pass([args[, bind]]);

	Arguments:
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).
		bind - (object, optional) The object that the "this" of the function will refer to.

	Returns:
		(function) The function whose arguments are passed when called.

	Example:
		(start code)
			var myFunction = function(){
				var result = 'Passed: ';
				for(var i = 0, l = arguments.length; i < l; i++){
					result += (arguments[i] + ' ');
				}
				return result;
			}
			var myHello = myFunction.pass('hello');
			var myItems = myFunction.pass(['peach', 'apple', 'orange']);

			//when ready I can execute the functions.
			alert(myHello());
			alert(myItems());
		(end)
	*/

	pass: function(args, bind){
		return this.create({'arguments': args, 'bind': bind});
	},

	/*
	Property: attempt
		Tries to execute the function.

	Syntax:
		>var result = myFunction.attempt([args[, bind]]);

	Arguments:
		args - (mixed) The arguments to pass to the function (must be an array if passing more than one argument).
		bind - (object, optional) The object that the "this" of the function will refer to.

	Returns:
		(mixed) False if an exception is thrown, else the function's return.

	Example:
		(start code)
		var myObject = {
			'cow': 'moo!'
		};

		var myFunction = function(){
			for(var i = 0; i < arguments.length; i++){
				if(!this[arguments[i]]) throw('doh!');
			}
		};
		var result = myFunction.attempt(['pig', 'cow'], myObject); // false
		(end)
	*/

	attempt: function(args, bind){
		return this.create({'arguments': args, 'bind': bind, 'attempt': true})();
	},

	/*
	Property: bind
		Returns a function whose "this" is altered.

	Syntax:
		>myFunction.bind([bind[, args[, evt]]]);

	Arguments:
		bind - (object, optional) The object that the "this" of the function will refer to.
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).
		evt  - (mixed, optional) Used to signifiy that the function is an Event Listener. See <Function.create> Options section for more information.

	Returns:
		(function) The binded function.

	Example:
		(start code)
		function myFunction(){
			this.setStyle('color', 'red');
			// note that 'this' here refers to myFunction, not an element
			// we'll need to bind this function to the element we want to alter
		};
		var myBoundFunction = myFunction.bind(myElement);
		myBoundFunction(); // this will make the element myElement red.
		(end)
	*/

	bind: function(bind, args, evt){
		return this.create({'bind': bind, 'arguments': args, 'event': evt});
	},

	/*
	Property: delay
		Delays the execution of a function by a specified duration.

	Syntax:
		>var timeoutID = myFunction.delay([delay[, bind[, args]]]);

	Arguments:
		delay - (integer, optional) The duration to wait (in milliseconds).
		bind  - (object, optional) The object that the "this" of the function will refer to.
		args  - (mixed, optional) The arguments passed (must be an array if the arguments are greater than one).

	Returns:
		(integer) The JavaScript Timeout ID (useful for clearing delays).

	Example:
		(start code)
		var myFunction = function(){ alert('moo! Element id is: ' + this.id); };
		//wait 50 milliseconds, then call myFunction and bind myElement to it
		myFunction.delay(50, myElement); // alerts: 'moo! Element id is: ... '

		// An anonymous function, example
		(function(){ alert('one second later...'); }).delay(1000); //wait a second and alert
		(end)

	See Also:
		<$clear>, <http://developer.mozilla.org/en/docs/DOM:window.setTimeout>
	*/

	delay: function(delay, bind, args){
		return this.create({'delay': delay, 'bind': bind, 'arguments': args})();
	},

	/*
	Property: periodical
		Executes a function in the specified intervals of time

	Syntax:
		>var intervalID = myFunction.periodical([period[, bind[, args]]]);

	Arguments:
		period - (integer, optional) The duration of the intervals between executions.
		bind   - (object, optional) The object that the "this" of the function will refer to.
		args   - (mixed, optional) The arguments passed (must be an array if the arguments are greater than one).

	Returns:
		(integer) The Interval ID (useful for clearing a periodical).

	Example:
		(start code)
		var Site = { counter: 0 };
		var addCount = function(){ this.counter++; };
		addCount.periodical(1000, Site); // will add the number of seconds at the Site
		(end)

	See Also:
		<$clear>, <http://developer.mozilla.org/en/docs/DOM:window.setInterval>
	*/

	periodical: function(interval, bind, args){
		return this.create({'periodical': interval, 'bind': bind, 'arguments': args})();
	}

});

Function.empty = $empty;
