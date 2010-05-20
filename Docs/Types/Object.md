Object {#Object}
====================

Function: Object.subset {#Object:subset}
----------------------------------------

Get a subset of an object.

### Syntax:

	Object.subset(object,keys);

### Arguments:

1. object - (*object*) The object.
2. keys - (*array*) An array with the keys.

### Returns:

* (*object*) The subset of the Object.

### Examples:

	var obj = {
		'a': 'one', 
		'b': 'two', 
		'c': 'three'
	};
	Object.subset(['a','c']); // returns {'a': 'one', 'c': 'three'}



Function: Object.map {#Object:map}
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
	var timesTwo = Object.map(timesTwo, function(value, key){
		return value * 2;
	}); //timesTwo now holds an object containing: {a: 2, b: 4, c: 6};



Function:: Object.filter {#Object:filter}
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
	}); //biggerThanTwenty now holds an object containing: {c: 30}



Function: Object.every {#Object:every}
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
	}); //areAllBigEnough = false



Function: Object.some {#Object:some}
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



Function: Object.keys {#Object:keys}
------------------------------------

Returns an array containing all the keys, in the same order as the values returned by [Object:values][].

### Syntax:

	var keys = Object.keys(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*array*) An array containing all the keys of the object.



Function: Object.values {#Object:values}
----------------------------------------

Returns an array containing all the values, in the same order as the keys returned by [Object:keys][].

### Syntax:

	var values = Object.values(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*array*) An array containing all the values of the object.



Function: Object.length {#Object:length}
----------------------------------------

Returns the number of keys in the object.

### Syntax:

	var length = Object.length(object);

### Arguments:

1. object - (*object*) The object.

### Returns:

* (*number*) The length of the object.

### Examples:

	var myObject = {
		'name': 'John',
		'lastName': 'Doe'
	});
	Object.length(myObject); // returns 2



Function: Object.keyOf {#Object:keyOf}
--------------------------------

Returns the key of the specified value. Synonymous with [Array:indexOf][].

### Syntax:

	var key = Object.keyOf(object);

### Arguments:

1. object - (*object*) The object.
2. item - (*mixed*) The item to search for in the object.

### Returns:

* (*string*) If the object has a the specified item in it, returns the key of that item.
* (*boolean*) Otherwise, returns false.

### Examples:

	var myObject = {'a': 'one', 'b': 'two', 'c': 3};
	Object.keyOf(myObject,'two'); // returns 'b'
	Object.keyOf(myObject,3); // returns 'c'
	Object.keyOf(myObject,'four'); // returns false



Function: Object.contains {#Object:contains}
--------------------------------------

Tests for the presence of a specified value in the object.

### Syntax:

	var inObject = Object.contains(object,value);

### Arguments:

1. object - (*object*) The object.
2. value - (*mixed*) The value to search for in the Object.

### Returns:

* (*boolean*) If the object has the passed in value in any of the keys, returns true. Otherwise, returns false.

### Examples:

	var myObject = {'a': 'one', 'b': 'two', 'c': 'three'};
	Object.contains(myObject, 'one'); //returns true
	Object.contains(myObject, 'four'); //returns false



Function: Object.toQueryString {#Object:toQueryString}
------------------------------------------------

Generates a query string from key/value pairs in an object and URI encodes the values.

### Syntax:

	var queryString = Object.toQueryString(object);

### Arguments:

1. object - (*object*) The object.
2. source - (*object*) The object to generate the query string from.

### Returns:

* (*string*) The query string.

### Examples:

	Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"




[Object]: #Object
[Array:indexOf]: /core/Types/Array/#Array:indexOf
[Object:values]: #Object:values
[Object:keys]: #Object:keys
[Function:bind]: /core/Types/Function#Function:bind
