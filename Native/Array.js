/*
Script: Array.js
	Contains Array prototypes and the function <$A>;

Authors:
	Valerio Proietti, <http://mad4milk.net>
	Michael Jackson, <http://ajaxon.com/michael>

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

Array.extend({

	//emulated methods

	/*
	Property: forEach
		Iterates through an array; This method is only available for browsers without native *forEach* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach>
	*/
	
	forEach: Array.prototype.forEach || function(fn, bind){
		for (var i = 0; i < this.length; i++) fn.call(bind, this[i], i, this);
	},
	
	/*
	Property: map
		This method is provided only for browsers without native *map* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>
	*/
	
	map: Array.prototype.map || function(fn, bind){
		var results = [];
		for (var i = 0; i < this.length; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},
	
	/*
	Property: every
		This method is provided only for browsers without native *every* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>
	*/
	
	every: Array.prototype.every || function(fn, bind){
		for (var i = 0; i < this.length; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},
	
	/*
	Property: some
		This method is provided only for browsers without native *some* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>
	*/
	
	some: Array.prototype.some || function(fn, bind){
		for (var i = 0; i < this.length; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	
	/*
	Property: indexOf
		This method is provided only for browsers without native *indexOf* support.
		For more info see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>
	*/
	
	indexOf: Array.prototype.indexOf || function(item, from){
		from = from || 0;
		if (from < 0) from = Math.max(0, this.length + from);
		while (from < this.length){
			if(this[from] === item) return from;
			from++;
		}
		return -1;
	},
	
	//custom methods

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
	Property: select
		Returns a new array containing all items of the original array on which the iterator function returns true.

	Arguments:
		iterator - a function that is used to determine which items will be selected
	
	Returns:
		an Array

	Example:
		>var letters = ["a","b","c","d","c"];
		>var countCs = letters.select(function(item, index, array){
		>	return item == 'c';
		>}); // ["c","c"]
	*/
	
	select: function(iterator){
		var array = [];
		this.forEach(function(item, index){
			if (iterator(item, index, array)) array.push(item);
		});
		return array;
	},

	/*
	Property: copy
		Returns a copy of the array.

	Returns:
		an Array

	Example:
		>var letters = ["a","b","c"];
		>var copy = ["a","b","c"].copy();
	*/

	copy: function(){
		return this.select(function(){
			return true;
		});
	},

	/*
	Property: remove
		Removes all occurrences of an item (or an array of items) from the array.

	Arguments:
		items - the item (or array of items) to remove

	Returns:
		the Array with all occurrences of the item(s) removed

	Example:
		>["1","2","3","2"].remove("2") // ["1","3"]
		>["1","2","3","2"].remove(["1","2"]) // ["3"]
	*/

	remove: function(items){
		items = items.push ? items : [items];
		var i = 0;
		while (i < this.length){
			if (items.test(this[i])) this.splice(i, 1);
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
		Extends an array with another.

	Arguments:
		newArray - the array of items to add to the original array

	Example:
		>var Animals = ['Cat', 'Dog', 'Koala'];
		>Animals.extend(['Lizard']);
		>//Animals is now: ['Cat', 'Dog', 'Koala', 'Lizard'];
	*/

	extend: function(newArray){
		for (var i = 0; i < newArray.length; i++) this.push(newArray[i]);
		return this;
	},

	/*
	Property: associate
		Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.

	Arguments:
		keys - the array of keywords

	Example:
		>var Animals = ['Cat', 'Dog', 'Koala', 'Lizard'];
		>var Speech = ['Meow', 'Bau', 'Fruuu', 'Mute'];
		>var Speeches = Animals.associate(speech);
		>//Speeches['Meow'] is now Cat.
		>//Speeches['Bau'] is now Dog.
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
	>function myFunction(){
	>	$A(arguments).each(argument, function(){
	>		alert(argument);
	>	});
	>};
	>//the above will alert all the arguments passed to the function myFunction.
*/

function $A(array){
	return Array.prototype.copy.call(array);
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