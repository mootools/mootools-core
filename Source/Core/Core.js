/*
                                   ._                  ._  1.99dev
          .____ ___    .__    .__ /\ \________    .__ /\ \    .___
         /\  __` __`\ / __`\ / __`\ \ ,___  __`\ / __`\ \ \  /',__\
         \ \ \/\ \/\ \\ \Z\ \\ \Z\ \ \ \_ \ \Z\ \\ \Z\ \ \ \_\__, `\
          \ \_\ \_\ \_\\____/ \____/\ \__\ \____/ \____/\ \________/
           \/_/\/_/\/_//___/ \/___/  \/__/\/___/ \/___/  \/_______/
                                           the javascript framework
*/

/*
---
name: Core
description: The heart of MooTools.
provides: [MooTools, Type, typeOf, instanceOf, uniqueID]
...
*/

(function(){

this.MooTools = {
	version: '1.99dev',
	build: '%build%'
};

// slicing is good for you

var slice = Array.prototype.slice;

var Function = this.Function;

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.prototype.overloadSetter = function(usePlural){
	var self = this;
	return function(a, b){
		if (usePlural || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
			if (enumerables) for (var i = enumerables.length; i--;){
				k = enumerables[i];
				if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
			}
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
	if (item.$family) return item.$family();
	
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
	if (object == null) return constructor;
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
	return (Type.isEnumerable(item)) ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
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
		object.prototype.$family = function(){
			return lower;
		}.hide();
	}

	object.extend(this);
	object.$constructor = Type;
	object.prototype.$constructor = object.hide();
	
	return object;

}.hide();

Type.isEnumerable = function(item){
	return (typeof item == 'object' && typeof item.length == 'number');
};

var extend = function(name, method){
	if (method && method.$hidden) return this;
	
	var previous = this[name];
	if (previous == null || !previous.$protected) this[name] = method;

	return this;
};

var implement = function(name, method){
	if (method && method.$hidden) return this;

	var previous = this.prototype[name];
	if (previous == null || !previous.$protected) this.prototype[name] = method;
	
	if (this[name] == null && typeof method == 'function') extend.call(this, name, function(item){
		return method.apply(item, slice.call(arguments, 1));
	});
	
	return this;
};

Type.implement({
	
	implement: implement.overloadSetter(),
	
	extend: extend.overloadSetter(),

	alias: function(key, value){
		implement.call(this, key, this.prototype[value]);
	}.overloadSetter()
	
});

new Type('Type', Type);

// Protect Types

var protect = function(type, methods){
	var object = new Type(type, this[type]);
	var generics = {};

	for (var i = 0, l = methods.length; i < l; i++){
		var name = methods[i], generic = object[name], proto = object.prototype[name];
		if (!proto) continue;
		proto.protect();
		if (!generic) generics[name] = proto;
		else generic.protect();
	}
	
	object.implement(generics);
};

protect('String', [
	'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
]);

protect('Array', [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
]);

protect('Number', ['toExponential', 'toFixed', 'toLocaleString', 'toPrecision']);

protect('Function', ['apply', 'call']);

protect('RegExp', ['exec', 'test']);

protect('Date', ['now']);

Date.extend('now', function(){
	return +(new Date);
});

new Type('Boolean', Boolean);

// fixes typeOf(NaN) returning as "number"

Number.prototype.$family = function(){
	return (isFinite(this)) ? 'number' : 'null';
}.hide();

// forEach, each

Object.extend('forEach', function(object, fn, context){
	for (var key in object) fn.call(context, object[key], key, object);
}).extend('each', Object.forEach);

Array.implement('forEach', function(fn, context){
	for (var i = 0, l = this.length; i < l; i++){
		if (i in this) fn.call(context, this[i], i, this);
	}
}).alias('each', 'forEach');

// Array & Object cloning

var clone = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var i = this.length, cloned = new Array(i);
	while (i--) cloned[i] = clone(this[i]);
	return cloned;
});

Object.extend('clone', function(object){
	var cloned = {};
	for (var key in object) cloned[key] = clone(object[key]);
	return cloned;
});

// Object merging

var merge = function(source, key, current){
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
	if (typeof k == 'string') return merge(source, k, v);
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		for (var key in object) merge(source, key, object[key]);
	}
	return source;
});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	Type(name);
});

// UID generator

var UID = 0;

this.uniqueID = function(){
	return (Date.now() + (UID++)).toString(36);
};

})();
