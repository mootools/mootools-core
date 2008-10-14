Core {#Core}
============

Core contains an handful of common sense functions used in [MooTools](http://mootools.net).
It also contains some basic [Hash][] and [Array][] methods.

Function: $chk {#chk}
---------------------

Checks to see if a value exists or is 0. Useful for allowing 0.

### Syntax:

	$chk(item);

### Arguments:

1. item - (*mixed*) The item to inspect.

### Returns:

* (*boolean*) If the object passed in exists or is 0, returns true. Otherwise, returns false.

### Example:

	function myFunction(arg){
		if($chk(arg)) alert('The object exists or is 0.');
		else alert('The object is either null, undefined, false, or ""');
	}



Function: $clear {#clear}
-------------------------

Clears a Timeout or an Interval. Useful when working with [Function:delay][] and [Function:periodical][].

### Syntax:

	$clear(timer);

### Arguments:

1. timer - (*number*) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

### Returns:

* (*null*) returns null.

### Example:

	var myTimer = myFunction.delay(5000); //Waits 5 seconds then executes myFunction.
	myTimer = $clear(myTimer); //Cancels myFunction.

### See also:

- [Function:delay][]
- [Function:periodical][]



Function: $defined {#defined}
-----------------------------

Checks to see if a value is defined.

### Syntax:

	$defined(obj);

### Arguments:

1. obj - (*mixed*) The object to inspect.

### Returns:

* (*boolean*) If the object passed is not null or undefined, returns true. Otherwise, returns false.

### Example:

	function myFunction(arg){
		if($defined(arg)) alert('The object is defined.');
		else alert('The object is null or undefined.');
	}



Function: $arguments {#arguments}
---------------------------------

Creates a function which returns the passed argument according to the index (i) passed.

### Syntax:

	var argument = $arguments(i);

### Arguments

1. i - (*number*) The index of the argument to return.

### Returns

* (*function*) The function that returns a certain argument from the function's arguments.

### Example:

	var secondArgument = $arguments(1);
	alert(secondArgument('a','b','c')); //Alerts "b".



Function: $empty {#empty}
-------------------------

An empty function, that's it. Typically used for as a placeholder inside event methods of classes.

### Syntax:

	var emptyFn = $empty;

### Example:

	var myFunc = $empty;

Function: $lambda {#lambda}
-------------------------

Creates an empty function which does nothing but return the value passed.

### Syntax:

	var returnTrue = $lambda(true);

### Arguments

1. value - (*mixed*) The value for the created function to return.

### Returns

* (*function*) A function which returns the desired value.

### Example:

	myLink.addEvent('click', $lambda(false)); //Prevents a link Element from being clickable.


Function: $extend {#extend}
---------------------------

Copies all the properties from the second object passed in to the first object passed in.

### Syntax:

	$extend(original, extended);

### Arguments:

1. original  - (*object*) The object to be extended.
2. extension - (*object*) The object whose properties will be copied to original.

### Returns:

* (*object*) The first object passed in, extended.

### Examples:

	var firstObj = {
		'name': 'John',
		'lastName': 'Doe'
	};
	var secondObj = {
		'age': '20',
		'sex': 'male',
		'lastName': 'Dorian'
	};
	$extend(firstObj, secondObj);
	//firstObj is now: {'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male'};



Function: $merge {#merge}
-------------------------

Merges any number of objects recursively without referencing them or their sub-objects.

### Syntax:

	var merged = $merge(obj1, obj2[, obj3[, ...]]);

### Arguments:

1. (objects) Any number of objects.

### Returns:

* (*object*) The object that is created as a result of merging all the objects passed in.

### Examples:

	var obj1 = {a: 0, b: 1};
	var obj2 = {c: 2, d: 3};
	var obj3 = {a: 4, d: 5};
	var merged = $merge(obj1, obj2, obj3); //returns {a: 4, b: 1, c: 2, d: 5}, (obj1, obj2, and obj3 are unaltered)

	var nestedObj1 = {a: {b: 1, c: 1}};
	var nestedObj2 = {a: {b: 2}};
	var nested = $merge(nestedObj1, nestedObj2); //returns: {a: {b: 2, c: 1}}



Function: $each {#each}
-----------------------

Used to iterate through iterables that are not regular arrays, such as built in getElementsByTagName calls, arguments of a function, or an object.

### Syntax:

	$each(iterable, fn[, bind]);

### Arguments:

1. iterable - (*object* or *array*) The object or array to iterate through.
2. fn       - (*function*) The function to test for each element.
3. bind     - (*object*, optional) The object to use as 'this' within the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, object)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array. In the case of an object, it is passed the key of that item rather than the index.
3. object - (*mixed*) The actual array/object.

### Examples:

#### Array Example:

	$each(['Sun','Mon','Tue'], function(day, index){
		alert('name:' + day + ', index: ' + index);
	}); //Alerts "name: Sun, index: 0", "name: Mon, index: 1", etc.


#### Object Example:

    //Alerts "The first day of the week is Sunday", "The second day of the week is Monday", etc:
	$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
		alert("The " + key + " day of the week is " + value);
	});



Function: $pick {#pick}
-----------------------

Returns the first defined argument passed in, or null.

### Syntax:

	var picked = $pick(var1[, var2[, var3[, ...]]]);

### Arguments:

* (*mixed*) Any number of variables.

### Returns:

* (*mixed*) The first variable that is defined.
* (*null*) If all variables passed in are `null` or `undefined`, returns `null`.

### Example:

	function say(infoMessage, errorMessage){
		alert($pick(errorMessage, infoMessage, 'There was no message supplied.'));
	}
	say(); //Alerts "There was no message supplied."
    say("This is an info message."); //Alerts "This is an info message."
    say("This message will be ignored.", "This is the error message."); //Alerts "This is the error message."



Function: $random {#random}
---------------------------

Returns a random integer between the two passed in values.

### Syntax:

	var random = $random(min, max);

### Arguments:

1. min - (*number*) The minimum value (inclusive).
2. max - (*number*) The maximum value (inclusive).

### Returns:

* (*number*) A random number between min and max.

### Example:

	alert($random(5, 20)); //Alerts a random number between 5 and 20.



Function: $splat {#splat}
-------------------------

Converts the argument passed in to an array if it is defined and not already an array.

### Syntax:

	var splatted = $splat(obj);

### Arguments:

1. obj - (*mixed*) Any type of variable.

### Returns:

* (*array*) If the variable passed in is an array, returns the array. Otherwise, returns an array with the only element being the variable passed in.

### Example:

	$splat('hello'); //Returns ['hello'].
	$splat(['a', 'b', 'c']); //Returns ['a', 'b', 'c'].



Function: $time {#time}
-----------------------

Returns the current time as a timestamp.

### Syntax:

	var time = $time();

### Returns:

* (*number*) - The current timestamp.



Function: $try {#try}
---------------------

Tries to execute a number of functions. Returns immediately the return value of the first non-failed function without executing successive functions, or null.

### Syntax:

	$try(fn[, fn, fn, fn, ...]);

### Arguments:

* fn   - (*function*) The function to execute.

### Returns:

* (*mixed*) Standard return of the called function.
* (*null*) `null` if all the passed functions fail.

### Examples:

	var result = $try(function(){
		return some.made.up.object;
	}, function(){
		return jibberish.that.doesnt.exists;
	}, function(){
		return false;
	});

	//result is false

	var failure, success;

	$try(function(){
		some.made.up.object = 'something';
		success = true;
	}, function(){
		failure = true;
	});

	if (success) alert('yey!');

Function: $type {#type}
-----------------------

Returns the type of object that matches the element passed in.

### Syntax:

	$type(obj);

### Arguments:

1. obj - (*object*) The object to inspect.

### Returns:

* 'element'    - (*string*) If object is a DOM element node.
* 'textnode'   - (*string*) If object is a DOM text node.
* 'whitespace' - (*string*) If object is a DOM whitespace node.
* 'arguments'  - (*string*) If object is an arguments object.
* 'array'      - (*string*) If object is an array.
* 'object'     - (*string*) If object is an object.
* 'string'     - (*string*) If object is a string.
* 'number'     - (*string*) If object is a number.
* 'date'       - (*string*) If object is a date.
* 'boolean'    - (*string*) If object is a boolean.
* 'function'   - (*string*) If object is a function.
* 'regexp'     - (*string*) If object is a regular expression.
* 'class'      - (*string*) If object is a Class (created with new Class, or the extend of another class).
* 'collection' - (*string*) If object is a native htmlelements collection, such as childNodes, getElementsByTagName, etc.
* 'window'     - (*string*) If object is the window object.
* 'document'   - (*string*) If object is the document object.
* false        - (*boolean*) If object is undefined, null, NaN or none of the above.

### Example:

	var myString = 'hello';
	$type(myString); //Returns "string".


[Hash]: /Native/Hash
[Array]: /Native/Array
[Function:bind]: /Native/Function/#Function:bind
[Function:delay]: /Native/Function/#Function:delay
[Function:periodical]: /Native/Function/#Function:periodical
