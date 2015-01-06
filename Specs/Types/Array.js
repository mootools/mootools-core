/*
---
name: Array
requires: ~
provides: ~
...
*/

(function(){

var defineGetter = function(object, name, getter){
	Object.defineProperty(object, name, {get : getter} );
}

var getTestArray = function(){
	var a = [0, 1, 2, 3];
	delete a[1];
	delete a[2];
	return a;
};


describe("Array", function(){

	// Array.flatten

	it('should flatten a multidimensional array', function(){
		var arr = [1,2,3,[4,5,[6,7,[8]]], [[[[[9]]]]]];
		expect(arr.flatten()).toEqual([1,2,3,4,5,6,7,8,9]);
	});

	it('should flatten arguments', function(){
		var test = function(){
			return Array.flatten(arguments);
		};
		expect(test(1,2,3)).toEqual([1,2,3]);
		expect(test([1,2,3])).toEqual([1,2,3]);
		expect(test(1,2,[3])).toEqual([1,2,3]);
	});

	// Array.filter

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

	// Array.clean

	it('should clean an array from undefined and null values', function(){
		var array = [null, 1, 0, true, false, "foo", undefined];
		var arr = array.clean();
		expect(arr).toEqual([1, 0, true, false, "foo"]);
	});

	// Array.map

	it('should return a mapping of an array', function(){
		var arr = [1,2,3,0,0,0].map(function(item){
			return (item + 1);
		});

		expect(arr).toEqual([2,3,4,1,1,1]);
	});

	it('map should skip deleted elements', function(){
		var i = 0;
		getTestArray().map(function(){
			return i++;
		});

		expect(i).toEqual(2);
	});

	// Array.every

	it('should return true if every item matches the comparator, otherwise false', function(){
		expect([1,2,3,0,0,0].every(Type.isNumber)).toBeTruthy();

		expect(['1',2,3,0].every(Type.isNumber)).toBeFalsy();
	});

	it('every should skip deleted elements', function(){
		var i = 0;
		getTestArray().every(function(){
			i++;
			return true;
		});

		expect(i).toEqual(2);
	});

	// Array.some

	it('should return true if some of the items in the array match the comparator, otherwise false', function(){
		expect(['1',2,3,0].some(Type.isNumber)).toBeTruthy();

		expect([1,2,3,0,0,0].map(String).some(Type.isNumber)).toBeFalsy();
	});

	it('some should skip deleted elements', function(){
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

	// Array.indexOf

	it('should return the index of the item', function(){
		expect([1,2,3,0,0,0].indexOf(0)).toEqual(3);
	});

	it('should return -1 if the item is not found in the array', function(){
		expect([1,2,3,0,0,0].indexOf('not found')).toEqual(-1);
	});

	// Array.erase

	it('should remove all items in the array that match the specified item', function(){
		var arr = [1,2,3,0,0,0].erase(0);
		expect(arr).toEqual([1,2,3]);
	});

	// Array.contains
	describe("Array.contains", function(){
		// old MooTools Tests
		it('should return true if the array contains the specified item', function(){
			expect([1,2,3,0,0,0].contains(0)).toBeTruthy();
		});

		it('should return false if the array does not contain the specified item', function(){
			expect([0,1,2].contains('not found')).toBeFalsy();
		});

		//ES7 tests converted to MT, please refer to https://github.com/domenic/Array.prototype.contains/tree/master/test for original BSD license for individual tests.
		if(Object.create && Object.defineProperty){
			describe("sees a new element added by a getter that is hit during iteration", function(){
				it('Expect array-like to contain "c", which was added by the getter for the 1st element', function(){
					var arrayLike = {
							length: 5,
							0: 'a'
					};
					defineGetter(arrayLike, 1 , function(){
							this[2] = 'c';
							return 'b';
					});

					var result = Array.prototype.contains.call(arrayLike, 'c');
					expect(result).toBeTruthy();
				});
			});
			describe("works on array-like objects", function(){
				var arrayLike1 = { length: 5, 0: "a", 1: "b" };
				it('Expected array-like to contain "a"', function(){
					var result1 = Array.prototype.contains.call(arrayLike1, "a");
					expect(result1).toBeTruthy();
				});
				it('Expected array-like not to contain "c"', function(){
					var result2 = Array.prototype.contains.call(arrayLike1, "c");
					expect(result2).toBeFalsy();
				});
				var arrayLike2 = { length: 2, 0: "a", 1: "b", 2: "c" };
				it('Expected array-like to contain "b"', function(){
					var result3 = Array.prototype.contains.call(arrayLike2, "b");
					expect(result3).toBeTruthy();
				});
				it('Expected array-like to not contain "c"', function(){
					var result4 = Array.prototype.contains.call(arrayLike2, "c");
					expect(result4).toBeFalsy();
				});
			});
			describe('should terminate if getting an index throws an exception',  function(){
				it('should re-throw and stop', function(){
					var trappedZero = {
						length: 2
					};
					defineGetter(trappedZero, 0 , function(){
						throw new Error('This error should be re-thrown');
					});
					defineGetter(trappedZero, 1, function(){
						throw new Error('Should not try get the element at index 1');
					})

					try{
						Array.prototype.contains.call(trappedZero, 'a');
					} catch(e){
						expect(e.message).toEqual('This error should be re-thrown')
					}
				});
			});
			describe('should terminate if an exception occurs converting the fromIndex to a number', function(){
				var fromIndex = {
					valueOf: function () {
						throw new Error('This error should be re-thrown');
					}
				};

				var trappedZero = {
				    length: 1
				};
				defineGetter(trappedZero, 0, function(){
					throw new Error('Should not try get the element at index 0');
				});
				it('should re-throw and stop', function(){
					try{
						Array.prototype.contains.call(trappedZero, 'a', fromIndex);
					} catch(e){
						expect(e.message).toEqual('This error should be re-thrown')
					}
				});
			});
			describe('should terminate if an exception occurs getting the length', function(){

				var fromIndexTrap = {
					valueOf: function () {
						throw new Error('Should not try to call ToInteger on valueOf');
					}
				}

				var throwingLength = {};
				defineGetter(throwingLength, 'length', function(){throw new Error('This error should be re-thrown');});
				defineGetter(throwingLength, 0, function(){throw new Error('Should not try to get the zeroth element')});
				it('should re-throw and stop', function(){
					try{
						Array.prototype.contains.call(throwingLength, 'a', fromIndexTrap);
					} catch(e){
						expect(e.message).toEqual('This error should be re-thrown');
					}
				});
			});
			describe('should terminate if an exception occurs converting the length to a number', function(){
				var fromIndexTrap = {
					valueOf: function () {
						throw new Error('Should not try to call ToInteger on valueOf');
					}
				};

				var badLength = {
					length: {
						valueOf: function () {
							throw new Error('This error should be re-thrown');
						}
					}
				};

				defineGetter(badLength, 0, function(){throw new Error('Should not try to get the zeroth element')})
				it('should re-throw and stop', function(){
					try{
						Array.prototype.contains.call(badLength, 'a', fromIndexTrap);
					} catch(e){
						expect(e.message).toEqual('This error should be re-thrown');
					}
				});
			});
			describe('should search the whole array, as the optional second argument fromIndex defaults to 0', function(){
				it('should contain 10', function(){
					expect([10, 11].contains(10)).toBeTruthy();
				})
				it('should contain 11', function(){
					expect([10, 11].contains(11)).toBeTruthy();
				})

				var arrayLike = {
					length: 2
				};
				defineGetter(arrayLike, 0, function(){return '1'})
				defineGetter(arrayLike, 1, function(){return '2'})

				it('should contain "1"', function(){
					expect([].contains.call(arrayLike, '1')).toBeTruthy();
				})
				it('should contain "2"', function(){
					expect([].contains.call(arrayLike, '2')).toBeTruthy();
				})
			})
			describe('returns false if fromIndex is greater or equal to the length of the array', function(){
				it('should not be searched', function(){
					var array = [1, 2];
					expect(array.contains(2, 3)).toBeFalsy();
					expect(array.contains(2, 2)).toBeFalsy();
				})

				var arrayLikeWithTrap = {
					length: 2
				};
				defineGetter(arrayLikeWithTrap, 0, function(){throw new Error('Getter for 0 should not be called')});
				defineGetter(arrayLikeWithTrap, 1, function(){throw new Error('Getter for 1 should not be called')});

				it('should not search arraylike', function(){
					expect([].contains.call(arrayLikeWithTrap, 'c', 2)).toBeFalsy();
					expect([].contains.call(arrayLikeWithTrap, 'c', 3)).toBeFalsy();
				})
			})
			describe('searches the whole array if the computed index from the given negative fromIndex argument is less than 0', function(){
				it('should search the array', function(){
					expect([1, 3].contains(1, -4)).toBeTruthy();
					expect([1, 3].contains(3, -4)).toBeTruthy();
				})

				var arrayLike = {
					length: 2,
					0: 'a'
				};

				defineGetter(arrayLike, 1, function(){return 'b'});
				// ES7 test don't check this, I am adding it here
				defineGetter(arrayLike, -1, function(){throw new Error('shold not try to get a negative value')});

				it('should search the arrayLike', function(){
					expect([].contains.call(arrayLike, 'a', -4)).toBeTruthy();
					expect([].contains.call(arrayLike, 'b', -4)).toBeTruthy();
				})
			})
			describe('should use a negative value as the offset from the end of the array to compute fromIndex', function(){
				it('should find 13', function(){
					expect([12, 13].contains(13, -1)).toBeTruthy();
				})
				it('should not find 12', function(){
					expect([12, 13].contains(12, -1)).toBeFalsy();
				})
				it('should find 12', function(){
					expect([12, 13].contains(12, -2)).toBeTruthy();
				})

				var arrayLike = {
					length: 2
				};
				defineGetter(arrayLike, '0', function(){return 'a'})
				defineGetter(arrayLike, '1', function(){return 'b'})
				it('should find b', function(){
					expect([].contains.call(arrayLike, 'b', -1)).toBeTruthy();
				});
				it('should not find a', function(){
					expect([].contains.call(arrayLike, 'a', -1)).toBeFalsy();
				});
				it('should find a', function(){
					expect([].contains.call(arrayLike, 'a', -2)).toBeTruthy();
				});
			});
			describe('converts its fromIndex parameter to an integer', function(){

				it('should not search the array', function(){
					expect(['a', 'b'].contains('a', 2.3)).toBeFalsy();
				});

				var arrayLikeWithTraps = {
					length: 2
				};
				defineGetter(arrayLikeWithTraps, 0, function(){throw new Error('Getter for index 0 should not be called')});
				defineGetter(arrayLikeWithTraps, 1, function(){throw new Error('Getter for index 1 should not be called')});

				it('Expected the array to be searched for a fromIndex fractionally above the length', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTraps, 'c', 2.1)).toBeFalsy();
				});
				it('Expected the array not to be searched for a fromIndex of +Infinity', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTraps, 'c', +Infinity)).toBeFalsy();
				});
				it('Expected the array not to be searched for a fromIndex of +Infinity', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTraps, 'c', +Infinity)).toBeFalsy();
				});
				it('Expected the array to be searched for a fromIndex of -Infinity', function(){
					expect(['a', 'b', 'c'].contains('a', -Infinity)).toBeTruthy();
				});
				it('Expected the fromIndex to be rounded down and thus the element to be found', function(){
					expect(['a', 'b', 'c'].contains('c', 2.9)).toBeTruthy();
				});
				it('Expected a fromIndex of NaN to be treated as 0 for an array', function(){
					expect(['a', 'b', 'c'].contains('c', NaN)).toBeTruthy();
				});

				var arrayLikeWithTrapAfterZero = {
					length: 2
				};
				defineGetter(arrayLikeWithTrapAfterZero, 0, function(){return 'a'});
				defineGetter(arrayLikeWithTrapAfterZero, 1, function(){throw new Error('Getter for index 1 should not be called')});
				it('Expected a fromIndex of NaN to be treated as 0 for an array-like', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTrapAfterZero, 'a', NaN)).toBeTruthy();
				});

				var numberLike = { valueOf: function () { return 2; } };
				it('Expected the element not to be found with the given number-like fromIndex', function(){
					expect(['a', 'b', 'c'].contains('a', numberLike)).toBeFalsy();
				});
				it('Expected the element not to be found with the given string fromIndex', function(){
					expect(['a', 'b', 'c'].contains('a', '2')).toBeFalsy();
				});
				it('Expected the element to be found with the given number-like fromIndex', function(){
					expect(['a', 'b', 'c'].contains('c', numberLike)).toBeTruthy();
				});
				it('Expected the element to be found with the given string fromIndex', function(){
					expect(['a', 'b', 'c'].contains('c', '2')).toBeTruthy();
				});
			});
			describe('should respect contains signature', function(){
				it('s length should be 1', function(){
					expect([].contains.length).toEqual(1);
				});
				if(Function.prototype.name !== undefined){ //IE doesn't have that yet (I could use function serialization but cba).
					it('s name should be "contains"', function(){
						expect([].contains.name).toEqual('contains');
					});
				}
				it('s property descriptor should be right', function(){
					var propertyDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'contains');
					expect(propertyDescriptor.writable).toBeTruthy();
					//expect(propertyDescriptor.enumerable).toBeFalsy(); currently is enumerable.
					expect(propertyDescriptor.configurable).toBeTruthy();
				});
			});
			describe('should not skip holes, and does treat them as undefined', function(){
				var arrayWithHoles = [,,,];
				it('Expected array with many holes to contain undefined', function(){
					expect(Array.prototype.contains.call(arrayWithHoles, undefined)).toBeTruthy();
				});

				var arrayWithASingleHole = ['a', 'b',, 'd'];
				it('Expected array with a single hole to contain undefined', function(){
					expect(arrayWithASingleHole.contains(undefined)).toBeTruthy();
				});
			});
			describe('should get length property from the prototype if it is available', function(){
				var proto = { length: 1 };
				var arrayLike = Object.create(proto);
				arrayLike[0] = 'a';

				Object.defineProperty(arrayLike, '1', {
					get: function () {
						throw new Error('Getter for 1 was called');
					}
				});
				it('Expected length to be determined from the prototype', function(){
					expect(Array.prototype.contains.call(arrayLike, 'a')).toBeTruthy();
				});
			});
			describe('treats a missing length property as zero', function(){
				var arrayLikeWithTraps = {};
				defineGetter(arrayLikeWithTraps, 0, function(){throw new Error('Getter for index 0 should not be called')})
				defineGetter(arrayLikeWithTraps, 1, function(){throw new Error('Getter for index 1 should not be called')})
				it('Expected a length-less object not to contain anything', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTraps, 'a')).toBeFalsy();
				});
			});
			describe('should always return false on negative-length objects', function(){
				it('Expected { length: -1 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: -1 }, 2)).toBeFalsy();
				});
				it('Expected { length: -2 } to not contain (no argument passed)', function(){
					expect(Array.prototype.contains.call({ length: -2 })).toBeFalsy();
				});
				it('Expected { length: -Infinity } to not contain undefined', function(){
					expect(Array.prototype.contains.call({ length: -Infinity }, undefined)).toBeFalsy();
				});
				it('Expected { length: -Math.pow(2, 53) } to not contain NaN', function(){
					expect(Array.prototype.contains.call({ length: -Math.pow(2, 53) }, NaN)).toBeFalsy();
				});
				it('Expected { length: -1, "-1": 2 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: -1, '-1': 2 }, 2)).toBeFalsy();
				});
				it('Expected { length: -3, "-1": 2 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: -3, '-1': 2 }, 2)).toBeFalsy();
				});
				it('Expected { length: -Infinity, "-1": 2 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: -Infinity, '-1': 2 }, 2)).toBeFalsy();
				});

				var arrayLikeWithTrap = {
					length: -1
				};
				defineGetter(arrayLikeWithTrap, 0, function(){throw new Error('Getter for index 0 should not be called')});
				it('Expected trapped array-like with length -1 to not contain 2', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTrap, 2)).toBeFalsy();
				});
			});
			describe('Array.prototype.contains should clamp positive lengths to 2^32 - 1', function(){
				var fromIndexForLargeIndexTests = 9007199254740990;
				it('Expected { length: 1 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: 1 }, 2)).toBeFalsy();
				});
				it('Expected { length: 1, 0: \'a\' } to contain \'a\'', function(){
					expect(Array.prototype.contains.call({ length: 1, 0: 'a' }, 'a')).toBeTruthy();
				});
				it('Expected { length: +Infinity, 0: \'a\' } to contain \'a\'', function(){
					expect(Array.prototype.contains.call({ length: +Infinity, 0: 'a' }, 'a')).toBeTruthy();
				});
				it('Expected { length: +Infinity } to not contain \'a\'', function(){
					expect(Array.prototype.contains.call({ length: +Infinity }, 'a', fromIndexForLargeIndexTests)).toBeFalsy();
				});

				var arrayLikeWithTrap = {
					length: +Infinity,
					'9007199254740993': 'a'
				};
				defineGetter(arrayLikeWithTrap, 9007199254740992, function(){
					throw('Getter for 9007199254740992 (i.e. 2^53) was called');
				});
				it('Expected trapped array-like with length 9007199254740992 to not contain \'a\'', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTrap, 'a', fromIndexForLargeIndexTests)).toBeFalsy();
				});

				var arrayLikeWithTooBigLength = {
					length: 9007199254740995,
					'9007199254740992': 'a'
				};
				it('Expected array-like with too-big length to not contain \'a\', since it is beyond the max length', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTooBigLength, 'a', fromIndexForLargeIndexTests)).toBeFalsy();
				});
			});
			describe('should always return false on zero-length objects', function(){
				it('Expected [] to not contain 2', function(){
					expect([].contains(2)).toBeFalsy();
				});
				it('Expected [] to not contain (no argument passed)', function(){
					expect([].contains()).toBeFalsy();
				});
				it('Expected [] to not contain undefined', function(){
					expect([].contains(undefined)).toBeFalsy();
				});
				it('Expected [] to not contain NaN', function(){
					expect([].contains(NaN)).toBeFalsy();
				});
				it('Expected { length: 0 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: 0 }, 2)).toBeFalsy();
				});
				it('Expected { length: 0 } to not contain (no argument passed)', function(){
					expect(Array.prototype.contains.call({ length: 0 })).toBeFalsy();
				});
				it('Expected { length: 0 } to not contain undefined', function(){
					expect(Array.prototype.contains.call({ length: 0 }, undefined)).toBeFalsy();
				});
				it('Expected { length: 0 } to not contain NaN', function(){
					expect(Array.prototype.contains.call({ length: 0 }, NaN)).toBeFalsy();
				});
				it('Expected { length: 0, 0: 2 } to not contain 2', function(){
					expect(Array.prototype.contains.call({ length: 0, 0: 2 }, 2)).toBeFalsy();
				});
				it('Expected { length: 0, 0: undefined } to not contain (no argument passed)', function(){
					expect(Array.prototype.contains.call({ length: 0, 0: undefined })).toBeFalsy();
				});
				it('Expected { length: 0, 0: undefined } to not contain undefined', function(){
					expect(Array.prototype.contains.call({ length: 0, 0: undefined }, undefined)).toBeFalsy();
				});
				it('Expected { length: 0, 0: NaN } to not contain NaN', function(){
					expect(Array.prototype.contains.call({ length: 0, 0: NaN }, NaN)).toBeFalsy();
				});

				var arrayLikeWithTrap = {
					length: 0
				};
				defineGetter(arrayLikeWithTrap, 0, function(){throw new Error('Getter for index 0 should not be called')});

				it('Expect arraylikewithtrap to return false', function(){
					expect(Array.prototype.contains.call(arrayLikeWithTrap)).toBeFalsy();
				})

				var trappedFromIndex = {
					valueOf: function () {
						throw new Error('Should not try to convert fromIndex to a number on a zero-length array');
					}
				};
				it('should not try to convert from if array length is 0', function(){
					expect([].contains('a', trappedFromIndex)).toBeFalsy();
					expect(Array.prototype.contains.call({ length: 0 }, trappedFromIndex)).toBeFalsy();
				});
			});
			describe('should not have its behavior impacted by modifications to the global property', function(){
			var ONumber = Number;
			function fakeNumber() {
				throw new Error('The overriden version of fakeNumber was called!');
			}

			var global = (new Function("return this;"))();
			global.Number = fakeNumber;

			if (Number !== fakeNumber) {
				throw new Error('Sanity check failed: could not modify the global Number');
			}
			it('Expected the empty array not to contain anything', function(){
				expect([].contains('a')).toBeFalsy();
			});
			it('Expected the number 1 not to contain anything', function(){
				expect(Array.prototype.contains.call(1, 'a')).toBeFalsy();
			});
			function fakeObject() {
				throw new Error('The overriden version of Object was called!');
			}
			var OObject = Object;
			global.Object = fakeObject;
			if (Object !== fakeObject) {
				throw new Error('Sanity check failed: could not modify the global Object');
			}
			it('Expected the empty array not to contain anything', function(){
				expect([].contains('a')).toBeFalsy();
			});
			it('Expected the number 1 not to contain anything', function(){
				expect(Array.prototype.contains.call(1, 'a')).toBeFalsy();
			});
			//restore
			Object = OObject;
			Number = ONumber;

			});
			describe('should use ToObject on this, so that when called with an object without ownProperties, it picks up numeric properties from the prototype chain', function(){
				var test = Object.create(Object.create({
					0: 'a',
					1: 'b',
					length: 2
				}))
				it('Expected test to contain "a"', function(){
					expect(Array.prototype.contains.call(test, "a")).toBeTruthy();
				});
				it('Expected test to contain "b"', function(){
					expect(Array.prototype.contains.call(test, "b")).toBeTruthy();
				});
				it('Expected test to not contain "c"', function(){
					expect(Array.prototype.contains.call(test, "c")).toBeFalsy();
				});
			});
			describe('works on objects', function(){
				it('Did not expect the object to be found', function(){
					expect(['a', 'b', 'c'].contains({})).toBeFalsy();
				});
				it('Did not expect the object to be found', function(){
					expect([{}, {}].contains({})).toBeFalsy();
				});
				var obj = {};
				it('Expected the object to be found', function(){
					expect([obj].contains(obj)).toBeTruthy();
				});
				it('Did not expect the object to be found', function(){
					expect([obj].contains(obj, 1)).toBeFalsy();
				});
				it('Expected the object to be found', function(){
					expect([obj, obj].contains(obj, 1)).toBeTruthy();
				});
				var stringyObject = { toString: function () { return 'a'; } };
				it('Did not expect the object to be found', function(){
					expect(['a', 'b', obj].contains(stringyObject)).toBeFalsy();
				});
			});
			describe('does not see an element removed by a getter that is hit during iteration', function(){
				var arrayLike = {
					length: 5,
					0: 'a',
					2: 'c'
				};
				defineGetter(arrayLike, 1, function(){
					delete this[2];
					return 'b';
				});
				it('Expected array-like to not contain "c", which was removed by the getter for the 1st element', function(){
					expect(Array.prototype.contains.call(arrayLike, 'c')).toBeFalsy();
				});
			});
			describe('should use the SameValueZero algorithm to compare', function(){
				it('Expected [1, 2, 3] to contain 2', function(){
					expect([1, 2, 3].contains(2)).toBeTruthy();
				});
				it('Expected [1, 2, 3] to not contain 4', function(){
					expect([1, 2, 3].contains(4)).toBeFalsy();
				});
				it('Expected [1, 2, NaN] to contain NaN', function(){
					expect([1, 2, NaN].contains(NaN)).toBeTruthy();
				});
				it('Expected [1, 2, -0] to contain +0', function(){
					expect([1, 2, -0].contains(+0)).toBeTruthy();
				});
				it('Expected [1, 2, -0] to contain -0', function(){
					expect([1, 2, -0].contains(-0)).toBeTruthy();
				});
				it('Expected [1, 2, +0] to contain -0', function(){
					expect([1, 2, +0].contains(-0)).toBeTruthy();
				});
				it('Expected [1, 2, +0] to contain +0', function(){
					expect([1, 2, +0].contains(+0)).toBeTruthy();
				});
				it('Expected [1, 2, -Infinity] to not contain +Infinity', function(){
					expect([1, 2, -Infinity].contains(+Infinity)).toBeFalsy();
				});
				it('Expected [1, 2, -Infinity] to contain -Infinity', function(){
					expect([1, 2, -Infinity].contains(-Infinity)).toBeTruthy();
				});
				it('Expected [1, 2, +Infinity] to not contain -Infinity', function(){
					expect([1, 2, +Infinity].contains(-Infinity)).toBeFalsy();
				});
				it('Expected [1, 2, +Infinity] to contain +Infinity', function(){
					expect([1, 2, +Infinity].contains(+Infinity)).toBeTruthy();
				});
			});
			describe('stops once it hits the length of an array-like, even if there are more after', function(){
				var arrayLike = {
					length: 2,
					0: 'a',
					1: 'b'
				};
				defineGetter(arrayLike, 2, function(){throw new Error('Should not try to get the second element');});
				it('Expected array-like to not contain "c"', function(){
					expect(Array.prototype.contains.call(arrayLike, 'c')).toBeFalsy();
				});
			});
		}

	});

	// Array.associate

	it('should associate an array with a specified array', function(){
		var obj = [1,2,3,0,0,0].associate(['a', 'b', 'c', 'd']);
		expect(obj).toEqual({a:1, b:2, c:3, d:0});
	});

	// Array.append

	it('should append to an array', function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.append(b);
		expect(a).toEqual([1,2,4,2,3,4,5]);
		expect(b).toEqual([2,3,4,5]);
	});

	var isType = function(type){
		return function(obj){
			return typeOf(obj) == type;
		};
	};

	// Array.link
	it('should link an array items to a new object according to the specified matchers', function(){
		var el = document.createElement('div');
		var assoc2 = [100, 'Hello', {foo: 'bar'}, el, false].link({
			myNumber: isType('number'),
			myElement: isType('element'),
			myObject: isType('object'),
			myString: isType('string'),
			myBoolean: isType('boolean')
		});

		expect(assoc2).toEqual({
			myNumber: 100,
			myElement: el,
			myObject: {foo: 'bar'},
			myString: 'Hello',
			myBoolean: false
		});
	});

	//<1.2compat>
	// Array.extend
	it('should extend an array', function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.extend(b);
		expect(a).toEqual([1,2,4,2,3,4,5]);
		expect(b).toEqual([2,3,4,5]);
	});
	//</1.2compat>

	it('should append an array', function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.append(b);
		expect(a).toEqual([1,2,4,2,3,4,5]);
		expect(b).toEqual([2,3,4,5]);
	});

	// Array.combine

	it('should combine an array', function(){
		var arr = [1,2,3,4].combine([3,1,4,5,6,7]);
		expect(arr).toEqual([1,2,3,4,5,6,7]);
	});

	// Array.include

	it('should include only new items', function(){
		var arr = [1,2,3,4].include(1).include(5);
		expect(arr).toEqual([1,2,3,4,5]);
	});

	// Array.getLast

	it('should return the last item in the array', function(){
		expect([1,2,3,0,0,0].getLast()).toEqual(0);
		expect([3].getLast()).toEqual(3);
	});

	it('should return null if there are no items', function(){
		expect([].getLast()).toEqual(null);
	});

	// Array.empty

	it('should empty the array', function(){
		var arr = [1,2,3,4].empty();
		expect(arr).toEqual([]);
	});

});

