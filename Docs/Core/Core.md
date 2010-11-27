Type: Core {#Core}
==================

Core contains a handful of common sense functions used in [MooTools](http://mootools.net).



Function: typeOf {#Core:typeOf}
--------------------------

Returns the type of object that matches the item passed in.

### Syntax:

	typeOf(obj);

### Arguments:

1. obj - (*object*) The object to inspect.

### Returns:

* 'element'    - (*string*) If object is a DOM element node.
* 'elements'   - (*string*) If object is a an instance of `Elements`
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
* 'event'      - (*string*) If object is an event.
* 'null'        - (*boolean*) If object is undefined, null, NaN or none of the above.

### Example:

	var myString = 'hello';
	typeOf(myString); // returns "string".

### Notes:

This method is equivalent to *$type* from MooTools 1.2, with the exception that undefined and null values now return 'null' as a string, instead of false.



Function: instanceOf {#Core:instanceOf}
----------------------------------

Checks to see if an object is an instance of a particular Type.

### Syntax:

	instanceOf(item, object)

### Arguments:

1. item - (*mixed*) The item which you want to check
2. object - (*mixed*) The Type you wish to compare with

### Returns:

* (*boolean*) Whether or not the item is an instance of the object.

### Examples:

	var foo = [];
	instanceOf(foo, Array)	// returns true
	instanceOf(foo, String)	// returns false

	var myClass = new Class();
	var bar = new myClass();
	instanceOf(bar, myClass)	// returns true


Deprecated Functions {#Deprecated-Functions}
============================================


Function: $chk {#Deprecated-Functions:chk}
---------------------

This method has been deprecated and will have no equivalent in MooTools 1.3.

If you really need this function you can implement it like so:

### Example:

	var $chk = function(obj){
		return !!(obj || obj === 0);
	};



Function: $clear {#Deprecated-Functions:clear}
-------------------------

This method has been deprecated. Please use *clearInterval* or *clearTimeout* instead.

### See Also:

- [MDC clearTimeout][], [MDC clearInterval][]


Function: $defined {#Deprecated-Functions:defined}
-----------------------------

This method has been deprecated.

If you really need this function you can implement it like so:

### Example:

	var $defined = function(obj){
		return (obj != undefined);
	};

	// or just use it like this:
	if(obj != undefined){
		// do something
	}


Function: $arguments {#Deprecated-Functions:arguments}
---------------------------------

This method has been deprecated and will have no equivalent in MooTools 1.3.

If you really need this function you can implement it like so:

### Example:

	var $arguments = function(i){
		return function(){
			return arguments[i];
		};
	};



Function: $empty {#Deprecated-Functions:empty}
-------------------------

This method has been deprecated. Use [Function.from](/core/Types/Function#Function:Function-from) instead.

### Example:

	var myFunc = Function.from();
	// or better:
	var myFunc = function(){};



Function: $lambda {#Deprecated-Functions:lambda}
---------------------------

This method has been deprecated. Use [Function.from](/core/Types/Function#Function:Function-from) instead.

### Example:

	myLink.addEvent('click', Function.from(false)); // prevents a link Element from being clickable



Function: $extend {#Deprecated-Functions:extend}
---------------------------

This method has been deprecated. Please use [Object.append](/core/Types/Object#Object:Object-append) instead.



Function: $merge {#Deprecated-Functions:merge}
-------------------------

This method has been deprecated. Please use [Object.merge](/core/Types/Object#Object:Object-merge) instead.



Function: $each {#Deprecated-Functions:each}
-----------------------

This method has been deprecated. Please use [Array.each](/core/Types/Array#Array:Array-each) or [Object.each](/core/Types/Object#Object:Object-each) instead.



Function: $pick {#Deprecated-Functions:pick}
-----------------------

This method has been deprecated. Please use [Array.pick](/core/Types/Array#Array:pick) instead.



Function: $random {#Deprecated-Functions:random}
---------------------------

This method has been deprecated. Please use [Number.random](/core/Types/Number#Number:Number-random) instead.



Function: $splat {#Deprecated-Functions:splat}
-------------------------

This method has been deprecated. Please use [Array.from](/core/Types/Array#Array:Array-from) instead.



Function: $time {#Deprecated-Functions:time}
-----------------------

This method has been deprecated. Please use *Date.now()* instead.

### Syntax:

	var time = Date.now();

### Returns:

* (*number*) - The current timestamp.



Function: $try {#Deprecated-Functions:try}
---------------------

This method has been deprecated. Please use [Function.attempt](/core/Types/Function#Function:Function-attempt) instead.



Function: $type {#Deprecated-Functions:type}
-----------------------

This method has been deprecated. Please use [typeOf](#Core:typeOf) instead.




[Array]: /core/Types/Array
[Function:bind]: /core/Types/Function/#bind
[Function:delay]: /core/Types/Function/#delay
[Function:periodical]: /core/Types/Function/#periodical
[MDC clearInterval]: https://developer.mozilla.org/en/DOM/window.clearInterval
[MDC clearTimeout]: https://developer.mozilla.org/en/DOM/window.clearTimeout
