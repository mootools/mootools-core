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
			for (var property in this){
				if ($type(this[property]) == 'object') this[property] = $merge(this[property]);
			}

			['Implements', 'Extends'].each(function(Property){
				if (!this[Property]) return;
				Class[Property](this, this[Property]);
				delete this[Property];
			}, this);

			this.constructor = klass;

			var self = (arguments[0] !== $empty && this.initialize && $type(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
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
		Class.Implements(this.prototype, Array.slice(arguments));
		return this;
	}

});

Class.Implements = function(self, klasses){
	$splat(klasses).each(function(klass){
		$extend(self, ($type(klass) == 'class') ? new klass($empty) : klass);
	});
};

Class.Extends = function(self, klass){
	klass = new klass($empty);
	for (var property in klass){
		var kp = klass[property];
		var sp = self[property];
		self[property] = (function(previous, current){
			if ($defined(current) && previous != current){
				var type = $type(current);
				if (type != $type(previous)) return current;
				switch (type){
					case 'function': return function(){
						current.parent = this.parent = previous.bind(this);
						return current.apply(this, arguments);
					};
					case 'object': return $merge(previous, current);
				}
			}
			return previous;
		})(kp, sp);
	}
};

//legacy .extend support

Class.prototype.extend = function(properties){
	properties.Extends = this;
	return new Class(properties);
};