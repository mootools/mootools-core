/*
Script: Hash.js
	Contains the class Hash.

Author:
	Christophe Beyls, <http://digitalia.be>

License:
	MIT-style license.
*/

/*
Class: Hash
	It wraps an object that it uses internally as a map. The user must use set(), get(), and remove() to add/change, retrieve and remove values, it must not access the internal object directly. null values are allowed.

Example:
	(start code)
	var hash = new Hash({a: 'hi', b: 'world', c: 'howdy'});
	hash.remove('b'); // b is removed.
	hash.set('c', 'hello');
	hash.get('c'); // returns 'hello'
	hash.length // returns 2 (a and b)
	(end)
*/

var Hash = new Class({

	length: 0,
	
	obj: {},

	initialize: function(obj){
		this.extend(obj);
	},

	/*
	Property: get
		Retrieves a value from the hash.

	Arguments:
		key - The key

	Returns:
		The value
	*/

	get: function(key){
		return this.obj[key];
	},

	/*
	Property: hasKey
		Check the presence of a specified key-value pair in the hash.

	Arguments:
		key - The key

	Returns:
		True if the Hash contains an value for the specified key, otherwise false
	*/

	hasKey: function(key){
		return this.obj[key] !== undefined;
	},

	/*
	Property: set
		Adds a key-value pair to the hash or replaces a previous value associated with the key.

	Arguments:
		key - The key
		value - The value
	*/

	set: function(key, value){
		if (value === undefined) return false;
		if (this.obj[key] === undefined) this.length++;
		this.obj[key] = value;
		return this;
	},

	/*
	Property: remove
		Removes a key-value pair from the hash.

	Arguments:
		key - The key
	*/

	remove: function(key){
		if (this.obj[key] === undefined) return this;
		var obj = {};
		this.length--;
		for (var property in this.obj){
			if (property != key) obj[property] = this.obj[property];
		}
		this.obj = obj;
		return this;
	},

	/*
	Property: each
		Calls a function for each key-value pair. The first argument passed to the function will be the key, the second one will be the value.

	Arguments:
		fn - The function to call for each key-value pair
		bind - Optional, the object that will be referred to as "this" in the function
	*/

	each: function(fn, bind){
		for (var property in this.obj) fn.call(bind || this, property, this.obj[property]);
	},

	/*
	Property: extend
		Extends the current hash with an object containing key-value pairs. Values for duplicate keys will be replaced by the new ones.

	Arguments:
		obj - An object containing key-value pairs
	*/

	extend: function(obj){
		for (var property in obj){
			if (this.obj[property] === undefined) this.length++;
			this.obj[property] = obj[property];
		}
		return this;
	},

	/*
	Property: empty
		Checks if the hash is empty.

	Returns:
		True if the hash is empty, otherwise false
	*/

	empty: function(){
		return (this.length == 0);
	},

	/*
	Property: keys
		Returns an array containing all the keys, in the same order as the values returned by <Hash.values>.

	Returns:
		An array containing all the keys of the hash
	*/

	keys: function(){
		var keys = [];
		for (var property in this.obj) keys.push(property);
		return keys;
	},

	/*
	Property: values
		Returns an array containing all the values, in the same order as the keys returned by <Hash.keys>.

	Returns:
		An array containing all the values of the hash
	*/

	values: function(){
		var values = [];
		for (var property in this.obj) values.push(this.obj[property]);
		return values;
	}

});

/*
Function: $H
	Shortcut to create a Hash from an Object.
*/

function $H(obj){
	return new Hash(obj);
};