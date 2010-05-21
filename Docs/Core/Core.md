Core {#Core}
============

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
* false        - (*boolean*) If object is undefined, null, NaN or none of the above.

### Example:

	var myString = 'hello';
	typeOf(myString); //Returns "string".
	
### Notes:

This method is equivalent to *$type* from MooTools 1.2.



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
	instanceOf(foo, Array)	// true
	instanceOf(foo, String)	// false
	
	var myClass = new Class();
	var bar = new myClass();
	instanceOf(bar, myClass)	// true



Function: Object.each {#Object:Object-each}
------------------------------------

Used to iterate through an object.

### Syntax:

	Object.each(obj, fn[, bind]);

### Arguments:

1. obj		- (*object*) The object to iterate through.
2. fn       - (*function*) The function to test for each element.
3. bind     - (*object*, optional) The object to use as 'this' within the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, object)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's key.
3. object - (*mixed*) The actual array/object.

### Example:

    //Alerts "The first day of the week is Sunday", "The second day of the week is Monday", etc:
	Object.each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
		alert("The " + key + " day of the week is " + value);
	});
	
### Notes:

This method is an object-specific equivalent of *$each* from MooTools 1.2.



Function: Object.merge {#Object:Object-merge}
--------------------------------------

Merges any number of objects recursively without referencing them or their sub-objects.

### Syntax:

	var merged = Object.merge(obj1, obj2[, obj3[, ...]]);

### Arguments:

1. (objects) Any number of objects.

### Returns:

* (*object*) The object that is created as a result of merging all the objects passed in.

### Examples:

	var obj1 = {a: 0, b: 1};
	var obj2 = {c: 2, d: 3};
	var obj3 = {a: 4, d: 5};
	var merged = Object.merge(obj1, obj2, obj3); //returns {a: 4, b: 1, c: 2, d: 5}, (obj1, obj2, and obj3 are unaltered)

	var nestedObj1 = {a: {b: 1, c: 1}};
	var nestedObj2 = {a: {b: 2}};
	var nested = Object.merge(nestedObj1, nestedObj2); //returns: {a: {b: 2, c: 1}}

### Notes:

This method is an object-specific equivalent of *$merge* from MooTools 1.2.



Function: Object.clone {#Object:Object-clone}
--------------------------------------

Returns a copy of an object.

### Syntax:

	var clone = Object.clone(obj);
	
### Arguments:

1. (obj) The object to clone

### Returns:

* (*object*) A copy of the passed object

### Example:

	var obj1 = {a: 0, b: 1};
	var obj2 = Object.clone(obj1);
	
	obj1.a = 42;
	alert(obj1.a);	// alerts '42'
	alert(obj2.a);	// alerts '0'

### Notes:

This is an object-specific equivalent of *$unlink* from MooTools 1.2.



Function: Object.append {#Object:Object-append}
----------------------------------------

Copies all the properties from the second object passed in to the first object passed in.

### Syntax:

	Object.append(original, extension);

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
	Object.append(firstObj, secondObj);
	//firstObj is now: {'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male'};

### Notes:

This method is an object-specific equivalent of *$extend* from MooTools 1.2.


Function method: extend {#Function:extend}
---------------------------------

Add methods to a function

### Syntax:

	myFunction.extend(key,value);

### Arguments:

1. key - (*string*) The key of the prototype
2. value - (*mixed*) The function or another value of the protoype

### Example: 

	var myFunction = function(){};
	myFunction.extend('alert',function(text){
		alert(text);
	});
	myFunction.alert('Hello!'); // Alerts Hello!


Function method: implement {#Function:implement}
---------------------------------------

Add methods to the prototype

### Syntax:

	myFunction.implement(key,value);

### Arguments:

1. key - (*string*) The key of the prototype
2. value - (*mixed*) The function or another value of the protoype

### Example: 

	var myFunction = function(){};
	myFunction.implement('alert',function(text){
		alert(text);
	});
	var myInstance = new myFunction();
	myInstance.alert('Hello!'); // Alerts Hello!

### Notes:

The difference between *implement* and *extend*, is that implement adds the value to the prototype.
So with *implement* each instance of the function will have this method or property while with *extend*
the method or property is added to a single instance.

Deprecated Functions {#Deprecated-Functions}
============================================


Function: $chk {#Deprecated-Functions:chk}
---------------------

This method has been deprecated and will have no equivalent in MooTools 2.0.

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

	// Or just use it like this
	if(obj != undefined){
		// Do something
	}


Function: $arguments {#Deprecated-Functions:arguments}
---------------------------------

This method has been deprecated and will have no equivalent in MooTools 2.0.

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
	// Or probably better....
	var myFunc = function(){};
	


Function: $lambda {#Deprecated-Functions:lambda}
---------------------------

This method has been deprecated. Use [Function.from](/core/Types/Function#Function:Function-from) instead.

### Example:

	myLink.addEvent('click', Function.from(false)); //Prevents a link Element from being clickable.



Function: $extend {#Deprecated-Functions:extend}
---------------------------

This method has been deprecated. Please use [Object.append](#Object:Object-append) instead.



Function: $merge {#Deprecated-Functions:merge}
-------------------------

This method has been deprecated. Please use [Object.merge](#Object:Object-merge) instead.



Function: $each {#Deprecated-Functions:each}
-----------------------

This method has been deprecated. Please use [Array.each](/core/Types/Array#Array:Array-each) or [Object.each](#Object:Object-each) instead.



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
