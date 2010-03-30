/*
---
name: Core
description: The heart of MooTools.
provides: [Core, MooTools, Type, typeOf, instanceOf]
...
*/

(function(){

this.MooTools = {
	version: '1.99dev',
	build: '%build%'
};

// nil

this.nil = function(item){
	return (item != null && item != nil) ? item : null;
};

Function.prototype.overloadSetter = function(usePlural){
	var self = this;
	return function(a, b){
		if (usePlural || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
		} else {
			self.call(this, a, b);
		}
		return this;
	};
};

Function.prototype.overloadGetter = function(usePlural){
	var self = this;
	return function(a){
		var args, result;
		if (usePlural || typeof a != 'string') args = a;
		else if (arguments.length > 1) args = arguments;
		if (args){
			result = {};
			for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
		} else {
			result = self.call(this, a);
		}
		return result;
	};
};

Function.prototype.extend = function(key, value){
	this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
	this.prototype[key] = value;
}.overloadSetter();

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$typeOf) return item.$typeOf();
	
	if (item.nodeName){
		if (item.nodeType == 1) return 'element';
		if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length == 'number'){
		if (item.callee) return 'arguments';
		if ('item' in item) return 'collection';
	}

	return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.$constructor || item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	return item instanceof object;
};

// From

Function.from = function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
};

Array.from = function(item){
	if (item == null) return [];
	return (Type.isEnumerable(item)) ? (typeOf(item) == 'array') ? item : Array.prototype.slice.call(item) : [item];
};

Number.from = function(item){
	var number = parseFloat(item);
	return isFinite(number) ? number : null;
};

String.from = function(item){
	return item + '';
};

// hide, protect

Function.implement({
	
	hide: function(){
		this.$hidden = true;
		return this;
	},

	protect: function(){
		this.$protected = true;
		return this;
	}
	
});

// Type

var Type = this.Type = function(name, object){
	
	var lower = (name || '').toLowerCase();
	
	if (name) Type['is' + name] = function(item){
		return (typeOf(item) == lower);
	};
	
	if (object == null) return null;
	
	if (name){
		object.prototype.$typeOf = function(){
			return lower;
		}.hide();
		object.$name = lower;
	}

	object.extend(this);
	object.$constructor = Type;
	object.prototype.$constructor = object;
	
	return object;
};

Type.isEnumerable = function(item){
	return (typeof item == 'object' && typeof item.length == 'number');
};

var hooks = {};

var hooksOf = function(object){
	var type = typeOf(object.prototype);
	return hooks[type] || (hooks[type] = []);
};

var implement = function(name, method){
	if (method && method.$hidden) return this;
	
	var hooks = hooksOf(this);
	
	for (var i = 0; i < hooks.length; i++){
		var hook = hooks[i];
		if (typeOf(hook) == 'type') implement.call(hook, name, method);
		else hook.call(this, name, method);
	}

	var previous = this.prototype[name];
	if (previous == null || !previous.$protected) this.prototype[name] = method;
	
	if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
		return method.apply(item, Array.prototype.slice.call(arguments, 1));
	});
	
	return this;
};

var extend = function(name, method){
	if (method && method.$hidden) return this;
	var previous = this[name];
	if (previous == null || !previous.$protected) this[name] = method;
	return this;
};

Type.implement({
	
	implement: implement.overloadSetter(),
	
	extend: extend.overloadSetter(),

	alias: function(key, value){
		implement.call(this, key, this.prototype[value]);
	}.overloadSetter(),

	mirror: function(hook){
		hooksOf(this).push(hook);
		return this;
	}
	
});

new Type('Type', Type);

// Default Types

var force = function(type, methods){
	var object = new Type(type, this[type]);
	
	var prototype = object.prototype;
	
	for (var i = 0, l = methods.length; i < l; i++){
		var name = methods[i];
		
		var generic = object[name];
		if (generic) generic.protect();
		
		var proto = prototype[name];
		if (proto){
			delete prototype[name];
			prototype[name] = proto.protect();
		}
	}
	
	return object.implement(object.prototype);
};

force('String', [
	'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
]);

force('Array', [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
]);

force('Number', ['toExponential', 'toFixed', 'toLocaleString', 'toPrecision']);

force('Function', ['apply', 'call']);

force('RegExp', ['exec', 'test']);

force('Date', ['now']);

Date.extend('now', function(){
	return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$typeOf = function(){
	return (isFinite(this)) ? 'number' : 'null';
}.hide();

// forEach, each

Object.extend('forEach', function(object, fn, bind){
	for (var key in object) fn.call(bind, object[key], key, object);
});

Object.each = Object.forEach;

Array.implement({
	
	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(bind, this[i], i, this);
		}
	},
	
	each: function(fn, bind){
		this.forEach(fn, bind);
		return this;
	}
	
});

// Array & Object cloning

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var i = this.length, clone = new Array(i);
	while (i--) clone[i] = cloneOf(this[i]);
	return clone;
});

Object.extend('clone', function(object){
	var clone = {};
	for (var key in object) clone[key] = cloneOf(object[key]);
	return clone;
});

// Object merging

var mergeOne = function(source, key, current){
	switch (typeOf(current)){
		case 'object':
			if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
			else source[key] = Object.clone(current);
		break;
		case 'array': source[key] = current.clone(); break;
		default: source[key] = current;
	}
	return source;
};

Object.extend('merge', function(source, k, v){
	if (typeof k == 'string') return mergeOne(source, k, v);
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		for (var key in object) mergeOne(source, key, object[key]);
	}
	return source;
});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	Type(name);
});

})();
