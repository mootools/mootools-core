/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2009 [Valerio Proietti](http://mad4milk.net/).

Code & Documentation:
	[The MooTools production team](http://mootools.net/developers/).

Inspiration:
	- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/)
		Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
	- Some functionality inspired by [Prototype.js](http://prototypejs.org)
		Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
*/

var MooTools = {
	'version': '1.3dev',
	'build': '%build%'
};

var clone = function(object){
	switch (typeOf(object)){
		case 'object': return Object.clone(object);
		case 'array': return Array.clone(object);
		default: return object;
	}
};

var check = function(object){
	return !!(object || object === 0);
};

var pick = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != null) return arguments[i];
	}
	return null;
};

Function.prototype.extend = function(generics){
	for (var generic in generics){
		if (!this.__protected__ || !this[generic]) this[generic] = generics[generic];
	}
	return this;
};

Object.__protected__ = Function.__protected__ = Array.__protected__ = true;
String.__protected__ = RegExp.__protected__ = Date.__protected__ = true;

Object.extend({
	
	append: function(original, extended){
		for (var key in (extended || {})) original[key] = extended[key];
		return original;
	},
	
	from: function(keys, values){
		keys = Array.from(keys);
		values = Array.from(values);
		var object = {};
		for (var i = 0; i < keys.length; i++) object[keys[i]] = values[i] || null;
		return object;
	},
	
	forEach: function(object, fn, bind){
		for (var p in object) fn.call(bind, object[p], p, object);
	},
	
	clone: function(object){
		var unlinked = {};
		for (var p in object) unlinked[p] = clone(object[p]);
		return unlinked;
	}
	
});

Object.each = Object.forEach;

Array.extend({
	
	from: function(iterable){
		switch(typeOf(iterable)){
			case 'arguments': case 'collection':
				var array = [];
				for (var i = 0, l = iterable.length; i < l; i++) array[i] = iterable[i];
				return array;
			case 'array': return iterable;
			default: return [iterable];
		}
	},
	
	forEach: function(iterable, fn, bind){
		for (var i = 0, l = iterable.length; i < l; i++) fn.call(bind, iterable[i], i, iterable);
	},
	
	clone: function(object){
		var unlinked = [];
		for (var i = 0, l = object.length; i < l; i++) unlinked[i] = clone(object[i]);
		return unlinked;
	}
	
});

Array.each = Array.forEach;

Function.extend({
	
	from: function(value){
		return (typeOf(value) == 'function') ? value : function(){
			return value;
		};
	},

	empty: function(){},

	stab: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch(e){}
		}
		return null;
	}
	
});

Number.extend({
	
	from: function(object, base){
		return parseInt(object, base || 10);
	},
	
	random: function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	
	__type__: function(){
		return (isFinite(this)) ? 'number' : null;
	}

});

Date.extend({

	now: function(){
		return +(new Date);
	}

});

var Type = function(name, object){
	var lower = name.toLowerCase();
	Type.types[lower] = object;
	Type['is' + name] = function(object){
		return (typeOf(object) == lower);
	};
	if (!object) return;
	if (!object.group) object.group = Type.group(object);
	if (!object.prototype.__type__) object.prototype.__type__ = function(){
		return lower;
	};
};

Type.extend({
	
	types: [],
	
	of: function(object){
		if (object == null) return object;
		if (object.__type__) return object.__type__();
		
		if (object.nodeName){
			switch (object.nodeType){
				case 1: return 'element';
				case 3: return (/\S/).test(object.nodeValue) ? 'textnode' : 'whitespace';
			}
		} else if (typeof object.length == 'number'){
			if (object.callee) return 'arguments';
			else if (object.item) return 'collection';
		}
		
		return typeof object;
	},
	
	group: function(object){
		return function(){
			var single = {}, items = arguments;
			for (var name in object.prototype) (function(name, method){
				single[name] = function(){
					var values = [];
					for (var i = 0, l = items.length; i < l; i ++) values.push(method.apply(items[i], arguments));
					return values;
				};
			})(name, object.prototype[name]);
			return single;
		};
	},
	
	getConstructor: function(object){
		return Type.types[typeOf(object)] || null;
	},
	
	isIterable: function(object){
		var type = typeOf(object);
		return (type == 'array' || type == 'arguments' || type == 'collection');
	},
	
	isDefined: function(object){
		return (object != undefined);
	}
	
});

var typeOf = Type.of;

var Native = function(name, object){
	object.extend(this);
	object.prototype.constructor = object;
	if (name) new Type(name, object);
	return object;
};

Native.prototype = {
	
	constructor: Native,
	
	implement: function(name, method){
		if (typeOf(name) == 'object'){
			for (var key in name) this.implement(key, name[key]);
			return this;
		}

		if (!this.__protected__ || !this.prototype[name]){
			this.prototype[name] = method;
			if (this.__onImplement__) this.__onImplement__(name, method);
		}
		if (typeOf(method) == 'function' && (!this.__protected__ || !this[name])) this[name] = function(){
			var args = Array.from(arguments);
			return method.apply(args.shift(), args);
		};
		
		return this;
	},
	
	alias: function(name, newName){
		return this.implement(newName, this.prototype[name]);
	}
	
};

new Native('Native', Native);

(function(){
	
	var natives = {'Array': Array, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String};
	var types = {'Boolean': Boolean, 'Object': null, 'Collection': null, 'WhiteSpace': null, 'Textnode': null};

	for (var n in natives) new Native(n, natives[n]);

	for (var t in types) new Type(t, types[t]);

	Type.types.object = Object;

	var arrayNames = ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"];
	var arrayPrototypes = [];

	var stringNames = ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"];
	var stringPrototypes = [];

	for (var i = 0; i < arrayNames.length; i++) arrayPrototypes.push(Array.prototype[arrayNames[i]]);

	Array.implement(Object.from(arrayNames, arrayPrototypes));

	for (var j = 0; j < stringNames.length; j++) stringPrototypes.push(String.prototype[stringNames[i]]);

	String.implement(Object.from(stringNames, stringPrototypes));

})();
