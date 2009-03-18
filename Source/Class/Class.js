/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

function Class(params){
	
	if (instanceOf(params, Function)) params = {initialize: params};
	
	var newClass = function(){
		Class.reset(this);
		if (newClass[':prototyping']) return this;
		this.name = 'constructor'; this.arguments = Array.from(arguments);
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.name = this.caller = this.arguments = null;
		return value;
	}.extend(this);
	
	newClass.implement(params);
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;

	return newClass;

};

new Native(Class).extend(new Storage).store('mutators', {
	
	Extends: function(parent){

		this.parent = parent;
		this.prototype = parent.getPrototype();

		this.prototype[':constructor'] = this;

		if (this.prototype.parent == null) this.prototype.parent = function(){
			if (!this.name) Class.retrieve('error:protected')();
			var parent = this[':constructor'].parent;
			if (!parent) Class.retrieve('error:parent')();
			this[':constructor'] = parent.prototype[this.name][':owner'];
			var result = this[':constructor'].prototype[this.name].apply(this, arguments);
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
	
}).extend('addMutator', function(key, mutator){
	
	this.retrieve('mutators')[key] = mutator;

}.asSetter());

Class.extend({
	
	wrap: function(key, method, self){

		return function(){
			if (method[':protected'] && this.name == null) Class.retrieve('error:protected')();
			var caller = this.caller, name = this.name, args = this.arguments;
			this.caller = name; this.name = key; this.arguments = Array.from(arguments);
			var result = method.apply(this, arguments);
			this.arguments = args; this.name = name; this.caller = caller;
			return result;
		}.extend({
			':owner': self,
			':origin': method
		});

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
		
		var mutator = Class.retrieve('mutators')[key];
		
		if (mutator){
			value = mutator.call(this, value);
			if (value == null) return;
		}
		
		var proto = this.prototype;

		switch (typeOf(value)){
			
			case 'function':
				if (value[':hidden']) return;
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
		
	}.asSetter(),
	
	getPrototype: function(){
		this[':prototyping'] = true;
		var proto = new this;
		delete this[':prototyping'];
		return proto;
	}
	
});

Class.store({

	'error:protected': function(){
		throw new Error('trying to call a protected method');
	},

	'error:parent': function(){
		throw new Error('the parent for this method does not exist');
	}

});
