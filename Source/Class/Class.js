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

		var klass = function(empty){
						
			for (var key in this) this[key] = $unlink(this[key]);

			for (var mutator in Class.Mutators){
				if (!this[mutator]) continue;
				Class.Mutators[mutator](this, this[mutator]);
			}

			this.constructor = klass;
			
			if (empty === $empty) return this;
			
			var self = (this.initialize) ? this.initialize.apply(this, arguments) : this;
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
	
	var instance = new klass($empty);
	
	for (var key in instance){

		var current = self[key], previous = instance[key];
		
		if (current == undefined){
			self[key] = previous;
			continue;
		}

		var ctype = $type(current), ptype = $type(previous);
		
		if (ctype != ptype) continue;
		
		switch (ctype){
			case 'function': self[key]._parent_ = previous; break;
			case 'object': self[key] = $merge(previous, current);
		}
		
	}
	
	self.parent = function(){
		return arguments.callee.caller._parent_.apply(this, arguments);
	};

};