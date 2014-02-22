/*
---
name: Core
requires: ~
provides: ~
...
*/

// <1.2compat>
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

// </1.2compat>


describe('Function.prototype.overloadSetter', function(){

	var collector, setter;
	beforeEach(function(){
		collector = {};
		setter = (function(key, value){
			collector[key] = value;
		});
	});

	it('should call a specific setter', function(){
		setter = setter.overloadSetter();
		setter('key', 'value');

		expect(collector).toEqual({key: 'value'});

		setter({
			otherKey: 1,
			property: 2
		});

		expect(collector).toEqual({
			key: 'value',
			otherKey: 1,
			property: 2
		});

		setter({
			key: 3
		});
		setter('otherKey', 4);

		expect(collector).toEqual({
			key: 3,
			otherKey: 4,
			property: 2
		});
	});

	it('should only works with objects in plural mode', function(){
		setter = setter.overloadSetter(true);

		setter({
			a: 'b',
			c: 'd'
		});

		expect(collector).toEqual({
			a: 'b',
			c: 'd'
		});
	});

});

describe('Function.prototype.overloadGetter', function(){

	var object, getter;
	beforeEach(function(){
		object = {
			aa: 1,
			bb: 2,
			cc: 3
		};

		getter = (function(key){
			return object[key] || null;
		});
	});

	it('should call a getter for each argument', function(){
		getter = getter.overloadGetter();

		expect(getter('aa')).toEqual(1);
		expect(getter('bb')).toEqual(2);
		expect(getter('cc')).toEqual(3);
		expect(getter('dd')).toBeNull();

		expect(getter('aa', 'bb', 'cc')).toEqual(object);
		expect(getter(['aa', 'bb', 'cc'])).toEqual(object);
		expect(getter(['aa', 'cc', 'dd'])).toEqual({aa: 1, cc: 3, dd: null});
	});

	it('should work in plural mode', function(){
		getter = getter.overloadGetter(true);

		expect(getter('aa')).toEqual({
			aa: 1
		});

		expect(getter(['aa', 'bb'])).toEqual({
			aa: 1,
			bb: 2
		});

	})

});

