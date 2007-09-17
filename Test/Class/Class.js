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
				this.msg = 'vroooom';
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
			Assert.equals(MarioKart.msg, 'vroooom'),

			Assert.equals(SoopedCar.msg, 'vroooom'),
			Assert.isTrue(SoopedCar.wiping),
			Assert.isTrue(SoopedCar.listening)
		);

	},

	Extends: function(){
		var Car = new Class({
			move: function(){
				return 'vroooom';
			},

			radio: function(){
				return 'FM';
			}
		});

		var Mercedes = new Class({
			Extends: Car,

			move: function(){
				return this.parent();
			},

			radio: function(){
				return 'XM';
			}
		});

		var myCar = new Car();
		var myMercedes = new Mercedes();

		this.end(
			Assert.equals(myCar.move(), 'vroooom'),
			Assert.equals(myCar.radio(), 'FM'),
			Assert.equals(myMercedes.move(), 'vroooom'),
			Assert.equals(myMercedes.radio(), 'XM')
		);
	},

	genericImplement: function(){
		var ClassA = new Class({
			method: function(){
				return 'method';
			}
		});

		var ClassB = new Class({
			trueMethod: function(){
				return true;
			},
			falseMethod: function(){
				return false;
			}
		});

		ClassA.implement(new ClassB);
		var myClass = new ClassA();

		this.end(
			Assert.isTrue(myClass.trueMethod()),
			Assert.isFalse(myClass.falseMethod()),
			Assert.equals(myClass.method(), 'method')
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
			Assert.equals(Class.merge('test', 'test'), 'test'),
			Assert.equals(mergeFn(), 'parent fn'),
			Assert.equals(mergeObj.a, 1),
			Assert.equals(mergeObj.b, 2)
		);
	},

	genericExtends: function(){
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

		var res = Class.Extends(myClass, new Tools());

		this.end(
			Assert.equals(res.methodA(), 'parent methodA'),
			Assert.equals(res.methodB(), 'methodB')
		);
	},

	proto: function(){
		var Animal = new Class({
			initialize: function(age){
				this.age = age;
			}
		});
		var Cat = Animal.extend({
			initialize: function(name, age, coloring){
				this.coloring = coloring;
				this.parent(age);
				this.name = name;
			}
		});
		var myCat = new Cat('Micia', 20, 'tortoiseshell');

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
			Assert.equals(Animal.constructor, Class),
			Assert.equals(myCat.constructor, Cat),
			Assert.equals(myCat.coloring, 'tortoiseshell'),
			Assert.equals(myCat.age, 20),
			Assert.equals(myCat.name, 'Micia'),
			Assert.equals(myLion.family, 'Felidae'),
			Assert.isTrue(myLion.roaring)
		);
	},

	Hash: function(){
		var emptyHash = new Hash();
		var aHash = new Hash({
			methodA: function(){
				return true;
			},

			methodB: function(){
				return 'methodB';
			},

			methodC: $empty
		});

		aHash.remove('methodC');


		var eachRes = true;
		aHash.each(function(fn) {
			if(!fn()) eachRes = false;
		});

		this.end(
			Assert.isType(emptyHash.extend, 'function'),
			Assert.isType(emptyHash.each, 'function'),
			Assert.isType(emptyHash.remove, 'function'),
			Assert.isTrue(!$defined(aHash.methodC)),
			eachRes
		);
	}

});