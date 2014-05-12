Type: Object {#Object}
======================

A collection of Object functions.

### See Also:

- [MDN Object][]

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

	fn(item, key, object)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. key  - (*mixed*) The current item's key.
3. object - (*mixed*) The actual array/object.

### Example:

    // alerts 'The first day of the week is Sunday', 'The second day of the week is Monday', etc.:
	Object.each({first: 'Sunday', second: 'Monday', third: 'Tuesday'}, function(value, key){
		alert('The ' + key + ' day of the week is ' + value);
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
	var merged = Object.merge(obj1, obj2, obj3); // returns {a: 4, b: 1, c: 2, d: 5}, (obj2, and obj3 are unaltered)

	merged === obj1; // true, obj1 gets altered and returned as merged object

	var nestedObj1 = {a: {b: 1, c: 1}};
	var nestedObj2 = {a: {b: 2}};
	var nested = Object.merge(nestedObj1, nestedObj2); // returns: {a: {b: 2, c: 1}}


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
		name: 'John',
		lastName: 'Doe'
	};
	var secondObj = {
		age: '20',
		sex: 'male',
		lastName: 'Dorian'
	};
	Object.append(firstObj, secondObj);
	//firstObj is now: {name: 'John', lastName: 'Dorian', age: '20', sex: 'male'};

### Notes:

This method is an object-specific equivalent of *$extend* from MooTools 1.2.


Function: Object.subset {#Object:Object-subset}
----------------------------------------

Get a subset of an object.

### Syntax:

	Object.subset(object, keys);

### Arguments:

1. object - (*object*) The object.
2. keys - (*array*) An array with the keys.

### Returns:

* (*object*) The subset of the Object.

### Examples:

	var object = {
		a: 'one',
		b: 'two',
		c: 'three'
	};
	Object.subset(object, ['a', 'c']); // returns {a: 'one', c: 'three'}



Function: Object.map {#Object:Object-map}
----------------------------

Creates a new map with the results of calling a provided function on every value in the map.

### Syntax:

	var mappedObject = Object.map(object, fn[, bind]);

### Arguments:

1. object - (*object*) The object.
2. fn   - (*function*) The function to produce an element of the Object from an element of the current one.
3. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, object)

##### Arguments:

1. value - (*mixed*) The current value in the object.
2. key   - (*string*) The current value's key in the object.
3. object - (*object*) The actual object.

### Returns:

* (*object*) The new mapped object.

### Examples:

	var myObject = {a: 1, b: 2, c: 3};
	var timesTwo = Object.map(myObject, function(value, key){
		return value * 2;
	}); // timesTwo now holds an object containing: {a: 2, b: 4, c: 6};



Function: Object.filter {#Object:Object-filter}
----------------------------------

Creates a new object with all of the elements of the object for which the provided filtering function returns true.

### Syntax:

	var filteredObject = Object.filter(object, fn[, bind]);

### Arguments:

1. object - (*object*) The object.
2. fn   - (*function*) The function to test each element of the Object. This function is passed the value and its key in the Object.
3. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, object)

##### Arguments:

1. value - (*mixed*) The current value in the object.
2. key   - (*string*) The current value's key in the object.
3. object - (*object*) The actual object.

### Returns:

* (*object*) The new filtered object.

### Examples:

	var myObject = {a: 10, b: 20, c: 30};
	var biggerThanTwenty = Object.filter(myObject, function(value, key){
		return value > 20;
	}); // biggerThanTwenty now holds an object containing: {c: 30}



Function: Object.every {#Object:Object-every}
--------------------------------

Returns true if every value in the object satisfies the provided testing function.

### Syntax:

	var allPassed = Object.every(object, fn[, bind]);

### Arguments:

1. object - (*object*) The object.
2. fn   - (*function*) The function to test each element of the Object. This function is passed the value and its key in the Object.
3. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, object)

##### Arguments:

1. value - (*mixed*) The current value in the object.
2. key   - (*string*) The current value's key in the object.
3. object  - (*object*) The actual object.

### Returns:

* (*boolean*) If every value in the Object satisfies the provided testing function, returns true. Otherwise, returns false.

### Examples:

	var myObject = {a: 10, b: 4, c: 25, d: 100};
	var areAllBigEnough = Object.every(myObject, function(value, key){
		return value > 20;
	}); // areAllBigEnough = false



Function: Object.some {#Object:Object-some}
------------------------------

Returns true if at least one value in the object satisfies the provided testing function.

### Syntax:

	var anyPassed = Object.some(object, fn[, bind]);

### Arguments:

1. object - (*object*) The object.
2. fn   - (*function*) The function to test each element of the object. This function is passed the value and its key in the object.
3. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, object)


##### Arguments:

1. value - (*mixed*) The current value in the object.
2. key   - (*string*) The current value's key in the object.
3. object  - (*object*) The actual object.

### Returns:

* (*boolean*) If any value in the object satisfies the provided testing function, returns true. Otherwise, returns false.

### Examples:

	var myObject = {a: 10, b: 4, c: 25, d: 100};
	var areAnyBigEnough = Object.some(myObject, function(value, key){
		return value > 20;
	}); //isAnyBigEnough = true



Function: Object.keys {#Object:Object-keys}
------------------------------------

Returns an array containing all the keys, in the same order as the values returned by [Object:values][].

### Syntax:

	var keys = Object.keys(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*array*) An array containing all the keys of the object.



Function: Object.values {#Object:Object-values}
----------------------------------------

Returns an array containing all the values, in the same order as the keys returned by [Object:keys][].

### Syntax:

	var values = Object.values(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*array*) An array containing all the values of the object.



Function: Object.getLength {#Object:Object-getLength}
----------------------------------------

Returns the number of keys in the object.

### Syntax:

	var length = Object.getLength(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*number*) The length of the object.

### Examples:

	var myObject = {
		name: 'John',
		lastName: 'Doe'
	});
	Object.getLength(myObject); // returns 2



Function: Object.keyOf {#Object:Object-keyOf}
--------------------------------

Returns the key of the specified value. Synonymous with [Array:indexOf][].

### Syntax:

	var key = Object.keyOf(object, item);

### Arguments:

1. object - (*object*) The object.
2. item - (*mixed*) The item to search for in the object.

### Returns:

* (*string*) If the object has a the specified item in it, returns the key of that item.
* (*boolean*) Otherwise, returns null.

### Examples:

	var myObject = {a: 'one', b: 'two', c: 3};
	Object.keyOf(myObject, 'two'); // returns 'b'
	Object.keyOf(myObject, 3); // returns 'c'
	Object.keyOf(myObject, 'four'); // returns false



Function: Object.contains {#Object:Object-contains}
--------------------------------------

Tests for the presence of a specified value in the object.

### Syntax:

	var inObject = Object.contains(object, value);

### Arguments:

1. object - (*object*) The object.
2. value - (*mixed*) The value to search for in the Object.

### Returns:

* (*boolean*) If the object has the passed in value in any of the keys, returns true. Otherwise, returns false.

### Examples:

	var myObject = {a: 'one', b: 'two', c: 'three'};
	Object.contains(myObject, 'one'); // returns true
	Object.contains(myObject, 'four'); // returns false



Function: Object.toQueryString {#Object:Object-toQueryString}
------------------------------------------------

Generates a query string from key/value pairs in an object and URI encodes the values.

### Syntax:

	var queryString = Object.toQueryString(object[, base]);

### Arguments:

1. object - (*object*) The object to generate the query string from.
2. base - (*string*, optional) Will be used as base variable in the query string.

### Returns:

* (*string*) The query string.

### Examples:

	Object.toQueryString({apple: 'red', lemon: 'yellow'}); // returns 'apple=red&lemon=yellow'

	Object.toQueryString({apple: 'red', lemon: 'yellow'}, 'fruits'); // returns 'fruits[apple]=red&fruits[lemon]=yellow'


Deprecated Functions {#Deprecated-Functions}
============================================

Type: Hash {#Deprecated-Functions:Hash}
--------------------------------------

Hash has been deprecated. Each Hash method has a similar Object method or a Vanilla JS equivalent.

Hash Method: has {#Deprecated-Functions:Hash:has}
-------------------------------------------------

You could simply use `myObject.myKey != undefined`

Hash Method: keyOf {#Deprecated-Functions:Hash:keyOf}
-----------------------------------------------------

Use [Object.keyOf](#Object:Object-keyOf)


Hash Method: hasValue {#Deprecated-Functions:Hash:hasValue}
------------------------------------------------------------

Use [Object.contains](#Object:Object-contains)


Hash Method: extend {#Deprecated-Functions:Hash:extend}
--------------------------------------------------------

Use [Object.append](#Object:Object-append)


Hash Method: combine {#Deprecated-Functions:Hash:combine}
---------------------------------------------------------

Use [Object.merge](#Object:Object-merge)


Hash Method: erase {#Deprecated-Functions:Hash:erase}
-----------------------------------------------------

Use `delete myObject.a`

Hash Method: get {#Deprecated-Functions:Hash:get}
-------------------------------------------------

Use `myObject.myKey`


Hash Method: set {#Deprecated-Functions:Hash:set}
-------------------------------------------------

Use `myObject.myKey = value`


Hash Method: empty {#Deprecated-Functions:Hash:empty}
-----------------------------------------------------

Use `myObject = {}`


Hash Method: include {#Deprecated-Functions:Hash:include}
---------------------------------------------------------

Use `if(myObject.myKey == undefined) myObject.myKey = value`


Hash Method: map {#Deprecated-Functions:Hash:map}
-------------------------------------------------

Use [Object.map](#Object:Object-map)


Hash Method: filter {#Deprecated-Functions:Hash:filter}
-------------------------------------------------------

Use [Object.filter](#Object:Object-filter)


Hash Method: every {#Deprecated-Functions:Hash:every}
-----------------------------------------------------

Use [Object.every](#Object:Object-every)


Hash Method: some {#Deprecated-Functions:Hash:some}
-------------------------------------------------------

Use [Object.some](#Object:Object-some)


Hash Method: getKeys {#Deprecated-Functions:Hash:getKeys}
-------------------------------------------------------

Use [Object.keys](#Object:Object-keys)


Hash Method: getValues {#Deprecated-Functions:Hash:getValues}
------------------------------------------------------------

Use [Object.values](#Object:Object-values)


Hash Method: toQueryString {#Deprecated-Functions:Hash:toQueryString}
-------------------------------------------------------

Use [Object.toQueryString](#Object:Object-toQueryString)




[MDN Object]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Object
[Object]: #Object
[Array:indexOf]: /core/Types/Array/#Array:indexOf
[Object:values]: #Object:values
[Object:keys]: #Object:keys
[Function:bind]: /core/Types/Function#Function:bind
