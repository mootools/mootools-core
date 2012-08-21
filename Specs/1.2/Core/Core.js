/*
Script: Core.js
	Public Specs for Core.js 1.2

License:
	MIT-style license.
*/

describe('$A', {

	'should return a copy for an array': function(){
		var arr1 = [1,2,3];
		var arr2 = $A(arr1);
		expect(arr1 !== arr2).toBeTruthy();
	},

	'should return an array for an Elements collection': function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = $A(div1.getElementsByTagName('*'));
		expect(Array.type(array)).toBeTruthy();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return $A(arguments);
		};
		var arr = fnTest(1,2,3);
		expect(Array.type(arr)).toBeTruthy();
		expect(arr.length).toEqual(3);
	}

});

describe('$arguments', {

	'should return the argument passed according to the index': function(){
		expect($arguments(0)('a','b','c','d')).toEqual('a');
		expect($arguments(1)('a','b','c','d')).toEqual('b');
		expect($arguments(2)('a','b','c','d')).toEqual('c');
		expect($arguments(3)('a','b','c','d')).toEqual('d');
	}

});

describe('$chk', {

	'should return false on false': function(){
		expect($chk(false)).toBeFalsy();
	},

	'should return false on null': function(){
		expect($chk(null)).toBeFalsy();
	},

	'should return false on undefined': function(){
		expect($chk(undefined)).toBeFalsy();
	},

	'should return true on 0': function(){
		expect($chk(0)).toBeTruthy();
	},

	'should return true for any truthsie': function(){
		expect($chk(1)).toBeTruthy();
		expect($chk({})).toBeTruthy();
		expect($chk(true)).toBeTruthy();
	}

});

describe('$clear', {

	'should clear timeouts': function(){
		var timeout = setTimeout(function(){}, 100);
		expect($clear(timeout)).toBeNull();
	},

	'should clear intervals': function(){
		var interval = setInterval(function(){}, 100);
		expect($clear(interval)).toBeNull();
	}

});

describe('$defined', {

	'should return true on 0': function(){
		expect($defined(0)).toBeTruthy();
	},

	'should return true on false': function(){
		expect($defined(false)).toBeTruthy();
	},

	'should return false on null': function(){
		expect($defined(null)).toBeFalsy();
	},

	'should return false on undefined': function(){
		expect($defined(undefined)).toBeFalsy();
	}

});

describe('$each', {

	'should call the function for each item in Function arguments': function(){
		var daysArr = [];
		(function(){
			$each(arguments, function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the array': function(){
		var daysArr = [];
		$each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the object': function(){
		var daysObj = {};
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});

describe('$extend', {

	'should extend two objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4};
		$extend(obj1, obj2);
		expect(obj1).toEqual({a: 1, b: 3, c: 4});
	},

	'should overwrite properties': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4, a: 5};
		$extend(obj1, obj2);
		expect(obj1).toEqual({a: 5, b: 3, c: 4});
	},

	'should not extend with null argument': function(){
		var obj1 = {a: 1, b: 2};
		$extend(obj1);
		expect(obj1).toEqual({a: 1, b: 2});
	}

});

describe('$lambda', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		expect($lambda(fn)).toEqual(fn);
	},

	'should return a function that returns the value passed when called': function(){
		expect($lambda('hello world!')()).toEqual('hello world!');
	}

});

describe('$merge', {

	'should dereference objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = $merge(obj1);
		expect(obj1 === obj2).toBeFalsy();
	},

	'should merge any arbitrary number of nested objects': function(){
		var obj1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var obj2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var obj3 = {a: {a: 3}, b: 3, c: false};
		expect($merge(obj1, obj2, obj3)).toEqual({a: {a: 3, b: 8, c: 3, d: 8}, b: 3, c: false});
	}

});

describe('$pick', {

	'should return the first false argument': function(){
		var picked1 = $pick(null, undefined, false, [1,2,3], {});
		expect(picked1).toBeFalsy();
	},

	'should return the first defined argument': function(){
		var picked1 = $pick(null, undefined, null, [1,2,3], {});
		expect(picked1).toEqual([1,2,3]);
	}

});

describe('$random', {

	'should return a number between two numbers specified': function(){
		var rand = $random(1, 3);
		expect((rand <= 3 && rand >= 1)).toBeTruthy();
	}

});

