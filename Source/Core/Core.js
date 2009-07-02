/*=
name: Core
description: The heart of MooTools.
credits:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/)
		Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org)
		Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)
=*/

(function(){

this.MooTools = {
	version: '1.99dev',
	build: '%build%'
};

// nil

this.nil = function(item){
	return (item != null && item != nil) ? item : null;
};

var Function = this.Function;

Function.prototype.overload = function(type){
	var self = this;
	return function(){
		return self.apply(this, type.apply(this, arguments));
	};
};

Function.overloadPair = function(k, v){
	if (typeof k == 'string'){
		var copy = {}; copy[k] = v;
		return [copy];
	}
	return arguments;
};

Function.overloadList = function(x){
	return (typeof x == 'string') ? arguments : x;
};

Function.prototype.extend = (function(object){
	for (var key in object) this[key] = object[key];
	return this;
}).overload(Function.overloadPair);

Function.prototype.implement = (function(object){
	for (var key in object) this.prototype[key] = object[key];
	return this;
}).overload(Function.overloadPair);

// typeOf, instanceOf

this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$typeOf) return item.$typeOf();
	
	if (item.nodeName){
		switch (item.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof item.length == 'number'){
		if (item.callee) return 'arguments';
		else if (item.item) return 'collection';
	}

	return typeof item;
};

this.instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.constructor;
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

Array.from = function(item, slice){
	return (item == null) ? [] : (Type.isEnumerable(item)) ? Array.prototype.slice.call(item, slice || 0) : [item];
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
	
	if (name) object.prototype.$typeOf = Function.from(lower).hide();
	object.extend(this);
	object.constructor = Type;
	object.prototype.constructor = object;
	
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

	if (typeOf(method) == 'function' && this[name] == null) extend.call(this, name, function(item){
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
	
	implement: (function(object){
		for (var key in object) implement.call(this, key, object[key]);
		return this;
	}).overload(Function.overloadPair),
	
	extend: (function(object){
		for (var key in object) extend.call(this, key, object[key]);
		return this;
	}).overload(Function.overloadPair),

	alias: (function(object){
		for (var key in object) implement.call(this, key, this.prototype[object[key]]);
		return this;
	}).overload(Function.overloadPair),

	mirror: function(hook){
		hooksOf(this).push(hook);
		return this;
	}
	
});

new Type('Type', Type);

// Default Types

var force = function(type, methods){
	var object = this[type];
	for (var i = 0; i < methods.length; i++){
		var name = methods[i];
		var proto = object.prototype[name];
		var generic = object[name];
		if (generic) generic.protect();
		
		if (proto){
			proto.protect();
			delete object.prototype[name];
			object.prototype[name] = proto;
		}

	}
	(new Type(type, object)).implement(object.prototype);
};

force('Array', [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
]);

force('String', [
	'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
]);

force('Number', ['toExponential', 'toFixed', 'toLocaleString', 'toPrecision']);

force('Function', ['apply', 'call']);

force('RegExp', ['exec', 'test']);

force('Date', ['now']);

new Type('Date', Date).extend('now', function(){
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

Array.implement('forEach', function(fn, bind){
	for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
});

Array.alias('each', 'forEach');

// Array & Object cloning

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var clone = [];
	for (var i = 0; i < this.length; i++) clone[i] = cloneOf(this[i]);
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
