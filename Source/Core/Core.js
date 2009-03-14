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

// nil

function nil(item){
	return (item != null && item != nil);
};

// Accessors multipliers

Function.prototype.asSetter = function(){
	var self = this;
	var multiple = function(argument){
		if (typeof argument == 'string'){
			self.apply(this, arguments);
		} else {
			for (var p in argument) self.call(this, p, argument[p]);
		}
		return this;
	};
	multiple[':origin'] = self;
	return multiple;
};

Function.prototype.asGetter = function(){
	var self = this;
	var multiple = function(argument){
		if (typeof argument == 'string') return self.apply(this, arguments);
		var obj = {};
		for (var i = 0; i < argument.length; i++) obj[argument[i]] = self.call(this, argument[i]);
		return obj;
	};
	multiple[':origin'] = self;
	return multiple;
};

// Object.has

Object.has = function(object, key){
	return (object.hasOwnProperty(key) && object[key] != null);
};

Object.pick = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != null) return arguments[i];
	}
	return null;
};

// Function extend, implement

Function.extend = Function.prototype.extend = function(key, value){
	if (!Object.has(this, key) && (value == null || !value[':hidden'])) this[key] = value;
	return this;
}.asSetter();

Function.prototype.implement = function(key, value){
	if (!Object.has(this.prototype, key) && (value == null || !value[':hidden'])) this.prototype[key] = value;
	return this;
}.asSetter();

// valueOf, typeOf, instanceOf

function valueOf(item){
	return (item != null && item.valueOf) ? item.valueOf() : null;
};

function typeOf(item){
	if (item == null) return null;
	if (item[':type']) return item[':type']();
	
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

function instanceOf(item, object){
	if (item == null) return false;
	var constructor = item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	return item instanceof object;
};

function constructorOf(item){
	return Type['object:' + typeOf(item)] || null;
};

// UID

var UID = (function(){
	
	var index = 0, table = {}, primitives = {};
	
	return {

		uidOf: function(item){			
			if ((item = valueOf(item)) && item.uid) return item.uid;
			
			if (!instanceOf(item, Object)) item = primitives[item] || (primitives[item] = {valueOf: Function.from(item)});
			var uid = item.uid || (item.uid = (index++).toString(16));
			if (!table[uid]) table[uid] = item;
			return uid;
		},
	
		itemOf: function(uid){
			return valueOf(table[uid] || null);
		}
	
	};
	
})();

// From

Function.from = function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
};

Array.from = function(item, slice){
	return (item == null) ? [] : (Type.isEnumerable(item)) ? Array.prototype.slice.call(item, slice || 0) : [item];
};

Number.from = Number;
String.from = String;

// Type

function Type(object){
	var name = object.name;
	if (!name){
		var match = object.toString().match(/^\s*function\s*([\w]+)/);
		if (!match || !(name = match[1])) return object;
	}
	var lower = name.toLowerCase();
	Type['is' + name] = function(item){
		return (typeOf(item) == lower);
	};
	Type['object:' + lower] = object;
	object.prototype[':type'] = Function.from(lower).hide();
	return object;
};

Type.isEnumerable = function(item){
	return (typeof item == 'object' && typeof item.length == 'number');
};

Type['object:object'] = Object;

// Object-less types

(function(types){
	
	for (var i = 0; i < types.length; i++) Type['is' + types[i]] = Function.from(types[i].toLowerCase());

})(['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments']);

// hide, protect

Function.implement({
	
	hide: function(){
		this[':hidden'] = true;
		return this;
	},

	protect: function(){
		this[':protected'] = true;
		return this;
	}
	
});

// Native

function Native(object){
	object.extend(this);
	object[':type'] = this[':type'];
	object.constructor = Native;
	object.prototype.constructor = object;
	return new Type(object);
};

new Type(Native);

(function(){
	
	var hooks = {};
	
	function hooksOf(object){
		var uid = UID.uidOf(object);
		return hooks[uid] || (hooks[uid] = []);
	};
	
	Native.implement({

		implement: function(name, method){

			var hooks = hooksOf(this);
			for (var i = 0; i < hooks.length; i++){
				var hook = hooks[i];
				if (typeOf(hook) == 'native') arguments.callee.call(hook, name, method);
				else hook.call(this, name, method);
			}

			Function.prototype.implement[':origin'].call(this, name, method);

			if (typeof method == 'function') this.extend(name, function(item){
				return method.apply(item, Array.from(arguments, 1));
			});

		}.asSetter(),

		alias: function(name, proto){
			Native.prototype.implement[':origin'].call(this, name, this.prototype[proto]);
		}.asSetter(),

		override: function(key, value){
			delete this[key];
			delete this.prototype[key];
			Native.prototype.implement[':origin'].call(this, key, value);
		}.asSetter(),
				
		mirror: function(hook){
			hooksOf(this).push(hook);
			return this;
		}

	});
	
})();

function Table(){
	this.table = {};
};

new Native(Table).implement({
	
	set: function(key, value){
		this.table[UID.uidOf(key)] = value;
		return this;
	},
	
	get: function(key){
		var value = this.table[UID.uidOf(key)];
		return (value != null) ? value : null;
	},
	
	erase: function(key){
		var uid = UID.uidOf(key), value = this.table[uid];
		delete this.table[uid];
		return value;
	},
	
	forEach: function(fn, bind){
		for (var uid in this.table) fn.call(bind, this.table[uid], UID.itemOf(uid), this);
	}

}).alias('each', 'forEach');

// Default Natives

(function(enforce){
	
	enforce(Array, [
		'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
		'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
	]);
	
	enforce(String, [
		'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
		'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
	]);
	
	enforce(Number, ['toExponential', 'toFixed', 'toLocaleString', 'toPrecision']);
	
	enforce(Function, ['apply', 'call']);
	
	enforce(RegExp, ['exec', 'test']);

})(function(object, methods){
		
	for (var i = 0; i < methods.length; i++){
		var name = methods[i], method = object.prototype[name];
		if (method){
			delete object.prototype[name];
			object.prototype[name] = method;
		}
	}
	
	new Native(object).implement(object.prototype);
});

new Native(Date).extend('now', function(){
	return +(new Date);
});

// fixes NaN

Number.prototype[':type'] = function(){
	return (isFinite(this)) ? 'number' : null;
}.hide();

// forEach

Object.extend('forEach', function(object, fn, bind){
	for (var key in object) fn.call(bind, object[key], key, object);
}).extend('each', Object.forEach);

Array.implement('forEach', function(fn, bind){
	for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
}).alias('each', 'forEach');
