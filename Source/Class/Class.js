/*
Script: Class.js
	Contains the Class implementations.

License:
	MIT-style license.
*/

/*
Function: Class
	The base Class object of the <http://mootools.net/> framework. Creates a new Class. The Class's initialize method will fire upon class instantiation unless <$empty> is passed to the Class constructor.

Syntax:
	>var MyClass = new Class(properties);

Arguments:
	properties - (object) The collection of properties that apply to the Class. Also accepts some special properties such as Extends, Implements, and initialize (see below).

	properties (continued):
		Extends - (class) That this class will extend.
		Implements - (mixed) An object or an array of objects that the Class implements. Similar to Extends, but it simply overrides the properties. Useful when implementing a Class properties in multiple classes.
		initialize - (function) The initialize function will be the constructor for this class when new instances are created.

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
		for (var property in this){
			if ($type(this[property]) == 'object') this[property] = $merge(this[property]);
		}
		var self = (arguments[0] !== $empty && this.initialize && $type(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
		if (this.options && this.options.initialize) this.options.initialize.call(this);
		return self;
	};

	if (properties.Implements){
		$extend(properties, Class.Implements.run(properties.Implements));
		delete properties.Implements;
	}

	if (properties.Extends){
		properties = Class.Extends(properties.Extends, properties);
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
		$extend(this.prototype, Class.Implements.run(arguments));
		return this;
	}

};

Class.Implements = function(){
	var all = {};
	Array.each(arguments, function(set){
		$extend(all, ($type(set) == 'class') ? new set($empty) : set);
	});
	return all;
};

Class.Extends = function(klass, properties){
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
				return function(){
					current.parent = this.parent = previous.bind(this);
					return current.apply(this, arguments);
				};
			case 'object': return $merge(previous, current);
		}
	}
	return current;
};