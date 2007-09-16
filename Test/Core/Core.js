/*
Script: Core.js
	Unit Tests for Core.js

License:
	MIT-style license.
*/

Tests.Core = new Test.Suite('Core', {
	
	$type: function(){
		
		var element = document.createElement('div');
		
		var objects = [10, '', [], {}, document.getElementsByTagName('*'), element, new Class({}), function(){}, arguments, false, true, null, undefined];

		var types = ['number', 'string', 'array', 'object', 'collection', 'element', 'class', 'function', 'arguments', 'boolean', 'boolean', false, false];
		
		var all = true;

		for (var i = 0; i < objects.length; i++){
			if (!Assert.type(objects[i], types[i])) all = false;
		}

		this.end(all);
	},
	
	$random: function(){
		var num = $random(0, 10);
		this.end(
			Assert.isTrue(num >= 0),
			Assert.isTrue(num <= 10)
		);
	},
	
	$try: function(){
		var y;
		var z;
		
		var binder = {'a': 1, 'b': 2, 'c': 3};
		var argument = {'a': 4, 'b': 5, 'c': 6};
		
		var x = $try(function(stuff){
			y = this;
			z = stuff;
			me_invented_the_function_name();
		}, binder, argument);
		
		var k = $try(function(){
			return 'success';
		});
		
		this.end(
			Assert.isFalse(x),
			Assert.equals(y, binder),
			Assert.equals(z, argument),
			Assert.equals(k, 'success')
		);
	},
	
	$extend: function(){
		var ob1 = {a: 1, b: 2};
		var ob2 = {a: 5, b: 3, c: 4};
		$extend(ob1, ob2);
		this.end(
			Assert.equals(ob1.b, 3),
			Assert.equals(ob2.b, 3),
			Assert.equals(ob1.c, 4),
			Assert.equals(ob1.a, 5)
		);
	},
	
	$merge: function(){
		var ob1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var ob2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var ob3 = {a: {a: 3}, b: 3, c: false};
		var merged = $merge(ob1, ob2, ob3);
		this.end(
			Assert.equals(ob1.a.a, 1),
			Assert.equals(ob2.a.a, 2),
			Assert.equals(ob3.a.a, 3),
			Assert.equals(merged.a.a, 3),
			Assert.equals(merged.a.b, 8),
			Assert.isFalse(merged.c)
		);
	},
	
	$clear: function(){
		var timeout = setTimeout(function(){}, 100);
		var periodical = setTimeout(function(){}, 100);
		
		timeout = $clear(timeout);
		periodical = $clear(periodical);
		
		this.end(
			Assert.equals(timeout, null),
			Assert.equals(periodical, null)
		);
	},
	
	$splat: function(){
		var arr = [1, 2, 3];
		var val = 1;
		this.end(
			Assert.stringEquals($splat(val), [1]),
			Assert.equals($splat(arr), arr),
			Assert.equals($splat(null), null)
		);
	},
	
	$pick: function(){
		var arr = [];
		var picked1 = $pick(null, undefined, false, arr, {});
		var picked2 = $pick(null, undefined, arr);

		this.end(
			Assert.isFalse(picked1),
			Assert.equals(picked2, arr)
		);
	},
	
	$chk: function(){
		this.end(
			Assert.isTrue($chk(0)),
			Assert.isFalse($chk(false)),
			Assert.isTrue($chk(true)),
			Assert.isFalse($chk(undefined)),
			Assert.isFalse($chk(''))
		);
	},
	
	$defined: function(){
		this.end(
			Assert.isTrue($defined('')),
			Assert.isTrue($defined(false)),
			Assert.isTrue($defined(0)),
			Assert.isFalse($defined(null)),
			Assert.isFalse($defined(undefined))
		);
	},
	
	Native: function(){
		var Instrument = new Native({
			
			name: 'instrument',
			
			initialize: function(name){
				this.name = name;
			}

		});
		
		Instrument.implement({
			
			method: function(a, b, c){
				return this.property + a + b + c + this.name;
			},
			
			property: 'stuff'
			
		});
		
		Instrument.implement({
			
			property: 'staff'
			
		});
		
		var myInstrument = new Instrument('xeelophone');
		
		this.end(
			Assert.equals(myInstrument.method('a', 'b', 'c'), 'staffabcxeelophone'),
			Assert.equals(Instrument.method(myInstrument, 'a', 'b', 'c'), 'staffabcxeelophone'),
			Assert.equals($type(myInstrument), 'instrument')
		);
	}
	
});