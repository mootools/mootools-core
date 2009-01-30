/*
Script: Object.js
	Contains Object generics.

License:
	MIT-style license.
*/

Object.extend({
	
	beget: function(object){
		var F = function(){};
		F.prototype = object;
		var instance = new F;
		Object.reset(instance);
		return instance;
	},
	
	reset: function(object, key){
		if (key == undefined){
			for (var p in object) Object.reset(object, p);
			return;
		}
		delete object[key];
		switch (typeOf(object[key])){
			case 'object': object[key] = Object.beget(object[key]); break;
			case 'array': object[key] = Array.clone(object[key]); break;
		}
	},
	
	merge: function(){
		var args = Array.from(arguments);
		args.unshift({});
		return Object.mixin.apply(null, args);
	},
	
	mixin: function(source){
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object){
				var ok = object[key], sk = source[key];
				if (typeOf(ok) == 'object'){
					if (typeOf(sk) == 'object') Object.mixin(sk, ok);
					else source[key] = Object.clone(ok);
				} else {
					source[key] = clone(ok);
				}
			}
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
	
	getKeys: function(object){
		var keys = [];
		for (var key in object) keys.push(key);
		return keys;
	},

	getValues: function(object){
		var values = [];
		for (var key in object) values.push(object[key]);
		return values;
	},
	
	toQueryString: function(object, base){
		var queryString = [];
		for (var key in object){
			var value = object[key];
			if (base) key = base + '[' + key + ']';
			var result;
			switch (typeOf(value)){
				case 'object': result = Object.toQueryString(value, key); break;
				case 'array':
					var qs = {};
					Array.each(value, function(val, i){
						qs[i] = val;
					});
					result = Object.toQueryString(qs, key);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != undefined) queryString.push(result);
		}

		return queryString.join('&');
	}
	
});