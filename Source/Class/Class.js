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
		if (newClass._prototyping) return this;
		this._current = nil;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		delete this._current; delete this.caller;
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
	
	wrap: function(self, key, method){
		if (method._origin) method = method._origin;
		
		return function(){
			if (method._protected && this._current == null) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this._current;
			this.caller = current; this._current = arguments.callee;
			var result = method.apply(this, arguments);
			this._current = current; this.caller = caller;
			return result;
		}.extend({_owner: self, _origin: method, _name: key});
	},
	
	getPrototype: function(klass){
		klass._prototyping = true;
		var proto = new klass;
		delete klass._prototyping;
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
			if (value._hidden) return this;
			proto[key] = Class.wrap(this, key, value);
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

	this.implement('parent', function(){
		var name = this.caller._name, previous = this.caller._owner.parent.prototype[name];
		if (!previous) throw new Error('The method "' + name + '" has no parent.');
		return previous.apply(this, arguments);
	}.protect());

});

Class.defineMutator('Implements', function(items){

	Array.from(items).each(function(item){
		if (instanceOf(item, Function)) item = Class.getPrototype(item);
		this.implement(item);
	}, this);

});
