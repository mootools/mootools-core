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
			var prop = properties[key], proto = this.prototype[key];
			switch (typeOf(prop)){
				case 'function': prop = wrap(key, prop.origin || prop, this); break;
				case 'object':
					if (typeOf(proto) == 'object') prop = Object.mixin(proto, prop);
					else prop = Object.clone(prop);
					break;
				case 'array': prop = Array.clone(prop);
			}
			this.prototype[key] = prop;
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
