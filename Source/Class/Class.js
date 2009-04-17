/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

this.Class = new Native('Class', function(params){
	
	if (instanceOf(params, Function)) params = {initialize: params};
	
	var newClass = function(){
		Object.reset(this);
		if (newClass._prototyping_) return this;
		this._current_ = nil;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this._current_ = this.caller = null;
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
		if (method._origin_) method = method._origin_;
		
		return function(){
			if (method._protected_ && this._current_ == null) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this._current_;
			this.caller = current; this._current_ = arguments.callee;
			var result = method.apply(this, arguments);
			this._current_ = current; this.caller = caller;
			return result;
		}.extend({_owner_: self, _origin_: method, _name_: key});
	},
	
	getPrototype: function(klass){
		klass._prototyping_ = true;
		var proto = new klass;
		delete klass._prototyping_;
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
			if (value._hidden_) return this;
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
		var name = this.caller._name_, previous = this.caller._owner_.parent.prototype[name];
		if (!previous) throw new Error('The method "' + name + '" has no parent.');
		return previous.apply(this, arguments);
	}.protect());

}).defineMutator('Implements', function(items){

	Array.from(items).forEach(function(item){
		if (instanceOf(item, Function)) item = Class.getPrototype(item);
		this.implement(item);
	}, this);

});
