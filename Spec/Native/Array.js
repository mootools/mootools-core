describe('Array', {
	
	forEach_iteration: function(){
		var oldArr = [1, 2, 3, false, null, 0];
		var newArr = [];
		oldArr.each(function(item, i){
			newArr[i] = item;
		});
		value_of(newArr).should_be(oldArr);
		value_of(newArr).should_have(6, 'items');
	},
	
	filter: function(){
		var arr = [1, 2, 3, false, null, 0];
		arr = arr.filter(function(item){
			return ($type(item) == 'number');
		});
		value_of(arr).should_be([1,2,3,0]);
	},
	
	filter_using_generics: function(){
		var arr = (function(){
			return arguments;
		})(1, 2, 3, false, null, 0);
		arr = Array.filter(arr, function(item){
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
	
	map_using_generics: function(){
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
		
		value_of(sum1).should_be(6);
		value_of(sum2).should_be(7);
		value_of(sum3).should_be('The answer is 42');
		value_of(sum4).should_be_undefined();
		value_of(sum5).should_be(1);
	},

	remove: function(){
		var arr1 = [1,2,3,0,0,0];
		arr1.remove(0);
		
		value_of(arr1).should_be([1,2,3]);
	},

	contains: function(){
		var arr1 = [1,2,3,0];
		var cnt1 = arr1.contains(0);
		var arr2 = ['1',2,3,0];
		var cnt2 = arr2.contains(1);
		value_of(cnt1).should_be_true();
		value_of(cnt2).should_be_false();
			
	},

	simple_association: function(){
		var arr1 = [1,2,3,4];
		var assoc = arr1.associate(['a', 'b', 'c', 'd']);
		
		value_of(assoc).should_be({a:1,b:2,c:3,d:4});
	},
	
	type_association: function(){
		var el = document.createElement('div');
		var arr2 = [100, 'Hello', {foo: 'bar'}, el];
		var assoc2 = arr2.associate({myNumber: 'number', myElement: 'element', myObject: 'object', myString: 'string'});
		
		value_of(assoc2).should_be({myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello'});
	},

	extend: function(){
		var arr1 = [1,2,3,4];
		arr1.extend([1,2,3,4,5,6,7]);
		
		value_of(arr1).should_be([1,2,3,4,1,2,3,4,5,6,7]);
	},

	merge: function(){
		var arr1 = [1,2,3,4];
		arr1.merge([1,2,3,4,5,6,7]);
		
		value_of(arr1).should_be([1,2,3,4,5,6,7]);
	},

	include: function(){
		var arr1 = [1,2,3,4];
		arr1.include(1);
		arr1.include(1);
		arr1.include(5);
		arr1.include(5);
		
		value_of(arr1).should_be([1,2,3,4,5]);
	},

	getLast: function(){
		var arr1 = [1,2,3,4];
		value_of(arr1.getLast()).should_be(4);
	},

	empty: function(){
		var arr1 = [1,2,3,4];
		value_of([].empty()).should_be_empty();
		value_of(arr1.empty).should_be_empty();
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