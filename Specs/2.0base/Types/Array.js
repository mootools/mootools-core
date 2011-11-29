/*
Specs for Array.js
License: MIT-style license.
*/

(function(){

var getTestArray = function(){
	var a = [0, 1, 2, 3];
	delete a[1];
	delete a[2];
	return a;
};

describe('Array.filter', function(){

	it('should filter an array', function(){
		var array = [1,2,3,0,0,0];
		var arr = array.concat([false, null, 4]).filter(Type.isNumber);
		expect(arr).toEqual(array.concat(4));
	});

	it('filter should skip deleted elements', function(){
		var i = 0;
		getTestArray().filter(function(){
			i++;
			return true;
		});

		expect(i).toEqual(2);
	});

});

describe('Array.indexOf', function(){

	it('should return the index of the item', function(){
		expect([1,2,3,0,0,0].indexOf(0)).toEqual(3);
	});

	it('should return -1 if the item is not found in the array', function(){
		expect([1,2,3,0,0,0].indexOf('not found')).toEqual(-1);
	});

});

describe('Array.map', function(){

	it('should return a mapping of an array', function(){
		var arr = [1,2,3,0,0,0].map(function(item){
			return (item + 1);
		});

		expect(arr).toEqual([2,3,4,1,1,1]);
	});

	it('should skip deleted elements', function(){
		var i = 0;
		getTestArray().map(function(){
			return i++;
		});

		expect(i).toEqual(2);
	});

});

describe('Array.every', function(){

	it('should return true if every item matches the comparator, otherwise false', function(){
		expect([1,2,3,0,0,0].every(Type.isNumber)).toBeTruthy();

		expect(['1',2,3,0].every(Type.isNumber)).toBeFalsy();
	});

	it('should skip deleted elements', function(){
		var i = 0;
		getTestArray().every(function(){
			i++;
			return true;
		});

		expect(i).toEqual(2);
	});

});

describe('Array.some', function(){


	it('should return true if some of the items in the array match the comparator, otherwise false', function(){
		expect(['1',2,3,0].some(Type.isNumber)).toBeTruthy();

		expect([1,2,3,0,0,0].map(String).some(Type.isNumber)).toBeFalsy();
	});

	it('should skip deleted elements', function(){
		var i = 0;
		var a = getTestArray();
		delete a[0];

		// skips the first three elements
		a.some(function(value, index){
			i = index;
			return true;
		});

		expect(i).toEqual(3);
	});

});

describe('Array.pair', function(){

	it('should pair an array with the results of a method invokation', function(){
		expect([1, 2, 3, 4].pair(function(value){
			return value * 2;
		})).toEqual({
			1: 2,
			2: 4,
			3: 6,
			4: 8
		})
	});

});

describe('Array.clean', function(){

	it('should clean an array from undefined and null values', function(){
		var array = [null, 1, 0, true, false, "foo", undefined];
		var arr = array.clean();
		expect(arr).toEqual([1, 0, true, false, "foo"]);
	});

});

describe('Array.pick', function(){

	it('should pick a value that is not null from the array', function(){
		expect([null, undefined, true, 1].pick()).toEqual(true);
	});

	it('should return null', function(){
		expect([].pick()).toBeNull();
	});

});

describe('Array.invoke', function(){

	it('should invoke methods on the contained objects', function(){

		var item = function(i){
			this.i = i;
			this.myMethod = function(){
				return this.i;
			};
		};

		expect([new item(3), new item(1), new item(2)].invoke('myMethod')).toEqual([3, 1, 2]);

	});

});

describe('Array.append', function(){

	it('should append to an array', function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.append(b);
		expect(a).toEqual([1,2,4,2,3,4,5]);
		expect(b).toEqual([2,3,4,5]);
	});

});

describe('Array.contains', function(){

	it('should return true if the array contains the specified item', function(){
		expect([1,2,3,0,0,0].contains(0)).toBeTruthy();
	});

	it('should return false if the array does not contain the specified item', function(){
		expect([0,1,2].contains('not found')).toBeFalsy();
	});

});

describe('Array.last', function(){

	it('should return the last item in the array', function(){
		expect([1,2,3,0,0,0].last()).toEqual(0);
		expect([3].last()).toEqual(3);
	});

	it('should return null if there are no items', function(){
		expect([].last()).toEqual(null);
	});

});

describe('Array.random', function(){

	it('should get a random element from an array', function(){
		var a = [1];

		expect(a.random()).toEqual(1);

		a.push(2, 3);

		// Let's try a few times
		expect(a).toContain(a.random());
		expect(a).toContain(a.random());
		expect(a).toContain(a.random());
		expect(a).toContain(a.random());
	});

});

describe('Array.include', function(){

	it('should include only new items', function(){
		var arr = [1,2,3,4].include(1).include(5);
		expect(arr).toEqual([1,2,3,4,5]);
	});

});

describe('Array.combine', function(){

	it('should combine an array', function(){
		var arr = [1,2,3,4].combine([3,1,4,5,6,7]);
		expect(arr).toEqual([1,2,3,4,5,6,7]);
	});

});

describe('Array.erase', function(){

	it('should remove all items in the array that match the specified item', function(){
		var arr = [1,2,3,0,0,0].erase(0);
		expect(arr).toEqual([1,2,3]);
	});

});

describe('Array.empty', function(){

	it('should empty the array', function(){
		var array = [1,2,3,4].empty();
		expect(array).toEqual([]);
	});

});

describe('Array.flatten', function(){

	it('should flatten a multidimensional array', function(){
		var array = [1,2,3,[4,5,[6,7,[8]]], [[[[[9]]]]]];
		expect(array.flatten()).toEqual([1,2,3,4,5,6,7,8,9]);
	});

	it('should flatten arguments', function(){
		var test = function(){
			return Array.flatten(arguments);
		};
		expect(test(1,2,3)).toEqual([1,2,3]);
		expect(test([1,2,3])).toEqual([1,2,3]);
		expect(test(1,2,[3])).toEqual([1,2,3]);
	});

});

describe('Array.item', function(){

	it('should return the correct value', function(){
		var array = [1, 2, 3];

		expect(array.item(0)).toEqual(1);
		expect(array.item(1)).toEqual(2);
		expect(array.item(2)).toEqual(3);
		expect(array.item(3)).toEqual(null);
		expect(array.item(-1)).toEqual(3);
		expect(array.item(-2)).toEqual(2);
		expect(array.item(-3)).toEqual(null);
	});
});

})();