describe('typeOf', {

	"should return 'array' for Array objects": function(){
		expect(typeOf([1,2])).toEqual('array');
	},

	"should return 'string' for String objects": function(){
		expect(typeOf('ciao')).toEqual('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		expect(typeOf(/_/)).toEqual('regexp');
	},

	"should return 'function' for Function objects": function(){
		expect(typeOf(function(){})).toEqual('function');
	},

	"should return 'number' for Number objects": function(){
		expect(typeOf(10)).toEqual('number');
		expect(typeOf(NaN)).not.toEqual('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		expect(typeOf(true)).toEqual('boolean');
		expect(typeOf(false)).toEqual('boolean');
	},

	"should return 'object' for Object objects": function(){
		expect(typeOf({a:2})).toEqual('object');
	},

	"should return 'arguments' for Function arguments": function(){
		if (typeof window != 'undefined' && window.opera){ // Seems like the Opera guys can't decide on this
			var type = $type(arguments);
			expect(type == 'array' || type == 'arguments').toBeTruthy();
			return;
		}

		expect(typeOf(arguments)).toEqual('arguments');
	},

	"should return 'null' for null objects": function(){
		expect(typeOf(null)).toEqual('null');
	},

	"should return 'null' for undefined objects": function(){
		expect(typeOf(undefined)).toEqual('null');
	}

});

describe('instanceOf', {

	"should return false on null object": function(){
		expect(instanceOf(null, null)).toBeFalsy();
	},

	"should return true for Arrays": function(){
		expect(instanceOf([], Array)).toBeTruthy();
	},

	"should return true for Numbers": function(){
		expect(instanceOf(1, Number)).toBeTruthy();
	},

	"should return true for Objects": function(){
		expect(instanceOf({}, Object)).toBeTruthy();
	},

	"should return true for Dates": function(){
		expect(instanceOf(new Date(), Date)).toBeTruthy();
	},

	"should return true for Booleans": function(){
		expect(instanceOf(true, Boolean)).toBeTruthy();
	},

	"should return true for RegExps": function(){
		expect(instanceOf(/_/, RegExp)).toBeTruthy();
	},

	"should respect the parent property of a custom object": function(){
		var X = function(){};
		X.parent = Array;
		expect(instanceOf(new X, Array)).toBeTruthy();
	},

	"should return true for Element instances": function(){
		expect(instanceOf(new Element('div'), Element)).toBeTruthy();
	}

});

describe('Array.from', {

	'should return the same array': function(){
		var arr1 = [1,2,3];
		var arr2 = Array.from(arr1);
		expect(arr1 === arr2).toBeTruthy();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return Array.from(arguments);
		};
		var arr = fnTest(1,2,3);
		expect(Type.isArray(arr)).toBeTruthy();
		expect(arr.length).toEqual(3);
	},

	'should transform a non array into an array': function(){
		expect(Array.from(1)).toEqual([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		expect(Array.from(null)).toEqual([]);
		expect(Array.from(undefined)).toEqual([]);
	},

	'should ignore and return an array': function(){
		expect(Array.from([1,2,3])).toEqual([1,2,3]);
	},

	'should return a copy of arguments or the arguments if it is of type array': function(){
		// In Opera arguments is an array so it does not return a copy
		// This is intended. Array.from is expected to return an Array from an array-like-object
		// It does not make a copy when the passed in value is an array already
		var args, type, copy = (function(){
			type = typeOf(arguments);
			args = arguments;

			return Array.from(arguments);
		})(1, 2);

		expect((type == 'array') ? (copy === args) : (copy !== args)).toBeTruthy();
	}

});

describe('String.from', function(){

	it('should convert to type string', function(){
		expect(typeOf(String.from('string'))).toBe('string');

		expect(typeOf(String.from(1))).toBe('string');

		expect(typeOf(String.from(new Date))).toBe('string');

		expect(typeOf(String.from(function(){}))).toBe('string');
	});

});

describe('Function.from', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		expect(Function.from(fn)).toEqual(fn);
	},

	'should return a function that returns the value passed when called': function(){
		expect(Function.from('hello world!')()).toEqual('hello world!');
	}

});

describe('Number.from', {

	'should return the number representation of a string': function(){
		expect(Number.from("10")).toEqual(10);
		expect(Number.from("10px")).toEqual(10);
	},

	'should return null when it fails to return a number type': function(){
		expect(Number.from("ciao")).toBeNull();
	}

});

describe('Type', function(){

	var Instrument = new Type('Instrument', function(name){
		this.name = name;
	}).implement({

		method: function(){
			return 'playing ' + this.name;
		}

	});

	var Car = new Type('Car', function(name){
		this.name = name;
	}).implement({

		method: (function(){
			return 'driving a ' + this.name;
		}).protect()

	});

	it('should allow implementation over existing methods when a method is not protected', function(){
		Instrument.implement({
			method: function(){
				return 'playing a guitar';
			}
		});
		var myInstrument = new Instrument('Guitar');
		expect(myInstrument.method()).toEqual('playing a guitar');
	});

	it('should not override a method when it is protected', function(){
		Car.implement({
			method: function(){
				return 'hell no!';
			}
		});
		var myCar = new Car('nice car');
		expect(myCar.method()).toEqual('driving a nice car');
	});

	it('should allow generic calls', function(){
		expect(Car.method({name: 'not so nice car'})).toEqual('driving a not so nice car');
	});

	it("should be a Type", function(){
		expect(Type.isType(Instrument)).toBeTruthy();
	});

	it("should generate and evaluate correct types", function(){
		var myCar = new Car('nice car');
		expect(Type.isCar(myCar)).toBeTruthy();
	});

	it("isEnumerable method on Type should return true for arrays, arguments, objects with a numerical length property", function(){
		expect(Type.isEnumerable([1,2,3])).toBeTruthy();
		(function(){
			expect(Type.isEnumerable(arguments)).toBeTruthy();
		})(1,2,3);
		expect(Type.isEnumerable({length: 2})).toBeTruthy();
	});

	it('sould chain any function on a type', function(){
		var MyType = new Type('MyType', function(){}.implement({
			a: function(){}
		}));

		expect(MyType.alias('a', 'b').implement({
			method: function(){}
		}).extend({
			staticMethod: function(){}
		})).toBe(MyType);
	});

});

describe('Function.attempt', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = Function.attempt(function(){
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
		var attempt = Function.attempt(function(){
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

describe('Object.each', {

	'should call the function for each item in the object': function(){
		var daysObj = {};
		Object.each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});

describe('Array.each', {

	'should call the function for each item in Function arguments': function(){
		var daysArr = [];
		(function(){
			Array.each(Array.from(arguments), function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the array': function(){
		var daysArr = [];
		Array.each(['Sun','Mon','Tue'], function(value, i){
			daysArr.push(value);
		});

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should not iterate over deleted elements': function(){
		var array = [0, 1, 2, 3],
			testArray = [];
		delete array[1];
		delete array[2];

		array.each(function(value){
			testArray.push(value);
		});

		expect(testArray).toEqual([0, 3]);
	}

});

describe('Array.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = [1,2,3, [1,2,3, {a: [1,2,3]}]];
		var b = Array.clone(a);
		expect(a === b).toBeFalsy();
		expect(a[3] === b[3]).toBeFalsy();
		expect(a[3][3] === b[3][3]).toBeFalsy();
		expect(a[3][3].a === b[3][3].a).toBeFalsy();

		expect(a[3]).toEqual(b[3]);
		expect(a[3][3]).toEqual(b[3][3]);
		expect(a[3][3].a).toEqual(b[3][3].a);
	}
});

describe('Object.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
		var b = Object.clone(a);
		expect(a === b).toBeFalsy();
		expect(a.a[3] === b.a[3]).toBeFalsy();
		expect(a.a[3][3] === b.a[3][3]).toBeFalsy();
		expect(a.a[3][3].a === b.a[3][3].a).toBeFalsy();

		expect(a.a[3]).toEqual(b.a[3]);
		expect(a.a[3][3]).toEqual(b.a[3][3]);
		expect(a.a[3][3].a).toEqual(b.a[3][3].a);
	}
});

describe('Object.merge', {

	'should merge any object inside the passed in object, and should return the passed in object': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}};
		var b = {c: {d:4}, d:4};
		var c = {a: 5, c: {a:5}};

		var merger = Object.merge(a, b);

		expect(merger).toEqual({a:1, b:2, c:{a:1, b:2, c:3, d:4}, d:4});
		expect(merger === a).toBeTruthy();

		expect(Object.merge(a, b, c)).toEqual({a:5, b:2, c:{a:5, b:2, c:3, d:4}, d:4});
	},

	'should recursively clone sub objects and sub-arrays': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}, d: [1,2,3]};
		var b = {e: {a:1}, f: [1,2,3]};

		var merger = Object.merge(a, b);

		expect(a.e === b.e).toBeFalsy();
		expect(a.f === b.f).toBeFalsy();
	}

});

