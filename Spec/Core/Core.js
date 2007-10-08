/*
Script: Core.js
	Examples for Core.js

License:
	MIT-style license.
*/

describe('$chk', {

	'should return false on false': function(){
		value_of($chk(false)).should_be_false();
	},

	'should return false on null': function(){
		value_of($chk(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($chk(undefined)).should_be_false();
	},

	'should return true on 0': function(){
		value_of($chk(0)).should_be_true();
	}

});

describe('$clear', {

	'should clear timeouts': function(){
		var timeout = setTimeout(function(){}, 100);
		value_of($clear(timeout)).should_be_null();
	},

	'should clear periodicals': function(){
		var periodical = setTimeout(function(){}, 100);
		value_of($clear(periodical)).should_be_null();
	}

});

describe('$defined', {

	'should return true on false': function(){
		value_of($defined(false)).should_be_true();
	},

	'should return false on null': function(){
		value_of($defined(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($defined(undefined)).should_be_false();
	},

	'should return true on 0': function(){
		value_of($defined(0)).should_be_true();
	}

});

describe('$extend', {

	'should extend two objects': function(){
		var ob1 = {a: 1, b: 2};
		var ob2 = {b: 3, c: 4};
		$extend(ob1, ob2);
		value_of(ob1).should_be({a: 1, b: 3, c: 4});
	},

	'should extend this and an object': function(){
		var fn = function(){};
		fn.extend = $extend;
		fn.extend({ newProperty: true });
		value_of(fn.newProperty).should_be(true);
	}

});

describe('$merge', {

	'should dereference objects': function(){
		var obj = {a: 1, a: 2};
		var obj2 = $merge(obj);
		value_of(obj === obj2).should_be_false();
	},

	'should merge any arbitrary number of objects': function(){
		var ob1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var ob2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var ob3 = {a: {a: 3}, b: 3, c: false};
		value_of($merge(ob1, ob2, ob3)).should_be({a: {a: 3, b: 8, c: 3, d:8}, b: 3, c: false});
	}

});

describe('$pick', {

	'should return the first false argument': function(){
		var picked1 = $pick(null, undefined, false, [1,2,3], {});
		value_of(picked1).should_be_false();
	},

	'should return the first defined argument': function(){
		var picked1 = $pick(null, undefined, null, [1,2,3], {});
		value_of(picked1).should_be([1,2,3]);
	}

});

describe('$random', {

	'should return a number between two numbers specified': function(){
		var rand = $random(1, 3);
		value_of((rand <= 3 && rand >= 1)).should_be_true();
	}

});

describe('$splat', {

	'should transform a non-array into an array': function(){
		value_of($splat(1)).should_be([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		value_of($splat(null)).should_be([]);
		value_of($splat(undefined)).should_be([]);
	},

	'should ignore and return an array': function(){
		value_of($splat([1,2,3])).should_be([1,2,3]);
	}

});

describe('$time', {

	'should return a timestamp': function(){
		value_of(Number.type($time())).should_be_true();
	}

});

describe('$try', {

	'should return the result of the function if successful': function(){
		var attempt = $try(function(){
			return 'success';
		});

		value_of(attempt).should_be('success');
	},

	'should return false when an exception is thrown': function(){
		var attempt = $try(function(){
			return I_invented_this();
		});

		value_of(attempt).should_be_false();
	}

});

describe('$type', {

	"should return 'array' for Array objects": function(){
		value_of($type([1,2])).should_be('array');
	},

	"should return 'string' for String objects": function(){
		value_of($type('ciao')).should_be('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		value_of($type(/_/)).should_be('regexp');
	},

	"should return 'function' for Function objects": function(){
		value_of($type(function(){})).should_be('function');
	},

	"should return 'number' for Number objects": function(){
		value_of($type(10)).should_be('number');
		value_of($type(NaN)).should_not_be('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		value_of($type(true)).should_be('boolean');
		value_of($type(false)).should_be('boolean');
	},

	"should return 'object' for Object objects": function(){
		value_of($type({a:2})).should_be('object');
	},

	"should return 'arguments' for Function arguments": function(){
		value_of($type(arguments)).should_be((window.opera) ? 'array' : 'arguments'); //opera's arguments behave like arrays--which is actually better.
	},

	"should return false for null objects": function(){
		value_of($type(null)).should_be_false();
	},

	"should return false for undefined objects": function(){
		value_of($type(undefined)).should_be_false();
	},

	"should return 'collection' for HTMLElements collections": function(){
		value_of($type(document.getElementsByTagName('*'))).should_be('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		value_of($type(div)).should_be('element');
	},

	"should return 'window' for the window object": function(){
		value_of($type(window)).should_be('window');
	},

	"should return 'document' for the document object": function(){
		value_of($type(document)).should_be('document');
	}

});

var Local = Local || {};

describe('Native', {

	'before all': function(){

		Local.Instrument = new Native({

			name: 'instrument',

			initialize: function(name){
				this.name = name;
			}

		});

		Local.Instrument.implement({

			method: function(){
				return this.property + ' ' + this.name;
			},

			property: 'stuff'

		});

		Local.Car = new Native({

			name: 'car',

			browser: true,

			initialize: function(name){
				this.name = name;
			}

		});

		Local.Car.implement({

			property: 'stuff',

			method: function(){
				return this.name + '_' + this.property;
			}

		});

	},

	'should allow implementation over existing methods when browser option is not set': function(){
		Local.Instrument.implement({ property: 'staff' });
		var myInstrument = new Local.Instrument('xeelophone');
		value_of(myInstrument.method()).should_be('staff xeelophone');
	},

	'should not override existing methods when browser option is set': function(){
		Local.Car.implement({ property: 'staff' });
		var myCar = new Local.Car('smart');
		value_of(myCar.method()).should_be('smart_stuff');
	},

	'should allow generic calls': function(){
		value_of(Local.Car.method({name: 'ciccio', property: 'bello'})).should_be('ciccio_bello');
	},

	"should have a 'native' type": function(){
		value_of(Native.type(Local.Car)).should_be_true();
	}

});

describe('$A', {

	'should return a copy for an array': function(){
		var arr1 = [1,2,3];
		var arr2 = $A(arr1);
		value_of(arr1 !== arr2).should_be_true();
	},

	'should return an array for an Elements collection': function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = $A(div1.getElementsByTagName('*'));
		value_of(Array.type(array)).should_be_true();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return $A(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of(Array.type(arr)).should_be_true();
		value_of(arr).should_have(3, 'items');
	}

});

describe('Array', {

	'should call the function for each item in the array': function(){
		var oldArr = [1, 2, 3, false, null, 0];
		var newArr = [];
		oldArr.each(function(item, i){
			newArr[i] = item;
		});

		value_of(newArr).should_be(oldArr);
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

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the array': function(){
		var daysArr = [];
		$each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the object': function(){
		var daysObj = {};
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		value_of(daysObj).should_be({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});