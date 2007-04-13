/*
Script: Moo.js
	My Object Oriented javascript.

License:
	MIT-style license.

MooTools Copyright:
	copyright (c) 2007 Valerio Proietti, <http://mad4milk.net>

MooTools Credits:
	- Class is slightly based on Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
	- Documentation by Aaron Newton (aaron.newton [at] cnet [dot] com) and Valerio Proietti.
*/

var MooTools = {
	version: '1.1dev'
};

/*
Class: Class
	The base class object of the <http://mootools.net> framework.
	Creates a new class, its initialize method will fire upon class instantiation.
	Initialize wont fire on instantiation when you pass *null*.

Arguments:
	properties - the collection of properties that apply to the class.

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
		if (arguments[0] !== null && this.initialize && $type(this.initialize) == 'function') return this.initialize.apply(this, arguments);
		else return this;
	};
	$extend(klass, this);
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
		(start code)
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = Animal.extend({
			initialize: function(name, age){
				this.parent(age); //will call the previous initialize;
				this.name = name;
			}
		});
		var myCat = new Cat('Micia', 20);
		alert(myCat.name); //alerts 'Micia'
		alert(myCat.age); //alerts 20
		(end)
	*/

	extend: function(properties){
		var proto = new this(null);
		for (var property in properties){
			var pp = proto[property];
			proto[property] = $mergeClass(pp, properties[property]);
		}
		return new Class(proto);
	},

	/*
	Property: implement
		Implements the passed in properties to the base Class prototypes, altering the base class, unlike <Class.extend>.

	Arguments:
		properties - the properties to add to the base class.

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

	implement: function(properties){
		$extend(this.prototype, properties);
	}

};

/* Section: Utility Functions */

/*
Function: $type
	Returns the type of object that matches the element passed in.

Arguments:
	obj - the object to inspect.

Example:
	>var myString = 'hello';
	>$type(myString); //returns "string"

Returns:
	'element' - if obj is a DOM element node
	'textnode' - if obj is a DOM text node
	'whitespace' - if obj is a DOM whitespace node
	'array' - if obj is an array
	'object' - if obj is an object
	'string' - if obj is a string
	'number' - if obj is a number
	'boolean' - if obj is a boolean
	'function' - if obj is a function
	'regexp' - if obj is a regular expression
	false - (boolean) if the object is not defined or none of the above.
*/

function $type(obj){
	if (obj == undefined) return false;
	var type = typeof obj;
	if (type == 'object'){
		if (obj.htmlElement) return 'element';
		if (obj.push) return 'array';
		if (obj.nodeName){
			switch(obj.nodeType){
				case 1: return 'element';
				case 3: return obj.nodeValue.test(/\S/) ? 'textnode' : 'whitespace';
			}
		}
	}
	if ((type == 'object' || type == 'function') && obj.exec) return 'regexp';
	return type;
};

/*
Function: $merge
	merges a number of objects recursively without referencing them or their sub-objects.

Arguments:
	any number of objects.

Example:
	>var mergedObj = $merge(obj1, obj2, obj3);
	>//obj1, obj2, and obj3 are unaltered
*/

function $merge(){
	var mix = {};
	for (var i = 0; i < arguments.length; i++){
		for (var property in arguments[i]){
			var ap = arguments[i][property];
			var mp = mix[property];
			if (mp && $type(ap) == 'object' && $type(mp) == 'object') mix[property] = $merge(mp, ap);
			else mix[property] = ap;
		}
	}
	return mix;
};

//internal

function $mergeClass(previous, current){
	if (previous && previous != current){
		var ptype = $type(previous);
		var ctype = $type(current);
		if (ptype == 'function' && ctype == 'function'){
			var merged = function(){
				this.parent = arguments.callee.parent;
				return current.apply(this, arguments);
			};
			merged.parent = previous;
			return merged;
		} else if (ptype == 'object' && ctype == 'object'){
			return $merge(previous, current);
		}
	}
	return current;
};

/*
Function: $extend
	Copies all the properties from the second passed object to the first passed Object.
	If you do myWhatever.extend = $extend the first parameter will become myWhatever, and your extend function will only need one parameter.

Example:
	(start code)
	var firstOb = {
		'name': 'John',
		'lastName': 'Doe'
	};
	var secondOb = {
		'age': '20',
		'sex': 'male',
		'lastName': 'Dorian'
	};
	$extend(firstOb, secondOb);
	//firstOb will become:
	{
		'name': 'John',
		'lastName': 'Dorian',
		'age': '20',
		'sex': 'male'
	};
	(end)

Returns:
	The first object, extended.
*/

var $extend = Object.extend = function(){
	var args = arguments;
	if (!args[1]) args = [this, args[0]];
	for (var property in args[1]) args[0][property] = args[1][property];
	return args[0];
};

/*
Function: $native
	Will add a .extend method to the objects passed as a parameter, but the property passed in will be copied to the object's prototype only if non previously existent.
	Its handy if you dont want the .extend method of an object to overwrite existing methods.
	Used automatically in mootools to implement Array/String/Function/Number methods to browser that dont support them whitout manual checking.

Arguments:
	a number of classes/native javascript objects

*/

var $native = Object.Native = function(){
	for (var i = 0; i < arguments.length; i++) arguments[i].extend = $native.extend;
};

$native.extend = function(props){
	for (var prop in props){
		if (!this.prototype[prop]) this.prototype[prop] = props[prop];
	}
};

$native(Function, Array, String, Number, Class);