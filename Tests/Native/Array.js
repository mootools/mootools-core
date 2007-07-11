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
		return Assert.stringEquals(oldArr, newArr);
	},

	filter: function(){
		var arr = [1,2,3,false,null,0];
		arr = arr.filter(function(item){
			return ($type(item) == 'number');
		});
		return Assert.stringEquals(arr, [1,2,3,0]);
	},

	map: function(){
		var arr = [1,2,3,0];
		arr = arr.map(function(item){
			return (item + 1);
		});
		return Assert.stringEquals(arr, [2,3,4,1]);
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
		return Assert.all(
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
		return Assert.all(
			Assert.isFalse(some1),
			Assert.isTrue(some2)
		);
	},

	indexOf: function(){
		var arr1 = [1,2,3,0];
		var idx1 = arr1.indexOf(0);
		var arr2 = ['1',2,3,0];
		var idx2 = arr2.indexOf(1);
		return Assert.all(
			Assert.equals(idx1, 3),
			Assert.equals(idx2, -1)
		);
	},

	copy: function(){
		return Assert.all(
			Assert.equals()
		);
	},

	remove: function(){
		var arr1 = [1,2,3,0,0,0];
		arr1.remove(0);
		return Assert.stringEquals(arr1, [1,2,3]);
	},

	contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = arr1.contains(0);
		var arr2 = ['1',2,3,0];
		var cnt2 = arr2.contains(1);
		return Assert.all(
			Assert.isTrue(cnt1),
			Assert.isFalse(cnt2)
		);
	},
	
	associate: function(){
		var arr1 = [1,2,3,4];
		var assoc = arr1.associate(['a', 'b', 'c', 'd']);
		
		var arr2 = [100, 'Hello', {foo: 'bar'}, document.createElement('div')];
		var assoc2 = arr2.associate({myNumber: 'number', myElement: 'element', myObject: 'object', myString: 'string'});
		
		return Assert.all(
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
		
		return Assert.stringEquals(arr1, [1,2,3,4,1,2,3,4,5,6,7]);
	},

	merge: function(){
		var arr1 = [1,2,3,4];
		arr1.merge([1,2,3,4,5,6,7]);
		
		return Assert.stringEquals(arr1, [1,2,3,4,5,6,7]);
	},

	include: function(){
		var arr1 = [1,2,3,4];
		arr1.include(1);
		arr1.include(1);
		arr1.include(5);
		arr1.include(5);
		
		return Assert.stringEquals(arr1, [1,2,3,4,5]);
	},

	getLast: function(){
		var arr1 = [1,2,3,4];
		return Assert.equals(arr1.getLast(), 4);
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
		
		return Assert.all(
			Assert.stringEquals(daysArr, ['Sun','Mon','Tue']),
			Assert.equals(daysObj.first, 'Sunday'),
			Assert.equals(daysObj.second, 'Monday'),
			Assert.equals(daysObj.third, 'Tuesday')
		);
		
	}
	
});