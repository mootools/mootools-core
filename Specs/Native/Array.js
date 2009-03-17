/*
Script: Array.js
	Specs for Array.js

License:
	MIT-style license.
*/

describe("Array Methods", {

	// Array.flatten

	'should flatten a multidimensional array': function(){
		var arr = [1,2,3,[4,5,[6,7,[8]]], [[[[[9]]]]]];
		value_of(arr.flatten()).should_be([1,2,3,4,5,6,7,8,9]);
	},

	'should flatten arguments': function(){
		var test = function(){
			return Array.flatten(arguments);
		};
		value_of(test(1,2,3)).should_be([1,2,3]);
		value_of(test([1,2,3])).should_be([1,2,3]);
		value_of(test(1,2,[3])).should_be([1,2,3]);
	},

	// Array.filter

	'should filter an array': function(){
		var array = [1,2,3,0,0,0];
		var arr = array.concat([false, null, 4]).filter(Type.isNumber);
		value_of(arr).should_be(array.concat(4));
	},

	// Array.clean

	'should clean an array from undefined and null values': function(){
		var array = [null, 1, 0, true, false, "foo", undefined];
		var arr = array.clean();
		value_of(arr).should_be([1, 0, true, false, "foo"]);
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
		value_of([1,2,3,0,0,0].every(Type.isNumber)).should_be_true();

		value_of(['1',2,3,0].every(Type.isNumber)).should_be_false();
	},

	// Array.some

	'should return true if some of the items in the array match the comparator, otherwise false': function(){
		value_of(['1',2,3,0].some(Type.isNumber)).should_be_true();

		value_of([1,2,3,0,0,0].map(String).some(Type.isNumber)).should_be_false();
	},

	// Array.indexOf

	'should return the index of the item': function(){
		value_of([1,2,3,0,0,0].indexOf(0)).should_be(3);
	},

	'should return -1 if the item is not found in the array': function(){
		value_of([1,2,3,0,0,0].indexOf('not found')).should_be(-1);
	},

	// Array.erase

	'should remove all items in the array that match the specified item': function(){
		var arr = [1,2,3,0,0,0].erase(0);
		value_of(arr).should_be([1,2,3]);
	},

	// Array.contains

	'should return true if the array contains the specified item': function(){
		value_of([1,2,3,0,0,0].contains(0)).should_be_true();
	},

	'should return false if the array does not contain the specified item': function(){
		value_of([0,1,2].contains('not found')).should_be_false();
	},

	// Array.append

	'should extend an array': function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.append(b);
		value_of(a).should_be([1,2,4,2,3,4,5]);
		value_of(b).should_be([2,3,4,5]);
	},

	// Array.combine

	'should combine an array': function(){
		var arr = [1,2,3,4].combine([3,1,4,5,6,7]);
		value_of(arr).should_be([1,2,3,4,5,6,7]);
	},

	// Array.include

	'should include only new items': function(){
		var arr = [1,2,3,4].include(1).include(5);
		value_of(arr).should_be([1,2,3,4,5]);
	},

	// Array.last

	'should return the last item in the array': function(){
		value_of([1,2,3,0,0,0].last()).should_be(0);
	},

	'should return null if there are no items': function(){
		value_of([].last()).should_be(null);
	},

	// Array.empty

	'should empty the array': function(){
		var arr = [1,2,3,4].empty();
		value_of(arr).should_be([]);
	}

});