Native: Hash {#Hash}
====================

A custom Object ({}) implementation which does not account for prototypes when setting, getting, or iterating.
Useful because in JavaScript, we cannot use Object.prototype. Instead, we can use Hash.prototype!


Hash Method: constructor {#Hash:constructor}
--------------------------------------------

### Syntax:

	var myHash = new Hash([object]);

### Arguments:

1. object - (*mixed*) A hash or object to implement.

### Returns:

* (*hash*) A new Hash instance.

### Examples:

	var myHash = new Hash({
		aProperty: true,
		aMethod: function(){
			return true;
		}
	});
	alert(myHash.has('aMethod')); //Returns true.



Hash Method: each {#Hash:each}
-------------------------------

Calls a function for each key-value pair in the object.

### Syntax:

	myHash.each(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function which should be executed on each item in the Hash. This function is passed the item and its key in the Hash.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information, see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, hash)

##### Arguments:

1. value - (*mixed*) The current value in the hash.
2. key   - (*string*) The current value's key in the hash.
3. hash  - (*hash*) The actual hash.

### Examples:

	var hash = new Hash({first: "Sunday", second: "Monday", third: "Tuesday"});
	hash.each(function(value, key){
		alert("the " + key + " day of the week is " + value);
	}); //Alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.



Hash Method: has {#Hash:has}
----------------------------

Tests for the presence of a specified key in the Hash.

### Syntax:

	var inHash = myHash.has(item);

### Arguments:

1. key - (*string*) The key to search for in the Hash.

### Returns:

* (*boolean*) If the Hash has a defined value for the specified key, returns true. Otherwise, returns false.

### Examples:

	var hash = new Hash({'a': 'one', 'b': 'two', 'c': 'three'});
	hash.has('a'); //returns true
	hash.has('d'); //returns false


### Notes:

- Testing for a Hash prototype will never return true. Only testing the actual properties of the Hash will return true.



Hash Method: keyOf {#Hash:keyOf}
--------------------------------

Returns the key of the specified value. Synonymous with [Array:indexOf][].

### Syntax:

	var key = myHash.keyOf(item);

### Arguments:

1. item - (*mixed*) The item to search for in the Hash.

### Returns:

* (*string*) If the Hash has a the specified item in it, returns the key of that item.
* (*boolean*) Otherwise, returns false.

### Examples:

	var hash = new Hash({'a': 'one', 'b': 'two', 'c': 3});
	hash.keyOf('two'); //returns 'b'
	hash.keyOf(3); //returns 'c'
	hash.keyOf('four') //returns false

### Notes:

- Testing for a Hash prototype will never return its key. Only the actual properties of the Hash will return their associated key.



Hash Method: hasValue {#Hash:hasValue}
--------------------------------------

Tests for the presence of a specified value in the Hash.

### Syntax:

	var inHash = myHash.hasValue(value);

### Arguments:

1. value - (*mixed*) The value to search for in the Hash.

### Returns:

* (*boolean*) If the Hash has the passed in value in any of the keys, returns true. Otherwise, returns false.

### Examples:

	var hash = new Hash({'a': 'one', 'b': 'two', 'c': 'three'});
	hash.hasValue('one'); //returns true
	hash.hasValue('four'); //returns false


Hash Method: extend {#Hash:extend}
----------------------------------

Extends this Hash with the key-value pairs from the object passed in.

### Syntax:

	myHash.extend(properties);

### Arguments:

1. properties - (*object*) The object whose items should be extended into this Hash

### Returns:

* (*hash*) This Hash, extended.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	var properties = {
		'age': '20',
		'sex': 'male',
		'lastName': 'Dorian'
	};
	hash.extend(properties);
	//hash now holds an object containing: { 'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male' };



Hash Method: combine {#Hash:combine}
--------------------------------

Combines this Hash with the key-value pairs of the object passed in. Does not allow duplicates (old values are **not** overwritten by new ones) and is case and type sensitive.

### Syntax:

	myHash.combine(properties);

### Arguments:

1. properties - (*object*) The object whose items should be combined into this Hash.

### Returns:

* (*hash*) This Hash, combined with the new key-value pairs.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	var properties = {
		'name': 'Jane'
		'age': '20',
		'sex': 'male',
		'lastName': 'Dorian'
	};
	hash.combine(properties);
	//hash now holds an object containing: { 'name': 'John', 'lastName': 'Doe', 'age': '20', 'sex': 'male' };



Hash Method: erase {#Hash:erase}
----------------------------------

Removes the specified key from the Hash.

### Syntax:

	myHash.erase(key);

### Arguments:

1. key - (*string*) The key to search for in the Hash.

### Returns:

* (*hash*) This Hash with the specified key and its value removed.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.erase('lastName');
	//hash now holds an object containing: { 'name': 'John' };



Hash Method: get {#Hash:get}
----------------------------

Retrieves a value from the hash.

### Syntax:

	myHash.get(key);

### Arguments:

1. key - (*string*) The key to retrieve in the Hash.

### Returns:

* (*mixed*) Returns the value that corresponds to the key if found.
* (*null*) null if the key doesn't exist.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.get('name'); //returns 'John'



Hash Method: set {#Hash:set}
----------------------------

Adds a key-value pair to the hash or replaces a previous value associated with the specified key.

### Syntax:

	myHash.set(key, value);

### Arguments:

1. key   - (*string*) The key to insert or modify in the Hash.
2. value - (*mixed*) The value to associate with the specified key in the Hash.

### Returns:

* (*hash*) This Hash with the specified key set to the specified value.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.set('name', 'Michelle'); //hash.name is now 'Michelle'



Hash Method: empty {#Hash:empty}
--------------------------------

Empties the hash.

### Syntax:

	myHash.empty();

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.empty();
	//hash now holds an empty object: {}



Hash Method: include {#Hash:include}
------------------------------------

Includes the specified key-value pair in the Hash if the key doesn't already exist.

### Syntax:

	myHash.include(key, value);

### Arguments:

1. key   - (*string*) The key to insert into the Hash.
2. value - (*mixed*) The value to associate with the specified key in the Hash.

### Returns:

* (*hash*) This Hash with the specified key included if it did not previously exist.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.include('name', 'Michelle'); //hash is unchanged
	hash.include('age', 25); //hash.age is now 25



Hash Method: map {#Hash:map}
----------------------------

Creates a new map with the results of calling a provided function on every value in the map.

### Syntax:

	var mappedHash = myHash.map(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to produce an element of the new Hash from an element of the current one.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, hash)

##### Arguments:

1. value - (mixed) The current value in the hash.
2. key   - (string) The current value's key in the hash.
3. hash  - (hash) The actual hash.

### Returns:

* (*hash*) The new mapped hash.

### Examples:

	var timesTwo = new Hash({a: 1, b: 2, c: 3}).map(function(value, key){
		return value * 2;
	}); //timesTwo now holds an object containing: {a: 2, b: 4, c: 6};



Hash Method: filter {#Hash:filter}
----------------------------------

Creates a new Hash with all of the elements of the Hash for which the provided filtering function returns true.

### Syntax:

	var filteredHash = myHash.filter(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to test each element of the Hash. This function is passed the value and its key in the Hash.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, hash)

##### Arguments:

1. value - (*mixed*) The current value in the hash.
2. key   - (*string*) The current value's key in the hash.
3. hash  - (*hash*) The actual hash.

### Returns:

* (*hash*) The new filtered hash.

### Examples:

	var biggerThanTwenty = new Hash({a: 10, b: 20, c: 30}).filter(function(value, key){
		return value > 20;
	}); //biggerThanTwenty now holds an object containing: {c: 30}


Hash Method: every {#Hash:every}
--------------------------------

Returns true if every value in the object satisfies the provided testing function.

### Syntax:

	var allPassed = myHash.every(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to test each element of the Hash. This function is passed the value and its key in the Hash.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind].

#### Argument: fn

##### Syntax:

	fn(value, key, hash)

##### Arguments:

1. value - (*mixed*) The current value in the hash.
2. key   - (*string*) The current value's key in the hash.
3. hash  - (*hash*) The actual hash.

### Returns:

* (*boolean*) If every value in the Hash satisfies the provided testing function, returns true. Otherwise, returns false.

### Examples:

	var areAllBigEnough = ({a: 10, b: 4, c: 25, d: 100}).every(function(value, key){
		return value > 20;
	}); //areAllBigEnough = false


Hash Method: some {#Hash:some}
------------------------------

Returns true if at least one value in the object satisfies the provided testing function.

### Syntax:

	var anyPassed = myHash.any(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to test each element of the Hash. This function is passed the value and its key in the Hash.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(value, key, hash)


##### Arguments:

1. value - (*mixed*) The current value in the hash.
2. key   - (*string*) The current value's key in the hash.
3. hash  - (*hash*) The actual hash.

### Returns:

* (*boolean*) If any value in the Hash satisfies the provided testing function, returns true. Otherwise, returns false.

### Examples:

	var areAnyBigEnough = ({a: 10, b: 4, c: 25, d: 100}).some(function(value, key){
		return value > 20;
	}); //isAnyBigEnough = true



Hash Method: getClean {#Hash:getClean}
--------------------------------------

Returns a a clean object from an Hash.

### Syntax:

	myHash.getClean();

### Returns:

* (*object*) a clean object

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash = hash.getClean(); // hash doesnt contain Hash prototypes anymore
	hash.each() //error!



Hash Method: getKeys {#Hash:getKeys}
------------------------------------

Returns an array containing all the keys, in the same order as the values returned by [Hash:getValues][].

### Syntax:

	var keys = myHash.getKeys();

### Returns:

* (*array*) An array containing all the keys of the hash.



Hash Method: getValues {#Hash:getValues}
----------------------------------------

Returns an array containing all the values, in the same order as the keys returned by [Hash:getKeys][].

### Syntax:

	var values = myHash.getValues();

### Returns:

* (*array*) An array containing all the values of the hash.



Hash Method: getLength {#Hash:getLength}
----------------------------------------

Returns the number of keys in the Hash.

### Syntax:

	var length = myHash.getLength();

### Returns:

* (*number*) The length of the Hash.

### Examples:

	var hash = new Hash({
		'name': 'John',
		'lastName': 'Doe'
	});
	hash.getLength(); // returns 2



Hash Method: toQueryString {#Hash:toQueryString}
------------------------------------------------

Generates a query string from key/value pairs in an object and URI encodes the values.

### Syntax:

	var queryString = myHash.toQueryString();

### Arguments:

1. source - (*object*) The object to generate the query string from.

### Returns:

* (*string*) The query string.

### Examples:

#### Using Hash generic:

	Hash.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"

#### Using Hash instance:

	var myHash = new Hash({apple: "red", lemon: "yellow"});
	myHash.toQueryString(); //returns "apple=red&lemon=yellow"


Utility Functions {#Utility}
============================

Function: $H {#H}
-----------------

Shortcut for the new [Hash](/Core/#Hash).

### See Also:

- [Hash][]


[Hash]: #Hash
[Array:indexOf]: /Native/Array/#Array:indexOf
[Hash:getKeys]: #Hash:getKeys
[Hash:getValues]: #Hash:getValues
[Function:bind]: /Native/Function#Function:bind
