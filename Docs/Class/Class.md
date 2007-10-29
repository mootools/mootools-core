Native: Class {#Class}
======================

The base Class of the [MooTools](http://mootools.net/) framework.

Class Method: constructor {#Class:constructor}
----------------------------------------------

### Syntax:

	var MyClass = new Class(properties);

### Arguments:

1. properties - (object) The collection of properties that apply to the Class. Also accepts some special properties such as Extends, Implements, and initialize (see below).

#### Property: Extends

* (class) The Class that this class will extend.

The methods of This Class that have the same name as the Extends Class, will have a parent property, that allows you to call the other overridden method.

#### Property: Implements

* (object) An object which properties will be copied into this Class.
* (class) A Class which properties will be copied into this Class.
* (array) An array of objects or Classes which properties will be copied into this Class.

Similar to Extends, but it simply overrides the properties, without inheritanc.
Useful when implementing a default set of properties in multiple Classes.

#### Property: initialize

* (function) The initialize function will be the constructor for this class when new instances are created.

### Returns:

* (class) The Class created.

### Examples:

#### Class Example:

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

#### Extends Example:

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
	var myCat = new Cat(20);
	myAnimal.setName('Micia');
	alert(myAnimal.name); //alerts 'Micia'




Class Method: implement {#Class:implement}
------------------------------------------

Implements the passed in properties into the base Class prototypes, altering the base Class.
The same as creating a [new Class](#Class:constructor) with the Implements property, but handy when you need to modify existing classes.

### Syntax:

	MyClass.implement(properties);

### Arguments:

1. properties - (object) The properties to add to the base Class.

### Example:

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
