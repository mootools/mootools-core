/*
Script: Moo.js
	My Object Oriented javascript.

Authors:
	Valerio Proietti, <http://mad4milk.net>
	Michael Jackson, <http://ajaxon.com/michael>

License:
	MIT-style license.

Credits:
	- Class is slightly based on Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
	- Some functions are based on those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
	- Documentation by Aaron Newton (aaron.newton [at] cnet [dot] com) and Valerio Proietti.
*/

/*
Function: Object.extend
	Copies all the properties from the second passed object to the first passed Object.
	If you do myWhatever.extend = Object.extend the first parameter will become myWhatever, and your extend function will only need one parameter.

Example:
	>var john = {
	>	name: 'John',
	>	last: 'Doe'
	>}
	
	>var dorian = {
	>	age: 20,
	>	sex: 'male',
	>	last: 'Dorian'
	>}
	
	>Object.extend(john, dorian);
	
	>//john is now the following:
	>john = {
	>	name: 'John',
	>	last: 'Dorian',
	>	age: 20,
	>	sex: 'male'
	>}

Returns:
	The first object, extended.
*/

Object.extend = function(obj, properties){
	obj = properties ? [obj, properties] : [this, obj];
	for (var property in obj[1]) obj[0][property] = obj[1][property];
	return obj[0];
};

/*
Class: Class
	The base class object of the <http://mootools.net> framework.

Arguments:
	properties - the collection of properties that apply to the class. Creates a new class, its initialize method will fire upon class instantiation.

Example:
	>var Cat = new Class({
	>	initialize: function(name){
	>		this.name = name;
	>	}
	>});
	>var myCat = new Cat('Micia');
	>alert myCat.name; //alerts 'Micia'
*/

var Class = function(properties){
	var klass = Object.extend(function(){
		return this.initialize ? this.initialize.apply(this, arguments) : this;
	}, this);
	klass.prototype = properties;
	return klass;
};

/*
Property: empty
	Returns an empty function
*/

Class.empty = function(){};

Class.prototype = {

	/*
	Property: extend
		Returns the copy of the Class extended with the passed in properties.

	Arguments:
		properties - the properties to add to the base class in this new Class.

	Example:
		>var Animal = new Class({
		>	initialize: function(age){
		>		this.age = age;
		>	}
		>});
		>var Cat = Animal.extend({
		>	initialize: function(name, age){
		>		this.parent(age); //will call the previous initialize;
		>		this.name = name;
		>	}
		>});
		>var myCat = new Cat('Micia', 20);
		>alert myCat.name; //alerts 'Micia'
		>alert myCat.age; //alerts 20
	*/

	extend: function(properties){
		var proto = Object.extend({}, this.prototype);

		for (var property in properties){
			if (proto[property] && proto[property] != properties[property])
				properties[property] = function(previous, current){
					if (!previous.apply || !current.apply) return current;
					return function(){
						this.parent = previous;
						return current.apply(this, arguments);
					}
				}(proto[property], properties[property]);
			proto[property] = properties[property];
		}
		
		return new Class(proto);
	},

	/*
	Property: implement
		Implements the passed in properties to the base Class prototypes, altering the base class, unlike <Class.extend>.

	Arguments:
		properties - the properties to add to the base class.

	Example:
		>var Animal = new Class({
		>	initialize: function(age){
		>		this.age = age;
		>	}
		>});
		>Animal.implement({
		>	setName: function(name){
		>		this.name = name
		>	}
		>});
		>var myAnimal = new Animal(20);
		>myAnimal.setName('Micia');
		>alert(myAnimal.name); //alerts 'Micia'
	*/

	implement: function(properties){
		Object.extend(this.prototype, properties);
	}

};

/*
Function: Object.Native
	Will add a .extend method to the objects passed as a parameter, equivalent to <Class.implement>

Arguments:
	a number of classes/native javascript objects

*/

Object.Native = function(){
	for (var i = 0; i < arguments.length; i++) arguments[i].extend = Class.prototype.implement;
};

Object.Native(Function, Array, String, Number, Class);