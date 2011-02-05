/*
Specs for Core.js
License: MIT-style license.
*/

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
			a: 1,
			b: 2,
			c: 3
		};

		getter = (function(key){
			return object[key] || null;
		});
	});

	it('should call a getter for each argument', function(){
		getter = getter.overloadGetter();

		expect(getter('a')).toEqual(1);
		expect(getter('b')).toEqual(2);
		expect(getter('c')).toEqual(3);
		expect(getter('d')).toBeNull();

		expect(getter('a', 'b', 'c')).toEqual(object);
		expect(getter(['a', 'b', 'c'])).toEqual(object);
		expect(getter(['a', 'c', 'd'])).toEqual({a: 1, c: 3, d: null});
	});

	it('should work in plural mode', function(){
		getter = getter.overloadGetter(true);

		expect(getter('a')).toEqual({
			a: 1
		});
		
		expect(getter(['a', 'b'])).toEqual({
			a: 1,
			b: 2
		});
	})

});


describe('Function.prototype.extend', function(){
	
	it('should extend the function', function(){
		var fn = (function(){}).extend({a: 1});
		expect(fn.a).toEqual(1);
		expect((new fn).a).toEqual(undefined);
	});
	
});

describe('Function.prototype.implement', function(){
	
	it('should implement the function prototype', function(){
		var fn = (function(){}).implement({a: 1});
		expect(fn.a).toEqual(undefined);
		expect((new fn).a).toEqual(1);
	})
	
});

describe('typeOf', function(){

	it("should return 'array' for Array objects", function(){
		expect(typeOf([1,2])).toEqual('array');
	});

	it("should return 'string' for String objects", function(){
		expect(typeOf('ciao')).toEqual('string');
	});

	it("should return 'regexp' for RegExp objects", function(){
		expect(typeOf(/_/)).toEqual('regexp');
	});

	it("should return 'function' for Function objects", function(){
		expect(typeOf(function(){})).toEqual('function');
	});

	it("should return 'number' for Number objects", function(){
		expect(typeOf(10)).toEqual('number');
		expect(typeOf(NaN)).not.toEqual('number');
	});

	it("should return 'boolean' for Boolean objects", function(){
		expect(typeOf(true)).toEqual('boolean');
		expect(typeOf(false)).toEqual('boolean');
	});

	it("should return 'object' for Object objects", function(){
		expect(typeOf({a:2})).toEqual('object');
	});

	it("should return 'arguments' for Function arguments", function(){
		if (typeof window != 'undefined' && window.opera){ // Seems like the Opera guys can't decide on this
			var type = $type(arguments);
			expect(type == 'array' || type == 'arguments').toBeTruthy();
			return;
		}
		
		expect(typeOf(arguments)).toEqual('arguments');
	});

	it("should return 'null' for null objects", function(){
		expect(typeOf(null)).toEqual('null');
	});

	it("should return 'null' for undefined objects", function(){
		expect(typeOf(undefined)).toEqual('null');
	});

});

describe('instanceOf', function(){
	
	it("should return false on null object", function(){
		expect(instanceOf(null, null)).toBeFalsy();
	});
	
	it("should return true for Arrays", function(){
		expect(instanceOf([], Array)).toBeTruthy();
	});
	
	it("should return true for Numbers", function(){
		expect(instanceOf(1, Number)).toBeTruthy();
	});
	
	it("should return true for Objects", function(){
		expect(instanceOf({}, Object)).toBeTruthy();
	});
	
	it("should return true for Dates", function(){
		expect(instanceOf(new Date(), Date)).toBeTruthy();
	});
	
	it("should return true for Booleans", function(){
		expect(instanceOf(true, Boolean)).toBeTruthy();
	});
	
	it("should return true for RegExps", function(){
		expect(instanceOf(/_/, RegExp)).toBeTruthy();
	});
	
	it("should respect the parent property of a custom object", function(){
		var X = function(){};
		X.parent = Array;
		expect(instanceOf(new X, Array)).toBeTruthy();
	});
	
});

describe('Array.from', function(){

	it('should return the same array', function(){
		var arr1 = [1,2,3];
		var arr2 = Array.from(arr1);
		expect(arr1 === arr2).toBeTruthy();
	});
	
	it('should return an array for arguments', function(){
		var fnTest = function(){
			return Array.from(arguments);
		};
		var arr = fnTest(1,2,3);
		expect(Type.isArray(arr)).toBeTruthy();
		expect(arr.length).toEqual(3);
	});
	
	it('should transform a non array into an array', function(){
		expect(Array.from(1)).toEqual([1]);
	});
	
	it('should transforum an undefined or null into an empty array', function(){
		expect(Array.from(null)).toEqual([]);
		expect(Array.from(undefined)).toEqual([]);
	});
	
	it('should ignore and return an array', function(){
		expect(Array.from([1,2,3])).toEqual([1,2,3]);
	});
	
	it('should return a copy of arguments or the arguments if it is of type array', function(){
		// In Opera arguments is an array so it does not return a copy
		// This is intended. Array.from is expected to return an Array from an array-like-object
		// It does not make a copy when the passed in value is an array already
		var args, type, copy = (function(){
			type = typeOf(arguments);
			args = arguments;
			
			return Array.from(arguments);
		})(1, 2);
		
		expect((type == 'array') ? (copy === args) : (copy !== args)).toBeTruthy();
	});

});

describe('String.from', function(){

	it('should convert to type string', function(){
		expect(typeOf(String.from('string'))).toBe('string');

		expect(typeOf(String.from(1))).toBe('string');

		expect(typeOf(String.from(new Date))).toBe('string');
		
		expect(typeOf(String.from(function(){}))).toBe('string');
	});

});