describe("Array Color Methods", function(){

	// Array.hexToRgb

	it('should return null if the length of the array is not 3', function(){
		expect([].hexToRgb()).toBeNull();
	});

	it('should return a CSS rgb string', function(){
		expect(['0','0','0'].hexToRgb()).toEqual('rgb(0,0,0)');
	});

	it('should support shorthand hex', function(){
		expect(['c','c','c'].hexToRgb()).toEqual('rgb(204,204,204)');
	});

	it('should return an array with 16-based numbers when passed true', function(){
		expect(['ff','ff','ff'].hexToRgb(true)).toEqual([255,255,255]);
	});

	// Array.rgbToHex

	it('should return null if the array does not have at least 3 times', function(){
		expect([0,1].rgbToHex()).toBeNull();
	});

	it('should return a css hexadecimal string', function(){
		expect(['255', '0', '0'].rgbToHex()).toEqual('#ff0000');
		expect([0,0,255].rgbToHex()).toEqual('#0000ff');
	});

	it('should return an array with hexadecimal string items', function(){
		expect([0,255,0].rgbToHex(true)).toEqual(['00', 'ff', '00']);
	});

	it('should return `transparent` if the fourth item is 0 and first param is not true', function(){
		expect([0,0,0,0].rgbToHex()).toEqual('transparent');
	});

});

describe('Array.getRandom', function(){

	it('should get a random element from an array', function(){
		var a = [1];

		expect(a.getRandom()).toEqual(1);

		a.push(2);

		// Let's try a few times
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
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

describe('Array', function(){

	describe('Array.map', function(){

		it('should return an array with the same length', function(){
			expect([1, 2, 3, undefined].map(function(v){
				return v;
			}).length).toEqual(4);
		});

		it('shoud return an empty array when the thisArg does not has a length property', function(){
			expect([].map.call({}, function(){
				return 1;
			})).toEqual([]);
		});

	});

	it('should accept thisArgs without length property', function(){
		var object = {}, fn = function(){};
		expect([].every.call(object, fn)).toBe(true);
		expect([].filter.call(object, fn)).toEqual([]);
		expect([].indexOf.call(object)).toEqual(-1);
		expect([].map.call(object, fn)).toEqual([]);
		expect([].some.call(object, fn)).toBe(false);
	});

	describe('Array.filter', function(){

		it('should return the original item, and not any mutations.', function(){

			var result = [0, 1, 2].filter(function(num, i, array){
				if (num == 1){
					array[i] = 'mutation';
					return true;
				}
			});

			expect(result[0]).toEqual(1);
		});

	});

});

})();
