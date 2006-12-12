/*
Script: Array.js
	Contains Array prototypes and the function <$A>;

Dependencies:
	<Moo.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

if (!Array.prototype.forEach){
	
	/*	
	Mehod: forEach
		Iterates through an array; note: <Array.each> is the preferred syntax for this funciton.
		
	Arguments:
		fn - the function to execute with each item in the array
		bind - optional, the object that the "this" of the function will refer to.
		
	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.forEach(function(animal){
		>	document.write(animal)
		>});

	See also:
		<Function.bind>
		<Array.each>
	*/
	
	Array.prototype.forEach = function(fn, bind){
		for(var i = 0; i < this.length ; i++) fn.call(bind, this[i], i);
	};
}

Array.extend({
	
	/*
	Property: each
		Same as <Array.each>.
	*/
	
	each: Array.prototype.forEach,
	
	/*	
	Property: copy
		Copy the array and returns it.
	
	Returns:
		an Array
			
	Example:
		>var letters = ["a","b","c"];
		>var copy = ["a","b","c"].copy();
	*/
	
	copy: function(){
		var newArray = [];
		for (var i = 0; i < this.length; i++) newArray.push(this[i]);
		return newArray;
	},
	
	/*	
	Property: remove
		Removes an item from the array.
		
	Arguments:
		item - the item to remove
		
	Returns:
		the Array without the item removed.
		
	Example:
		>["1","2","3"].remove("2") // ["1","3"];
	*/
	
	remove: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) this.splice(i, 1);
		}
		return this;
	},
	
	/*	
	Property: test
		Tests an array for the presence of an item.
		
	Arguments:
		item - the item to search for in the array.
		
	Returns:
		true - the item was found
		false - it wasn't
		
	Example:
		>["a","b","c"].test("a"); // true
		>["a","b","c"].test("d"); // false
	*/
	
	test: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) return true;
		};
		return false;
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
		Creates an associative array based on the array of keywords passed in.
		
	Arguments:
		keys - the array of keywords.
		
	Example:
		(sart code)
		var Animals = ['Cat', 'Dog', 'Coala', 'Lizard'];
		var Speech = ['Miao', 'Bau', 'Fruuu', 'Mute'];
		var Speeches = Animals.associate(speech);
		//Speeches['Miao'] is now Cat.
		//Speeches['Bau'] is now Dog.
		//...
		(end)
	*/
	
	associate: function(keys){
		var newArray = [];
		for (var i =0; i < this.length; i++) newArray[keys[i]] = this[i];
		return newArray;
	}

});

/* Section: Utility Functions  */

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