/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = function(properties){
	
	var newClass = (function(){
		if (newClass._prototyping) return this;
		Object.reset(this);
		return (this.initialize) ? this.initialize.apply(this, arguments) : this;
	}).extend(this);
	
	newClass._implements = [];
	
	newClass.implement(Function.from(properties || {})());
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;
	newClass.group = Type.group(newClass);
	
	return newClass;
};

Class.superClass = Function;

Class.implement({
	
	implement: function(item){
		
		if (this._implements.contains(item)) return this;
		this._implements.push(item);
		
		for (var mutator in Class.Mutators){
			if (!item[mutator]) continue;
			Class.Mutators[mutator].call(this, item[mutator], item);
			if ((/^[A-Z]/).test(mutator)) delete item[mutator];
		}

		var wrap = function(key, method, self){
			return (function(){
				var caller = this.caller;
				this.caller = key;
				var result = method.apply(this, arguments);
				this.caller = caller;
				return result;
			}).extend({owner: self, origin: method}).disguise(method);
		};

		var properties = (typeOf(item) == 'class') ? item.getPrototype() : item;
			
		for (var key in properties){

			var current = properties[key], proto = this.prototype[key];
			var cType = typeOf(current), temp;
			
			if (cType == 'function') temp = wrap(key, current.origin || current, this);
			else if (cType == 'object' && typeOf(proto) == 'object') temp = Object.mixin(proto, current);
			else if (cType == 'object') temp = Object.clone(current);
			else if (cType == 'array') temp = Array.clone(current);
			else temp = current;
			
			this.prototype[key] = temp;
		}
		
		return this;

	},
	
	getPrototype: function(){
		this._prototyping = true;
		var proto = new this;
		delete this._prototyping;
		return proto;
	}
	
});

new Type('Class', Class);

Class.Mutators = {
	
	Extends: function(superClass){
		this.superClass = superClass;
		this.prototype = superClass.getPrototype();
		this._implements.append(superClass._implements);
		
		Object.reset(this.prototype);
		
		this.prototype._constructor = this;
		
		if (this.prototype.parent == null) this.prototype.parent = function(){
			var superParent = this._constructor.superClass.prototype[this.caller].owner;
			this._constructor = superParent;
			var result = superParent.prototype[this.caller].apply(this, arguments);
			delete this._constructor;
			return result;
		};
		
	},
	
	Implements: function(items){
		Array.from(items).each(function(item){
			this.implement(item);
		}, this);
	}
	
};
