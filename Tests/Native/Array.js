/*
Script: Array.js
	Unit Tests for Array.js

License:
	MIT-style license.
*/

Tests.Array = new Test.Suite('Array', {

	forEach: function(){
		var oldArr = [1,2,3,false,null,0];
		var newArr = [];
		oldArr.each(function(item, i){
			newArr[i] = item;
		});
		this.end(Assert.stringEquals(oldArr, newArr));
	},

	filter: function(){
		var arr = [1,2,3,false,null,0];
		arr = arr.filter(function(item){
			return ($type(item) == 'number');
		});
		this.end(Assert.stringEquals(arr, [1,2,3,0]));
	},

	map: function(){
		var arr = [1,2,3,0];
		arr = arr.map(function(item){
			return (item + 1);
		});
		this.end(Assert.stringEquals(arr, [2,3,4,1]));
	},

	every: function(){
		var arr1 = [1,2,3,0];
		var every1 = arr1.every(function(item){
			return ($type(item) == 'number');
		});
		var arr2 = ['1',2,3,0];
		var every2 = arr2.every(function(item){
			return ($type(item) == 'number');
		});
		this.end(
			Assert.isTrue(every1),
			Assert.isFalse(every2)
		);
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
		this.end(
			Assert.isFalse(some1),
			Assert.isTrue(some2)
		);
	},

	indexOf: function(){
		var arr1 = [1,2,3,0];
		var idx1 = arr1.indexOf(0);
		var arr2 = ['1',2,3,0];
		var idx2 = arr2.indexOf(1);
		this.end(
			Assert.equals(idx1, 3),
			Assert.equals(idx2, -1)
		);
	},

	reduce: function(){
		var arr1 = [1,2,3];
		var sum1 = arr1.reduce(function(a, b) {
			return a + b;
		});
		var sum2 = arr1.reduce(function(a, b) {
			return a + b;
		}, 1);

		var arr3 = ['answer', 'is', 42];
		var sum3 = arr3.reduce(function(a, b) {
			return a.concat(' ', b);
		}, 'The');

		var sum4 = [].reduce(function(a, b) {
			return a + b;
		});
		var sum5 = [].reduce(function(a, b) {
			return a + b;
		}, 1);
		this.end(
			Assert.equals(6, sum1),
			Assert.equals(7, sum2),
			Assert.stringEquals('The answer is 42', sum3),
			Assert.equals(sum4, undefined),
			Assert.equals(sum5, 1)
		);
	},

	copy: function(){
		this.end(
			Assert.equals()
		);
	},

	remove: function(){
		var arr1 = [1,2,3,0,0,0];
		arr1.remove(0);
		this.end(Assert.stringEquals(arr1, [1,2,3]));
	},

	contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = arr1.contains(0);
		var arr2 = ['1',2,3,0];
		var cnt2 = arr2.contains(1);
		this.end(
			Assert.isTrue(cnt1),
			Assert.isFalse(cnt2)
		);
	},

	associate: function(){
		var arr1 = [1,2,3,4];
		var assoc = arr1.associate(['a', 'b', 'c', 'd']);

		var arr2 = [100, 'Hello', {foo: 'bar'}, document.createElement('div')];
		var assoc2 = arr2.associate({myNumber: 'number', myElement: 'element', myObject: 'object', myString: 'string'});

		this.end(
			Assert.equals(assoc.a, 1),
			Assert.equals(assoc.b, 2),
			Assert.equals(assoc.c, 3),
			Assert.equals(assoc.d, 4),

			Assert.equals(assoc2.myNumber, arr2[0]),
			Assert.equals(assoc2.myElement, arr2[3]),
			Assert.equals(assoc2.myObject, arr2[2]),
			Assert.equals(assoc2.myString, arr2[1])

		);
	},

	extend: function(){
		var arr1 = [1,2,3,4];
		arr1.extend([1,2,3,4,5,6,7]);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,1,2,3,4,5,6,7]));
	},

	merge: function(){
		var arr1 = [1,2,3,4];
		arr1.merge([1,2,3,4,5,6,7]);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,5,6,7]));
	},

	include: function(){
		var arr1 = [1,2,3,4];
		arr1.include(1);
		arr1.include(1);
		arr1.include(5);
		arr1.include(5);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,5]));
	},

	getLast: function(){
		var arr1 = [1,2,3,4];
		this.end(Assert.equals(arr1.getLast(), 4));
	},

	empty: function(){
		var arr1 = [1,2,3,4];
		this.end(
			Assert.equals([].empty().length, 0),
			Assert.equals(arr1.empty().length, 0)
		);
	},

	$each: function(){
		var daysArr = [];
		$each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

		var daysObj = [];
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		this.end(
			Assert.stringEquals(daysArr, ['Sun','Mon','Tue']),
			Assert.equals(daysObj.first, 'Sunday'),
			Assert.equals(daysObj.second, 'Monday'),
			Assert.equals(daysObj.third, 'Tuesday')
		);

	}

});