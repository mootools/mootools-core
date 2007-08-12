/*
Script: Array.js
	Contains Array prototypes, <$A>, <$each>.

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of the Array Object prototype methods.
	For more information on the JavaScript Array Object see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array>.
*/

Array.extend({

	/*
	Property: every
		Returns true if every element in the array satisfies the provided testing function.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>.

		This method is provided only for browsers without native *every* support.

	Syntax:
		>var allPassed = myArray.every(fn[, bind]);

	Arguments:
		fn   - (function) The function to test for each element. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Returns:
		(boolean) If every element in the array satisfies the provided testing function, returns true. Otherwise, returns false.

	Example:
		(start code)
		var areAllBigEnough = [10, 4, 25, 100].every(function(item, index){
			return item > 20;
		}); //areAllBigEnough = false
		(end)
	*/

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	/*
	Property: filter
		Creates a new array with all of the elements of the array for which the provided filtering function returns true.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter>.

		This method is provided only for browsers without native *filter* support.

	Syntax:
		>var filteredArray = myArray.filter(fn[, bind]);

	Arguments:
		fn   - (function) The function to test each element of the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Returns:
		(array) The new filtered array.

	Example:
		(start code)
		var biggerThanTwenty = [10, 3, 25, 100].filter(function(item, index){
			return item > 20;
		}); //biggerThanTwenty = [25, 100]
		(end)
	*/

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	/*
	Property: forEach
		Calls a function for each element in the array.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach>.

		This method is only available for browsers without native *forEach* support.

	Syntax:
		>myArray.forEach(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Example:
		(start code)
		['apple', 'banana', 'lemon'].forEach(function(item, index){
			alert(index + " = " + item); //alerts "0 = apple" etc.
		}, bind); //optional second argument for binding, not used here
		(end)
	*/

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	},

	/*
	Property: indexOf
		Returns the index of the first element within the array equal to the specified value, or -1 if the value is not found.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>.

		This method is provided only for browsers without native *indexOf* support.

	Syntax:
		>var index = myArray.indexOf(item[, from]);

	Returns:
		(integer) The index of the first element within the array equal to the specified value. If not found, returns -1.

	Arguments:
		item - (object) The item to search for in the array.
		from - (integer, optional) The index of the array at which to begin the search (defaults to 0).

	Example:
		(start code)
		['apple', 'lemon', 'banana'].indexOf('lemon'); //returns 1
		['apple', 'lemon'].indexOf('banana'); //returns -1
		(end)
	*/

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	/*
	Property: map
		Creates a new array with the results of calling a provided function on every element in the array.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>.

		This method is provided only for browsers without native *map* support.

	Syntax:
		>var mappedArray = myArray.map(fn[, bind]);

	Arguments:
		fn   - (function) The function to produce an element of the new Array from an element of the current one.
			This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Returns:
		(array) The new mapped array.

	Example:
		(start code)
		var timesTwo = [1, 2, 3].map(function(item, index){
			return item * 2;
		}); //timesTwo = [2, 4, 6];
		(end)
	*/

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},

	/*
	Property: some
		Returns true if at least one element in the array satisfies the provided testing function.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>.

		This method is provided only for browsers without native *some* support.

	Syntax:
		>var somePassed = myArray.some(fn[, bind]);

	Returns:
		(boolean) If at least one element in the array satisfies the provided testing function returns true. Otherwise, returns false.

	Arguments:
		fn   - (function) The function to test for each element. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Example:
		(start code)
		var isAnyBigEnough = [10, 4, 25, 100].some(function(item, index){
			return item > 20;
		}); //isAnyBigEnough = true
		(end)
	*/

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/*
	Property: reduce
		Apply a function simultaneously against two values of the array (from left-to-right) as to reduce it to a single value.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:reduce>.

		This method is provided only for browsers without native *reduce* support.

	Syntax:
		>var reduced = myArray.reduce(fn[, value]);

	Arguments:
		fn    - (function) Function to execute on each value in the array.
			This function is passed the previous item, the current item, the current index and the array itself.
		value - (object, optional) Object to use as the initial argument to the first call of the callback.

	Returns:
		(mixed) The result of reducing this array according to fn.

	Examples:
		Sum up numbers
		(start code)
		var sum = [1, 2, 3, 4, 6].reduce(function(previousItem, currentItem){
			return previousItem + currentItem;
		}, 10); // sum is 26
		(end)

		Collect elements of many arrays into an array
		(start code)
		var collected = [['a', 'b'], ['c', 'd'], ['e', 'f', 'g']].reduce(function(previousItem, currentItem) {
			return previousItem.concat(currentItem);
		}, []); // collected is ['a', 'b', 'c', 'd', 'e', 'f', 'g']
		(end)
	*/

	reduce: function(fn, value){
		var i = 0;
		if (arguments.length < 2 && this.length) value = this[i++];
		for (var l = this.length; i < l; i++) value = fn.call(null, value, this[i], i, this);
		return value;
	},

	/*
	Property: associate
		Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.
		Can also accept an object of key / type pairs to assign values.

	Syntax:
		>var associated = myArray.associate(obj);

	Arguments:
		obj - (mixed) If an array is passed, its items will be used as the keys of the object that will be created.
			Alternatively, an object containing key / type pairs may be passed and used as a template for associating values with the different keys.

	Returns:
		(object) The new associated object.

	Examples:
		array example
		(start code)
		var animals = ['Cow', 'Pig', 'Dog', 'Cat'];
		var sounds = ['Moo', 'Oink', 'Woof', 'Miao'];
		animals.associate(sounds);
		//returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}
		(end)

		object example
		(start code)
		var values = [100, 'Hello', {foo: 'bar'}, $('myelement')];
		values.associate({myNumber: 'number', myElement: 'element', myObject: 'object', myString: 'string'});
		//returns {myNumber: 100, myElement: <div id="myelement">, myObject: {foo: bar}, myString: Hello}
		(end)
	*/

	associate: function(obj){
		var routed = {};
		var objtype = $type(obj);
		if (objtype == 'array'){
			var temp = {};
			for (var i = 0, j = obj.length; i < j; i++) temp[obj[i]] = true;
			obj = temp;
		}
		for (var oname in obj) routed[oname] = null;
		for (var k = 0, l = this.length; k < l; k++){
			var res = (objtype == 'array') ? $defined(this[k]) : $type(this[k]);
			for (var name in obj){
				if (!$defined(routed[name]) && ((res && obj[name] === true) || obj[name].contains(res))){
					routed[name] = this[k];
					break;
				}
			}
		}
		return routed;
	},

	/*
	Property: contains
		Tests an array for the presence of an item.

	Syntax:
		>var inArray = myArray.contains(item[, from])

	Arguments:
		item - (object) The item to search for in the array.
		from - (integer, optional) The index of the array at which to begin the search (defaults to 0).

	Returns:
		(boolean) If the array contains the item specified, returns true. Otherwise, returns false.

	Example:
		(start code)
		["a","b","c"].contains("a"); //returns true
		["a","b","c"].contains("d"); //returns false
		(end)
	*/

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	/*
	Property: copy
		Returns a copy of the array.

	Syntax:
		>var copiedArray = myArray.copy([start, [length]]);

	Arguments:
		start  - (integer, optional) The index from which the copy should be started.
			If a negative number is provided, the offset is taken from the end of the array (defaults to 0).
		length - (integer, optional) The number of elements to copy (defaults to array.length - start).

	Returns:
		(array) The new copied array.

	Example:
		(start code)
		var letters = ["a","b","c"];
		var copy = letters.copy(); //copy = ["a", "b", "c"]
		(end)
	*/

	copy: function(start, length){
		return $A(this, start, length);
	},

	/*
	Property: each
		Same as <Array.forEach>.

	Syntax:
		>myArray.each(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Example:
		(start code)
		['apple','banana','lemon'].each(function(item, index){
			alert(index + " = " + item); //alerts "0 = apple" etc.
		}, bind); //optional second argument for binding, not used here
		(end)
	*/

	/*
	Property: extend
		Extends an array with all the items of another.

	Syntax:
		>myArray.extend(array);

	Arguments:
		array - (array) The array whose items should be extended into this array.

	Returns:
		(array) This array, extended.

	Example:
		(start code)
		var animals = ['Cow', 'Pig', 'Dog'];
		animals.extend(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat', 'Dog'];
		(end)
	*/

	extend: function(array){
		for (var i = 0, j = array.length; i < j; i++) this.push(array[i]);
		return this;
	},

	/*
	Property: getLast
		Returns the last item from the array.

	Syntax:
		>myArray.getLast();

	Returns:
		(mixed) The last item in this array. If this array is empty, returns null.

	Example:
		(start code)
		['Cow', 'Pig', 'Dog', 'Cat'].getLast(); //returns 'Cat'
		(end)
	*/

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	/*
	Property: getRandom
		Returns a random item from the array.

	Syntax:
		>myArray.getRandom();

	Returns:
		(mixed) A random item from this array. If this array is empty, returns null.

	Example:
		(start code)
		['Cow', 'Pig', 'Dog', 'Cat'].getRandom(); //returns one of the items
		(end)
	*/

	getRandom: function(){
		return (this.length) ? this[$random(0, this.length - 1)] : null;
	},

	/*
	Property: include
		Pushes the passed element into the array if it's not already present (case and type sensitive).

	Syntax:
		>myArray.include(item);

	Arguments:
		item - (object) The item that should be added to this array.

	Returns:
		(array) This array with the new item included.

	Example:
		(start code)
		['Cow', 'Pig', 'Dog'].include('Cat'); //returns ['Cow', 'Pig', 'Dog', 'Cat']
		['Cow', 'Pig', 'Dog'].include('Dog'); //returns ['Cow', 'Pig', 'Dog']
		(end)
	*/

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	/*
	Property: merge
		Merges an array with all the items of another. Does not allow duplicates (case and type sensitive).

	Syntax:
		>myArray.merge(array);

	Arguments:
		array - (array) The array whose items should be merged into this array.

	Returns:
		(array) This array merged with the new items.

	Example:
		(start code)
		var animals = ['Cow', 'Pig', 'Dog'];
		animals.merge(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat'];
		(end)
	*/

	merge: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	/*
	Property: remove
		Removes all occurrences of an item from the array.

	Syntax:
		>myArray.remove(item);

	Arguments:
		item - (object) The item to search for in the array.

	Returns:
		(array) This array with all occurrences of the item removed.

	Example:
		(start code)
		['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].remove('Dog') //returns ['Cow', 'Pig', 'Cat']
		['Cow', 'Pig', 'Dog'].remove('Cat') //returns ['Cow', 'Pig', 'Dog']
		(end)
	*/

	remove: function(item){
		for (var i = this.length; i--;) if (this[i] === item) this.splice(i, 1);
		return this;
	},

	/*
	Property: empty
		Empties an array.

	Syntax:
		>myArray.empty();

	Returns:
		(array) This array, emptied.

	Example:
		(start code)
		var myArray = ['old', 'data'];
		myArray.empty(); // now myArray.length is 0
		(end code)
	*/

	empty: function(){
		this.length = 0;
		return this;
	}

});

