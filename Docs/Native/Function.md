Native: Function {#Function}
============================

Function Methods.

### See Also:

- [MDC Function][]



Function Method: create {#Function:create}
------------------------------------------

Base function for creating functional closures which is used by all other Function prototypes.

### Syntax:

	var createdFunction = myFunction.create([options]);

### Arguments:

1. [options] - (*object*, optional) The options from which the function will be created. If options is not provided, then creates a copy of the function.

#### Options: {#Function:create:options}

* bind       - (*object*: defaults to this function) The object that the "this" of the function will refer to.
* event      - (*mixed*: defaults to false) If set to true, the function will act as an event listener and receive an event as its first argument. If set to a class name, the function will receive a new instance of this class (with the event passed as argument's constructor) as first argument.
* arguments  - (*mixed*: defaults to standard arguments) A single argument or an array of arguments that will be passed as arguments to the function. If both the event and arguments options are set, the event is passed as first argument and the arguments array will follow.
* delay      - (*number*: defaults to no delay) If set, the returned function will delay the actual execution by this amount of milliseconds and return a timer handle when called.
* periodical - (*number*: defaults to no periodical execution) If set, the returned function will periodically perform the actual execution with this specified interval and return a timer handle when called.
* attempt    - (*boolean*: false) If set to true, the returned function will try to execute and return either the results or null on error.

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



Function Method: pass {#Function:pass}
--------------------------------------

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



Function Method: attempt {#Function:attempt}
--------------------------------------------

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



Function Method: bind {#Function:bind}
--------------------------------------

Changes the scope of `this` within the target function to refer to the bind parameter.

### Syntax:

	myFunction.bind([bind[, args[, evt]]]);

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



Function Method: bindWithEvent {#Function:bindWithEvent}
--------------------------------------------------------

Changes the scope of `this` within the target function to refer to the bind parameter. It also makes "space" for an event.
This allows the function to be used in conjunction with [Element:addEvent][] and arguments.

### Syntax:

	myFunction.bindWithEvent([bind[, args[, evt]]]);

### Arguments:

1. bind - (*object*, optional) The object that the "this" of the function will refer to.
2. args - (*mixed*, optional) The arguments to pass to the function (must be an array if passing more than one argument).

### Returns:

* (*function*) The bound function.

### Example:

	function myFunction(e, add){
		//Note that 'this' here refers to window, not an element.
		//We'll need to bind this function to the element we want to alter.
		this.setStyle('top', e.client.x + add);
	};
	$(myElement).addEvent('click', myFunction.bindWithEvent(myElement, 100));
	//When clicked, the element will move to the position of the mouse + 100.



Function Method: delay {#Function:delay}
----------------------------------------

Delays the execution of a function by a specified duration.

### Syntax:

	var timeoutID = myFunction.delay(delay[, bind[, args]]);

### Arguments:

1. delay - (*number*) The duration to wait (in milliseconds).
2. bind  - (*object*, optional) The object that the "this" of the function will refer to.
3. args  - (*mixed*, optional) The arguments passed (must be an array if the arguments are greater than one).

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



Function Method: periodical {#Function:periodical}
--------------------------------------------------

Executes a function in the specified intervals of time. Periodic execution can be stopped using the [$clear][] function.

### Syntax:

	var intervalID = myFunction.periodical(period[, bind[, args]]);

### Arguments:

1. period - (*number*) The duration of the intervals between executions.
2. bind   - (*object*, optional) The object that the "this" of the function will refer to.
3. args   - (*mixed*, optional) The arguments passed (must be an array if the arguments are greater than one).

### Returns:

* (*number*) The Interval id (for clearing a periodical).

### Example:

	var Site = { counter: 0 };
	var addCount = function(){ this.counter++; };
	addCount.periodical(1000, Site); //Will add the number of seconds at the Site.


### See Also:

- [$clear][], [MDC setInterval][]



Function Method: run {#Function:run}
------------------------------------

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



[options]: #Function:create:options
[Element:addEvent]: /Element/Element.Event/#Element:addEvent
[$clear]: /Core/Core/#clear
[MDC Function]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Function
[MDC setInterval]: http://developer.mozilla.org/en/docs/DOM:window.setInterval
[MDC setTimeout]: http://developer.mozilla.org/en/docs/DOM:window.setTimeout