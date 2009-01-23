/*
Script: Class.js
	Contains the Class Function for easily creating, extending, and implementing reusable Classes.

License:
	MIT-style license.
*/

var Class = new Native({

	name: 'Class',

	initialize: function(properties){
		properties = properties || {};
		var klass = function(){
			for (var key in this){
				if (typeOf(this[key]) != 'function') this[key] = Object.unlink(this[key]);
			}
			this.constructor = klass;
			if (Class.prototyping) return this;
			var instance = (this.initialize) ? this.initialize.apply(this, arguments) : this;
			if (this.options && this.options.initialize) this.options.initialize.call(this);
			return instance;
		};

		for (var mutator in Class.Mutators){
			if (!properties[mutator]) continue;
			properties = Class.Mutators[mutator](properties, properties[mutator]);
			delete properties[mutator];
		}

		Object.extend(klass, this);
		klass.constructor = Class;
		klass.prototype = properties;
		return klass;
	}

});

Class.Mutators = {

	Extends: function(self, klass){
		Class.prototyping = klass.prototype;
		var subclass = new klass;
		delete subclass.parent;
		subclass = Class.inherit(subclass, self);
		delete Class.prototyping;
		return subclass;
	},

	Implements: function(self, klasses){
		Object.splat(klasses).each(function(klass){
			Class.prototying = klass;
			Object.extend(self, (typeOf(klass) == 'class') ? new klass : klass);
			delete Class.prototyping;
		});
		return self;
	}

};

Class.extend({

	inherit: function(object, properties){
		var caller = arguments.callee.caller && !Browser.Features.air; // caller support is broken in air 1.5
		for (var key in properties){
			var override = properties[key];
			var previous = object[key];
			var type = typeOf(override);
			if (previous && type == 'function'){
				if (override != previous){
					if (caller){
						override.__parent = previous;
						object[key] = override;
					} else {
						Class.override(object, key, override);
					}
				}
			} else if(type == 'object'){
				object[key] = Object.merge(previous, override);
			} else {
				object[key] = override;
			}
		}

		if (caller) object.parent = function(){
			return arguments.callee.caller.__parent.apply(this, arguments);
		};

		return object;
	},

	override: function(object, name, method){
		var parent = Class.prototyping;
		if (parent && object[name] != parent[name]) parent = null;
		var override = function(){
			var previous = this.parent;
			this.parent = parent ? parent[name] : object[name];
			var value = method.apply(this, arguments);
			this.parent = previous;
			return value;
		};
		object[name] = override;
	}

});

Class.implement({

	implement: function(){
		var proto = this.prototype;
		Object.each(arguments, function(properties){
			Class.inherit(proto, properties);
		});
		return this;
	}

});
