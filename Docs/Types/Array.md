Type: Array {#Array}
====================

A collection of Array methods and functions.

### See Also:

- [MDN Array][]


Function: Array.each {#Array:Array-each}
----------------------------------

Used to iterate through arrays, or iterables that are not regular arrays, such as built in getElementsByTagName calls or arguments of a function.

### Syntax:

	Array.each(iterable, fn[, bind]);

### Arguments:

1. iterable - (*array*) The array to iterate through.
2. fn       - (*function*) The function to test for each element.
3. bind     - (*object*, optional) The object to use as 'this' within the function. For more information see [Function:bind][].

#### Argument: fn

##### Syntax:

	fn(item, index, object)

##### Arguments:

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array. In the case of an object, it is passed the key of that item rather than the index.
3. object - (*mixed*) The actual array/object.

### Example:

	Array.each(['Sun', 'Mon', 'Tue'], function(day, index){
		alert('name:' + day + ', index: ' + index);
	}); // alerts 'name: Sun, index: 0', 'name: Mon, index: 1', etc.

### See Also:

- [Array:each](#Array:each)

### Notes:

This is an array-specific equivalent of *$each* from MooTools 1.2.



Function: Array.clone {#Array:Array-clone}
------------------------------------

Returns a copy of the passed array.

### Syntax:

	var clone = Array.clone(myArray);

### Arguments:

1. myArray	- (*array*) The array you wish to copy.

### Returns:

* (*array*) a copy of the passed array.

### Example:

	var myArray = ['red', 'blue', 'green'];
	var otherArray = Array.clone(myArray);

	var myArray[0] = 'yellow';

	alert(myArray[0]);		// alerts 'yellow'
	alert(otherArray[0])	// alerts 'red'

### Notes:

This is an array-specific equivalent of *$unlink* from MooTools 1.2.

Function: Array.convert {#Array:Array:convert}
----------------------------------

Converts the argument passed in to an array if it is defined and not already an array.

### Syntax:

	var splatted = Array.convert(obj);

### Arguments:

1. obj - (*mixed*) Any type of variable.

### Returns:

* (*array*) If the variable passed in is an array, returns the array. Otherwise, returns an array with the only element being the variable passed in.

### Example:

	Array.convert('hello'); // returns ['hello'].
	Array.convert(['a', 'b', 'c']); // returns ['a', 'b', 'c'].

### Notes:

This is equivalent to *$splat* from MooTools 1.2, with the exception of Array-like Objects such as NodeList or FileList which `Array.convert` does transform in
Arrays and `$splat` not.

Array method: each {#Array:each}
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

- [Array.each](#Array:Array-each)
- [MDN Array:forEach][]

### Notes:

- This method is only available for browsers without native [MDN Array:forEach][] support.






Array method: invoke {#Array:invoke}
--------------------------

Returns an array with the named method applied to the array's contents.

### Syntax:

	var arr = myArray.invoke(method[, arg, arg, arg ...])

### Arguments:

1. method - (*string*) The method to apply to each item in the array.
2. arg - (*mixed*) Any number of arguments to pass to the named method.

### Returns:

* (*array*) A new array containing the results of the applied method.

### Example:

	var foo = [4, 8, 15, 16, 23, 42];
	var bar = foo.invoke('limit', 10, 30);	//bar is now [10, 10, 15, 16, 23, 30]

### Notes:

The method that is invoked is a method of each of the items.
If the method does not exist, then an error will be thrown. For example:

	[0, false, 'string'].invoke('limit', 0, 10); // throws an error!

Array method: every {#Array:every}
----------------------------

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
	}); // areAllBigEnough = false


### See Also:

- [MDN Array:every][]



Array method: filter {#Array:filter}
------------------------------

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
	}); // biggerThanTwenty = [25, 100]

### See Also:

- [MDN Array:filter][]



Array method: clean {#Array:clean}
----------------------------

Creates a new array with all of the elements of the array which are defined (i.e. not null or undefined).

### Syntax:

	var cleanedArray = myArray.clean();

### Returns:

* (*array*) The new filtered array.

### Examples:

	var myArray = [null, 1, 0, true, false, 'foo', undefined, ''];
	myArray.clean() // returns [1, 0, true, false, 'foo', '']



Array method: indexOf {#Array:indexOf}
--------------------------------

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

	['apple', 'lemon', 'banana'].indexOf('lemon'); // returns 1
	['apple', 'lemon'].indexOf('banana'); // returns -1

### See Also:

- [MDN Array:indexOf][]



Array method: map {#Array:map}
------------------------

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

- [MDN Array:map][]



Array method: some {#Array:some}
--------------------------

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
	}); // isAnyBigEnough = true

### See Also:

- [MDN Array:some][]



Array method: associate {#Array:associate}
------------------------------------

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
	// returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}



Array method: link {#Array:link}
--------------------------

Accepts an object of key / function pairs to assign values.

### Syntax:

	var result = myArray.link(object);

### Arguments:

1. object - (*object*)  An object containing key / function pairs must be passed to be used as a template for associating values with the different keys.

### Returns:

* (*object*) The new associated object.

### Examples:

	var el = document.createElement('div');
	var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
	arr2.link({
		myNumber: Type.isNumber,
		myElement: Type.isElement,
		myObject: Type.isObject,
		myString: Type.isString,
		myBoolean: function(obj){ return obj != null; }
	});
	// returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}


Array method: contains {#Array:contains}
----------------------------------

Tests an array for the presence of an item.

### Syntax:

	var inArray = myArray.contains(item[, from]);

### Arguments:

1. item - (*object*) The item to search for in the array.
2. from - (*number*, optional: defaults to 0) The index of the array at which to begin the search.

### Returns:

* (*boolean*) If the array contains the item specified, returns true. Otherwise, returns false.

### Examples:

	['a', 'b', 'c'].contains('a'); // returns true
	['a', 'b', 'c'].contains('d'); // returns false

### See Also:

- [MDN Array:indexOf][]



Array method: append {#Array:append}
------------------------------

Appends the passed array to the end of the current array.

### Syntax:

	var myArray = myArray.append(otherArray);

### Arguments:

1. otherArray - (*array*) The array containing values you wish to append.

### Returns:

* (*array*) The original array including the new values.

### Examples:

	var myOtherArray = ['green', 'yellow'];
	['red', 'blue'].append(myOtherArray); // returns ['red', 'blue', 'green', 'yellow'];

	[0, 1, 2].append([3, [4]]); // [0, 1, 2, 3, [4]]

### Notes:

This is an array-specific equivalent of *$extend* from MooTools 1.2.



Array method: getLast {#Array:getLast}
--------------------------------

Returns the last item from the array.

### Syntax:

	myArray.getLast();

### Returns:

* (*mixed*) The last item in this array.
* (*null*) If this array is empty, returns null.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat'].getLast(); // returns 'Cat'



Array method: getRandom {#Array:getRandom}
------------------------------------

Returns a random item from the array.

### Syntax:

	myArray.getRandom();

### Returns:

* (*mixed*) A random item from this array. If this array is empty, returns null.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat'].getRandom(); // returns one of the items



Array method: include {#Array:include}
--------------------------------

Pushes the passed element into the array if it's not already present (case and type sensitive).

### Syntax:

	myArray.include(item);

### Arguments:

1. item - (*object*) The item that should be added to this array.

### Returns:

* (*array*) This array with the new item included.

### Examples:

	['Cow', 'Pig', 'Dog'].include('Cat'); // returns ['Cow', 'Pig', 'Dog', 'Cat']
	['Cow', 'Pig', 'Dog'].include('Dog'); // returns ['Cow', 'Pig', 'Dog']

### Notes:

If you want to push the passed element even if it's already present, use
the vanilla javascript:

	myArray.push(item);

Array method: combine {#Array:combine}
--------------------------------

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



Array method: erase {#Array:erase}
----------------------------

Removes all occurrences of an item from the array.

### Syntax:

	myArray.erase(item);

### Arguments:

1. item - (*object*) The item to search for in the array.

### Returns:

* (*array*) This array with all occurrences of the item removed.

### Examples:

	['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].erase('Dog') // returns ['Cow', 'Pig', 'Cat']
	['Cow', 'Pig', 'Dog'].erase('Cat') // returns ['Cow', 'Pig', 'Dog']



Array method: empty {#Array:empty}
----------------------------

Empties an array.

### Syntax:

	myArray.empty();

### Returns:

* (*array*) This array, emptied.

### Examples:

	var myArray = ['old', 'data'];
	myArray.empty(); //myArray is now []


Array method: flatten {#Array:flatten}
--------------------------------

Flattens a multidimensional array into a single array.

### Syntax:

	myArray.flatten();

### Returns:

* (*array*) A new flat array.

### Examples:

	var myArray = [1,2,3,[4,5, [6,7]], [[[8]]]];
	var newArray = myArray.flatten(); //newArray is [1,2,3,4,5,6,7,8]



Array method: pick {#Array:pick}
--------------------------
Returns the first defined value of the array passed in, or null.

### Syntax:

	var picked = [var1, var2, var3].pick();

### Returns:

* (*mixed*) The first variable that is defined.
* (*null*) If all variables passed in are `null` or `undefined`, returns `null`.

### Example:

	function say(infoMessage, errorMessage){
		alert([errorMessage, infoMessage, 'There was no message supplied.'].pick());

		//or more MooTools 1.2 style using Generics
		Array.pick([errorMessage, infoMessage, 'There was no message supplied.']);

	}
	say(); // alerts 'There was no message supplied.'
    say('This is an info message.'); // alerts 'This is an info message.'
    say('This message will be ignored.', 'This is the error message.'); // alerts 'This is the error message.'


### Notes:

This is equivalent to *$pick* from MooTools 1.2.



Array method: hexToRgb {#Array:hexToRgb}
----------------------------------

Converts an hexadecimal color value to RGB. Input array must be the following hexadecimal color format.
\['FF', 'FF', 'FF'\]

### Syntax:

	myArray.hexToRgb([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (e.g. \[255, 51, 0\]) instead of a string (e.g. "rgb(255, 51, 0)").

### Returns:

* (*string*) A string representing the color in RGB.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	['11', '22', '33'].hexToRgb(); // returns 'rgb(17, 34, 51)'
	['11', '22', '33'].hexToRgb(true); // returns [17, 34, 51]

### See Also:

- [String:hexToRgb][]



Array method: rgbToHex {#Array:rgbToHex}
----------------------------------

Converts an RGB color value to hexadecimal. Input array must be in one of the following RGB color formats.
\[255, 255, 255\], or \[255, 255, 255, 1\]

### Syntax:

	myArray.rgbToHex([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (e.g. \['ff', '33', '00'\]) instead of a string (e.g. '#ff3300').

### Returns:

* (*string*) A string representing the color in hexadecimal, or 'transparent' string if the fourth value of rgba in the input array is 0 (rgba).
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	[17, 34, 51].rgbToHex(); // returns '#112233'
	[17, 34, 51].rgbToHex(true); // returns ['11', '22', '33']
	[17, 34, 51, 0].rgbToHex(); // returns 'transparent'

### See Also:

- [String:rgbToHex][]


Deprecated Functions {#Deprecated-Functions}
============================================

Function: Array.from {#Deprecated-Functions:Array:Array:from}
----------------------------------

This method has been deprecated in MooTools 1.6, please use *[Array:convert][]* instead. 
For backwards compatibility you can use the _compat layer_ that still uses the old implementation, overriding the Native ES6 implementation. 
Please use the no compat version instead, unless you know why you have to use the _compat layer_.

### See Also:

 - [MDN Array:from][]



[Array:convert]: /core/Types/Array/#Array:convert
[Function:bind]: /core/Types/Function/#Function:bind
[String:hexToRgb]: /core/Types/String/#String:hexToRgb
[String:rgbToHex]: /core/Types/String/#String:rgbToHex
[MDN Array]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array
[MDN Array:from]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[MDN Array:every]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
[MDN Array:filter]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
[MDN Array:indexOf]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
[MDN Array:map]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
[MDN Array:some]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
[MDN Array:forEach]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
[Array:every]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
[Array:filter]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
[Array:indexOf]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
[Array:map]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
[Array:some]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
