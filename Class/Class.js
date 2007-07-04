/*
Script: Class.js
	Contains the Class Function, aims to ease the creation of reusable Classes.

License:
	MIT-style license.
*/

/*
Class: Class
	The base Class object of the <http://mootools.net> framework.
	Creates a new Class whose initialize method will fire upon class instantiation.
	Initialize wont fire on instantiation when you pass *null* to the constructor.

Arguments:
	properties - (object) The collection of properties that apply to the Class.

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
*/

var Class = function(properties){
	var klass = function(){
		var self = (arguments[0] !== $empty && this.initialize && $type(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
		if (this.options && this.options.initialize) this.options.initialize.call(this);
		return self;
	};
	$extend(klass, this);
	klass.prototype = properties;
	klass.$family = 'class';
	return klass;
};

Class.empty = $empty;

Class.prototype = {

	/*
	Property: extend
		Returns a copy of the Class extended with the properties passed in. The original Class will be unaltered.

	Arguments:
		properties - (object) The properties to add to the base class in this new Class.

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
		var proto = new this($empty);
		for (var property in properties){
			var pp = proto[property];
			proto[property] = Abstract.merge(pp, properties[property]);
		}
		return new Class(proto);
	},

	/*
	Property: implement
		Implements the passed in properties into the base Class prototypes, altering the base Class, unlike <Class.extend>.

	Arguments:
		properties - (object) The properties to add to the base class.

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
		for (var i = 0, l = arguments.length; i < l; i++) $extend(this.prototype, arguments[i]);
	}

};