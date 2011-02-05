/*
---
name: Object
description: Object generics
requires: Type
provides: Object
...
*/

Object.extend({
	
	getLength: function(object){
		var length = 0;
		for (var key in object) length++;
		return length;
	},
	
	from: function(keys, values){
		var object = {};
		for (var i = 0; i < keys.length; i++){
			var value = values[i];
			object[keys[i]] = (value != null) ? value : null;
		}
		return object;
	},
	
	append: function(original){
		for (var i = 1; i < arguments.length; i++){
			var extended = arguments[i] || {};
			for (var key in extended) original[key] = extended[key];
		}
		return original;
	},
	
	subset: function(object, keys){
		var results = {};
		for (var i = 0, l = keys.length; i < l; i++){
			var k = keys[i], value = object[k];
			results[k] = (value != null) ? value : null;
		}
		return results;
	},
	
	map: function(object, fn, bind){
		var results = {};
		for (var key in object) results[key] = fn.call(bind, object[key], key, object);
		return results;
	},
	
	filter: function(object, fn, bind){
		var results = {};
		for (var key in object){
			if (fn.call(bind, object[key], key, object)) results[key] = object[key];
		}
		return results;
	},
	
	every: function(object, fn, bind){
		for (var key in object){
			if (!fn.call(bind, object[key], key)) return false;
		}
		return true;
	},
	
	some: function(object, fn, bind){
		for (var key in object){
			if (fn.call(bind, object[key], key)) return true;
		}
		return false;
	},
	
	keys: function(object){
		var keys = [];
		for (var key in object) keys.push(key);
		return keys;
	},
	
	values: function(object){
		var values = [];
		for (var key in object) values.push(object[key]);
		return values;
	}
	
});
