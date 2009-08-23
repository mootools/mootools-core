/*
Script: Core.js
	Examples for Core.js

License:
	MIT-style license.
*/

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
	}

});

describe('Array.from', {

	'should return a copy for an array': function(){
		var arr1 = [1,2,3];
		var arr2 = Array.from(arr1);
		value_of(arr1 !== arr2).should_be_true();
	},

	'should return an array for an Elements collection': function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = Array.from(div1.getElementsByTagName('*'));
		value_of(Type.isArray(array)).should_be_true();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return Array.from(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of(Type.isArray(arr)).should_be_true();
		value_of(arr).should_have(3, 'items');
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
	}

});

/*describe('Object.check', {

	'should return false on false': function(){
		value_of(Object.check(false)).should_be_false();
	},

	'should return false on null': function(){
		value_of(Object.check(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of(Object.check(undefined)).should_be_false();
	},

	'should return true on 0': function(){
		value_of(Object.check(0)).should_be_true();
	},

	'should return true for any truthsie': function(){
		value_of(Object.check(1)).should_be_true();
		value_of(Object.check({})).should_be_true();
		value_of(Object.check(true)).should_be_true();
	}

});*/

describe('Function.clear', {

	'should clear timeouts': function(){
		var timeout = setTimeout(function(){}, 100);
		value_of(Function.clear(timeout)).should_be_null();
	},

	'should clear intervals': function(){
		var interval = setInterval(function(){}, 100);
		value_of(Function.clear(interval)).should_be_null();
	}

});

describe('nil', {

	'should return true on 0': function(){
		value_of(nil(0)).should_be(0);
	},

	'should return true on false': function(){
		value_of(nil(false)).should_be_false();
	},

	'should return false on null': function(){
		value_of(nil(null)).should_be_null();
	},

	'should return false on undefined': function(){
		value_of(nil(undefined)).should_be_null();
	},

	'should return passed in value': function(){
		value_of(nil('String')).should_be('String');
	}

});

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

	'should call the function for each item in the array': function(){
		var daysArr = [];
		Object.each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

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

describe('Function.from', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		value_of(Function.from(fn)).should_be(fn);
	},

	'should return a function that returns the value passed when called': function(){
		value_of(Function.from('hello world!')()).should_be('hello world!');
	}

});

describe('Number.random', {

	'should return a number between two numbers specified': function(){
		var rand = Number.random(1, 3);
		value_of((rand <= 3 && rand >= 1)).should_be_true();
	}

});

describe('Date.now', {

	'should return a timestamp': function(){
		value_of(Type.isNumber(Date.now())).should_be_true();
	}

});

describe('Function.stab', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = Function.stab(function(){
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
		var attempt = Function.stab(function(){
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
		value_of(typeOf(arguments)).should_be((window.opera) ? 'array' : 'arguments'); //opera's arguments behave like arrays--which is actually better.
	},

	"should return 'null' for null objects": function(){
		value_of(typeOf(null)).should_be('null');
	},

	"should return 'null' for undefined objects": function(){
		value_of(typeOf(undefined)).should_be('null');
	},

	"should return 'collection' for HTMLElements collections": function(){
		value_of(typeOf(document.getElementsByTagName('*'))).should_be('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		value_of(typeOf(div)).should_be('element');
	},

	"should return 'window' for the window object": function(){
		value_of(typeOf(window)).should_be('window');
	},

	"should return 'document' for the document object": function(){
		value_of(typeOf(document)).should_be('document');
	}

});

})();