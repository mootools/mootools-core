/*
Script: Array.js
	Contains Array prototypes, <$A>, <$each>

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

//custom methods

Array.extend({

	/*
	Property: forEach
		Iterates through an array; This method is only available for browsers without native *forEach* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach>

		*forEach* executes the provided function (callback) once for each element present in the array. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - the object to bind "this" to (see <Function.bind>)

	Example:
		>['apple','banana','lemon'].each(function(item, index){
		>	alert(index + " = " + item); //alerts "0 = apple" etc.
		>}, bindObj); //optional second arg for binding, not used here
	*/

	forEach: function(fn, bind){
		for (var i = 0, j = this.length; i < j; i++) fn.call(bind, this[i], i, this);
	},

	/*
	Property: filter
		This method is provided only for browsers without native *filter* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter>

		*filter* calls a provided callback function once for each element in an array, and constructs a new array of all the values for which callback returns a true value. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values. Array elements which do not pass the callback test are simply skipped, and are not included in the new array.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - the object to bind "this" to (see <Function.bind>)

	Example:
		>var biggerThanTwenty = [10,3,25,100].filter(function(item, index){
		> return item > 20;
		>});
		>//biggerThanTwenty = [25,100]
	*/

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, j = this.length; i < j; i++){
			if (fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	/*
	Property: map
		This method is provided only for browsers without native *map* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>

		*map* calls a provided callback function once for each element in an array, in order, and constructs a new array from the results. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - the object to bind "this" to (see <Function.bind>)

	Example:
		>var timesTwo = [1,2,3].map(function(item, index){
		> return item*2;
		>});
		>//timesTwo = [2,4,6];
	*/

	map: function(fn, bind){
		var results = [];
		for (var i = 0, j = this.length; i < j; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},

	/*
	Property: every
		This method is provided only for browsers without native *every* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>

		*every* executes the provided callback function once for each element present in the array until it finds one where callback returns a false value. If such an element is found, the every method immediately returns false. Otherwise, if callback returned a true value for all elements, every will return true. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - the object to bind "this" to (see <Function.bind>)

	Example:
		>var areAllBigEnough = [10,4,25,100].every(function(item, index){
		> return item > 20;
		>});
		>//areAllBigEnough = false
	*/

	every: function(fn, bind){
		for (var i = 0, j = this.length; i < j; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	/*
	Property: some
		This method is provided only for browsers without native *some* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>

		*some* executes the callback function once for each element present in the array until it finds one where callback returns a true value. If such an element is found, some immediately returns true. Otherwise, some returns false. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - the object to bind "this" to (see <Function.bind>)

	Example:
		>var isAnyBigEnough = [10,4,25,100].some(function(item, index){
		> return item > 20;
		>});
		>//isAnyBigEnough = true
	*/

	some: function(fn, bind){
		for (var i = 0, j = this.length; i < j; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/*
	Property: indexOf
		This method is provided only for browsers without native *indexOf* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>

		*indexOf* compares a search element to elements of the Array using strict equality (the same method used by the ===, or triple-equals, operator).

	Arguments:
		item - any type of object; element to locate in the array
		from - integer; optional; the index of the array at which to begin the search (defaults to 0)

	Example:
		>['apple','lemon','banana'].indexOf('lemon'); //returns 1
		>['apple','lemon'].indexOf('banana'); //returns -1
	*/

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	/*
	Property: each
		Same as <Array.forEach>.

	Arguments:
		fn - function to execute with each item in the array; passed the item and the index of that item in the array
		bind - optional, the object that the "this" of the function will refer to.

	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.each(function(animal){
		>	document.write(animal)
		>});
	*/

	/*
	Property: copy
		returns a copy of the array.

	Returns:
		a new array which is a copy of the current one.

	Arguments:
		start - integer; optional; the index where to start the copy, default is 0. If negative, it is taken as the offset from the end of the array.
		length - integer; optional; the number of elements to copy. By default, copies all elements from start to the end of the array.

	Example:
		>var letters = ["a","b","c"];
		>var copy = letters.copy();		// ["a","b","c"] (new instance)
	*/

	copy: function(start, length){
		start = start || 0;
		if (start < 0) start = this.length + start;
		length = length || (this.length - start);
		var newArray = [];
		for (var i = 0; i < length; i++) newArray[i] = this[start++];
		return newArray;
	},

	/*
	Property: remove
		Removes all occurrences of an item from the array.

	Arguments:
		item - the item to remove

	Returns:
		the Array with all occurrences of the item removed.

	Example:
		>["1","2","3","2"].remove("2") // ["1","3"];
	*/

	remove: function(item){
		var i = 0;
		var len = this.length;
		while (i < len){
			if (this[i] === item){
				this.splice(i, 1);
				len--;
			} else {
				i++;
			}
		}
		return this;
	},

	/*
	Property: contains
		Tests an array for the presence of an item.

	Arguments:
		item - the item to search for in the array.
		from - integer; optional; the index at which to begin the search, default is 0. If negative, it is taken as the offset from the end of the array.

	Returns:
		true - the item was found
		false - it wasn't

	Example:
		>["a","b","c"].contains("a"); // true
		>["a","b","c"].contains("d"); // false
	*/

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	/*
	Property: associate
		Creates an object with key-value pairs based on the array of keywords passed in
		and the current content of the array.

	Arguments:
		keys - the array of keywords.

	Example:
		(start code)
		var Animals = ['Cat', 'Dog', 'Coala', 'Lizard'];
		var Speech = ['Miao', 'Bau', 'Fruuu', 'Mute'];
		var Speeches = Animals.associate(Speech);
		//Speeches['Miao'] is now Cat.
		//Speeches['Bau'] is now Dog.
		//...
		(end)
	*/

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	/*
	Property: extend
		Extends an array with another one.

	Arguments:
		array - the array to extend ours with

	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.extend(['Lizard']);
		>//Animals is now: ['Cat', 'Dog', 'Coala', 'Lizard'];
	*/

	extend: function(array){
		for (var i = 0, j = array.length; i < j; i++) this.push(array[i]);
		return this;
	},

	/*
	Property: merge
		merges an array in another array, without duplicates. (case- and type-sensitive)

	Arguments:
		array - the array to merge from.

	Example:
		>['Cat','Dog'].merge(['Dog','Coala']); //returns ['Cat','Dog','Coala']
	*/

	merge: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	/*
	Property: include
		includes the passed in element in the array, only if its not already present. (case- and type-sensitive)

	Arguments:
		item - item to add to the array (if not present)

	Example:
		>['Cat','Dog'].include('Dog'); //returns ['Cat','Dog']
		>['Cat','Dog'].include('Coala'); //returns ['Cat','Dog','Coala']
	*/

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	/*
	Property: getRandom
		returns a random item in the Array
	*/

	getRandom: function(){
		return this[$random(0, this.length - 1)] || null;
	},

	/*
	Property: getLast
		returns the last item in the Array
	*/

	getLast: function(){
		return this[this.length - 1] || null;
	}

});

//copies

Array.prototype.each = Array.prototype.forEach;
Array.each = Array.forEach;

/* Section: Utility Functions */

/*
Function: $A()
	Same as <Array.copy>, but as function.
	Useful to apply Array prototypes to iterable objects, as a collection of DOM elements or the arguments object.

Example:
	(start code)
	function myFunction(){
		$A(arguments).each(argument, function(){
			alert(argument);
		});
	};
	//the above will alert all the arguments passed to the function myFunction.
	(end)
*/

function $A(array){
	return Array.copy(array);
};

/*
Function: $each
	Use to iterate through iterables that are not regular arrays, such as builtin getElementsByTagName calls, arguments of a function, or an object.

Arguments:
	iterable - an iterable element or an objct.
	function - function to apply to the iterable.
	bind - optional, the 'this' of the function will refer to this object.

Function argument:
	The function argument will be passed the following arguments.

	item - the current item in the iterator being procesed
	index - integer; the index of the item, or key in case of an object.

Examples:
	(start code)
	$each(['Sun','Mon','Tue'], function(day, index){
		alert('name:' + day + ', index: ' + index);
	});
	//alerts "name: Sun, index: 0", "name: Mon, index: 1", etc.
	//over an object
	$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
		alert("the " + key + " day of the week is " + value);
	});
	//alerts "the first day of the week is Sunday",
	//"the second day of the week is Monday", etc.
	(end)
*/

function $each(iterable, fn, bind){
	if (iterable && typeof iterable.length == 'number' && $type(iterable) != 'object'){
		Array.forEach(iterable, fn, bind);
	} else {
		 for (var name in iterable) fn.call(bind || iterable, iterable[name], name);
	}
};

/*compatibility*/

Array.prototype.test = Array.prototype.contains;

/*end compatibility*/