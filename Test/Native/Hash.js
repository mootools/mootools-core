/*
Script: Array.js
	Unit Tests for Array.js

License:
	MIT-style license.
*/

Tests.Hash = new Test.Suite('Hash', {

	each: function(){
		var oldHash = new Hash({a:1, b:2, c:3});
		var newObj = {};
		oldHash.each(function(value, key){
			newObj[key] = value;
		});
		this.end(
			newObj.each == undefined,
			Assert.equals(newObj.a, 1),
			Assert.equals(newObj.b, 2),
			Assert.equals(newObj.c, 3)
		);
	},

	filter: function(){
		var oldHash = new Hash({a:1, b:2, c:3, d: 'no'});
		var newHash = oldHash.filter(function(item){
			return ($type(item) == 'number');
		});
		this.end(
			newHash.d == undefined,
			Assert.equals(newHash.a, 1)
		);
	},

	map: function(){
		var oldHash = new Hash({a:1, b:2, c:3});
		var newHash = oldHash.map(function(value){
			return (value + 1);
		});
		this.end(
			Assert.equals(newHash.a, 2),
			Assert.equals(newHash.b, 3),
			Assert.equals(newHash.c, 4)
		);
	}

	/*every: function(){
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
	},*/

	/*some: function(){
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
	},*/

	/*remove: function(){
		var arr1 = [1,2,3,0,0,0];
		arr1.remove(0);
		this.end(Assert.stringEquals(arr1, [1,2,3]));
	},*/

	/*contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = arr1.contains(0);
		var arr2 = ['1',2,3,0];
		var cnt2 = arr2.contains(1);
		this.end(
			Assert.isTrue(cnt1),
			Assert.isFalse(cnt2)
		);
	},*/

	/*extend: function(){
		var arr1 = [1,2,3,4];
		arr1.extend([1,2,3,4,5,6,7]);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,1,2,3,4,5,6,7]));
	},*/

	/*merge: function(){
		var arr1 = [1,2,3,4];
		arr1.merge([1,2,3,4,5,6,7]);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,5,6,7]));
	},*/

	/*include: function(){
		var arr1 = [1,2,3,4];
		arr1.include(1);
		arr1.include(1);
		arr1.include(5);
		arr1.include(5);

		this.end(Assert.stringEquals(arr1, [1,2,3,4,5]));
	},*/

	/*$each: function(){
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

	}*/

});