describe('$splat', {

	'should transform a non array into an array': function(){
		expect($splat(1)).toEqual([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		expect($splat(null)).toEqual([]);
		expect($splat(undefined)).toEqual([]);
	},

	'should ignore and return an array': function(){
		expect($splat([1,2,3])).toEqual([1,2,3]);
	}

});

describe('$time', {

	'should return a timestamp': function(){
		expect(Number.type($time())).toBeTruthy();
	},

	'should be within a reasonable range': function(){
		expect($time() < 1e13 && $time() > 1e12).toBeTruthy();
	}

});

describe('$try', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			throw new Exception();
		}, function(){
			calls++;
			return 'success';
		}, function(){
			calls++;
			return 'moo';
		});
		expect(calls).toEqual(2);
		expect(attempt).toEqual('success');
	},

	'should return null when no function succeeded': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			return I_invented_this();
		}, function(){
			calls++;
			return uninstall_ie();
		});
		expect(calls).toEqual(2);
		expect(attempt).toBeNull();
	}

});

describe('$type', {

	"should return 'array' for Array objects": function(){
		expect($type([1,2])).toEqual('array');
	},

	"should return 'string' for String objects": function(){
		expect($type('ciao')).toEqual('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		expect($type(/_/)).toEqual('regexp');
	},

	"should return 'function' for Function objects": function(){
		expect($type(function(){})).toEqual('function');
	},

	"should return 'number' for Number objects": function(){
		expect($type(10)).toEqual('number');
		expect($type(NaN)).not.toEqual('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		expect($type(true)).toEqual('boolean');
		expect($type(false)).toEqual('boolean');
	},

	"should return 'object' for Object objects": function(){
		expect($type({a:2})).toEqual('object');
	},

	"should return 'arguments' for Function arguments": function(){
		if (window.opera){ // Seems like the Opera guys can't decide on this
			var type = $type(arguments);
			expect(type == 'array' || type == 'arguments').toBeTruthy();
			return;
		}

		expect($type(arguments)).toEqual('arguments');
	},

	"should return false for null objects": function(){
		expect($type(null)).toBeFalsy();
	},

	"should return false for undefined objects": function(){
		expect($type(undefined)).toBeFalsy();
	},

	"should return 'collection' for HTMLElements collections": function(){
		expect($type(document.getElementsByTagName('*'))).toEqual('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		expect($type(div)).toEqual('element');
	},

	"should return 'array' for Elements": function(){
		expect($type(new Elements)).toEqual('array');
	},

	"should return 'window' for the window object": function(){
		expect($type(window)).toEqual('window');
	},

	"should return 'document' for the document object": function(){
		expect($type(document)).toEqual('document');
	}

});

describe('$unlink', {

	"should unlink an object recursivly": function(){
		var inner = {b: 2};
		var obj = {a: 1, inner: inner};
		var copy = $unlink(obj);
		obj.a = 10;
		inner.b = 20;

		expect(obj.a).toEqual(10);
		expect(obj.inner.b).toEqual(20);
		expect($type(obj)).toEqual('object');

		expect(copy.a).toEqual(1);
		expect(copy.inner.b).toEqual(2);
		expect($type(copy)).toEqual('object');
	},

	"should unlink an Hash": function(){
		var hash = new Hash({a: 'one'});
		var copy = $unlink(hash);

		expect($type(hash)).toEqual('hash');
		expect($type(copy)).toEqual('hash');

		copy.set('a', 'two');

		expect(hash.get('a')).toEqual('one');
		expect(copy.get('a')).toEqual('two');
	}

});

describe('Hash.getLength', {

	"should return the number of items in it": function(){
		var hash = new Hash({});
		expect(hash.getLength()).toEqual(0);
		hash.set('mootools', 'awesome');
		hash.milk = 'yummy';
		expect(hash.getLength()).toEqual(2);
	},

	"should not fail when length is set": function(){
		var hash = new Hash({'length': 10});
		expect(hash.getLength()).toEqual(1);
	},

	"should work as a generic on objects": function(){
		expect(Hash.getLength({})).toEqual(0);
		expect(Hash.getLength({'': '', '0': '0', 'length': 99})).toEqual(3);
	}

});

describe('$H', {

	"should create a new hash": function(){
		var hash = $H({});
		expect($type(hash)).toEqual('hash');
	}

});
