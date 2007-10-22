/*
Script: Class.js
	Specs for Class.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe('Class', {

	'before all': function(){
		Local.Animal = new Class({

			initialized: false,

			initialize: function(name){
				this.initialized = true;
				this.name = name;
			},

			sleep: function(){
				return 'zzzz';
			}

		});

		Local.Actions = new Class({
			eat: function(){
				return 'yum!';
			},

			sleep: function(){
				return 'zzzz';
			}
		});

		Local.Attributes = new Class({
			color: function(){
				return 'green';
			},

			size: function(){
				return 'small';
			}
		});
	},

	"should be type 'class'": function(){
		value_of(Class.type(Local.Animal)).should_be_true();
	},

	'should initialize': function(){
		var init = new Local.Animal();
		value_of(init.initialized).should_be_true();
	},

	'should not initialize if passed $empty': function(){
		var noInit = new Local.Animal($empty);
		value_of(noInit.initialized).should_be_false();
	},

	'should use property Extends to extend another class': function(){
		var Cat = new Class({
			Extends: Local.Animal,

			initialize: function(name, color){
				arguments.callee.parent(name);
				this.color = color;
				this.ferocious = false;
			},

			speak: function(){
				return 'miao';
			}
		});

		var myCat = new Cat('furry', 'green');
		value_of(myCat.name).should_be('furry');
		value_of(myCat.color).should_be('green');
		value_of(myCat.ferocious).should_be_false();
		value_of(myCat.sleep()).should_be('zzzz');
		value_of(myCat.speak()).should_be('miao');
	},

	'should use property Implements to implement another class': function(){
		var Cat = new Class({

			Implements: Local.Animal

		});

		var myCat = new Cat();
		value_of(myCat.sleep()).should_be('zzzz');
	},

	'should use property Implements to implement any number of classes': function(){
		var Cat = new Class({

			Extends: Local.Animal,

			Implements: [Local.Actions, Local.Attributes]

		});

		var myCat = new Cat();

		value_of(myCat.initialized).should_be_true();
		value_of(myCat.eat()).should_be('yum!');
		value_of(myCat.color()).should_be('green');
	},

	'should implement an object': function(){
		Local.Animal.implement(new Local.Actions);

		var myAnimal = new Local.Animal('fuzzy');

		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
	},

	'should implement any number of objects': function(){
		Local.Animal.implement(new Local.Actions, new Local.Attributes);

		var myAnimal = new Local.Animal('fuzzy');

		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
		value_of(myAnimal.color()).should_be('green');
		value_of(myAnimal.size()).should_be('small');
	}

});