/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = new Native('Class', function(properties){
		
	var newClass = function(){
		if (newClass.__prototyping__) return this;
		Object.reset(this);
		return (this.initialize) ? this.initialize.apply(this, arguments) : this;
	}.extend(this);
	
	newClass.__implements__ = [];
	
	newClass.implement(Function.from(properties || {})());
	
	newClass.prototype.constructor = newClass;
	return newClass;
		
}.extend({__protected__: true}));

Class.implement({
	
	constructor: Class,
	
	implement: function(item){
		
		if (this.__implements__.contains(item)) return this;
		this.__implements__.push(item);
		
		for (var mutator in Class.Mutators){
			if (!item[mutator]) continue;
			Class.Mutators[mutator].call(this, item[mutator], item);
			delete item[mutator];
		}
		
		var wrap = function(key, method, self){
			return function(){
				var caller = this.caller;
				this.caller = key;
				var result = method.apply(this, arguments);
				this.caller = caller;
				return result;
			}.extend({owner: self, origin: method}).disguise(method);
		};
			
		var properties = (typeOf(item) == 'class') ? item.getPrototype() : item;
			
		for (var key in properties){

			var current = properties[key], proto = this.prototype[key];
			var cType = typeOf(current), temp;
			
			if (cType == 'function'){
				temp = wrap(key, current.origin || current, this);
			} else if (cType == 'object' && typeOf(proto) == 'object'){
				temp = Object.mixin(proto, current);
			} else if (cType == 'object'){
				temp = Object.clone(current);
			} else if (cType == 'array'){
				temp = Array.clone(current);
			} else {
				temp = current;
			}
			
			this.prototype[key] = temp;
		}
		
		return this;

	},
	
	getPrototype: function(){
		this.__prototyping__ = true;
		var proto = new this;
		delete this.__prototyping__;
		return proto;
	}
	
});

Class.Mutators = {
	
	Extends: function(superClass){
		this.superClass = superClass;
		this.prototype = superClass.getPrototype();
		
		this.__implements__.append(superClass.__implements__);
		
		Object.reset(this.prototype);
		
		this.prototype.__constructor__ = this;
		
		if (this.prototype.parent == undefined) this.prototype.parent = function(){
			var superParent = this.__constructor__.superClass.prototype[this.caller].owner;
			this.__constructor__ = superParent;
			var result = superParent.prototype[this.caller].apply(this, arguments);
			delete this.__constructor__;
			return result;
		};
		
	},
	
	Implements: function(items){
		Array.from(items).each(function(item){
			this.implement(item);
		}, this);
	}
	
};
