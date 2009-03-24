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
	'version': '1.99dev',
	'build': '%build%'
};

// nil

var nil = function(item){
	return (item != null && item != nil);
};

// Accessors multipliers

Function.prototype.setMany = function(single){
	var one = this, many = function(item){
		var value = this, fn = (single) ? this[single] : one;
		for (var key in item) value = fn.call(this, key, item[key]);
		return value;
	};
	
	return (single) ? many : function(item){
		return ((typeof item == 'string') ? one : many).apply(this, arguments);
	};
};

Function.prototype.getMany = function(single){
	var one = this, many = function(item){
		var obj = {}, fn = (single) ? this[single] : one;
		for (var i = 0; i < item.length; i++) obj[item[i]] = fn.call(this, item[i]);
		return obj;
	};
	
	return single ? (many) : function(item){
		return ((typeof item == 'string') ? one : many).apply(this, arguments);
	};
};

// Object.pick

Object.pick = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != null) return arguments[i];
	}
	return null;
};

// Function extend, implement

Function.prototype.extend = function(key, value){
	this[key] = value;
	return this;
}.setMany();

Function.prototype.implement = function(key, value){
	this.prototype[key] = value;
	return this;
}.setMany();

// typeOf, instanceOf

var typeOf = function(item){
	if (item == null) return 'null';
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

var instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	return item instanceof object;
};

var constructorOf = function(item){
	return Type['object:' + typeOf(item)] || null;
};

// UID

var UID = (function(){
	
	var index = 0, table = {}, primitives = {};
	
	return {

		uidOf: function(item){
			if (item == null) return 'nil';
			if ((item = (item.valueOf) ? item.valueOf() : item).uid) return item.uid;
			if (!instanceOf(item, Object)) item = primitives[item] || (primitives[item] = {valueOf: Function.from(item)});
			var uid = item.uid || (item.uid = (index++).toString(16));
			if (!table[uid]) table[uid] = item;
			return uid;
		},
	
		itemOf: function(uid){
			if (uid == 'nil') return null;
			var tuid = table[uid];
			if (tuid == null) return null;
			return (tuid.valueOf) ? tuid.valueOf() : tuid;
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

var Type = function(name, object){
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
	
	hide: function(bool){
		if (bool == null) bool = true;
		this[':hidden'] = bool;
		return this;
	},

	protect: function(bool){
		if (bool == null) bool = true;
		this[':protected'] = bool;
		return this;
	}
	
});


// Native

var Native = function(name, object){
	object.extend(this);
	
	object[':type'] = this[':type'];
	object.constructor = Native;
	object.prototype.constructor = object;
	return new Type(name, object);
};

(function(){
	
	var hooks = {};
	
	var hooksOf = function(object){
		var uid = UID.uidOf(object);
		return hooks[uid] || (hooks[uid] = []);
	};
	
	Native.implement({
		
		implement: function(name, method){
			
			if (method[':hidden']) return this;
			
			var hooks = hooksOf(this);
			
			for (var i = 0; i < hooks.length; i++){
				var hook = hooks[i];
				if (typeOf(hook) == 'native') hook.implement(name, method);
				else hook.call(this, name, method);
			}
	
			var previous = this.prototype[name];
			if (previous == null || !previous[':protected']) this.prototype[name] = method;

			if (typeof method == 'function' && this[name] == null) this.extend(name, function(item){
				return method.apply(item, Array.from(arguments, 1));
			});
			
			return this;
			
		}.setMany(),
		
		extend: function(name, method){
			if (!method[':hidden']){
				var previous = this[name];
				if (previous == null || !previous[':protected']) this[name] = method;
			}
			return this;
		}.setMany(),
	
		alias: function(name, proto){
			return this.implement(name, this.prototype[proto]);
		}.setMany(),
				
		mirror: function(hook){
			hooksOf(this).push(hook);
			return this;
		}
		
	});
	
})();

new Type('Native', Native);

// Default Natives

(function(force){
	
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

})(function(type, methods){
	
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
	
	new Native(type, object).implement(object.prototype);

});

new Native('Date', Date).extend('now', function(){
	return +(new Date);
});

// fixes NaN

Number.prototype[':type'] = function(){
	return (isFinite(this)) ? 'number' : null;
}.hide();

// forEach

Object.extend({
	
	forEach: function(object, fn, bind){
		for (var key in object) fn.call(bind, object[key], key, object);
	},
	
	each: function(object, fn, bind){
		Object.forEach(object, fn, bind);
		return object;
	}
	
});

Array.implement({
	
	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	},
	
	each: function(fn, bind){
		this.forEach(fn, bind);
		return this;
	}
	
});