//copied functions
Array.prototype.each = Array.prototype.forEach;
Array.each = Array.forEach;

//Array generics
['concat', 'join', 'pop', 'push', 'reverse', 'shift', 'slice', 'sort', 'splice', 'unshift'].each(function(prop) {
	if (!Array[prop]) Array[prop] = Native.generic(prop);
});

/* Section: Utility Functions */

/*
Function: $each
	Use to iterate through iterables that are not regular arrays, such as builtin getElementsByTagName calls, arguments of a function, or an object.

Syntax:
	>$each(iterable, fn[, bind]);

Arguments:
	iterable - (object or array) The object or array to iterate through.
	fn       - (function) The function to test for each element. This function is passed the item and its index in the array.
		In the case of an object, it is passed the key of that item rather than the index.
	bind     - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

Examples:
	array example
	(start code)
	$each(['Sun','Mon','Tue'], function(day, index){
		alert('name:' + day + ', index: ' + index);
	}); //alerts "name: Sun, index: 0", "name: Mon, index: 1", etc.
	(end)

	object example
	(start code)
	$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
		alert("the " + key + " day of the week is " + value);
	}); //alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.
	(end)
*/

function $each(iterable, fn, bind){
	((iterable && typeof iterable.length == 'number' && $type(iterable) != 'object') ? Array : Abstract).each(iterable, fn, bind);
};