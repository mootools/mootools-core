/*
Script: Array.js
	Specs for Array.js

License:
	MIT-style license.
*/

describe('$A', {

	should_return_array_copy_for_array: function(){
		value_of($A([1,2,3])).should_be([1,2,3]);
	},

	should_return_array_for_elements_collection: function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		value_of($A(div1.getElementsByTagName('*'))).should_be([div2, div3]);
	},

	should_return_array_for_arguments: function(){
		var fnTest = function(){
			return $A(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of(arr).should_be([1,2,3]);
	}

});

describe('Array', {

	forEach: function(){
		var oldArr = [1, 2, 3, false, null, 0];
		var newArr = [];
		oldArr.each(function(item, i){
			newArr[i] = item;
		});

		value_of(newArr).should_be(oldArr);
	},

	filter: function(){
		var arr = [1, 2, 3, false, null, 0];
		arr = arr.filter(function(item){
			return ($type(item) == 'number');
		});

		value_of(arr).should_be([1,2,3,0]);
	},

	map: function(){
		var arr = [1, 2, 3, 0];
		arr = arr.map(function(item){
			return (item + 1);
		});

		value_of(arr).should_be([2,3,4,1]);
	},

	every: function(){
		var arr1 = [1, 2, 3, 0];
		var every1 = arr1.every(function(item){
			return ($type(item) == 'number');
		});
		var arr2 = ['1',2,3,0];
		var every2 = arr2.every(function(item){
			return ($type(item) == 'number');
		});

		value_of(every1).should_be_true();
		value_of(every2).should_be_false();
	},

	some: function(){
		var arr1 = [1,2,3,0];
		var some1 = arr1.some(function(item){
			return ($type(item) == 'string');
		});
		var arr2 = ['1',2,3,0];
		var some2 = arr2.some(function(item){
			return ($type(item) == 'string');
		});

		value_of(some2).should_be_true();
		value_of(some1).should_be_false();
	},

	indexOf: function(){
		var arr1 = [1,2,3,0];
		var idx1 = arr1.indexOf(0);
		var arr2 = ['1',2,3,0];
		var idx2 = arr2.indexOf(1);

		value_of(idx1).should_be(3);
		value_of(idx2).should_be(-1);
	},

	reduce: function(){
		var arr1 = [1,2,3];
		var sum1 = arr1.reduce(function(a, b) {
			return a + b;
		});
		var sum2 = arr1.reduce(function(a, b) {
			return a + b;
		}, 1);

		var arr2 = ['answer', 'is', 42];
		var sum3 = arr2.reduce(function(a, b) {
			return a.concat(' ', b);
		}, 'The');

		var sum4 = [].reduce(function(a, b) {
			return a + b;
		});
		var sum5 = [].reduce(function(a, b) {
			return a + b;
		}, 1);

		value_of(sum1).should_be(6);
		value_of(sum2).should_be(7);
		value_of(sum3).should_be('The answer is 42');
		value_of(sum4).should_be_undefined();
		value_of(sum5).should_be(1);
	},

	remove: function(){
		var arr = [1,2,3,0,0,0];
		arr.remove(0);

		value_of(arr).should_be([1,2,3]);
	},

	contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = arr1.contains(0);
		var arr2 = ['1',2,3,0];
		var cnt2 = arr2.contains(1);

		value_of(cnt1).should_be_true();
		value_of(cnt2).should_be_false();
	},

	associate: function(){
		var arr = [1,2,3,4];
		var assoc = arr.associate(['a', 'b', 'c', 'd']);

		value_of(assoc).should_be({a:1,b:2,c:3,d:4});
	},

	link: function(){
		var el = document.createElement('div');
		var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
		var assoc2 = arr2.link({myNumber: $type.number, myElement: $type.element, myObject: $type.object, myString: $type.string, myBoolean: $defined});

		value_of(assoc2).should_be({myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false});
	},

	extend: function(){
		var arr = [1,2,3,4];
		arr.extend([1,2,3,4,5,6,7]);

		value_of(arr).should_be([1,2,3,4,1,2,3,4,5,6,7]);
	},

	merge: function(){
		var arr = [1,2,3,4];
		arr.merge([1,2,3,4,5,6,7]);

		value_of(arr).should_be([1,2,3,4,5,6,7]);
	},

	include: function(){
		var arr = [1,2,3,4];
		arr.include(1);
		arr.include(3);
		arr.include(5);
		arr.include(5);

		value_of(arr).should_be([1,2,3,4,5]);
	},

	getLast: function(){
		var arr = [1,2,3,4];

		value_of(arr.getLast()).should_be(4);
	},

	empty: function(){
		var arr = [1,2,3,4];

		value_of([].empty()).should_be_empty();
		value_of(arr.empty).should_be_empty();
	}

});

