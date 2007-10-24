Core Utilities {#Core}
======================

Core contains an handful of common sense functions used in [MooTools](http://mootools.net).
It also contains some basic [Hash](/Hash) and [Array](/Array) methods.



Function: $chk {#chk}
---------------------

Checks to see if a value exists or is 0. Useful for allowing 0.

### Syntax:

	$chk(item);
	
### Arguments:
	
1. item - (mixed) The item to inspect.

### Returns:

* (boolean) If the object passed in exists or is 0, returns true. Otherwise, returns false.

### Example:

	function myFunction(arg){
		if($chk(arg)) alert('The object exists or is 0.');
		else alert('The object is either null, undefined, false, or ""');
	}



Function: $clear {#clear}
-------------------------

Clears a Timeout or an Interval.

### Syntax:

	$clear(timer);

### Arguments:

1. timer - (number) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

### Returns:

* (false) returns null.

### Example:

	var myTimer = myFunction.delay(5000); //Wait 5 seconds and execute myFunction.
	myTimer = $clear(myTimer); //Nevermind.

### See also:

[Function.delay](/Native/#Function:delay), [Function.periodical](/Native/#Function:periodical)



Function: $defined {#defined}
-----------------------------

Checks to see if a value is defined.

### Syntax:

	$defined(obj);

### Arguments:

1. obj - (mixed) The object to inspect.

### Returns:

* (boolean) If the object passed is not null or undefined, returns true. Otherwise, returns false.

### Example:
	
	function myFunction(arg){
		if($defined(arg)) alert('The object is defined.');
		else alert('The object is null or undefined.');
	}
	


Function: $empty {#empty}
-------------------------

An empty function, that's it. Typically used for as a placeholder inside classes event methods.

### Syntax:

	var emptyFn = $empty;

### Example:
	
	var myFunc = $empty;



Function: $extend {#extend}
---------------------------

Copies all the properties from the second object passed in to the first object passed in.
In myWhatever.extend = $extend, the first parameter will become myWhatever, and the extend function will only need one parameter.

### Syntax:

	$extend(original[, extended]);

### Arguments:

1. original - (object) The object to be extended.
2. extended - (object, optional) The object whose properties will be copied to src.

### Returns:

* (object) The extended object.

### Examples:

#### Normal Extension:
	
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
	//firstObj is now: { 'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male' };
	

#### Without the Second Parameter:
	
	var myFunction = function(){ ... };
	myFunction.extend = $extend;
	myFunction.extend(secondObj);
	//myFunction now has the properties: 'age', 'sex', and 'lastName', each with its respected values.



Function: $merge {#merge}
-------------------------

Merges any number of objects recursively without referencing them or their sub-objects.

### Syntax:

	var merged = $merge(obj1, obj2[, obj3[, ...]]);

### Arguments:

* (objects) Any number of objects.

### Returns:

* (object) The object that is created as a result of merging all the objects passed in.

### Example:

	var obj1 = {a: 0, b: 1};
	var obj2 = {c: 2, d: 3};
	var obj3 = {a: 4, d: 5};
	var merged = $merge(obj1, obj2, obj3); //returns {a: 4, b: 1, c: 2, d: 5}, (obj1, obj2, and obj3 are unaltered)

	var nestedObj1 = {a: {b: 1, c: 1}};
	var nestedObj2 = {a: {b: 2}};
	var nested = $merge(nestedObj1, nestedObj2); //returns: {a: {b: 2, c: 1}}
	


Function: $pick {#pick}
-----------------------

Returns the first defined argument passed in, or null.

### Syntax:
	
	var picked = $pick(var1[, var2[, var3[, ...]]]);

### Arguments:

* (mixed) Any number of variables.

### Returns:

* (mixed) The first variable that is defined.
* (false) If all variables passed in are null or undefined, returns null.

### Example:
	
	function say(infoMessage, errorMessage){
		alert($pick(errorMessage, infoMessage, 'There was no message supplied.'));
	}


	
Function: $random {#random}
---------------------------

Returns a random integer number between the two passed in values.

### Syntax:
	
	var random = $random(min, max);

### Arguments:

1. min - (number) The minimum value (inclusive).
2. max - (number) The maximum value (inclusive).

### Returns:

* (number) A random number between min and max.

### Example:
	
	alert($random(5, 20)); //alerts a random number between 5 and 20
	


Function: $splat {#splat}
-------------------------

Array-ifies the argument passed in if it is defined and not already an array.

### Syntax:
	
	var splatted = $splat(obj);

### Arguments:

1. obj - (mixed) Any type of variable.

### Returns:

* (array) If the variable passed in is an array, returns the array. Otherwise, returns an array with the only element being the variable passed in.

### Example:
	
	$splat('hello'); //returns ['hello']
	$splat(['a', 'b', 'c']); //returns ['a', 'b', 'c']



Function: $time {#time}
-----------------------

Returns the current time as a timestamp.

### Syntax:

	var time = $time();

### Returns:

* (number) - Current timestamp.



Function: $try {#try}
---------------------

Tries to execute a function. Returns false if it fails.

### Syntax:

	$try(fn[, bind[, args]]);

### Arguments:

1. fn   - (function) The function to execute.
2. bind - (object, optional: defaults to the function passed in) The object to use as 'this' in the function. For more information see [Function.bind](/Native/#Function:bind).
3. args - (mixed, optional) Single item or array of items as arguments to be passed to the function.

### Returns:

* (mixed) Standard return of the called function.
* (boolean) `false` on failure.

### Example:
	
	var result = $try(eval, window, 'some invalid javascript'); //false

### Note:

Warning: if the function passed can return false, there will be no way to know if it has been successfully executed or not.



Function: $type {#type}
-----------------------

Returns the type of object that matches the element passed in.

### Syntax:

	$type(obj);

### Arguments:

1. obj - (object) The object to inspect.

### Returns:

* 'element'    - (string) If object is a DOM element node.
* 'textnode'   - (string) If object is a DOM text node.
* 'whitespace' - (string) If object is a DOM whitespace node.
* 'arguments'  - (string) If object is an arguments object.
* 'array'      - (string) If object is an array.
* 'object'     - (string) If object is an object.
* 'string'     - (string) If object is a string.
* 'number'     - (string) If object is a number.
* 'boolean'    - (string) If object is a boolean.
* 'function'   - (string) If object is a function.
* 'regexp'     - (string) If object is a regular expression.
* 'class'      - (string) If object is a Class (created with new Class, or the extend of another class).
* 'collection' - (string) If object is a native htmlelements collection, such as childNodes, getElementsByTagName, etc.
* 'window'     - (string) If object is the window object.
* 'document'   - (string) If object is the document object.
* false        - (boolean) If object is undefined, null, NaN or none of the above.

### Example:
	
	var myString = 'hello';
	$type(myString); //returns "string"



Native: Hash {#Hash}
====================

A Custom "Object" ({}) implementation which does not account for prototypes when setting, getting, iterating.
Useful because in Javascript we cannot use Object.prototype. You can now use Hash.prototype!

## Syntax:
	
	var myHash = new Hash([object]);

## Arguments:

1. object - (`mixed`) A hash or object to implement.

## Returns:

(hash) A new Hash instance.

## Example:
	
	var myHash = new Hash({
		aProperty: true,
		aMethod: function(){
			return true;
		}
	});
	alert(myHash.has('aMethod')); //true
	


Hash Method: each {#Hash:each}
-------------------------------

Calls a function for each key-value pair in the object.

### Syntax:

	myHash.each(fn[, bind]);

### Arguments:

1. fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
2. bind - (object, optional) The object to use as 'this' in the function. For more information see [Function.bind](/Native/#Function:bind).

#### Argument: fn

##### Syntax:

	fn(value, key, hash)
	
##### Arguments:

1. value - (mixed) The current value in the hash.
2. key   - (string) The current value's key in the hash.
3. hash  - (hash) The actual hash.

### Example:
	
	var hash = new Hash({first: "Sunday", second: "Monday", third: "Tuesday"});
	hash.each(function(value, key){
		alert("the " + key + " day of the week is " + value);
	}); //alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.



Function: $H {#H}
-----------------

Shortcut for new [Hash](/Core/#Hash).

### See Also:

[Hash](/Hash)



Native: Array {#Array}
======================

Array Method: each {#Array:each}
---------------------------------

Calls a function for each element in the array.

### Syntax:
	
	myArray.each(fn[, bind]);

### Arguments:

1. fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
2. bind - (object, optional) The object to use as 'this' in the function. For more information see [Function.bind](/Native/#Function:bind).

#### Argument: fn

##### Syntax
	
	fn(item, index, array)

##### Arguments:

1. item   - (mixed) The current item in the array.
2. index  - (number) The current item's index in the array.
3. array  - (array) The actual array.

### Example:
	
	['apple', 'banana', 'lemon'].each(function(item, index){
		alert(index + " = " + item); //alerts "0 = apple" etc.
	}, bind); //optional second argument for binding, not used here
	

### See Also:

[MDC Array.forEach](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach)

### Note:

This method is only available for browsers without native [Array.forEach](/Core/#Array:forEach) support.



Function: $A {#A}
-----------------

Creates a copy of an Array. Useful for applying the Array prototypes to iterable objects such as a DOM Node collection or the arguments object.

### Syntax:
	
	var copiedArray = $A(iterable);

### Arguments:

1. iterable - (array) The iterable to copy.

### Returns:

* (array) The new copied array.

### Examples:

#### Apply Array to arguments:
	
	function myFunction(){
		$A(arguments).each(function(argument, index){
			alert(argument);
		});
	}; //will alert all the arguments passed to the function myFunction.	

#### Copy an Array:
	
	var anArray = [0, 1, 2, 3, 4];
	var copiedArray = $A(anArray); //returns [0, 1, 2, 3, 4]
	


Function: $each {#each}
-----------------------

Use to iterate through iterables that are not regular arrays, such as builtin getElementsByTagName calls, arguments of a function, or an object.

### Syntax:

	$each(iterable, fn[, bind]);

### Arguments:

1. iterable - (object or array) The object or array to iterate through.
2. fn - (function) The function to test for each element.
3. bind - (object, optional) The object to use as 'this' in the function. For more information see [Function.bind](/Native/#Function:bind).

#### Argument: fn

##### Syntax:

	fn(item, index, object)

##### Arguments:

1. item - (mixed) The current item in the array.
2. index - (number) The current item's index in the array. In the case of an object, it is passed the key of that item rather than the index.
3. object - (mixed) The actual array/object.

### Examples:

#### Array Example:
	
	$each(['Sun','Mon','Tue'], function(day, index){
		alert('name:' + day + ', index: ' + index);
	}); //alerts "name: Sun, index: 0", "name: Mon, index: 1", etc.
	

#### Object Example:
	
	$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
		alert("the " + key + " day of the week is " + value);
	}); //alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.