/*
Script: Function.js
	Contains Function prototypes and utility functions.

License:
	MIT-style license.
*/

/*
Native: Function
	A collection of The Function Object prototype methods.

See Also:
	 <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Function>
*/

Function.implement({

	extend: $extend,

	/*
	Method: create
		Base function for creating functional closures which is used by all other Function prototypes.

	Syntax:
		>var createdFunction = myFunction.create([options]);

	Arguments:
		options - (object, optional) The options from which the function will be created. If options is not provided, then creates a copy of the function.

		options (continued):
			bind - (object: defaults to this function) The object that the "this" of the function will refer to.
			event - (mixed: defaults to false) If set to true, the function will act as an event listener and receive an event as its first argument. If set to a class name, the function will receive a new instance of this class (with the event passed as argument's constructor) as first argument.
			arguments - (mixed: defaults to standard arguments) A single argument or an array of arguments that will be passed as arguments to the function. If both the event and arguments options are set, the event is passed as first argument and the arguments array will follow.
			delay - (number: defaults to no delay) If set, the returned function will delay the actual execution by this amount of milliseconds and return a timer handle when called.
			periodical - (number: defaults to no periodical execution) If set, the returned function will periodically perform the actual execution with this specified interval and return a timer handle when called.
			attempt - (boolean: false) If set to true, the returned function will try to execute and return either the results or false on error.

	Returns:
		(function) The function that was created as a result of the options passed in.

	Example:
		[javascript]
			var myFunction = function(){
				alert("I'm a function :)");
			};

			var mySimpleFunction = myFunction.create(); //just a simple copy

			var myAdvancedFunction = myFunction.create({ //when called, this function will attempt
				arguments: [0,1,2,3],
				attempt: true,
				delay: 1000,
				bind: myElement
			});
		[/javascript]
	*/

	create: function(options){
		var self = this;
		options = options || {};
		return function(event){
			var args = $defined(options.arguments) ? $splat(options.arguments) : arguments;
			if (options.event) args = [event || window.event].extend(args);
			var returns = function(){
				return self.apply(options.bind || null, args);
			};
			if (options.delay) return setTimeout(returns, options.delay);
			if (options.periodical) return setInterval(returns, options.periodical);
			if (options.attempt) return $try(returns);
			return returns();
		};
	},

	/*
	Method: pass
		Returns a closure with arguments and bind.

	Syntax:
		>var newFunction = myFunction.pass([args[, bind]]);

	Arguments:
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).
		bind - (object, optional) The object that the "this" of the function will refer to.

	Returns:
		(function) The function whose arguments are passed when called.

	Example:
		[javascript]
			var myFunction = function(){
				var result = 'Passed: ';
				for (var i = 0, l = arguments.length; i < l; i++){
					result += (arguments[i] + ' ');
				}
				return result;
			}
			var myHello = myFunction.pass('hello');
			var myItems = myFunction.pass(['peach', 'apple', 'orange']);

			//when ready I can execute the functions.
			alert(myHello());
			alert(myItems());
		[/javascript]
	*/

	pass: function(args, bind){
		return this.create({'arguments': args, 'bind': bind});
	},

	/*
	Method: attempt
		Tries to execute the function.

	Syntax:
		>var result = myFunction.attempt([args[, bind]]);

	Arguments:
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).
		bind - (object, optional) The object that the "this" of the function will refer to.

	Returns:
		(mixed) False if an exception is thrown, else the function's return.

	Example:
		[javascript]
			var myObject = {
				'cow': 'moo!'
			};

			var myFunction = function(){
				for (var i = 0; i < arguments.length; i++){
					if(!this[arguments[i]]) throw('doh!');
				}
			};
			var result = myFunction.attempt(['pig', 'cow'], myObject); //result = false
		[/javascript]
	*/

	attempt: function(args, bind){
		return this.create({'arguments': args, 'bind': bind, 'attempt': true})();
	},

	/*
	Method: bind
		Returns a function whose "this" is altered.

	Syntax:
		>myFunction.bind([bind[, args[, evt]]]);

	Arguments:
		bind - (object, optional) The object that the "this" of the function will refer to.
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).

	Returns:
		(function) The binded function.

	Example:
		[javascript]
			function myFunction(){
				this.setStyle('color', 'red');
				//note that 'this' here refers to window, not an element
				//we'll need to bind this function to the element we want to alter
			};
			var myBoundFunction = myFunction.bind(myElement);
			myBoundFunction(); // this will make the element myElement red.
		[/javascript]
	*/

	bind: function(bind, args){
		return this.create({'bind': bind, 'arguments': args});
	},

	/*
	Method: bindWithEvent
		Returns a function whose "this" is altered. It also makes "space" for an event.
		This makes the method indicate for using in conjunction with <Element.addEvent> and arguments.

	Syntax:
		>myFunction.bindWithEvent([bind[, args[, evt]]]);

	Arguments:
		bind - (object, optional) The object that the "this" of the function will refer to.
		args - (mixed, optional) The arguments to pass to the function (must be an array if passing more than one argument).

	Returns:
		(function) The binded function.

	Example:
		[javascript]
			function myFunction(e, add){
				this.setStyle('top', e.client.x + add);
				//note that 'this' here refers to window, not an element
				//we'll need to bind this function to the element we want to alter
			};
			$(myElement).addEvent('click', myFunction.bindWithEvent(myElement, 100);
			//when clicked the element will move to the position of the mouse + 100;
		[/javascript]
	*/

	bindWithEvent: function(bind, args){
		return this.create({'bind': bind, 'event': true, 'arguments': args});
	},

	/*
	Method: delay
		Delays the execution of a function by a specified duration.

	Syntax:
		>var timeoutID = myFunction.delay([delay[, bind[, args]]]);

	Arguments:
		delay - (number, optional) The duration to wait (in milliseconds).
		bind  - (object, optional) The object that the "this" of the function will refer to.
		args  - (mixed, optional) The arguments passed (must be an array if the arguments are greater than one).

	Returns:
		(number) The JavaScript Timeout ID (useful for clearing delays).

	Example:
		[javascript]
			var myFunction = function(){ alert('moo! Element id is: ' + this.id); };
			//wait 50 milliseconds, then call myFunction and bind myElement to it
			myFunction.delay(50, myElement); // alerts: 'moo! Element id is: ... '

			//An anonymous function, example
			(function(){ alert('one second later...'); }).delay(1000); //wait a second and alert
		[/javascript]

	See Also:
		<$clear>, <http://developer.mozilla.org/en/docs/DOM:window.setTimeout>
	*/

	delay: function(delay, bind, args){
		return this.create({'delay': delay, 'bind': bind, 'arguments': args})();
	},

	/*
	Method: periodical
		Executes a function in the specified intervals of time

	Syntax:
		>var intervalID = myFunction.periodical([period[, bind[, args]]]);

	Arguments:
		period - (number, optional) The duration of the intervals between executions.
		bind   - (object, optional) The object that the "this" of the function will refer to.
		args   - (mixed, optional) The arguments passed (must be an array if the arguments are greater than one).

	Returns:
		(number) The Interval ID (useful for clearing a periodical).

	Example:
		[javascript]
			var Site = { counter: 0 };
			var addCount = function(){ this.counter++; };
			addCount.periodical(1000, Site); // will add the number of seconds at the Site
		[/javascript]

	See Also:
		<$clear>, <http://developer.mozilla.org/en/docs/DOM:window.setInterval>
	*/

	periodical: function(interval, bind, args){
		return this.create({'periodical': interval, 'bind': bind, 'arguments': args})();
	},

	/*
	Method: run
		Runs the Function with specified arguments and binding. Kinda like .apply but reversed and with support for single argument.

	Syntax:
		>var myFunctionResult = myFunction.run(args[, bind]);

	Arguments:
		args - (mixed) An argument, or array of arguments to run the function with.
		bind - (object, optional) The object that the "this" of the function will refer to.

	Returns:
		(mixed) This Function's return.

	Examples:
		Simple run:
		[javascript]
			var myFn = function(a, b, c){
				return a + b + c;
			}
			var myArgs = [1,2,3];
			myFn.run(args); //returns 6
		[/javascript]

		Run with binding:
		[javascript]
			var myFn = function(a, b, c){
				return a + b + c + this;
			}
			var myArgs = [1,2,3];
			myFn.run(args, 6); //returns 12
		[/javascript]
	*/

	run: function(args, bind){
		return this.apply(bind, $splat(args));
	}

});