/*
Script: Class.js
	Contains the Class and Abstract implementations.

License:
	MIT-style license.
*/

/*
Class: Class
	The base Class object of the <http://mootools.net> framework.
	Creates a new Class.  Its initialize method will fire upon class instantiation unless *null* is passed to the Class constructor.

Syntax:
	>var MyClass = new Class(properties);

Arguments:
	properties - (object) The collection of properties that apply to the Class. Also accepts Extends and Implements. See below.
	
Example:
	(start code)
	var Cat = new Class({
		initialize: function(name){
			this.name = name;
		}
	});
	var myCat = new Cat('Micia');
	alert(myCat.name); //alerts 'Micia'
	(end)
	
Implements:
	Implements the passed in Class properties into the base Class prototypes. Similar to Extends, but it simply overrides the properties.
	Useful when implementing a Class properties in multiple classes.

	Implements Syntax:
		>var MyClass = new Class({Implements: SomeOtherClass});

	Implements Example:
		(start code)
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = new Class({Implements: Animal,
			setName: function(name){
				this.name = name
			}
		});
		var myCat = new Cat(20);
		myAnimal.setName('Micia');
		alert(myAnimal.name); //alerts 'Micia'
		(end)
	
Extends:
	This class will be extended from the other class passed in.

	Extends Syntax:
		>var MyExtendedClass = new Class({Extends: SomeOtherClass});

	Extends Example:
		(start code)
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = new Class({Extends: Animal
			initialize: function(name, age){
				this.parent(age); //will call initalize of Animal
				this.name = name;
			}
		});
		var myCat = new Cat('Micia', 20);
		alert(myCat.name); //alerts 'Micia'
		alert(myCat.age); //alerts 20
		(end)
*/

var Class = function(properties){
	properties = properties || {};
	var klass = function(){
		var self = (arguments[0] !== $empty && this.initialize && $type(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
		if (this.options && this.options.initialize) this.options.initialize.call(this);
		return self;
	};
	
	if (properties.Implements){
		$extend(properties, Class.implement($splat(properties.Implements)));
		delete properties.Implements;
	}
	
	if (properties.Extends){
		properties = Class.extend(properties.Extends, properties);
		delete properties.Extends;
	}
	
	$extend(klass, this);
	klass.prototype = properties;
	klass.prototype.constructor = klass;
	klass.$family = 'class';
	return klass;
};

Class.empty = $empty;

Class.prototype = {

	constructor: Class,
	
	/*
	Property: extend
		Returns a copy of the Class extended with the properties passed in. The original Class will be unaltered.

	Syntax:
		>var MyExtendedClass = MyClass.extend(properties);

	Arguments:
		properties - (object) The properties to add to the base Class in this new Class.

	Example:
		(start code)
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = Animal.extend({
			initialize: function(name, age){
				this.parent(age); //will call initalize of Animal
				this.name = name;
			}
		});
		var myCat = new Cat('Micia', 20);
		alert(myCat.name); //alerts 'Micia'
		alert(myCat.age); //alerts 20
		(end)
	*/

	extend: function(properties){
		return new Class(Class.extend(this, properties));
	},
	
	/*
	Property: implement
		Implements the passed in properties into the base Class prototypes, altering the base Class, unlike <Class.extend>.

	Syntax:
		>MyClass.implement(properties);

	Arguments:
		properties - (object) The properties to add to the base Class.

	Example:
		(start code)
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		Animal.implement({
			setName: function(name){
				this.name = name
			}
		});
		var myAnimal = new Animal(20);
		myAnimal.setName('Micia');
		alert(myAnimal.name); //alerts 'Micia'
		(end)
	*/

	implement: function(){
		$extend(this.prototype, Class.implement($A(arguments)));
		return this;
	}

};

Class.implement = function(sets){
	var all = {};
	for (var i = 0, l = sets.length; i < l; i++) $extend(all, ($type(sets[i]) == 'class') ? new sets[i]($empty) : sets[i]);
	return all;
};

Class.extend = function(klass, properties){
	var proto = new klass($empty);
	for (var property in properties){
		var pp = proto[property];
		proto[property] = Class.merge(pp, properties[property]);
	}
	return proto;
};

Class.merge = function(previous, current){
	if ($defined(previous) && previous != current){
		var type = $type(current);
		if (type != $type(previous)) return current;
		switch (type){
			case 'function':
				var merged = function(){
					this.parent = arguments.callee.parent;
					return current.apply(this, arguments);
				};
				merged.parent = previous;
				return merged;
			case 'object': return $merge(previous, current);
		}
	}
	return current;
};

/*
Class: Abstract
	-doc missing-
*/

var Abstract = function(obj){
	return $extend(this, obj || {});
};

Native(Abstract);

Abstract.extend({
	
	each: function(fn, bind){
		for (var property in this){
			if (this.hasOwnProperty(property)) fn.call(bind || this, this[property], property);
		}
	},
	
	remove: function(property){
		delete this[property];
		return this;
	},

	extend: $extend

});

Client = new Abstract(Client);