describe('Array Generics', {

	forEach: function(){
		var oldArr = [1, 2, 3, false, null, 0];
		var newArr = [];
		Array.each(oldArr, function(item, i){
			newArr[i] = item;
		});

		value_of(newArr).should_be(oldArr);
	},

	filter: function(){
		var arr = (function(){
			return arguments;
		})(1, 2, 3, false, null, 0);
		arr = Array.filter(arr, function(item){
			return ($type(item) == 'number');
		});

		value_of(arr).should_be([1,2,3,0]);
	},

	map: function(){
		var arr = (function() {
			return arguments;
		})(1, 2, 3, 0);
		arr = Array.map(arr, function(item){
			return (item + 1);
		});

		value_of(arr).should_be([2,3,4,1]);
	},

	every: function(){
		var arr1 = [1, 2, 3, 0];
		var every1 = Array.every(arr1, function(item){
			return ($type(item) == 'number');
		});
		var arr2 = ['1',2,3,0];
		var every2 = Array.every(arr2, function(item){
			return ($type(item) == 'number');
		});

		value_of(every1).should_be_true();
		value_of(every2).should_be_false();
	},

	some: function(){
		var arr1 = [1,2,3,0];
		var some1 = Array.some(arr1, function(item){
			return ($type(item) == 'string');
		});
		var arr2 = ['1',2,3,0];
		var some2 = Array.some(arr2, function(item){
			return ($type(item) == 'string');
		});

		value_of(some2).should_be_true();
		value_of(some1).should_be_false();
	},

	indexOf: function(){
		var arr1 = [1,2,3,0];
		var idx1 = Array.indexOf(arr1, 0);
		var arr2 = ['1',2,3,0];
		var idx2 = Array.indexOf(arr2, 1);

		value_of(idx1).should_be(3);
		value_of(idx2).should_be(-1);
	},

	reduce: function(){
		var arr1 = [1,2,3];
		var sum1 = Array.reduce(arr1, function(a, b) {
			return a + b;
		});
		var sum2 = Array.reduce(arr1, function(a, b) {
			return a + b;
		}, 1);

		var arr2 = ['answer', 'is', 42];
		var sum3 = Array.reduce(arr2, function(a, b) {
			return a.concat(' ', b);
		}, 'The');

		var sum4 = Array.reduce([], function(a, b) {
			return a + b;
		});
		var sum5 = Array.reduce([], function(a, b) {
			return a + b;
		}, 1);

		value_of(sum1).should_be(6);
		value_of(sum2).should_be(7);
		value_of(sum3).should_be('The answer is 42');
		value_of(sum4).should_be_undefined();
		value_of(sum5).should_be(1);
	},

	remove: function(){
		var arr = [1,2,3,0,0,0];
		Array.remove(arr, 0);

		value_of(arr).should_be([1,2,3]);
	},

	contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = Array.contains(arr1, 0);
		var arr2 = ['1',2,3,0];
		var cnt2 = Array.contains(arr2, 1);

		value_of(cnt1).should_be_true();
		value_of(cnt2).should_be_false();

	},

	associate: function(){
		var arr = [1,2,3,4];
		var assoc = Array.associate(arr, ['a', 'b', 'c', 'd']);

		value_of(assoc).should_be({a:1,b:2,c:3,d:4});
	},

	link: function(){
		var el = document.createElement('div');
		var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
		var assoc2 = Array.link(arr2, {myNumber: $type.number, myElement: $type.element, myObject: $type.object, myString: $type.string, myBoolean: $defined});

		value_of(assoc2).should_be({myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false});
	},

	extend: function(){
		var arr = [1,2,3,4];
		Array.extend(arr, [1,2,3,4,5,6,7]);

		value_of(arr).should_be([1,2,3,4,1,2,3,4,5,6,7]);
	},

	merge: function(){
		var arr = [1,2,3,4];
		Array.merge(arr, [1,2,3,4,5,6,7]);

		value_of(arr).should_be([1,2,3,4,5,6,7]);
	},

	include: function(){
		var arr = [1,2,3,4];
		Array.include(arr, 1);
		Array.include(arr, 3);
		Array.include(arr, 5);
		Array.include(arr, 5);

		value_of(arr).should_be([1,2,3,4,5]);
	},

	getLast: function(){
		var arr = [1,2,3,4];

		value_of(Array.getLast(arr)).should_be(4);
	},

	empty: function(){
		var arr = [1,2,3,4];

		value_of(Array.empty([])).should_be_empty();
		value_of(Array.empty(arr)).should_be_empty();
	}

});

describe('$each', {

	$each_on_arguments: function(){
		var daysArr = [];
		(function(){
			$each(arguments, function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	$each_on_array: function(){
		var daysArr = [];
		$each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	$each_on_object: function(){
		var daysObj = {};
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		value_of(daysObj).should_be({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});