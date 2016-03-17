Class {#Class}
======================

The base Class of the [MooTools](http://mootools.net/) framework.

Class Method: constructor {#Class:constructor}
----------------------------------------------

### Syntax:

	var MyClass = new Class(properties);

### Arguments:

1. properties - Can be one of the following types:
	* (*object*) The collection of properties that apply to the Class. Also accepts some special properties such as Extends, Implements, and initialize (see below).
	* (*function*) The initialize function (see below).

#### Property: Extends

* (*class*) The Class that this class will extend.

The methods of this Class that have the same name as the Extends Class, will have a parent property, that allows you to call the other overridden method.
The Extends property should be the first property in a class definition.

#### Property: Implements

* (*class*)  The properties of a passed Class will be copied into the target Class.
* (*array*)  An array of Classes, the properties of which will be copied into this Class.

Implements is similar to Extends, except that it adopts properties from one or more other classes without inheritance.
Useful when implementing a default set of properties in multiple Classes. The Implements property should come after Extends but before all other properties.

#### Property: initialize

* (*function*) The initialize function will be the constructor for this class when new instances are created.

#### Property: toElement

* (*function*) A method which returns an element. This method will be automatically called when passing an instance of a class in the [document.id][] function.


### Returns:

* (*class*) The created Class.

### Examples:

#### Class Example:

	var Cat = new Class({
		initialize: function(name){
			this.name = name;
		}
	});
	var myCat = new Cat('Micia');
	alert(myCat.name); // alerts 'Micia'

	var Cow = new Class({
		initialize: function(){
			alert('moooo');
		}
	});

#### Extends Example:

	var Animal = new Class({
		initialize: function(age){
			this.age = age;
		}
	});
	var Cat = new Class({
		Extends: Animal,
		initialize: function(name, age){
			this.parent(age); // calls initialize method of Animal class
			this.name = name;
		}
	});
	var myCat = new Cat('Micia', 20);
	alert(myCat.name); // alerts 'Micia'.
	alert(myCat.age); // alerts 20.

#### Implements Example:

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
	var myAnimal = new Cat(20);
	myAnimal.setName('Micia');
	alert(myAnimal.name); // alerts 'Micia'.




Class Method: implement {#Class:implement}
------------------------------------------

Implements the passed in properties into the base Class prototypes, altering the base Class.
The same as creating a [new Class](#Class:constructor) with the Implements property, but handy when you need to modify existing classes.

### Syntax:

	MyClass.implement(properties);

### Arguments:

1. properties - (*object*) The properties to add to the base Class.

### Examples:

	var Animal = new Class({
		initialize: function(age){
			this.age = age;
		}
	});
	Animal.implement({
		setName: function(name){
			this.name = name;
		}
	});
	var myAnimal = new Animal(20);
	myAnimal.setName('Micia');
	alert(myAnimal.name); // alerts 'Micia'

[document.id]: /core/Element/Element#Window:document-id
