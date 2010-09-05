/*
Script: Core.js
	Examples for Core.js

License:
	MIT-style license.
*/

describe('Function.prototype.extend', {
	
	"should extend the function": function(){
		var fn = (function(){}).extend({a: 1});
		value_of(fn.a).should_be(1);
		value_of((new fn).a).should_be(undefined);
	}
	
});

describe('Function.prototype.implement', {
	
	"should implement the function prototype": function(){
		var fn = (function(){}).implement({a: 1});
		value_of(fn.a).should_be(undefined);
		value_of((new fn).a).should_be(1);
	}
	
});

describe('typeOf', {

	"should return 'array' for Array objects": function(){
		value_of(typeOf([1,2])).should_be('array');
	},

	"should return 'string' for String objects": function(){
		value_of(typeOf('ciao')).should_be('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		value_of(typeOf(/_/)).should_be('regexp');
	},

	"should return 'function' for Function objects": function(){
		value_of(typeOf(function(){})).should_be('function');
	},

	"should return 'number' for Number objects": function(){
		value_of(typeOf(10)).should_be('number');
		value_of(typeOf(NaN)).should_not_be('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		value_of(typeOf(true)).should_be('boolean');
		value_of(typeOf(false)).should_be('boolean');
	},

	"should return 'object' for Object objects": function(){
		value_of(typeOf({a:2})).should_be('object');
	},

	"should return 'arguments' for Function arguments": function(){
		if (typeof window != 'undefined' && window.opera){ // Seems like the Opera guys can't decide on this
			var type = $type(arguments);
			value_of(type == 'array' || type == 'arguments').should_be_true();
			return;
		}
		
		value_of(typeOf(arguments)).should_be('arguments');
	},

	"should return 'null' for null objects": function(){
		value_of(typeOf(null)).should_be('null');
	},

	"should return 'null' for undefined objects": function(){
		value_of(typeOf(undefined)).should_be('null');
	}

});

describe('instanceOf', {
	
	"should return false on null object": function(){
		value_of(instanceOf(null, null)).should_be_false();
	},
	
	"should return true for Arrays": function(){
		value_of(instanceOf([], Array)).should_be_true();
	},
	
	"should return true for Numbers": function(){
		value_of(instanceOf(1, Number)).should_be_true();
	},
	
	"should return true for Objects": function(){
		value_of(instanceOf({}, Object)).should_be_true();
	},
	
	"should return true for Dates": function(){
		value_of(instanceOf(new Date(), Date)).should_be_true();
	},
	
	"should return true for Booleans": function(){
		value_of(instanceOf(true, Boolean)).should_be_true();
	},
	
	"should return true for RegExps": function(){
		value_of(instanceOf(/_/, RegExp)).should_be_true();
	},
	
	"should respect the parent property of a custom object": function(){
		var X = function(){};
		X.parent = Array;
		value_of(instanceOf(new X, Array)).should_be_true();
	}
	
});

describe('Array.from', {

	'should return the same array': function(){
		var arr1 = [1,2,3];
		var arr2 = Array.from(arr1);
		value_of(arr1 === arr2).should_be_true();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return Array.from(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of(Type.isArray(arr)).should_be_true();
		value_of(arr.length).should_be(3);
	},

	'should transform a non array into an array': function(){
		value_of(Array.from(1)).should_be([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		value_of(Array.from(null)).should_be([]);
		value_of(Array.from(undefined)).should_be([]);
	},

	'should ignore and return an array': function(){
		value_of(Array.from([1,2,3])).should_be([1,2,3]);
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
		
		value_of((type == 'array') ? (copy === args) : (copy !== args)).should_be_true();
	}

});

describe('Function.from', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		value_of(Function.from(fn)).should_be(fn);
	},

	'should return a function that returns the value passed when called': function(){
		value_of(Function.from('hello world!')()).should_be('hello world!');
	}

});

describe('Number.from', {

	'should return the number representation of a string': function(){
		value_of(Number.from("10")).should_be(10);
		value_of(Number.from("10px")).should_be(10);
	},

	'should return null when it fails to return a number type': function(){
		value_of(Number.from("ciao")).should_be_null();
	}

});

(function(){

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

describe('Type', {

	'should allow implementation over existing methods when a method is not protected': function(){
		Instrument.implement({
			method: function(){
				return 'playing a guitar';
			}
		});
		var myInstrument = new Instrument('Guitar');
		value_of(myInstrument.method()).should_be('playing a guitar');
	},

	'should not override a method when it is protected': function(){
		Car.implement({
			method: function(){
				return 'hell no!';
			}
		});
		var myCar = new Car('nice car');
		value_of(myCar.method()).should_be('driving a nice car');
	},

	'should allow generic calls': function(){
		value_of(Car.method({name: 'not so nice car'})).should_be('driving a not so nice car');
	},

	"should be a Type": function(){
		value_of(Type.isType(Instrument)).should_be_true();
	},
	
	"should generate and evaluate correct types": function(){
		var myCar = new Car('nice car');
		value_of(Type.isCar(myCar)).should_be_true();
	},
	
	"isEnumerable method on Type should return true for arrays, arguments, objects with a numerical length property": function(){
		value_of(Type.isEnumerable([1,2,3])).should_be_true();
		(function(){
			value_of(Type.isEnumerable(arguments)).should_be_true();
		})(1,2,3);
		value_of(Type.isEnumerable({length: 2})).should_be_true();
	}

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
		value_of(calls).should_be(2);
		value_of(attempt).should_be('success');
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
		value_of(calls).should_be(2);
		value_of(attempt).should_be_null();
	}

});

})();

describe('Object.each', {

	'should call the function for each item in Function arguments': function(){
		var daysArr = [];
		(function(){
			Object.each(Array.from(arguments), function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the object': function(){
		var daysObj = {};
		Object.each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		value_of(daysObj).should_be({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});

describe('Array.each', {

	'should call the function for each item in the array': function(){
		var daysArr = [];
		Array.each(['Sun','Mon','Tue'], function(value, i){
			daysArr.push(value);
		});
	
		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should not iterate over deleted elements': function(){
		var array = [0, 1, 2, 3],
			testArray = [];
		delete array[1];
		delete array[2];

		array.each(function(value){
			testArray.push(value);
		});

		value_of(testArray).should_be([0, 3]);
	}
	
});

describe('Array.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = [1,2,3, [1,2,3, {a: [1,2,3]}]];
		var b = Array.clone(a);
		value_of(a === b).should_be_false();
		value_of(a[3] === b[3]).should_be_false();
		value_of(a[3][3] === b[3][3]).should_be_false();
		value_of(a[3][3].a === b[3][3].a).should_be_false();
		
		value_of(a[3]).should_be(b[3]);
		value_of(a[3][3]).should_be(b[3][3]);
		value_of(a[3][3].a).should_be(b[3][3].a);
	}
});

describe('Object.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
		var b = Object.clone(a);
		value_of(a === b).should_be_false();
		value_of(a.a[3] === b.a[3]).should_be_false();
		value_of(a.a[3][3] === b.a[3][3]).should_be_false();
		value_of(a.a[3][3].a === b.a[3][3].a).should_be_false();
		
		value_of(a.a[3]).should_be(b.a[3]);
		value_of(a.a[3][3]).should_be(b.a[3][3]);
		value_of(a.a[3][3].a).should_be(b.a[3][3].a);
	}
});

describe('Object.merge', {
	
	'should merge any object inside the passed in object, and should return the passed in object': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}};
		var b = {c: {d:4}, d:4};
		var c = {a: 5, c: {a:5}};
		
		var merger = Object.merge(a, b);
		
		value_of(merger).should_be({a:1, b:2, c:{a:1, b:2, c:3, d:4}, d:4});
		value_of(merger === a).should_be_true();
		
		value_of(Object.merge(a, b, c)).should_be({a:5, b:2, c:{a:5, b:2, c:3, d:4}, d:4});
	},
	
	'should recursively clone sub objects and sub-arrays': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}, d: [1,2,3]};
		var b = {e: {a:1}, f: [1,2,3]};
		
		var merger = Object.merge(a, b);
		
		value_of(a.e === b.e).should_be_false();
		value_of(a.f === b.f).should_be_false();
	}
	
});

describe('Object.append', {
	'should combine two objects': function(){
		var a = {a: 1, b: 2}, b = {b: 3, c: 4};
		value_of(Object.append(a, b)).should_be({a: 1, b: 3, c: 4});
		
		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		value_of(Object.append(a, b)).should_be(a);
		
		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		var c = {a: 2, d: 5};
		value_of(Object.append(a, b, c)).should_be({a: 2, b: 3, c: 4, d: 5});
	}
});

describe('Date.now', {

	'should return a timestamp': function(){
		value_of(Type.isNumber(Date.now())).should_be_true();
	}

});

describe('String.generateUID', function(){

	it('should be a string', function(){
		expect(typeof String.generateUID()).toBe('string');
	});

	it("should generate unique ids", function(){
		expect(String.generateUID()).not.toEqual(String.generateUID());
	});
	
});
