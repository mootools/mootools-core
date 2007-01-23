/*
Script: Array.js
	Contains Array prototypes, <$A>, <$each>

Authors:
	- Christophe Beyls, <http://digitalia.be>
	- Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

//emulated methods

/*
Property: forEach
	Iterates through an array; This method is only available for browsers without native *forEach* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach>
*/

Array.prototype.forEach = Array.prototype.forEach || function(fn, bind){
	for (var i = 0; i < this.length; i++) fn.call(bind, this[i], i, this);
};

/*
Property: filter
	This method is provided only for browsers without native *filter* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter>
*/

Array.prototype.filter = Array.prototype.filter || function(fn, bind){
	var results = [];
	for (var i = 0; i < this.length; i++){
		if (fn.call(bind, this[i], i, this)) results.push(this[i]);
	}
	return results;
};

/*
Property: map
	This method is provided only for browsers without native *map* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>
*/

Array.prototype.map = Array.prototype.map || function(fn, bind){
	var results = [];
	for (var i = 0; i < this.length; i++) results[i] = fn.call(bind, this[i], i, this);
	return results;
};

/*
Property: every
	This method is provided only for browsers without native *every* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>
*/

Array.prototype.every = Array.prototype.every || function(fn, bind){
	for (var i = 0; i < this.length; i++){
		if (!fn.call(bind, this[i], i, this)) return false;
	}
	return true;
};

/*
Property: some
	This method is provided only for browsers without native *some* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>
*/

Array.prototype.some = Array.prototype.some || function(fn, bind){
	for (var i = 0; i < this.length; i++){
		if (fn.call(bind, this[i], i, this)) return true;
	}
	return false;
};

/*
Property: indexOf
	This method is provided only for browsers without native *indexOf* support.
	For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>
*/

Array.prototype.indexOf = Array.prototype.indexOf || function(item, from){
	from = from || 0;
	if (from < 0) from = Math.max(0, this.length + from);
	while (from < this.length){
		if(this[from] === item) return from;
		from++;
	}
	return -1;
};

//custom methods

Array.extend({

	/*
	Property: each
		Same as <Array.forEach>.

	Arguments:
		fn - the function to execute with each item in the array
		bind - optional, the object that the "this" of the function will refer to.

	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.forEach(function(animal){
		>	document.write(animal)
		>});
	*/

	each: Array.prototype.forEach,

	/*
	Property: copy
		returns a copy of the array.

	Returns:
		a new array which is a copy of the current one.
	
	Arguments:
		start - optional, the index where to start the copy, default is 0. If negative, it is taken as the offset from the end of the array.
		length - optional, the number of elements to copy. By default, copies all elements from start to the end of the array.

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
		while (i < this.length){
			if (this[i] === item) this.splice(i, 1);
			else i++;
		}
		return this;
	},

	/*
	Property: test
		Tests an array for the presence of an item.

	Arguments:
		item - the item to search for in the array.
		from - optional, the index at which to begin the search, default is 0. If negative, it is taken as the offset from the end of the array.

	Returns:
		true - the item was found
		false - it wasn't

	Example:
		>["a","b","c"].test("a"); // true
		>["a","b","c"].test("d"); // false
	*/

	test: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	/*
	Property: extend
		Extends an array with another

	Arguments:
		newArray - the array to extend ours with

	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.extend(['Lizard']);
		>//Animals is now: ['Cat', 'Dog', 'Coala', 'Lizard'];
	*/

	extend: function(newArray){
		for (var i = 0; i < newArray.length; i++) this.push(newArray[i]);
		return this;
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
		var Speeches = Animals.associate(speech);
		//Speeches['Miao'] is now Cat.
		//Speeches['Bau'] is now Dog.
		//...
		(end)
	*/

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	}

});

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

function $A(array, start, length){
	return Array.prototype.copy.call(array, start, length);
};

/*
Function: $each
	use to iterate through iterables that are not regular arrays, such as builtin getElementsByTagName calls, or arguments of a function.

Arguments:
	iterable - an iterable element.
	function - function to apply to the iterable.
	bind - optional, the 'this' of the function will refer to this object.
*/

function $each(iterable, fn, bind){
	return Array.prototype.forEach.call(iterable, fn, bind);
};