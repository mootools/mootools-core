/*
Script: Class.js
	Specs for Class.js

License:
	MIT-style license.
*/

describe('Class', {

	'before all': function(){
		this.local.Animal = new Class({

			initialized: false,

			initialize: function(name){
				this.initialized = true;
				this.name = name;
			},

			sleep: function(){
				return 'zzzz';
			}

		});

		this.local.Actions = new Class({
			eat: function(){
				return 'yum!';
			},

			sleep: function(){
				return 'zzzz';
			}
		});

		this.local.Attributes = new Class({
			color: function(){
				return 'green';
			},

			size: function(){
				return 'small';
			}
		});
	},

	"should be type 'class'": function(){
		value_of(Class.type(this.local.Animal)).should_be_true();
	},

	'should initialize': function(){
		var init = new this.local.Animal();
		value_of(init.initialized).should_be_true();
	},

	'should not initialize if passed $empty': function(){
		var noInit = new this.local.Animal($empty);
		value_of(noInit.initialized).should_be_false();
	},

	'should use property Extends to extend another class': function(){
		var Cat = new Class({
			Extends: this.local.Animal,

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

			Implements: this.local.Animal

		});

		var myCat = new Cat();
		value_of(myCat.sleep()).should_be('zzzz');
	},

	'should use property Implements to implement any number of classes': function(){
		var Cat = new Class({

			Extends: this.local.Animal,

			Implements: [this.local.Actions, this.local.Attributes]

		});

		var myCat = new Cat();

		value_of(myCat.initialized).should_be_true();
		value_of(myCat.eat()).should_be('yum!');
		value_of(myCat.color()).should_be('green');
	},

	'should implement an object': function(){
		this.local.Animal.implement(new this.local.Actions);

		var myAnimal = new this.local.Animal('fuzzy');

		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
	},

	'should implement any number of objects': function(){
		this.local.Animal.implement(new this.local.Actions, new this.local.Attributes);

		var myAnimal = new this.local.Animal('fuzzy');

		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
		value_of(myAnimal.color()).should_be('green');
		value_of(myAnimal.size()).should_be('small');
	}

});