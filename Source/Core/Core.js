/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2008 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf]

...
*/

(function(){

this.MooTools = {
	version: '1.3dev',
	build: '%build%'
};

// nil

this.nil = function(item){
	return (item != null && item != nil) ? item : null;
};

var Function = this.Function;

Function.prototype.extend = function(object){
	for (var key in object) this[key] = object[key];
	return this;
};

Function.prototype.implement = function(object){
	for (var key in object) this.prototype[key] = object[key];
	return this;
};

// typeOf, instanceOf

this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$family) return item.$family();
	
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

Array.from = function(item){
	return (item == null) ? [] : (Type.isEnumerable(item)) ? Array.prototype.slice.call(item) : [item];
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
	
	if (name){
		var typeCheck = function(item){
			return (typeOf(item) == lower);
		};
		
		Type['is' + name] = typeCheck;
		/*<block name="compatibility" version="1.2">*/
		if (object) object.type = typeCheck;
		/*</block>*/
	}

	if (object == null) return null;
	
	if (name) object.prototype.$family = Function.from(lower).hide();
	object.extend(this);
	object.constructor = Type;
	object.prototype.constructor = object;
	
	return object;
};

Type.isEnumerable = function(item){
	return (typeof item == 'object' && typeof item.length == 'number');
};

var hooks = this.hooks = {};

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
	
	implement: function(a){
		for (var key in a) implement.call(this, key, a[key]);
		return this;
	},
	
	extend: function(object){
		for (var key in object) extend.call(this, key, object[key]);
		return this;
	},

	alias: function(object){
		for (var key in object) implement.call(this, key, this.prototype[object[key]]);
		return this;
	},

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

Date.extend({now: function(){
	return +(new Date);
}});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
	return (isFinite(this)) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend({random: function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}});

// forEach, each

Object.extend({forEach: function(object, fn, bind){
	for (var key in object) fn.call(bind, object[key], key, object);
}});

Object.each = Object.forEach;

Array.implement({forEach: function(fn, bind){
	for (var i = 0, l = this.length; i < l; i++){
		if (i in this) fn.call(bind, this[i], i, this);
	}
}});

Array.each = Array.forEach;
Array.prototype.each = Array.prototype.forEach;

// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement({clone: function(){
	var clone = [];
	for (var i = 0; i < this.length; i++) clone[i] = cloneOf(this[i]);
	return clone;
}});

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

Object.extend({
	
	merge: function(source, k, v){
		if (typeof k == 'string') return mergeOne(source, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) mergeOne(source, key, object[key]);
		}
		return source;
	},
	
	clone: function(object){
		var clone = {};
		for (var key in object) clone[key] = cloneOf(object[key]);
		return clone;
	},
	
	append: function(original){
		for (var i = 1, l = arguments.length; i < l; i++){
			var extended = arguments[i] || {};
			for (var key in extended) original[key] = extended[key];
		}
		return original;
	}
	
});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	Type(name);
});

})();

/*<block name="compatibility" version="1.2">*/

Object.type = Type.isObject;

var Native = function(properties){
	return new Type(properties.name, properties.initialize);
};

Native.implement = function(objects, methods){
	for (var i = 0; i < objects.length; i++) objects[i].implement(methods);
	return Native;
};

var Hash = new Type('Hash', function(object){
	if (typeOf(object) == 'hash') object = $unlink(object.getClean());
	for (var key in object) this[key] = object[key];
	return this;
});

Hash.implement({

	forEach: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key)) fn.call(bind, this[key], key, this);
		}
	},

	getClean: function(){
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	},

	getLength: function(){
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	}

});

Hash.alias({each: 'forEach'});

var $A = Array.from;

var $arguments = function(i){
	return function(){
		return arguments[i];
	};
};

var $chk = function(obj){
	return !!(obj || obj === 0);
};

var $clear = function(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

var $defined = function(obj){
	return (obj != null);
};

var $each = function(iterable, fn, bind){
	var type = typeOf(iterable);
	((type == 'arguments' || type == 'collection' || type == 'array') ? Array : Hash).each(iterable, fn, bind);
};

var $empty = function(){};

var $extend = function(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
	return original;
};

var $H = function(object){
	return new Hash(object);
};

var $lambda = Function.from;

var $merge = function(){
	var args = Array.slice(arguments);
	args.unshift({});
	return Object.merge.apply(null, args);
};

var $mixin = Object.merge;

var $random = Number.random;

var $splat = Array.from;

var $time = Date.now;

var $type = function(object){
	var type = typeOf(object);
	return (type == 'null') ? false : type;
};

var $unlink = function(object){
	switch (typeOf(object)){
		case 'object': return Object.clone(object);
		case 'array': return Array.clone(object);
		case 'hash': return new Hash(object);
		default: return object;
	}
};

/*</block>*/
