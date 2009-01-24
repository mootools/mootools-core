/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = new Native({
	
	name: 'Class',
	
	initialize: function(properties){
		
		var newClass = Object.extend(function(){
			for (var key in this){
				if (['array', 'object'].contains(typeOf(this[key]))) this[key] = Object.unlink(this[key]);
			}
			if (newClass.prototyping) return this;
			newClass.fireEvent('beforeInitialize', this);
			var result = (this.initialize) ? this.initialize.apply(this, arguments) : this;
			newClass.fireEvent('afterInitialize', this);
			return result;
		}, this);
		
		properties = Function.from(properties || {})();
		
		for (var mutator in Class.Mutators){
			if (!properties[mutator]) continue;
			Class.Mutators[mutator].call(newClass, properties[mutator], properties);
			delete properties[mutator];
		}
		
		newClass.implement(properties);
		
		newClass.constructor = Class;
		newClass.prototype.constructor = newClass;
		return newClass;
		
	}
	
});

Class.implement({
	
	addEvent: Native.prototype.addObjectEvent,
	removeEvent: Native.prototype.removeObjectEvent,
	fireEvent: Native.prototype.fireObjectEvent,
	
	implement: function(item){
		
		var self = this;
		
		var wrap = function(name, method){
			var wrapper = function(){
				var caller = this.caller;
				this.caller = name;
				var result = method.apply(this, arguments);
				this.caller = caller;
				return result;
			};
			wrapper.owner = self;
			wrapper.disguise(method);
			wrapper.origin = method;
			return wrapper;
		};
			
		var properties = (typeOf(item) == 'class') ? item.getPrototype() : item;
		
		this.fireEvent('beforeImplement', properties);
	
		for (var key in properties){
			
			var current = properties[key];
			
			this.prototype[key] = (typeOf(current) == 'function') ? wrap(key, current.origin || current) : Object.unlink(current);
			
			this.fireEvent('afterImplement', [key, this.prototype[key]]);
		}
		
		return this;

	},
	
	getPrototype: function(){
		this.prototyping = true;
		var proto = new this;
		delete this.prototyping;
		return proto;
	}
	
});

Class.Mutators = {
	
	Extends: function(superClass, properties){
		
		var parent = function(){
			var superParent = this.$constructor.superClass.prototype[this.caller].owner;
			this.$constructor = superParent;
			var result = superParent.prototype[this.caller].apply(this, arguments);
			delete this.$constructor;
			return result;
		};
		
		this.superClass = superClass;
		this.prototype = superClass.getPrototype();
		this.prototype.$constructor = this;
		
		for (var key in properties){
			if (!this.prototype[key]) continue;
			var previous = this.prototype[key], current = properties[key];
			if ([current, previous].every(typeOf.object)) properties[key] = Object.merge(previous, current);
		}
		
		if (this.prototype.parent == undefined) this.prototype.parent = parent;
		
	},
	
	Implements: function(items){
		Object.splat(items).each(function(item){
			this.implement(item);
		}, this);
	}
	
};
