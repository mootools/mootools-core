/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = new Native('Class', function(params){
	
	if (instanceOf(params, Function)) params = {initialize: params};
	
	var newClass = function(){
		Object.reset(this);
		if (newClass[':prototyping']) return this;
		this[':name'] = 'constructor'; this.arguments = Array.from(arguments);
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this[':name'] = this.caller = this.arguments = null;
		return value;
	}.extend(this);

	newClass.implement(params);
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;

	return newClass;

});


Class.extend({

	defineMutator: function(key, mutator){
		Storage.retrieve(this, 'mutators', {})[key] = mutator;
		return this;
	},
	
	wrap: function(key, method, self){

		return function(){
			if (method[':protected'] && this[':name'] == null) throw new Error('the method "' + key + '" cannot be called directly.');
			var caller = this.caller, name = this[':name'], args = this.arguments;
			this.caller = name; this[':name'] = key; this.arguments = Array.from(arguments);
			var result = method.apply(this, arguments);
			this.arguments = args; this[':name'] = name; this.caller = caller;
			return result;
		}.extend({':owner': self, ':origin': method});

	},
	
	getPrototype: function(klass){
		klass[':prototyping'] = true;
		var proto = new klass;
		delete klass[':prototyping'];
		return proto;
	}
	
});

Object.extend('reset', function(object, key){
		
	if (key == null){
		for (var p in object) Object.reset(object, p);
		return object;
	}
	
	delete object[key];
	
	switch (typeOf(object[key])){
		case 'object':
			var F = function(){};
			F.prototype = object[key];
			var i = new F;
			object[key] = Object.reset(i);
		break;
		case 'array': object[key] = Object.clone(object[key]); break;
	}
	
	return object;
	
});

Class.implement('implement', function(key, value){
	
	var mutator = Storage.retrieve(Class, 'mutators')[key];
	
	if (mutator){
		value = mutator.call(this, value);
		if (value == null) return this;
	}
	
	var proto = this.prototype;

	switch (typeOf(value)){
		
		case 'function':
			if (value[':hidden']) return this;
			proto[key] = Class.wrap(key, value[':origin'] || value, this);
		break;
		
		case 'object':
			var previous = proto[key];
			if (typeOf(previous) == 'object') Object.merge(previous, value);
			else proto[key] = Object.clone(value);
		break;
		
		case 'array':
			proto[key] = Object.clone(value);
		break;
		
		default: proto[key] = value;

	}
	
	return this;
	
}.setMany());

Class.defineMutator('Extends', function(parent){

	this.parent = parent;
	this.prototype = Class.getPrototype(parent);

	this.prototype[':constructor'] = this;

	if (this.prototype.parent == null) this.prototype.parent = function(){
		if (!this[':name']) throw new Error('the method "parent" cannot be called directly.');
		var parent = this[':constructor'].parent;
		if (!parent) throw new Error('trying to call a non-existing parent.');
		this[':constructor'] = parent.prototype[this[':name']][':owner'];
		var result = this[':constructor'].prototype[this[':name']].apply(this, arguments);
		delete this[':constructor'];
		return result;
	};

});

Class.defineMutator('Implements', function(items){

	Array.from(items).each(function(item){
		if (instanceOf(item, Function)) item = Class.getPrototype(item);
		this.implement(item);
	}, this);

});
