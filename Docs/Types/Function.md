Function {#Function}
============================

Function Methods.

### See Also:

- [MDC Function][]



Function: Function.from {#Function-from}
----------------------------------------

If the passed argument is a function, it will return itself. Otherwise, it will return a function that returns the passed argument.

### Syntax:

	var foo = Function.from(obj);
	
### Arguments:

1. obj - (*mixed*) If this argument is a function, it will simply return itself. Otherwise, an object you wish to convert into a function that returns the argument.

### Returns:

* (*function*) Either the passed function or an anonymous function that returns the passed argument.

### Examples:

	var fn = Function.from(42);
	alert(fn());	// alerts '42'
	
	var fn2 = Function.from(fn);
	alert(fn2());	// alerts '42'
	
### Notes:

This function is equivalent to the following deprecated MooTools 1.2 methods:

	var fn1 = Function.from();		// Equivalent to var fn1 = $empty();
	var fn2 = Function.from(foo);	// Equivalent to var fn2 = $lambda(foo);



Function method: extend {#extend}
---------------------------------


Function method: implement {#implement}
---------------------------------------


Function method: clear {#clear}
-------------------------------

Clears a Timeout or an Interval. Useful when working with [Function:delay](#delay) and [Function:periodical](#periodical).

### Syntax:

	myTimer.clear(timer);

### Arguments:

1. timer - (*number*) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

### Returns:

* (*null*) returns null.

### Example:

	var myTimer = myFunction.delay(5000); //Waits 5 seconds then executes myFunction.
	myTimer = myTimer.clear(); //Cancels myFunction.

### See also:

- [Function:delay][]
- [Function:periodical][]

### Notes:

This method is equivalent to *$clear* from MooTools 1.2.



Function method: Function.stab {#stab}
-----------------------------

Tries to execute a number of functions. Returns immediately the return value of the first non-failed function without executing successive functions, or null.

### Syntax:

	Function.stab(fn[, fn, fn, fn, ...]);

### Arguments:

* fn   - (*function*) The function to execute.

### Returns:

* (*mixed*) Standard return of the called function.
* (*null*) `null` if all the passed functions fail.

### Examples:

	var result = Function.stab(function(){
		return some.made.up.object;
	}, function(){
		return jibberish.that.doesnt.exists;
	}, function(){
		return false;
	});

	//result is false

	var failure, success;

	Function.stab(function(){
		some.made.up.object = 'something';
		success = true;
	}, function(){
		failure = true;
	});

	if (success) alert('yey!');

### Notes:

This method is an equivalent of *$try* from MooTools 1.2.



Function method: create {#create}
---------------------------------

Base function for creating functional closures which is used by all other Function prototypes.

### Syntax:

	var createdFunction = myFunction.create([options]);

### Arguments:

1. [options] - (*object*, optional) The options from which the function will be created. If options is not provided, then creates a copy of the function.

#### Options: {#Function:create:options}

* bind		 - (*object*: defaults to this function) The object that the "this" of the function will refer to.
* event		 - (*mixed*: defaults to false) If set to true, the function will act as an event listener and receive an event as its first argument. If set to a class name, the function will receive a new instance of this class (with the event passed as argument's constructor) as first argument.
* arguments	 - (*mixed*: defaults to standard arguments) A single argument or an array of arguments that will be passed as arguments to the function. If both the event and arguments options are set, the event is passed as first argument and the arguments array will follow.
* delay		 - (*number*: defaults to no delay) If set, the returned function will delay the actual execution by this amount of milliseconds and return a timer handle when called.
* periodical - (*number*: defaults to no periodical execution) If set, the returned function will periodically perform the actual execution with this specified interval and return a timer handle when called.
* attempt	 - (*boolean*: false) If set to true, the returned function will try to execute and return either the results or null on error.

### Returns:

* (*function*) The function that was created as a result of the options passed in.

### Example:

	var myFunction = function(){
		alert("I'm a function. :D");
	};

	var mySimpleFunction = myFunction.create(); //Just a simple copy.

	var myAdvancedFunction = myFunction.create({ //When called, this function will attempt.
		arguments: [0,1,2,3],
		attempt: true,
		delay: 1000,
		bind: myElement
	});



Function method: run {#run}
---------------------------

Runs the Function with specified arguments and binding. The same as apply but reversed and with support for a single argument.

### Syntax:

	var myFunctionResult = myFunction.run(args[, bind]);

### Arguments:

1. args - (*mixed*) An argument, or array of arguments to run the function with.
2. bind - (*object*, optional) The object that the "this" of the function will refer to.

### Returns:

* (*mixed*) This Function's return value.

### Examples:

#### Simple Run:

	var myFn = function(a, b, c){
		return a + b + c;
	}
	var myArgs = [1,2,3];
	myFn.run(myArgs); //Returns: 6


#### Run With Binding:

	var myFn = function(a, b, c) {
		return a + b + c + this;
	}
	var myArgs = [1,2,3];
	myFn.run(myArgs, 6); //Returns: 12



Function method: pass {#pass}
-----------------------------

Returns a closure with arguments and bind.

### Syntax:

	var newFunction = myFunction.pass([args[, bind]]);

### Arguments:

1. args - (*mixed*, optional) The arguments to pass to the function (must be an array if passing more than one argument).
2. bind - (*object*, optional) The object that the "this" of the function will refer to.

### Returns:

* (*function*) The function whose arguments are passed when called.

### Example:

	var myFunction = function(){
		var result = 'Passed: ';
		for (var i = 0, l = arguments.length; i < l; i++){
			result += (arguments[i] + ' ');
		}
		return result;
	}
	var myHello = myFunction.pass('hello');
	var myItems = myFunction.pass(['peach', 'apple', 'orange']);

	//Later in the code, the functions can be executed:
	alert(myHello()); //Passes "hello" to myFunction.
	alert(myItems()); //Passes the array of items to myFunction.



Function method: bind {#bind}
-----------------------------

Changes the scope of `this` within the target function to refer to the bind parameter.

### Syntax:

	myFunction.bind([bind[, args]]);

### Arguments:

1. bind - (*object*, optional) The object that the "this" of the function will refer to.
2. args - (*mixed*, optional) The arguments to pass to the function (must be an array if passing more than one argument).

### Returns:

* (*function*) The bound function.

### Example:

	function myFunction(){
		//Note that 'this' here refers to window, not an element.
		//The function must be bound to the element we want to manipulate.
		this.setStyle('color', 'red');
	};
	var myBoundFunction = myFunction.bind(myElement);
	myBoundFunction(); //This will make myElement's text red.



Function method: bindWithEvent {#bindWithEvent}
-----------------------------------------------

Changes the scope of `this` within the target function to refer to the bind parameter. It also makes "space" for an event.
This allows the function to be used in conjunction with [Element:addEvent][] and arguments.

### Syntax:

	myFunction.bindWithEvent([bind[, args]]);

### Arguments:

1. bind - (*object*, optional) The object that the "this" of the function will refer to.
2. args - (*mixed*, optional) The arguments to pass to the function (must be an array if passing more than one argument).

### Returns:

* (*function*) The bound function.

### Example:

	var Logger = new Class({
		log: function(){
			console.log.apply(null, arguments);
		}
	});
	
	var Log = new Logger();
	
	$('myElement').addEvent('click', function(event, offset){
		offset += event.client.x;
		this.log('clicked; moving to:', offset); // this refers to myClass
		event.target.setStyle('top', offset);
		return false;
	}.bindWithEvent(Log, 100));



Function method: attempt {#attempt}
-----------------------------------

Tries to execute the function.

### Syntax:

	var result = myFunction.attempt([args[, bind]]);

### Arguments:

1. args - (*mixed*, optional) The arguments to pass to the function (must be an array if passing more than one argument).
2. bind - (*object*, optional) The object that the "this" of the function will refer to.

### Returns:

* (*mixed*) The function's return value or `null` if an exception is thrown.

### Example:

	var myObject = {
		'cow': 'moo!'
	};

	var myFunction = function(){
		for (var i = 0; i < arguments.length; i++){
			if(!this[arguments[i]]) throw('doh!');
		}
	};
	var result = myFunction.attempt(['pig', 'cow'], myObject); //result = null



Function method: delay {#delay}
-------------------------------

Delays the execution of a function by a specified duration.

### Syntax:

	var timeoutID = myFunction.delay(delay[, bind[, args]]);

### Arguments:

1. delay - (*number*) The duration to wait (in milliseconds).
2. bind	 - (*object*, optional) The object that the "this" of the function will refer to.
3. args	 - (*mixed*, optional) The arguments passed (must be an array if the arguments are greater than one).

### Returns:

* (*number*) The JavaScript timeout id (for clearing delays).

### Example:

	var myFunction = function(){ alert('moo! Element id is: ' + this.id); };
	//Wait 50 milliseconds, then call myFunction and bind myElement to it.
	myFunction.delay(50, myElement); //Alerts: 'moo! Element id is: ... '

	//An anonymous function which waits a second and then alerts.
	(function(){ alert('one second later...'); }).delay(1000);


### See Also:

- [$clear][], [MDC setTimeout][]



Function method: periodical {#periodical}
-----------------------------------------

Executes a function in the specified intervals of time. Periodic execution can be stopped using the [$clear][] function.

### Syntax:

	var intervalID = myFunction.periodical(period[, bind[, args]]);

### Arguments:

1. period - (*number*) The duration of the intervals between executions.
2. bind	  - (*object*, optional) The object that the "this" of the function will refer to.
3. args	  - (*mixed*, optional) The arguments passed (must be an array if the arguments are greater than one).

### Returns:

* (*number*) The Interval id (for clearing a periodical).

### Example:

	var Site = { counter: 0 };
	var addCount = function(){ this.counter++; };
	addCount.periodical(1000, Site); //Will add the number of seconds at the Site.


### See Also:

- [$clear][], [MDC setInterval][]



[options]: #Function:create:options
[Element:addEvent]: /core/Element/Element.Event/#Element:addEvent
[$clear]: /core/Core/Core/#clear
[MDC Function]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Function
[MDC setInterval]: https://developer.mozilla.org/en/DOM/window.setInterval
[MDC setTimeout]: https://developer.mozilla.org/en/DOM/window.setTimeout