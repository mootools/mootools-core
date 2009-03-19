/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = new Native('Class', function(params){
	
	if (instanceOf(params, Function)) params = {initialize: params};
	
	var newClass = function(){
		Class.reset(this);
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

Class.extend('defineMutator', function(key, mutator){
	Storage.retrieve(this, 'mutators', {})[key] = mutator;
	return this;
}).extend('defineMutators', Class.defineMutator.setMany(true));

Class.extend({
	
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
	
	reset: function(instance){
		for (var key in instance){
			delete instance[key];
			var value = instance[key];
			switch (typeOf(value)){
				case 'object':
					value = Object.beget(value);
					for (var p in value){
						var current = value[p], ct = typeOf(current);
						if (ct == 'object' || ct == 'array') value[p] = Object.clone(current);
					}
					instance[key] = value;
				break;
				case 'array': instance[key] = Object.clone(value);
			}
		}
	}
	
});

Class.implement({
	
	implement: function(key, value){
		
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
				if (typeOf(previous) == 'object') Object.mixin(previous, value);
				else proto[key] = Object.clone(value);
			break;
			
			case 'array':
				proto[key] = Object.clone(value);
			break;
			
			default: proto[key] = value;

		}
		
		return this;
		
	}.setMany(),
	
	getPrototype: function(){
		this[':prototyping'] = true;
		var proto = new this;
		delete this[':prototyping'];
		return proto;
	}
	
});

Class.defineMutators({
	
	Extends: function(parent){

		this.parent = parent;
		this.prototype = parent.getPrototype();

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

	},

	Implements: function(items){

		Array.from(items).each(function(item){
			if (instanceOf(item, Function)) item = Class.getPrototype(item);
			this.implement(item);
		}, this);

	}
	
});
