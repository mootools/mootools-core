/*
---
name: Class
requires: ~
provides: ~
...
*/

(function(){

var Animal = new Class({

	initialized: false,

	initialize: function(name, sound){
		this.name = name;
		this.sound = sound || '';
		this.initialized = true;
	},

	eat: function(){
		return 'animal:eat:' + this.name;
	},

	say: function(){
		return 'animal:say:' + this.name;
	}

});

var Cat = new Class({

	Extends: Animal,

	ferocious: false,

	initialize: function(name, sound){
		this.parent(name, sound || 'miao');
	},

	eat: function(){
		return 'cat:eat:' + this.name;
	},

	play: function(){
		return 'cat:play:' + this.name;
	}

});

var Lion = new Class({

	Extends: Cat,

	ferocious: true,

	initialize: function(name){
		this.parent(name, 'rarr');
	},

	eat: function(){
		return 'lion:eat:' + this.name;
	}

});

var Actions = new Class({

	jump: function(){
		return 'actions:jump:' + this.name;
	},

	sleep: function(){
		return 'actions:sleep:' + this.name;
	}

});

var Attributes = new Class({

	color: function(){
		return 'attributes:color:' + this.name;
	},

	size: function(){
		return 'attributes:size:' + this.name;
	}

});

describe('Class creation', function(){

//<1.2compat>
	it('Classes should be of type "class"', function(){
		expect($type(Animal)).to.equal('class');
		expect(Class.type(Animal)).to.equal(true);
	});
//</1.2compat>

	it('Classes should be of type "class"', function(){
		expect(typeOf(Animal)).to.equal('class');
	});

	it('should call initialize upon instantiation', function(){
		var animal = new Animal('lamina');
		expect(animal.name).to.equal('lamina');
		expect(animal.initialized).to.equal(true);
		expect(animal.say()).to.equal('animal:say:lamina');
	});

	it('should use "Extend" property to extend another class', function(){
		var cat = new Cat('fluffy');
		expect(cat.name).to.equal('fluffy');
		expect(cat.sound).to.equal('miao');
		expect(cat.ferocious).to.equal(false);
		expect(cat.say()).to.equal('animal:say:fluffy');
		expect(cat.eat()).to.equal('cat:eat:fluffy');
		expect(cat.play()).to.equal('cat:play:fluffy');
	});

	it('should use "Extend" property to extend an extended class', function(){
		var leo = new Lion('leo');
		expect(leo.name).to.equal('leo');
		expect(leo.sound).to.equal('rarr');
		expect(leo.ferocious).to.equal(true);
		expect(leo.say()).to.equal('animal:say:leo');
		expect(leo.eat()).to.equal('lion:eat:leo');
		expect(leo.play()).to.equal('cat:play:leo');
	});

	it('should use "Implements" property to implement another class', function(){
		var Dog = new Class({
			Implements: Animal
		});

		var rover = new Dog('rover');
		expect(rover.name).to.equal('rover');
		expect(rover.initialized).to.equal(true);
		expect(rover.eat()).to.equal('animal:eat:rover');
	});

	it('should use "Implements" property to implement any number of classes', function(){
		var Dog = new Class({
			Extends: Animal,
			Implements: [Actions, Attributes]
		});

		var rover = new Dog('rover');
		expect(rover.initialized).to.equal(true);
		expect(rover.eat()).to.equal('animal:eat:rover');
		expect(rover.say()).to.equal('animal:say:rover');
		expect(rover.jump()).to.equal('actions:jump:rover');
		expect(rover.sleep()).to.equal('actions:sleep:rover');
		expect(rover.size()).to.equal('attributes:size:rover');
		expect(rover.color()).to.equal('attributes:color:rover');
	});

	it('should alter the prototype of a Class when implementing new methods', function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');

		Dog.implement({
			jump: function(){
				return 'dog:jump:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.jump()).to.equal('dog:jump:spot');
		expect(rover.jump()).to.equal('dog:jump:rover');
	});

	it('should alter the prototype of a Class when implementing new methods into the super class', function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');

		Animal.implement({
			jump: function(){
				return 'animal:jump:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.jump()).to.equal('animal:jump:spot');
		expect(rover.jump()).to.equal('animal:jump:rover');
	});

	it('should alter the prototype of a Class when overwriting methods in the super class', function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');
		expect(rover.say()).to.equal('animal:say:rover');

		Animal.implement({
			say: function(){
				return 'NEW:animal:say:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.say()).to.equal('NEW:animal:say:spot');
		expect(rover.say()).to.equal('NEW:animal:say:rover');
	});

});

describe('Class::implement', function(){

	it('should implement an object', function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions);

		var rover = new Dog('rover');

		expect(rover.name).to.equal('rover');
		expect(rover.jump()).to.equal('actions:jump:rover');
		expect(rover.sleep()).to.equal('actions:sleep:rover');
	});

	it('should implement any number of objects', function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions).implement(new Attributes);

		var rover = new Dog('rover');

		expect(rover.name).to.equal('rover');
		expect(rover.jump()).to.equal('actions:jump:rover');
		expect(rover.sleep()).to.equal('actions:sleep:rover');
		expect(rover.size()).to.equal('attributes:size:rover');
		expect(rover.color()).to.equal('attributes:color:rover');
	});

});

describe('Class toString', function(){

	it('should allow to implement toString', function(){
		var Person = new Class({

			initialize: function(name){
				this.name = name;
			},

			toString: function(){
				return this.name;
			}

		});

		var Italian = new Class({

			Extends: Person,

			toString: function(){
				return "It's me, " + this.name;
			}

		});

		expect((new Person('Valerio')) + '').to.equal('Valerio');
		expect((new Italian('Valerio')) + '').to.equal("It's me, Valerio");
	});

});

describe('Class.toElement', function(){

	var MyParentElement = new Class({

		initialize: function(element){
			this.element = element;
		},

		toElement: function(){
			return this.element;
		}

	});

	var MyChildElement = new Class({

		Extends: MyParentElement,

		initialize: function(element){
			this.parent(element);
		}

	});

	var MyArrayElement = new Class({

		Extends: Array,

		initialize: function(element){
			this.element = element;
		},

		toElement: function(){
			return this.element;
		}

	});

	var dit = (typeof Element === 'undefined' ? xit : it);

	dit('should return an element when a class instance is passed to document.id', function(){
		var element = new Element('div', {'class': 'my-element'});
		var instance = new MyParentElement(element);

		expect(document.id(instance)).to.equal(element);
	});

	dit('should call the toElement() method in parent class if none is defined in child', function(){
		var element = new Element('div', {'class': 'my-element'});
		var instance = new MyChildElement(element);

		expect(document.id(instance)).to.equal(element);
		expect(instance instanceof MyParentElement).to.equal(true);
	});

	dit('should call toElement() when extending natives (String, Array, Object)', function(){
		var element = new Element('div', {'class': 'my-element'});
		var instance = new MyArrayElement(element);

		expect(document.id(instance)).to.equal(element);
		expect(instance instanceof Array).to.equal(true);
	});

});

})();
