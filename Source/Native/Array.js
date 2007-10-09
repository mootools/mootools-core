/*
Script: Array.js
	Contains Array prototypes, <$each>.

License:
	MIT-style license.
*/

/*
Native: Array
	A collection of the Array Object prototype methods.

See Also:
	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array>
*/

Array.implement({

	/*
	Method: every
		Returns true if every element in the array satisfies the provided testing function.

		This method is provided only for browsers without native <Array.every> support.

	Syntax:
		>var allPassed = myArray.every(fn[, bind]);

	Arguments:
		fn   - (function) The function to test for each element.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(item, index, array)

			Arguments:
				item   - (mixed) The current item in the array.
				index  - (number) The current item's index in the array.
				array  - (array) The actual array.

	Returns:
		(boolean) If every element in the array satisfies the provided testing function, returns true. Otherwise, returns false.

	Example:
		[javascript]
			var areAllBigEnough = [10, 4, 25, 100].every(function(item, index){
				return item > 20;
			}); //areAllBigEnough = false
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>
	*/

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	/*
	Method: filter
		Creates a new array with all of the elements of the array for which the provided filtering function returns true.

		This method is provided only for browsers without native <Array.filter> support.

	Syntax:
		>var filteredArray = myArray.filter(fn[, bind]);

	Arguments:
		fn   - (function) The function to test each element of the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(item, index, array)

			Arguments:
				item   - (mixed) The current item in the array.
				index  - (number) The current item's index in the array.
				array  - (array) The actual array.

	Returns:
		(array) The new filtered array.

	Example:
		[javascript]
			var biggerThanTwenty = [10, 3, 25, 100].filter(function(item, index){
				return item > 20;
			}); //biggerThanTwenty = [25, 100]
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter>
	*/

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	/*
	Method: indexOf
		Returns the index of the first element within the array equal to the specified value, or -1 if the value is not found.

		This method is provided only for browsers without native <Array.indexOf> support.

	Syntax:
		>var index = myArray.indexOf(item[, from]);

	Returns:
		(number) The index of the first element within the array equal to the specified value. If not found, returns -1.

	Arguments:
		item - (object) The item to search for in the array.
		from - (number, optional: defaults to 0) The index of the array at which to begin the search.

	Example:
		[javascript]
			['apple', 'lemon', 'banana'].indexOf('lemon'); //returns 1
			['apple', 'lemon'].indexOf('banana'); //returns -1
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>
	*/

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	/*
	Method: map
		Creates a new array with the results of calling a provided function on every element in the array.

		This method is provided only for browsers without native <Array.map> support.

	Syntax:
		>var mappedArray = myArray.map(fn[, bind]);

	Arguments:
		fn   - (function) The function to produce an element of the new Array from an element of the current one.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(item, index, array)

			Arguments:
				item   - (mixed) The current item in the array.
				index  - (number) The current item's index in the array.
				array  - (array) The actual array.

	Returns:
		(array) The new mapped array.

	Example:
		[javascript]
			var timesTwo = [1, 2, 3].map(function(item, index){
				return item * 2;
			}); //timesTwo = [2, 4, 6];
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>
	*/

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},

	/*
	Method: some
		Returns true if at least one element in the array satisfies the provided testing function.

		This method is provided only for browsers without native <Array.some> support.

	Syntax:
		>var somePassed = myArray.some(fn[, bind]);

	Returns:
		(boolean) If at least one element in the array satisfies the provided testing function returns true. Otherwise, returns false.

	Arguments:
		fn   - (function) The function to test for each element. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(item, index, array)

			Arguments:
				item   - (mixed) The current item in the array.
				index  - (number) The current item's index in the array.
				array  - (array) The actual array.

	Example:
		[javascript]
			var isAnyBigEnough = [10, 4, 25, 100].some(function(item, index){
				return item > 20;
			}); //isAnyBigEnough = true
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>
	*/

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/*
	Method: associate
		Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.

	Syntax:
		>var associated = myArray.associate(obj);

	Arguments:
		obj - (array) Its items will be used as the keys of the object that will be created.

	Returns:
		(object) The new associated object.

	Example:
		[javascript]
			var animals = ['Cow', 'Pig', 'Dog', 'Cat'];
			var sounds = ['Moo', 'Oink', 'Woof', 'Miao'];
			animals.associate(sounds);
			//returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}
		[/javascript]
	*/

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	/*
	Method: link
		Accepts an object of key / function pairs to assign values.

	Syntax:
		>var result = Array.link(array, object);

	Arguments:
		object - (object)  An object containing key / function pairs must be passed to be used as a template for associating values with the different keys.

	Returns:
		(object) The new associated object.

	Example:
		[javascript]
			var el = document.createElement('div');
			var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
			arr2.link({myNumber: Number.type, myElement: Element.type, myObject: Object.type, myString: String.type, myBoolean: $defined});
			//returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}
		[/javascript]
	*/

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				result[key] = null;
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	/*
	Method: contains
		Tests an array for the presence of an item.

	Syntax:
		>var inArray = myArray.contains(item[, from]);

	Arguments:
		item - (object) The item to search for in the array.
		from - (number, optional: defaults to 0) The index of the array at which to begin the search.

	Returns:
		(boolean) If the array contains the item specified, returns true. Otherwise, returns false.

	Example:
		[javascript]
			["a","b","c"].contains("a"); //returns true
			["a","b","c"].contains("d"); //returns false
		[/javascript]

	See Also:
		<Array.indexOf>
	*/

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	/*
	Method: extend
		Extends an array with all the items of another.

	Syntax:
		>myArray.extend(array);

	Arguments:
		array - (array) The array whose items should be extended into this array.

	Returns:
		(array) This array, extended.

	Example:
		[javascript]
			var animals = ['Cow', 'Pig', 'Dog'];
			animals.extend(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat', 'Dog'];
		[/javascript]
	*/

	extend: function(array){
		for (var i = 0, j = array.length; i < j; i++) this.push(array[i]);
		return this;
	},

	/*
	Method: getLast
		Returns the last item from the array.

	Syntax:
		>myArray.getLast();

	Returns:
		(mixed) The last item in this array. If this array is empty, returns null.

	Example:
		[javascript]
			['Cow', 'Pig', 'Dog', 'Cat'].getLast(); //returns 'Cat'
		[/javascript]
	*/

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	/*
	Method: getRandom
		Returns a random item from the array.

	Syntax:
		>myArray.getRandom();

	Returns:
		(mixed) A random item from this array. If this array is empty, returns null.

	Example:
		[javascript]
			['Cow', 'Pig', 'Dog', 'Cat'].getRandom(); //returns one of the items
		[/javascript]
	*/

	getRandom: function(){
		return (this.length) ? this[$random(0, this.length - 1)] : null;
	},

	/*
	Method: include
		Pushes the passed element into the array if it's not already present (case and type sensitive).

	Syntax:
		>myArray.include(item);

	Arguments:
		item - (object) The item that should be added to this array.

	Returns:
		(array) This array with the new item included.

	Example:
		[javascript]
			['Cow', 'Pig', 'Dog'].include('Cat'); //returns ['Cow', 'Pig', 'Dog', 'Cat']
			['Cow', 'Pig', 'Dog'].include('Dog'); //returns ['Cow', 'Pig', 'Dog']
		[/javascript]
	*/

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	/*
	Method: merge
		Merges an array with all the items of another. Does not allow duplicates and is case and type sensitive.

	Syntax:
		>myArray.merge(array);

	Arguments:
		array - (array) The array whose items should be merged into this array.

	Returns:
		(array) This array merged with the new items.

	Example:
		[javascript]
			var animals = ['Cow', 'Pig', 'Dog'];
			animals.merge(['Cat', 'Dog']); //animals = ['Cow', 'Pig', 'Dog', 'Cat'];
		[/javascript]
	*/

	merge: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	/*
	Method: remove
		Removes all occurrences of an item from the array.

	Syntax:
		>myArray.remove(item);

	Arguments:
		item - (object) The item to search for in the array.

	Returns:
		(array) This array with all occurrences of the item removed.

	Example:
		[javascript]
			['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].remove('Dog') //returns ['Cow', 'Pig', 'Cat']
			['Cow', 'Pig', 'Dog'].remove('Cat') //returns ['Cow', 'Pig', 'Dog']
		[/javascript]
	*/

	remove: function(item){
		for (var i = this.length; i--; i){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	/*
	Method: empty
		Empties an array.

	Syntax:
		>myArray.empty();

	Returns:
		(array) This array, emptied.

	Example:
		[javascript]
			var myArray = ['old', 'data'];
			myArray.empty(); //myArray is now []
		[/javascript]
	*/

	empty: function(){
		this.length = 0;
		return this;
	},
	
	
	/*
	Method: flatten
		Flattens a multidimensional array into a single array.

	Syntax:
		>myArray.flatten();

	Returns:
		(array) A new flat array.

	Example:
		[javascript]
			var myArray = [1,2,3,[4,5, [6,7]], [[[8]]]];
			varnewArray = myArray.flatten(); //newArray is [1,2,3,4,5,6,7,8]
		[/javascript]
	*/

	
	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = $type(this[i]);
			if (!type) continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments') ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	}

});