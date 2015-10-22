/*
---
name: Array
requires: ~
provides: ~
...
*/

(function(){

var getTestArray = function(){
	var a = [0, 1, 2, 3];
	delete a[1];
	delete a[2];
	return a;
};

describe('Array', function(){

	describe('Array.flatten', function(){

		it('should flatten a multidimensional array', function(){
			var arr = [1, 2, 3, [4, 5, [6, 7, [8]]], [[[[[9]]]]]];
			expect(arr.flatten()).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		});

		it('should flatten arguments', function(){
			var test = function(){
				return Array.flatten(arguments);
			};
			expect(test(1, 2, 3)).to.eql([1, 2, 3]);
			expect(test([1, 2, 3])).to.eql([1, 2, 3]);
			expect(test(1, 2, [3])).to.eql([1, 2, 3]);
		});

	});

	describe('Array.filter', function(){

		it('should filter an array', function(){
			var array = [1, 2, 3, 0, 0, 0];
			var arr = array.concat([false, null, 4]).filter(Type.isNumber);
			expect(arr).to.eql(array.concat(4));
		});

		it('should skip deleted elements', function(){
			var i = 0;
			getTestArray().filter(function(){
				i++;
				return true;
			});

			expect(i).to.equal(2);
		});

	});

	describe('Array.clean', function(){

		it('should clean an array from undefined and null values', function(){
			var array = [null, 1, 0, true, false, 'foo', undefined];
			var arr = array.clean();
			expect(arr).to.eql([1, 0, true, false, 'foo']);
		});

	});

	describe('Array.map', function(){

		it('should return a mapping of an array', function(){
			var arr = [1, 2, 3, 0, 0, 0].map(function(item){
				return (item + 1);
			});

			expect(arr).to.eql([2, 3, 4, 1, 1, 1]);
		});

		it('should skip deleted elements', function(){
			var i = 0;
			getTestArray().map(function(){
				return i++;
			});

			expect(i).to.equal(2);
		});

	});

	describe('Array.every', function(){

		it('should return true if every item matches the comparator, otherwise false', function(){
			expect([1, 2, 3, 0, 0, 0].every(Type.isNumber)).to.equal(true);

			expect(['1', 2, 3, 0].every(Type.isNumber)).to.equal(false);
		});

		it('should skip deleted elements', function(){
			var i = 0;
			getTestArray().every(function(){
				i++;
				return true;
			});

			expect(i).to.equal(2);
		});

	});

	describe('Array.some', function(){

		it('should return true if some of the items in the array match the comparator, otherwise false', function(){
			expect(['1', 2, 3, 0].some(Type.isNumber)).to.equal(true);

			expect([1, 2, 3, 0, 0, 0].map(String).some(Type.isNumber)).to.equal(false);
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

			expect(i).to.equal(3);
		});

	});

	describe('Array.indexOf', function(){

		it('should return the index of the item', function(){
			expect([1, 2, 3, 0, 0, 0].indexOf(0)).to.equal(3);
		});

		it('should return -1 if the item is not found in the array', function(){
			expect([1, 2, 3, 0, 0, 0].indexOf('not found')).to.equal(-1);
		});

	});

	describe('Array.erase', function(){

		it('should remove all items in the array that match the specified item', function(){
			var arr = [1, 2, 3, 0, 0, 0].erase(0);
			expect(arr).to.eql([1, 2, 3]);
		});

	});

	describe('Array.contains', function(){

		it('should return true if the array contains the specified item', function(){
			expect([1, 2, 3, 0, 0, 0].contains(0)).to.equal(true);
		});

		it('should return false if the array does not contain the specified item', function(){
			expect([0, 1, 2].contains('not found')).to.equal(false);
		});

	});

	describe('Array.associate', function(){

		it('should associate an array with a specified array', function(){
			var obj = [1, 2, 3, 0, 0, 0].associate(['a', 'b', 'c', 'd']);
			expect(obj).to.eql({a:1, b:2, c:3, d:0});
		});

	});

	describe('Array.append', function(){

		it('should append to an array', function(){
			var a = [1, 2, 4];
			var b = [2, 3, 4, 5];
			a.append(b);
			expect(a).to.eql([1, 2, 4, 2, 3, 4, 5]);
			expect(b).to.eql([2, 3, 4, 5]);
		});

	});

	var isType = function(type){
		return function(obj){
			return typeOf(obj) == type;
		};
	};

	describe('Array.link', function(){

		it('should link an array items to a new object according to the specified matchers', function(){
			var el;
			if (typeof document === 'undefined'){
				el = {$family: function(){ return 'element'; }};
			} else {
				el = document.createElement('div');
			}

			var assoc2 = [100, 'Hello', {foo: 'bar'}, el, false].link({
				myNumber: isType('number'),
				myElement: isType('element'),
				myObject: isType('object'),
				myString: isType('string'),
				myBoolean: isType('boolean')
			});

			expect(assoc2).to.eql({
				myNumber: 100,
				myElement: el,
				myObject: {foo: 'bar'},
				myString: 'Hello',
				myBoolean: false
			});
		});

	});

//<1.2compat>
	describe('Array.extend', function(){

		it('should extend an array', function(){
			var a = [1, 2, 4];
			var b = [2, 3, 4, 5];
			a.extend(b);
			expect(a).to.eql([1, 2, 4, 2, 3, 4, 5]);
			expect(b).to.eql([2, 3, 4, 5]);
		});

	});
//</1.2compat>

	describe('Array.combine', function(){

		it('should combine an array', function(){
			var arr = [1, 2, 3, 4].combine([3, 1, 4, 5, 6, 7]);
			expect(arr).to.eql([1, 2, 3, 4, 5, 6, 7]);
		});

	});

	describe('Array.include', function(){

		it('should include only new items', function(){
			var arr = [1, 2, 3, 4].include(1).include(5);
			expect(arr).to.eql([1, 2, 3, 4, 5]);
		});

	});

	describe('Array.getLast', function(){

		it('should return the last item in the array', function(){
			expect([1, 2, 3, 0, 0, 0].getLast()).to.equal(0);
			expect([3].getLast()).to.equal(3);
		});

		it('should return null if there are no items', function(){
			expect([].getLast()).to.equal(null);
		});

	});

	describe('Array.empty', function(){

		it('should empty the array', function(){
			var arr = [1, 2, 3, 4].empty();
			expect(arr).to.eql([]);
		});

	});

});

describe('Array Color Methods', function(){

	describe('Array.hexToRgb', function(){

		it('should return null if the length of the array is not 3', function(){
			expect([].hexToRgb()).to.equal(null);
		});

		it('should return a CSS rgb string', function(){
			expect(['0', '0', '0'].hexToRgb()).to.equal('rgb(0,0,0)');
		});

		it('should support shorthand hex', function(){
			expect(['c', 'c', 'c'].hexToRgb()).to.equal('rgb(204,204,204)');
		});

		it('should return an array with 16-based numbers when passed true', function(){
			expect(['ff', 'ff', 'ff'].hexToRgb(true)).to.eql([255, 255, 255]);
		});

	});

	describe('Array.rgbToHex', function(){

		it('should return null if the array does not have at least 3 times', function(){
			expect([0, 1].rgbToHex()).to.equal(null);
		});

		it('should return a css hexadecimal string', function(){
			expect(['255', '0', '0'].rgbToHex()).to.equal('#ff0000');
			expect([0, 0, 255].rgbToHex()).to.equal('#0000ff');
		});

		it('should return an array with hexadecimal string items', function(){
			expect([0, 255, 0].rgbToHex(true)).to.eql(['00', 'ff', '00']);
		});

		it('should return `transparent` if the fourth item is 0 and first param is not true', function(){
			expect([0, 0, 0, 0].rgbToHex()).to.equal('transparent');
		});

	});

});

describe('Array.getRandom', function(){

	it('should get a random element from an array', function(){
		var a = [1];

		expect(a.getRandom()).to.equal(1);

		a.push(2);

		// Let's try a few times.
		expect(a).to.contain(a.getRandom());
		expect(a).to.contain(a.getRandom());
		expect(a).to.contain(a.getRandom());
		expect(a).to.contain(a.getRandom());
	});

});

describe('Array.pick', function(){

	it('should pick a value that is not null from the array', function(){
		expect([null, undefined, true, 1].pick()).to.equal(true);
	});

	it('should return null', function(){
		expect([].pick()).to.equal(null);
	});

});

describe('Array', function(){

	describe('Array.map', function(){

		it('should return an array with the same length', function(){
			expect([1, 2, 3, undefined].map(function(v){
				return v;
			}).length).to.equal(4);
		});

		it('shoud return an empty array when the thisArg does not has a length property', function(){
			expect([].map.call({}, function(){
				return 1;
			})).to.eql([]);
		});

	});

	it('should accept thisArgs without length property', function(){
		var object = {}, fn = function(){};
		expect([].every.call(object, fn)).to.equal(true);
		expect([].filter.call(object, fn)).to.eql([]);
		expect([].indexOf.call(object)).to.equal(-1);
		expect([].map.call(object, fn)).to.eql([]);
		expect([].some.call(object, fn)).to.equal(false);
	});

	describe('Array.filter', function(){

		it('should return the original item, and not any mutations.', function(){
			var result = [0, 1, 2].filter(function(num, i, array){
				if (num == 1){
					array[i] = 'mutation';
					return true;
				}
			});

			expect(result[0]).to.equal(1);
		});

	});

});

})();
