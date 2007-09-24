/*
Script: Class.js
	Specs for Class.js

License:
	MIT-style license.
*/

describe('Class', {

	initialize: function(){
		var Animal = new Class({
			initialized: false,

			initialize: function(){
				this.initialized = true;
			}
		});
		
		var init = new Animal();
		var noInit = new Animal($empty);
		
		value_of(init.initialized).should_be_true();
		value_of(noInit.initialized).should_be_false();
	},
	
	Extends: function(){
		var Animal = new Class({
			initialize: function(name){
				this.name = name;
			},
			
			sleep: function(){
				return 'zzzz';
			}
		});

		var Cat = new Class({
			Extends: Animal,

			initialize: function(name, color){
				this.parent(name);
				this.color = color;
				this.ferocious = false;
			},
			
			speak: function(){
				return 'miao';
			}
		});

		var Lion = new Class({
			Extends: Cat,

			initialize: function(name, type){
				this.parent(name, 'gold');
				this.type = type;
				this.ferocious = true;
			},
			
			speak: function(){
				return 'rarr';
			},
			
			sleep: function(){
				return 'grrr';
			}
		});
		
		var myAnimal = new Animal('fuzzy');
		var myCat = new Cat('furry', 'green');
		var myLion = new Lion('fluffy', 'mountain');
		
		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.sleep()).should_be('zzzz');

		value_of(myCat.name).should_be('furry');
		value_of(myCat.color).should_be('green');
		value_of(myCat.ferocious).should_be_false();
		value_of(myCat.sleep()).should_be('zzzz');
		value_of(myCat.speak()).should_be('miao');
		
		value_of(myLion.name).should_be('fluffy');
		value_of(myLion.color).should_be('gold');
		value_of(myLion.type).should_be('mountain');
		value_of(myLion.ferocious).should_be_true();
		value_of(myLion.sleep()).should_be('grrr');
		value_of(myLion.speak()).should_be('rarr');
	},
	
	Implement: function(){
		var Actions = new Class({
			eat: function(){
				return 'yum!';
			},
			
			sleep: function(){
				return 'zzzz';
			}
		});
		
		var Attributes = new Class({
			color: function(){
				return 'green';
			},
			
			size: function(){
				return 'small';
			}			
		});
		
		var Animal = new Class({
			Implements: Actions,
			
			initialize: function(name){
				this.name = name;
			}
		});
		
		var Cat = new Class({
			Implements: [Actions, Attributes],
			
			initialize: function(name){
				this.name = name;
			}
		});
		
		var myAnimal = new Animal('fuzzy');
		var myCat = new Cat('furry');
		
		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
		
		value_of(myCat.name).should_be('furry');
		value_of(myCat.eat()).should_be('yum!');
		value_of(myCat.sleep()).should_be('zzzz');
		value_of(myCat.color()).should_be('green');
		value_of(myCat.size()).should_be('small');
	},

	Implement_after_declaration: function(){
		var Actions = new Class({
			eat: function(){
				return 'yum!';
			},
			
			sleep: function(){
				return 'zzzz';
			}
		});
		
		var Attributes = new Class({
			color: function(){
				return 'green';
			},
			
			size: function(){
				return 'small';
			}			
		});
		
		var Animal = new Class({
			initialize: function(name){
				this.name = name;
			}
		});
		
		Animal.implement(new Actions);
		
		var Cat = new Class({
			initialize: function(name){
				this.name = name;
			}
		});
		
		Cat.implement(new Actions, new Attributes);
		
		var myAnimal = new Animal('fuzzy');
		var myCat = new Cat('furry');
		
		value_of(myAnimal.name).should_be('fuzzy');
		value_of(myAnimal.eat()).should_be('yum!');
		value_of(myAnimal.sleep()).should_be('zzzz');
		
		value_of(myCat.name).should_be('furry');
		value_of(myCat.eat()).should_be('yum!');
		value_of(myCat.sleep()).should_be('zzzz');
		value_of(myCat.color()).should_be('green');
		value_of(myCat.size()).should_be('small');
	}
	
});