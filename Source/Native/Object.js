/*
Script: Object.js
	Contains Object generics.

License:
	MIT-style license.
*/

Object.extend({
	
	from: function(keys, values){
		keys = Array.from(keys);
		values = Array.from(values);
		var object = {};
		for (var i = 0; i < keys.length; i++) object[keys[i]] = Object.pick(values[i]);
		return object;
	},
	
	append: function(original, extended){
		for (var key in (extended || {})) original[key] = extended[key];
		return original;
	},
	
	beget: function(object){
		var F = function(){};
		F.prototype = object;
		return new F;
	},
	
	clone: function(object){
		return Object.mixin(Type.isEnumerable(object) ? [] : {}, object);
	},
	
	mixin: function(source){
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			((Type.isEnumerable(object)) ? Array : Object).forEach(object, function(value, key){
				var previous = source[key], type = typeOf(value);
				
				if (type=='array' || type=='object'){
					if (instanceOf(previous, Object)) Object.mixin(previous, value);
					else source[key] = Object.clone(value);
				} else {
					source[key] = value;
				}
			});
		}
		return source;
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
