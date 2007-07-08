Tests.Core = new Test.Suite('Core', {
	
	$type: function(){
		
		var element = document.createElement('div');
		
		var objects = [10, '', [], {}, document.getElementsByTagName('*'), element, new Class({}), function(){}, arguments, false, true, null, undefined];

		var types = ['number', 'string', 'array', 'object', 'collection', 'element', 'class', 'function', 'arguments', 'boolean', 'boolean', false, false];

		for (var i = 0; i < objects.length; i++){
			if (!$equals($type(objects[i]), types[i])) return false;
		}

		return true;
	},
	
	$random: function(){
		var num = $random(0, 10);
		return Test.all(
			$equals(num >= 0, true),
			$equals(num <= 10, true)
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
		
		return Test.all(
			$equals(x, false),
			$equals(y, binder),
			$equals(z, argument),
			$equals(k, 'success')
		);
	},
	
	$extend: function(){
		var ob1 = {a: 1, b: 2};
		var ob2 = {a: 5, b: 3, c: 4};
		$extend(ob1, ob2);
		return Test.all(
			$equals(ob1.b, 3),
			$equals(ob2.b, 3),
			$equals(ob1.c, 4),
			$equals(ob1.a, 5)
		);
	},
	
	$merge: function(){
		var ob1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var ob2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var ob3 = {a: {a: 3}, b: 3, c: false};
		var merged = $merge(ob1, ob2, ob3);
		return Test.all(
			$equals(ob1.a.a, 1),
			$equals(ob2.a.a, 2),
			$equals(ob3.a.a, 3),
			$equals(merged.a.a, 3),
			$equals(merged.a.b, 8),
			$equals(merged.c, false)
		);
	},
	
	$clear: function(){
		var timeout = setTimeout(function(){}, 100);
		var periodical = setTimeout(function(){}, 100);
		
		timeout = $clear(timeout);
		periodical = $clear(periodical);
		
		return Test.all(
			$equals(timeout, null),
			$equals(periodical, null)
		);
	},
	
	$splat: function(){
		var arr = [1, 2, 3];
		var val = 1;
		return Test.all(
			$equals($splat(val).toString(), [1].toString()),
			$equals($splat(arr), arr),
			$equals($splat(null), null)
		);
	},
	
	$pick: function(){
		var arr = [];
		var picked1 = $pick(null, undefined, false, arr, {});
		var picked2 = $pick(null, undefined, arr);

		return Test.all(
			$equals(picked1, false),
			$equals(picked2, arr)
		);
	},
	
	$chk: function(){
		return Test.all(
			$equals($chk(0), true),
			$equals($chk(false), false),
			$equals($chk(true), true),
			$equals($chk(undefined), false),
			$equals($chk(''), false)
		);
	},
	
	$defined: function(){
		return Test.all(
			$equals($defined(''), true),
			$equals($defined(false), true),
			$equals($defined(0), true),
			$equals($defined(null), false),
			$equals($defined(undefined), false)
		);
	},
	
	Native: function(){
		window.Instrument = function(name){
			this.name = name;
		};
		
		Native(Instrument);
		
		Native.type('Instrument');
		
		Instrument.extend({
			
			method: function(a, b, c){
				return this.property + a + b + c + this.name;
			},
			
			property: 'stuff'
			
		});
		
		Instrument.extend({
			
			property: 'staff'
			
		});
		
		var myInstrument = new Instrument('xeelophone');
		
		return Test.all(
			$equals(myInstrument.method('a', 'b', 'c'), 'stuffabcxeelophone'),
			$equals(Instrument.method(myInstrument, 'a', 'b', 'c'), 'stuffabcxeelophone'),
			$equals($type(myInstrument), 'instrument')
		);
	}
	
});