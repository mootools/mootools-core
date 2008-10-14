Native: Array {#Array}
======================

A collection of Array methods.

### See Also:

- [MDC Array][]


Array Method: each {#Array:each}
---------------------------------

Calls a function for each element in the array.

### Syntax:

	myArray.each(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
2. bind - (*object*, optional) The object to be used as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax

	fn(item, index, array)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### Examples:

	//Alerts "0 = apple", "1 = banana", and so on:
	['apple', 'banana', 'lemon'].each(function(item, index){
		alert(index + " = " + item);
	}); //The optional second argument for binding isn't used here.


### See Also:

- [MDC Array:forEach][]

### Notes:

- This method is only available for browsers without native [MDC Array:forEach][] support.



Array Method: every {#Array:every}
----------------------------------

Returns true if every element in the array satisfies the provided testing function.
This method is provided only for browsers without native [Array:every][] support.

### Syntax:

	var allPassed = myArray.every(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to test for each element.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, array)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### Returns:

* (*boolean*) If every element in the array satisfies the provided testing function, returns true. Otherwise, returns false.

### Examples:

	var areAllBigEnough = [10, 4, 25, 100].every(function(item, index){
		return item > 20;
	}); //areAllBigEnough = false


### See Also:

- [MDC Array:every][]



Array Method: filter {#Array:filter}
------------------------------------

Creates a new array with all of the elements of the array for which the provided filtering function returns true.
This method is provided only for browsers without native [Array:filter][] support.

### Syntax:

	var filteredArray = myArray.filter(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to test each element of the array. This function is passed the item and its index in the array.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, array)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### Returns:

* (*array*) The new filtered array.

### Examples:

	var biggerThanTwenty = [10, 3, 25, 100].filter(function(item, index){
		return item > 20;
	}); //biggerThanTwenty = [25, 100]

### See Also:

- [MDC Array:filter][]


Array Method: clean {#Array:clean}
------------------------------------

Creates a new array with all of the elements of the array which are defined (i.e. not null or undefined).

### Syntax:

	var cleanedArray = myArray.clean();

### Returns:

* (*array*) The new filtered array.

### Examples:

	var myArray = [null, 1, 0, true, false, "foo", undefined, ""];
	myArray.clean() // returns [1, 0, true, false, "foo", ""]


Array Method: indexOf {#Array:indexOf}
--------------------------------------

Returns the index of the first element within the array equal to the specified value, or -1 if the value is not found.
This method is provided only for browsers without native [Array:indexOf][] support.

### Syntax:

	var index = myArray.indexOf(item[, from]);

### Returns:

* (*number*) The index of the first element within the array equal to the specified value. If not found, returns -1.

### Arguments:

1. item - (*object*) The item to search for in the array.
2. from - (*number*, optional: defaults to 0) The index of the array at which to begin the search.

### Examples:

	['apple', 'lemon', 'banana'].indexOf('lemon'); //returns 1
	['apple', 'lemon'].indexOf('banana'); //returns -1

### See Also:

- [MDC Array:indexOf][]



Array Method: map {#Array:map}
------------------------------

Creates a new array with the results of calling a provided function on every element in the array.
This method is provided only for browsers without native [Array:map][] support.

### Syntax:

	var mappedArray = myArray.map(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function to produce an element of the new Array from an element of the current one.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, array)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### Returns:

* (*array*) The new mapped array.

### Examples:

	var timesTwo = [1, 2, 3].map(function(item, index){
		return item * 2;
	}); //timesTwo = [2, 4, 6];

### See Also:

- [MDC Array:map][]



Array Method: some {#Array:some}
--------------------------------

Returns true if at least one element in the array satisfies the provided testing function.
This method is provided only for browsers without native [Array:some][] support.

### Syntax:

	var somePassed = myArray.some(fn[, bind]);

### Returns:

* (*boolean*) If at least one element in the array satisfies the provided testing function returns true. Otherwise, returns false.

### Arguments:

1. fn   - (*function*) The function to test for each element. This function is passed the item and its index in the array.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, array)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### Examples:

	var isAnyBigEnough = [10, 4, 25, 100].some(function(item, index){
		return item > 20;
	}); //isAnyBigEnough = true

### See Also:

- [MDC Array:some][]



Array Method: associate {#Array:associate}
------------------------------------------

Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.

### Syntax:

	var associated = myArray.associate(obj);

### Arguments:

1. obj - (*array*) Its items will be used as the keys of the object that will be created.

### Returns:

* (*object*) The new associated object.

### Examples:

	var animals = ['Cow', 'Pig', 'Dog', 'Cat'];
	var sounds = ['Moo', 'Oink', 'Woof', 'Miao'];
	sounds.associate(animals);
	//returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}



Array Method: link {#Array:link}
--------------------------------

Accepts an object of key / function pairs to assign values.

### Syntax:

	var result = Array.link(array, object);

### Arguments:

1. object - (*object*)  An object containing key / function pairs must be passed to be used as a template for associating values with the different keys.

### Returns:

* (*object*) The new associated object.

### Examples:

	var el = document.createElement('div');
	var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
	arr2.link({myNumber: Number.type, myElement: Element.type, myObject: Object.type, myString: String.type, myBoolean: $defined});
	//returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}



Array Method: contains {#Array:contains}
----------------------------------------

Tests an array for the presence of an item.

### Syntax:

	var inArray = myArray.contains(item[, from]);

### Arguments:

1. item - (*object*) The item to search for in the array.
2. from - (*number*, optional: defaults to 0) The index of the array at which to begin the search.

### Returns:

* (*boolean*) If the array contains the item specified, returns true. Otherwise, returns false.

### Examples:

	["a","b","c"].contains("a"); //returns true
	["a","b","c"].contains("d"); //returns false

### See Also:

- [MDC Array:indexOf][]



Array Method: extend {#Array:extend}
------------------------------------

Extends an array with all the items of another.

### Syntax:

	myArray.extend(array);

### Arguments:

1. array - (*array*) The array whose items should be extended into this array.

### Returns:

* (*array*) This array, extended.

### Examples:

	var animals = ['Cow', 'Pig', 'Dog'];
	animals.extend(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat', 'Dog'];



Array Method: getLast {#Array:getLast}
--------------------------------------

Returns the last item from the array.

### Syntax:

	myArray.getLast();

### Returns:

* (*mixed*) The last item in this array.
* (*null*) If this array is empty, returns null.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat'].getLast(); //returns 'Cat'



Array Method: getRandom {#Array:getRandom}
------------------------------------------

Returns a random item from the array.

### Syntax:

	myArray.getRandom();

### Returns:

* (*mixed*) A random item from this array. If this array is empty, returns null.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat'].getRandom(); //returns one of the items



Array Method: include {#Array:include}
--------------------------------------

Pushes the passed element into the array if it's not already present (case and type sensitive).

### Syntax:

	myArray.include(item);

### Arguments:

1. item - (*object*) The item that should be added to this array.

### Returns:

* (*array*) This array with the new item included.

### Examples:

	['Cow', 'Pig', 'Dog'].include('Cat'); //returns ['Cow', 'Pig', 'Dog', 'Cat']
	['Cow', 'Pig', 'Dog'].include('Dog'); //returns ['Cow', 'Pig', 'Dog']



Array Method: combine {#Array:combine}
----------------------------------

Combines an array with all the items of another. Does not allow duplicates and is case and type sensitive.

### Syntax:

	myArray.combine(array);

### Arguments:

1. array - (*array*) The array whose items should be combined into this array.

### Returns:

* (*array*) This array combined with the new items.

### Examples:

	var animals = ['Cow', 'Pig', 'Dog'];
	animals.combine(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat'];



Array Method: erase {#Array:erase}
------------------------------------

Removes all occurrences of an item from the array.

### Syntax:

	myArray.erase(item);

### Arguments:

1. item - (*object*) The item to search for in the array.

### Returns:

* (*array*) This array with all occurrences of the item removed.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].erase('Dog') //returns ['Cow', 'Pig', 'Cat']
	['Cow', 'Pig', 'Dog'].erase('Cat') //returns ['Cow', 'Pig', 'Dog']



Array Method: empty {#Array:empty}
----------------------------------

Empties an array.

### Syntax:

	myArray.empty();

### Returns:

* (*array*) This array, emptied.

### Examples:

	var myArray = ['old', 'data'];
	myArray.empty(); //myArray is now []



Array Method: flatten {#Array:flatten}
--------------------------------------

Flattens a multidimensional array into a single array.

### Syntax:

	myArray.flatten();

### Returns:

* (*array*) A new flat array.

### Examples:

	var myArray = [1,2,3,[4,5, [6,7]], [[[8]]]];
	var newArray = myArray.flatten(); //newArray is [1,2,3,4,5,6,7,8]



Array Method: hexToRgb {#Array:hexToRgb}
----------------------------------------

Converts an hexidecimal color value to RGB. Input array must be the following hexidecimal color format.
\['FF','FF','FF'\]

### Syntax:

	myArray.hexToRgb([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (eg. \[255, 51, 0\]) instead of a string (eg. "rgb(255,51,0)").

### Returns:

* (*string*) A string representing the color in RGB.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	['11','22','33'].hexToRgb(); //returns "rgb(17,34,51)"
	['11','22','33'].hexToRgb(true); //returns [17, 34, 51]

### See Also:

- [String:hexToRgb](/Native/String/#hexToRgb)



Array Method: rgbToHex {#Array:rgbToHex}
----------------------------------------

Converts an RGB color value to hexidecimal. Input array must be in one of the following RGB color formats.
\[255,255,255\], or \[255,255,255,1\]

### Syntax:

	myArray.rgbToHex([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (eg. \['ff','33','00'\]) instead of a string (eg. "#ff3300").

### Returns:

* (*string*) A string representing the color in hexadecimal, or 'transparent' string if the fourth value of rgba in the input array is 0 (rgba).
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	[17,34,51].rgbToHex(); //returns "#112233"
	[17,34,51].rgbToHex(true); //returns ['11','22','33']
	[17,34,51,0].rgbToHex(); //returns "transparent"

### See Also:

- [String:rgbToHex](/Native/String/#rgbToHex)

Utility Functions {#Utility}
============================


Function: $A {#A}
-----------------

Creates a copy of an Array. Useful for applying the Array prototypes to iterable objects such as a DOM Node collection or the arguments object.

### Syntax:

	var copiedArray = $A(iterable);

### Arguments:

1. iterable - (array) The iterable to copy.

### Returns:

* (*array*) The new copied array.

### Examples:

#### Apply Array to arguments:

	function myFunction(){
		$A(arguments).each(function(argument, index){
			alert(argument);
		});
	};
	myFunction("One", "Two", "Three"); //Alerts "One", then "Two", then "Three".

#### Copy an Array:

	var anArray = [0, 1, 2, 3, 4];
	var copiedArray = $A(anArray); //Returns [0, 1, 2, 3, 4].


[Array]: /Native/Array
[Function:bind]: /Native/Function/#Function:bind
[MDC Array]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array
[MDC Array:every]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every
[MDC Array:filter]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
[MDC Array:indexOf]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf
[MDC Array:map]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
[MDC Array:some]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
[MDC Array:forEach]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
[Array:every]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every
[Array:filter]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
[Array:indexOf]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf
[Array:map]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
[Array:some]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some