describe('Function.from', function(){

	it('if a function is passed in that function should be returned', function(){
		var fn = function(a,b){ return a; };
		expect(Function.from(fn)).toEqual(fn);
	});
	
	it('should return a function that returns the value passed when called', function(){
		expect(Function.from('hello world!')()).toEqual('hello world!');
	});

});

describe('Number.from', function(){

	it('should return the number representation of a string', function(){
		expect(Number.from("10")).toEqual(10);
		expect(Number.from("10px")).toEqual(10);
	});
	
	it('should return null when it fails to return a number type', function(){
		expect(Number.from("ciao")).toBeNull();
	});

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

	it('should alias a method', function(){
		Car.alias('drive', 'method');

		expect(new Car('nice car').drive()).toEqual('driving a nice car');
	});
	
	it("isEnumerable method on Type should return true for arrays, arguments, strings, objects with a numerical length property", function(){
		expect(Type.isEnumerable([1,2,3])).toBeTruthy();
		(function(){
			expect(Type.isEnumerable(arguments)).toBeTruthy();
		})(1,2,3);
		expect(Type.isEnumerable({length: 2})).toBeTruthy();
		expect(Type.isEnumerable("string")).toBeTruthy();
		
		expect(Type.isEnumerable(function(){})).toBeFalsy();
		expect(Type.isEnumerable(new Date)).toBeFalsy();
		expect(Type.isEnumerable({})).toBeFalsy();
		expect(Type.isEnumerable(5)).toBeFalsy();
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

	it('should protect native methods', function(){

		var push = Array.prototype.push;

		Array.implement('push', function(){
			throw 'dontCallMe';
		});

		var array = [];
		array.push(1);
		expect(array).toEqual([1]);

		expect(push).toBe(Array.prototype.push);
	});

});

describe('Object.forEach', function(){

	it('should call the function for each item in the object', function(){
		var daysObj = {};
		Object.forEach({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	});

	it('should ignore the prototype chain', function(){
		var fn = function(){};
		fn.prototype = {a: 1};

		var object = new fn;
		object.b = 2;

		var items = {};
		Object.forEach(object, function(value, key){
			items[key] = value;
		});

		expect(items).toEqual({b: 2});
	});

});

describe('Object.each', function(){

	it('should call the function for each item in the object', function(){
		var daysObj = {};
		Object.each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	});

});

describe('Array.forEach', function(){

	it('should call the function for each item in Function arguments', function(){
		var daysArr = [];
		(function(){
			Array.forEach(Array.from(arguments), function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	});

	it('should call the function for each item in the array', function(){
		var daysArr = [];
		Array.forEach(['Sun','Mon','Tue'], function(value, i){
			daysArr.push(value);
		});

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	});

	it('should not iterate over deleted elements', function(){
		var array = [0, 1, 2, 3],
			testArray = [];
		delete array[1];
		delete array[2];

		array.forEach(function(value){
			testArray.push(value);
		});

		expect(testArray).toEqual([0, 3]);
	});

});

describe('Array.each', function(){

	it('should be chainable', function(){
		var array = [];
		array.each(function(){}).push(1, 2);
		expect(array).toEqual([1, 2]);
	});
	
});

describe('Array.clone', function(){
	
	it('should recursively clone and dereference arrays and objects, while mantaining the primitive values', function(){
		var a = [1,2,3, [1,2,3, {a: [1,2,3]}]];
		var b = Array.clone(a);
		expect(a === b).toBeFalsy();
		expect(a[3] === b[3]).toBeFalsy();
		expect(a[3][3] === b[3][3]).toBeFalsy();
		expect(a[3][3].a === b[3][3].a).toBeFalsy();
		
		expect(a[3]).toEqual(b[3]);
		expect(a[3][3]).toEqual(b[3][3]);
		expect(a[3][3].a).toEqual(b[3][3].a);
	});

});

describe('Object.clone', function(){
	
	it('should recursively clone and dereference arrays and objects, while mantaining the primitive values', function(){
		var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
		var b = Object.clone(a);
		expect(a === b).toBeFalsy();
		expect(a.a[3] === b.a[3]).toBeFalsy();
		expect(a.a[3][3] === b.a[3][3]).toBeFalsy();
		expect(a.a[3][3].a === b.a[3][3].a).toBeFalsy();
		
		expect(a.a[3]).toEqual(b.a[3]);
		expect(a.a[3][3]).toEqual(b.a[3][3]);
		expect(a.a[3][3].a).toEqual(b.a[3][3].a);
	});

});

describe('Object.merge', function(){
	
	it('should merge any object inside the passed in object, and should return the passed in object', function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}};
		var b = {c: {d:4}, d:4};
		var c = {a: 5, c: {a:5}};
		
		var merger = Object.merge(a, b);
		
		expect(merger).toEqual({a:1, b:2, c:{a:1, b:2, c:3, d:4}, d:4});
		expect(merger === a).toBeTruthy();
		
		expect(Object.merge(a, b, c)).toEqual({a:5, b:2, c:{a:5, b:2, c:3, d:4}, d:4});
	});

	it('should recursively clone sub objects and sub-arrays', function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}, d: [1,2,3]};
		var b = {e: {a:1}, f: [1,2,3]};
		
		var merger = Object.merge(a, b);
		
		expect(a.e === b.e).toBeFalsy();
		expect(a.f === b.f).toBeFalsy();
	});
	
});

describe('Date.now', function(){

	it('should return a timestamp', function(){
		expect(Type.isNumber(Date.now())).toBeTruthy();
	});

});

describe('String.uniqueID', function(){

	it('should be a string', function(){
		expect(typeof String.uniqueID()).toBe('string');
	});

	it("should generate unique ids", function(){
		expect(String.uniqueID()).not.toEqual(String.uniqueID());
	});
	
});
