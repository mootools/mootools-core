/*
Script: Array.js
	Public Specs for Array.js 1.1.2

License:
	MIT-style license.
*/
describe('$A', {

	'should return a copy for an array': function(){
		var arr1 = [1,2,3];
		var arr2 = $A(arr1);
		value_of(arr1 !== arr2).should_be_true();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return $A(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of($type(arr)).should_be('array');
		value_of(arr).should_have(3, 'items');
	}

});

describe("Array Methods", {

	// Array.filter

	'should filter an array': function(){
		var array = [1,2,3,0,0,0];
		var arr = array.concat([false, null, 4]).filter(function(i){
			return $type(i) == "number";
		});
		value_of(arr).should_be(array.concat(4));
	},

	// Array.map

	'should return a mapping of an array': function(){
		var arr = [1,2,3,0,0,0].map(function(item){
			return (item + 1);
		});

		value_of(arr).should_be([2,3,4,1,1,1]);
	},

	// Array.every

	'should return true if every item matches the comparator, otherwise false': function(){
		value_of([1,2,3,0,0,0].every(function(i){
			return $type(i) == "number";
		})).should_be_true();

		value_of(['1',2,3,0].every(function(i){
			return $type(i) == "number";
		})).should_be_false();
	},

	// Array.some

	'should return true if some of the items in the array match the comparator, otherwise false': function(){
		value_of(['1',2,3,0].some(function(i){
			return $type(i) == "number";
		})).should_be_true();

		value_of([1,2,3,0,0,0].map(String).some(function(i){
			return $type(i) == "number";
		})).should_be_false();
	},

	// Array.indexOf

	'should return the index of the item': function(){
		value_of([1,2,3,0,0,0].indexOf(0)).should_be(3);
	},

	'should return -1 if the item is not found in the array': function(){
		value_of([1,2,3,0,0,0].indexOf('not found')).should_be(-1);
	},

	// Array.remove

	'should remove all items in the array that match the specified item': function(){
		var arr = [1,2,3,0,0,0].remove(0);
		value_of(arr).should_be([1,2,3]);
	},

	// Array.contains

	'should return true if the array contains the specified item': function(){
		value_of([1,2,3,0,0,0].contains(0)).should_be_true();
	},

	'should return false if the array does not contain the specified item': function(){
		value_of([0,1,2].contains('not found')).should_be_false();
	},

	// Array.associate

	'should associate an array with a specified array': function(){
		var obj = [1,2,3,0,0,0].associate(['a', 'b', 'c', 'd']);
		value_of(obj).should_be({a:1, b:2, c:3, d:0});
	},

	// Array.extend

	'should extend an array': function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.extend(b);
		value_of(a).should_be([1,2,4,2,3,4,5]);
		value_of(b).should_be([2,3,4,5]);
	},

	// Array.merge

	'should combine an array': function(){
		var arr = [1,2,3,4].merge([3,1,4,5,6,7]);
		value_of(arr).should_be([1,2,3,4,5,6,7]);
	},

	// Array.include

	'should include only new items': function(){
		var arr = [1,2,3,4].include(1).include(5);
		value_of(arr).should_be([1,2,3,4,5]);
	},

	// Array.getLast

	'should return the last item in the array': function(){
		value_of([1,2,3,0,0,1].getLast()).should_be(1);
		value_of([3].getLast()).should_be(3);
	},

	'should return null if there are no items': function(){
		value_of([].getLast()).should_be(null);
	},

	// Array.getRandom

	'should get a random value from the array': function(){
		var arr = [1,2,3].getRandom();
		var match = arr == 1 | arr == 2 | arr == 3;
		value_of(match).should_be_true();
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


describe("Array Color Methods", {

	// Array.hexToRgb

	'should return null if the length of the array is not 3': function(){
		//adding !! here because 1.1 returns null, while 1.2 returns false
		//but we don't consider this to be a breaking change
		value_of(!![].hexToRgb()).should_be_false();
	},

	'should return a CSS rgb string': function(){
		value_of(['0','0','0'].hexToRgb()).should_be('rgb(0,0,0)');
	},

	'should support shorthand hex': function(){
		value_of(['c','c','c'].hexToRgb()).should_be('rgb(204,204,204)');
	},

	'should return an array with 16-based numbers when passed true': function(){
		value_of(['ff','ff','ff'].hexToRgb(true)).should_be([255,255,255]);
	},

	// Array.rgbToHex

	'should return null if the array does not have at least 3 times': function(){
		//adding !! here because 1.1 returns null, while 1.2 returns false
		//but we don't consider this to be a breaking change
		value_of(!![0,1].rgbToHex()).should_be_false();
	},

	'should return a css hexadecimal string': function(){
		value_of(['255', '0', '0'].rgbToHex()).should_be('#ff0000');
		value_of([0,0,255].rgbToHex()).should_be('#0000ff');
	},

	'should return an array with hexadecimal string items': function(){
		value_of([0,255,0].rgbToHex(true)).should_be(['00', 'ff', '00']);
	},

	'should return `transparent` if the fourth item is 0 and first param is not true': function(){
		value_of([0,0,0,0].rgbToHex()).should_be('transparent');
	}

});