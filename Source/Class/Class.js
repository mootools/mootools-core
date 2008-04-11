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
			
			for (var key in this) this[key] = $unlink(this[key]);
			
			for (var mutator in Class.Mutators){
				if (!this[mutator]) continue;
				Class.Mutators[mutator](this, this[mutator]);
				delete this[mutator];
			}

			this.constructor = klass;

			var self = (arguments[0] !== $empty && this.initialize) ? this.initialize.apply(this, arguments) : this;
			if (this.options && this.options.initialize) this.options.initialize.call(this);
			
			return self;
		};

		$extend(klass, this);
		klass.constructor = Class;
		klass.prototype = properties;
		return klass;
	}

});

Class.implement({

	implement: function(){
		Class.Mutators.Implements(this.prototype, Array.slice(arguments));
		return this;
	}

});

Class.Mutators = {};

Class.Mutators.Implements = function(self, klasses){
	$splat(klasses).each(function(klass){
		$extend(self, ($type(klass) == 'class') ? new klass($empty) : klass);
	});
};

Class.Mutators.Extends = function(self, klass){
	
	var instance = new klass($empty), current;
	
	for (var key in instance) self[key] = (function(previous, current){
		if (current != undefined && previous != current){
			var type = $type(current), ptype = $type(previous);
			if (type != ptype) return current;
			switch (type){
				case 'function':
					return function(){
						current.parent = previous.bind(this);
						return current.apply(this, arguments);
					};
				case 'object': return $merge(previous, current);
				default: return current;
			}
		}
		return previous;
	})(instance[key], (current = self[key]));
	
	self.parent = function(){
		return arguments.callee.caller.parent.apply(this, arguments);
	};

};