/*
Script: Class.js
	Unit Tests for Class.js

License:
	MIT-style license.
*/

Tests.Class = new Test.Suite('Class', {

	empty: function(){
		this.end(
			Assert.equals(Class.empty, $empty)
		);	
	},
	
	initialize: function(){
		var Cart = new Class({
			milk: false,
			
			initialize: function(prop, val){
				this.milk = true;
				if($pick(prop, val)) this[prop] = val;
			}
		});
		var Milky = new Cart();
		var NoMilk = new Cart($empty);
		
		this.end(
			Assert.isTrue(Milky.milk),
			Assert.isFalse(NoMilk.milk)
		);
	},
	
	Implements: function(){
		var Car = new Class({
			move: function(){
				this.msg = 'vvvrrroooommmmm';
				this.moving = true;
			}
		});
		
		var Aux = new Class({
			radio: function(){
				this.listening = true;	
			},
			
			wipers: function(){
				this.wiping = true;	
			}
		});
		
		var GoKart = new Class({
			Implements: Car,
			
			initialize: function(character) {
				this.player = character;
				this.move();
			},
			
			move: function(){
				this.msg = 'vroom vroom';
			}
		});
		
		var Honda = new Class({
			Implements: [Car, Aux],
			
			initialize: function(){
				this.move();
				this.radio();
				this.wipers();
			},
			
			move: function(){
				this.msg = 'vroom vroom';
			}
		});
		
		var MarioKart = new GoKart('Luigi');
		var SoopedCar = new Honda();
		
		this.end(
			Assert.equals(MarioKart.player, 'Luigi'),
			Assert.equals(MarioKart.msg, 'vvvrrroooommmmm'),
			
			Assert.equals(SoopedCar.msg, 'vvvrrroooommmmm'),
			Assert.isTrue(SoopedCar.wiping),
			Assert.isTrue(SoopedCar.listening)
		);
		
	},
	
	Extends: function(){
		var Car = new Class({
			move: function(){
				return 'vvvrrroooommmmm';
			},
			
			radio: function(){
				return 'RF';
			}
		});
		
		var Mercedes = new Class({
			Extends: [Car],
			
			move: function(){
				return this.parent();
			},
			
			radio: function(){
				return 'XM';	
			}
		});
		
		var myCar = new Mercedes();
		
		this.end(			
			Assert.equals(myCar.move(), 'vvvrrroooommmmm'),
			Assert.equals(myCar.radio(), 'XM')
		);
	},
	
	genericImplement: function(){
		var aClass = new Class({
			methodA: function(){
				return false;	
			},
			methodB: function(){
				return true;	
			}
		});
		
		var res = Class.implement(aClass);
		
		this.end(
			Assert.isFalse(res.methodA()),
			Assert.isTrue(res.methodB())
		);		
	},
	
	genericMerge: function(){
		var fn = function(){
			return 'parent fn';	
		};
		
		var mergeFn = Class.merge(fn, function(){
			return this.parent();
		});
		
		var mergeObj = Class.merge({a: 1}, {b: 2});
		
		this.end(
			Assert.isTrue(Class.merge(null, true)),
			Assert.isFalse(Class.merge(true, false)),
			Assert.equals(Class.merge('test', 'test')),
			Assert.equals(mergeFn(), 'parent fn'),
			Assert.equals(mergeObj.a, 1),
			Assert.equals(mergeObj.b, 2)
		);
	},
	
	genericExtend: function(){
		var Tools = new Class({
			methodA: function(){
				return this.parent();	
			},
			methodB: function(){
				return 'methodB';	
			}
		});
		
		var myClass = new Class({
			initialize: function(name) {
				this.name = name;	
			},
			
			methodA: function(){
				return 'parent methodA';
			},
			
			methodB: function(){
				return 'parent methodB';	
			}
		});
		
		var res = Class.extend(myClass, Tools);
		
		this.end(
			Assert.equals(res.methodA(), 'parent methodA'),
			Assert.isTrue(res.methodB(), 'methodB')
		);		
	},	
	
	proto: function(){
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = Animal.extend({
			initialize: function(name, age){
				this.parent(age);
				this.name = name;
			}
		});
		var myCat = new Cat('Micia', 20);
		
		var Mammal = new Class({
			initialize: function(family){
				this.family = family;
			}
		});
		Mammal.implement({
			roar: function(){
				this.roaring = true;
			}
		});
		var myLion = new Mammal('Felidae');
		myLion.roar();
		
		this.end(
			Assert.equals(Animal.constructor, 'class'),
			Assert.equals(myCat.age, 20),
			Assert.isTrue(myLion.roaring)
		);
	}

});