describe('Object.append', {
	'should combine two objects': function(){
		var a = {a: 1, b: 2}, b = {b: 3, c: 4};
		expect(Object.append(a, b)).toEqual({a: 1, b: 3, c: 4});

		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		expect(Object.append(a, b)).toEqual(a);

		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		var c = {a: 2, d: 5};
		expect(Object.append(a, b, c)).toEqual({a: 2, b: 3, c: 4, d: 5});
	}
});

describe('Date.now', {

	'should return a timestamp': function(){
		expect(Type.isNumber(Date.now())).toBeTruthy();
	}

});

describe('String.uniqueID', function(){

	it('should be a string', function(){
		expect(typeof String.uniqueID()).toBe('string');
	});

	it("should generate unique ids", function(){
		expect(String.uniqueID()).not.toEqual(String.uniqueID());
	});

});

describe('typeOf Client', {

	"should return 'collection' for HTMLElements collections": function(){
		expect(typeOf(document.getElementsByTagName('*'))).toEqual('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		expect(typeOf(div)).toEqual('element');
	},

	"should return 'elements' for Elements": function(){
		expect(typeOf(new Elements)).toEqual('elements');
	},

	"should return 'window' for the window object": function(){
		expect(typeOf(window)).toEqual('window');
	},

	"should return 'document' for the document object": function(){
		expect(typeOf(document)).toEqual('document');
	}

});

describe('Array.from', function(){

	it('should return an array for an Elements collection', function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = Array.from(div1.getElementsByTagName('*'));
		expect(Type.isArray(array)).toEqual(true);
	});

	it('should return an array for an Options collection', function(){
		var div = document.createElement('div');
		div.innerHTML = '<select><option>a</option></select>';
		var select = div.firstChild;
		var array = Array.from(select.options);
		expect(Type.isArray(array)).toEqual(true);
	});

});


describe('Core', function(){

	describe('typeOf', function(){
		it('should correctly report the type of arguments when using "use strict"', function(){
			"use strict";
			expect(typeOf(arguments)).toEqual('arguments');
		});
	});

});
