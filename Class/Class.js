/*
Script: Class.js
	Contains the Class and Abstract implementations.

License:
	MIT-style license.
*/

/*
Function: Class
	The base Class object of the <http://mootools.net/> framework. Creates a new Class. The Class's initialize method will fire upon class instantiation unless <$empty> is passed to the Class constructor.

Syntax:
	>var MyClass = new Class(properties);

Arguments:
	properties - (object) The collection of properties that apply to the Class. Also accepts Extends and Implements properties (see below).

	properties (continued):
		Extends - (class) That this class will extend.
		Implements - (mixed) An object or an array of objects that the Class implements. Similar to Extends, but it simply overrides the properties. Useful when implementing a Class properties in multiple classes.

Returns:
	(class) The Class created.

Examples:
	Class Example:
	[javascript]
		var Cat = new Class({
			initialize: function(name){
				this.name = name;
			}
		});
		var myCat = new Cat('Micia');
		alert(myCat.name); //alerts 'Micia'

		var Cow = new Class({
			initialize: function(){
				alert('moooo');
			});
		});
		var Effie = new Cow($empty); //will not alert 'moooo'
	[/javascript]

	Extends Example:
	[javascript]
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
	[/javascript]

	Implements Example:
	[javascript]
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = new Class({
			Implements: Animal,
			setName: function(name){
				this.name = name
			}
		});
		var myCat = new Cat(20);
		myAnimal.setName('Micia');
		alert(myAnimal.name); //alerts 'Micia'
	[/javascript]
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
	Method: extend
		Returns a copy of the Class extended with the properties passed in. The original Class will be unaltered.

	Syntax:
		>var MyExtendedClass = MyClass.extend(properties);

	Arguments:
		properties - (object) The properties to add to the base Class in this new Class.

	Returns:
		(class) A new Class extended with the properties passed in.

	Example:
		[javascript]
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
		[/javascript]
	*/

	extend: function(properties){
		return new Class(Class.extend(this, properties));
	},

	/*
	Method: implement
		Implements the passed in properties into the base Class prototypes, altering the base Class, unlike <Class.extend>.

	Syntax:
		>MyClass.implement(properties);

	Arguments:
		properties - (object) The properties to add to the base Class.

	Example:
		[javascript]
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
		[/javascript]
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
	Returns an extended JavaScript object with helper functions. An Abstract is also referred to as a Static or Singleton object.

Syntax:
	>var MyAbstract = new Abstract(obj);

Arguments:
	obj - (object) The collection of properties that apply to the static Abstract object.

Returns:
	(object) An extended object.

Example:
	[javascript]
		var Site = new Abstract({
			name: 'MooTools-O-Fun',
			welcome: function(){
				alert('welcome');
			}
		});
		alert(Site.name); //alerts 'MooTools-O-Fun'
	[/javascript]
*/

var Abstract = function(obj){
	return $extend(this, obj || {});
};

Native(Abstract);

Abstract.extend({

	/*
	Method: each
		Iterates through each property in the object.

	Syntax:
		>myAbstract.each(fn[, bind]);

	Arguments:
		fn   - (function) The function to call with the property value and key as its parameters.
		bind - (object, optional) The object to bind the function with.

	Example:
		[javascript]
			var Alphabet = new Abstract({
				'a': 'apple',
				'b': 'banana',
				'c': 'cat'
			});

			var mySentence = '';
			Alphabet.each(function(example, letter){
				mySentence += ('Letter: letter + ' is for ' + example + ' ');
			}); // mySentence will be: 'Letter: a is for apple. Letter: b is for apple. Letter: c is for cat.\n'
		[/javascript]
	*/

	each: function(fn, bind){
		for (var property in this){
			if (this.hasOwnProperty(property)) fn.call(bind || this, this[property], property);
		}
	},

	/*
	Method: remove
		Removes the property from the object.

	Syntax:
		>myAbstract.remove(property);

	Arguments:
		property - (string) Property that is removed from the object.

	Returns:
		(object) The same abstract object. Used for chaining purposes.

	Example:
		[javascript]
			var PicoDeGallo = new Abstract({
				'onions': 3,
				'tomatoes': 4,
				'jalapenos': 6,
				'cilantro': 1,
				'avacado': 3
			});
			PicoDeGallo.remove('avacado'); //eew no avacado in my Pico de Gallo
			//Make the Pico
		[/javascript]
	*/

	remove: function(property){
		delete this[property];
		return this;
	},

	/*
	Method: extend
		Same as <$extend>.
	*/

	extend: $extend

});

Client = new Abstract(Client);
