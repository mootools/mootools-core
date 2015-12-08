# Type: Core {#Core}

Core contains common functions used in [MooTools][].

## Function: typeOf {#Core:typeOf}

Returns the type of an object.

### Syntax:

	typeOf(obj);

### Arguments:

1. obj - (*object*) The object to inspect.

### Returns:

* 'element'    - (*string*) If object is a DOM element node.
* 'elements'   - (*string*) If object is an instance of [Elements][].
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
* 'class'      - (*string*) If object is a [Class][] (created with new Class or the extend of another class).
* 'collection' - (*string*) If object is a native HTML elements collection, such as childNodes or getElementsByTagName.
* 'window'     - (*string*) If object is the window object.
* 'document'   - (*string*) If object is the document object.
* 'domevent'   - (*string*) If object is an event.
* 'null'       - (*string*) If object is undefined, null, NaN or none of the above.

### Example:

	var myString = 'hello';
	typeOf(myString); // returns "string"

### Note:

This method is equivalent to *$type* from MooTools 1.2, with the exception that undefined and null values now return 'null' as a string, instead of false.

## Function: instanceOf {#Core:instanceOf}

Checks if an object is an instance of a particular type.

### Syntax:

	instanceOf(item, object)

### Arguments:

1. item - (*mixed*) The item to check.
2. object - (*mixed*) The type to compare it with.

### Returns:

* (*boolean*) Whether or not the item is an instance of the object.

### Examples:

	var foo = [];
	instanceOf(foo, Array) // returns true
	instanceOf(foo, String) // returns false

	var myClass = new Class();
	var bar = new myClass();
	instanceOf(bar, myClass) // returns true

### Type {#Type}

MooTools extends native types, like string, array or number to make them even more useful.

The types MooTools uses are:

- String
- Array
- Number
- Function
- RegExp
- Date
- Boolean

Custom MooTools types are:

- Element
- Elements
- Event

## Type method: implement {#Type:implement}

This method implements a new method to the type's prototype.

### Syntax:

	myType.implement(name, method);

**or**

	myType.implement(methods);

### Arguments:

1. name - (*string*) The method name.
2. method - (*function*) The method function.

**or**

1. methods - (*object*) An object with key-value pairs. The key is the method name, the value is the method function.

### Returns:

* (*object*) The type.

### Examples:

	Array.implement('limitTop', function(top){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] > top) this[i] = top;
		}
		return this;
	});

	[1, 2, 3, 4, 5, 6].limitTop(4); // returns [1, 2, 3, 4, 4, 4]

It is also possible to pass an object of methods:

	String.implement({
		repeat: function(times){
			var string = '';
			while (times--) string += this;
			return string;
		},
		ftw: function(){
			return this + ' FTW!';
		}
	});

	'moo! '.repeat(3); // returns "moo! moo! moo! "
	'MooTools'.ftw(); // returns "MooTools FTW!"
	('MooTools'.ftw() + ' ').repeat(2); // returns "MooTools FTW! MooTools FTW! "

## Type method: extend {#Type:extend}

Adds one or more functions to the type. These are static functions that accept for example other types to parse them into the type, or other utility functions that belong to the certain type.

### Syntax:

	myType.extend(name, method);

**or**

	myType.extend(methods);

### Arguments:

1. name - (*string*) The method name.
2. method - (*function*) The method function.

**or**

1. methods - (*object*) An object with key-value pairs. The key is the method name, the value is the method function.

### Returns:

* (*object*) The type.

### Examples:

	RegExp.extend('from', function(regexp, flags){
		return new RegExp(regexp, flags);
	});

	Number.extend('parseCurrency', function(currency){
		// takes a string and transforms it into a number to
		// do certain calculations
	});

## Generics {#Type:generics}

Most methods of types can be used as generic functions. These are the already existing JavaScript methods, methods MooTools adds, or methods you [implemented][implement] yourself.

### Example:

	var everyArgBiggerThanTwo = function(){
		// Instead of this
		return Array.prototype.every.call(arguments, someFunction);
		// you can use
		return Array.every(arguments, someFunction);
	};

This is useful if methods of a certain type should be used as function of another type.
 As the example above, it is used for the Arguments type, which is not a real array, so `arguments.every(fn)` would not work. However, `Array.every(arguments, fn)` does work in MooTools.

### Syntax:

	Type.methodName(thisArg[, arg1, arg2, ...]);

### Arguments:

1. thisArg - (*mixed*) This is the subject, which is usually `thisArg.method([arg1, arg2, ...]);`.
2. arg1, arg2, ... - (*mixed*) Additional arguments which will be passed as method arguments.

### Returns:

- (*mixed*) Anything the method usually returns.

[Class]: /core/Class/Class
[Elements]: /core/Element/Element
[implement]: core/Core/Core#Type:implement
[MooTools]: http://mootools.net

---

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

- [MDN clearTimeout][], [MDN clearInterval][]


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

This method has been deprecated. Use [Function.convert](/core/Types/Function#Function:Function:convert) instead.

### Example:

	var myFunc = Function.convert();
	// or better:
	var myFunc = function(){};



Function: $lambda {#Deprecated-Functions:lambda}
---------------------------

This method has been deprecated. Use [Function.convert](/core/Types/Function#Function:Function:convert) instead.

### Example:

	myLink.addEvent('click', Function.convert(false)); // prevents a link Element from being clickable



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

This method has been deprecated. Please use [Array.convert](/core/Types/Array#Array:Array:convert) instead.
However `$splat` does *not* transform Array-like objects such as NodeList or FileList in arrays, `Array.convert` does.


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
[MDN clearInterval]: https://developer.mozilla.org/en/DOM/window.clearInterval
[MDN clearTimeout]: https://developer.mozilla.org/en/DOM/window.clearTimeout
