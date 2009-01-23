/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2008 [Valerio Proietti](http://mad4milk.net/).

Code & Documentation:
	[The MooTools production team](http://mootools.net/developers/).

Inspiration:
	- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/)
		Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
	- Some functionality inspired by [Prototype.js](http://prototypejs.org)
		Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
*/

var MooTools = {
	'version': '1.2.1',
	'build': '%build%'
};

var Native = function(options){
	options = options || {};
	var name = options.name;
	var legacy = options.legacy;
	var protect = options.protect;
	var generics = options.generics;
	var initialize = options.initialize;
	var object = initialize || legacy;
	generics = generics !== false;

	object.constructor = Native;
	object.$family = {name: 'native'};
	
	for (var k in this) object[k] = this[k];
	
	if (legacy && initialize) object.prototype = legacy.prototype;
	object.prototype.constructor = object;

	if (name){
		var family = name.toLowerCase();
		object.prototype.$family = {name: family};
		Native.typize(object, family);
	}

	var add = function(name, method, force){
		if (!protect || force || !object.prototype[name]) object.prototype[name] = method;
		if (generics) Native.genericize(object, name, protect);
		object.fireObjectEvent('afterImplement', [name, method]);
		return object;
	};

	object.alias = function(a1, a2, a3){
		if (typeof a1 == 'string'){
			if ((a1 = this.prototype[a1])) return add(a2, a1, a3);
		}
		for (var a in a1) this.alias(a, a1[a], a2);
		return this;
	};

	object.implement = function(a1, a2, a3){
		if (typeof a1 == 'string') return add(a1, a2, a3);
		for (var p in a1) add(p, a1[p], a2);
		return this;
	};

	return object;
};

Native.prototype = {
	
	addObjectEvent: function(name, method){
		if (!this.events) this.events = {};
		if (!this.events[name]) this.events[name] = [];
		var events = this.events[name], found = false;
		for (var i = 0, l = events.length; i < l; i++){
			if (events[i] !== method) continue;
			found = true;
			break;
		}
		if (!found) events.push(method);
		return this;
	},
	
	removeObjectEvent: function(name, method){
		if (!this.events || !this.events[name]) return this;
		var events = this.events[name];
		for (var i = 0, l = events.length; i < l; i++){
			if (events[i] === item) events.splice(i, 1);
		}
		return this;
	},
	
	fireObjectEvent: function(name, args){
		if (!this.events || !this.events[name]) return this;
		var events = this.events[name];
		for (var i = 0, l = events.length; i < l; i++){
			events[i].apply(this, Object.splat(args));
		}
		return this;
	}
	
};

Native.genericize = function(object, property, check){
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') object[property] = function(){
		var args = Array.prototype.slice.call(arguments);
		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.implement = function(objects, properties){
	for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

Native.typize = function(object, family){
	if (!object.type) object.type = function(item){
		return ($type(item) === family);
	};
};

(function(){
	
	var natives = {'Array': Array, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String};
	for (var n in natives) new Native({name: n, initialize: natives[n], protect: true});

	var types = {'boolean': Boolean, 'native': Native, 'object': Object};
	for (var t in types) Native.typize(types[t], t);

	var generics = {
		'Array': [
			"concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse",
			"shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"
		],
		'String': [
			"charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace",
			"search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"
		]
	};
	
	for (var g in generics){
		for (var i = generics[g].length; i--;) Native.genericize(window[g], generics[g][i], true);
	}
	
})();

Array.create = function(iterable){
	if (iterable.item){
		var array = [];
		for (var i = 0, l = iterable.length; i < l; i++) array[i] = iterable[i];
		return array;
	}
	return Array.prototype.slice.call(iterable);
};

Function.args = function(i){
	return function(){
		return arguments[i];
	};
};

Object.check = function(object){
	return !!(object || object === 0);
};

Object.defined = function(obj){
	return (obj != undefined);
};

Object.each = function(iterable, fn, bind){
	var type = $type(iterable);
	if (type == 'arguments' || type == 'collection' || type == 'array'){
		for (var i = 0, l = iterable.length; i < l; i++) fn.call(bind, iterable[i], i, iterable);
	} else {
		for (var p in iterable){
			if (iterable.hasOwnProperty(p)) fn.call(bind, iterable[p], p, iterable);
		}
	}
};

Function.empty = function(){};

Object.extend = function(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
	return original;
};

Function.lambda = function(value){
	return (typeof value == 'function') ? value : function(){
		return value;
	};
};

Object.merge = function(){
	var mix = {};
	for (var i = 0, l = arguments.length; i < l; i++){
		var object = arguments[i];
		if ($type(object) != 'object') continue;
		for (var key in object){
			var op = object[key], mp = mix[key];
			mix[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? Object.merge(mp, op) : Object.unlink(op);
		}
	}
	return mix;
};

Object.pick = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != undefined) return arguments[i];
	}
	return null;
};

Number.random = function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Object.splat = function(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

if (!Date.now) Date.now = function(){
	return new Date;
};

Function.stab = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

function $type(obj){
	if (obj == undefined) return false;
	if (obj.$family) return (obj.$family.name == 'number' && !isFinite(obj)) ? false : obj.$family.name;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.callee) return 'arguments';
		else if (obj.item) return 'collection';
	}
	return typeof obj;
};

Object.toQueryString = function(object, base){
	var queryString = [];
	for (var key in object){
		var value = object[key];
		if (base) key = base + '[' + key + ']';
		var result;
		switch ($type(value)){
			case 'object': result = Object.toQueryString(value, key); break;
			case 'array':
				var qs = {};
				value.each(function(val, i){
					qs[i] = val;
				});
				result = Object.toQueryString(qs, key);
			break;
			default: result = key + '=' + encodeURIComponent(value);
		}
		if (value != undefined) queryString.push(result);
	}

	return queryString.join('&');
};

Object.unlink = function(object){
	var unlinked;
	switch ($type(object)){
		case 'object':
			unlinked = {};
			for (var p in object) unlinked[p] = Object.unlink(object[p]);
		break;
		case 'array':
			unlinked = [];
			for (var i = 0, l = object.length; i < l; i++) unlinked[i] = Object.unlink(object[i]);
		break;
		default: return object;
	}
	return unlinked;
};
