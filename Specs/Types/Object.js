/*
---
name: Object
requires: ~
provides: ~
...
*/

(function(){

var object = { a: 'string', b: 233, c: {} };

describe("Object Methods", function(){

	// Object subset

	it('should return an object with only the specified keys', function(){
		expect(Object.subset(object, ['a', 'b'])).toEqual({a:'string',b:233});
	});

	it('should ignore undefined keys', function(){
		var obj = {
			b: 'string',
			d: null
		};
		var subset = Object.subset(obj, ['a', 'b', 'c', 'd']);
		expect(subset).toEqual({b: 'string', d: null});
		// To equal doesn't check for undefined properties
		expect('a' in subset).toBeFalsy();
		expect('c' in subset).toBeFalsy();
	});

	// Object keyOf

	it('should return the key of the value or null if not found', function(){
		expect(Object.keyOf(object, 'string')).toEqual('a');
		expect(Object.keyOf(object, 'not found')).toBeNull();
	});

	// Object.contains

	it('should return true if the object contains value otherwise false', function(){
		expect(Object.contains(object, 'string')).toBeTruthy();
		expect(Object.contains(object, 'not found')).toBeFalsy();
	});

	// Object.map

	it('should map a new object according to the comparator', function(){
		expect(Object.map(object, Type.isNumber)).toEqual({a:false,b:true,c:false});
	});

	// Object.filter

	it('should filter the object according to the comparator', function(){
		expect(Object.filter(object, Type.isNumber)).toEqual({b:233});
	});

	// Object.every

	it('should return true if every value matches the comparator, otherwise false', function(){
		expect(Object.every(object, typeOf)).toBeTruthy();
		expect(Object.every(object, Type.isNumber)).toBeFalsy();
	});

	// Object.some

	it('should return true if some of the values match the comparator, otherwise false', function(){
		expect(Object.some(object, Type.isNumber)).toBeTruthy();
		expect(Object.some(object, Type.isArray)).toBeFalsy();
	});

	// Object.values

	it('values should return an empty array', function(){
		expect(Object.values({})).toEqual([]);
	});

	it('should return an array with the values of the object', function(){
		expect(Object.values(object)).toEqual(['string', 233, {}]);
	});

	// Object.toQueryString

	it('should return a query string', function(){
		var myObject = {apple: "red", lemon: "yellow"};
		expect(Object.toQueryString(myObject)).toEqual('apple=red&lemon=yellow');

		var myObject2 = {apple: ['red', 'yellow'], lemon: ['green', 'yellow']};
		expect(Object.toQueryString(myObject2)).toEqual('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

		var myObject3 = {fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}};
		expect(Object.toQueryString(myObject3)).toEqual('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
	});

});

describe('Object.getLength', function(){

	it('should get the amount of items in an object', function(){
		var object = {
			a: [0, 1, 2],
			s: "It's-me-Valerio!",
			n: 1,
			f: 3.14,
			b: false
		};

		expect(Object.getLength(object)).toEqual(5);

		object.n = null;

		expect(Object.getLength(object)).toEqual(5);
	});

});


describe('Object hasOwnProperty', function(){

	it('should not fail on window', function(){
		expect(function(){
			var fn = function(){};
			Object.each(window, fn);
			Object.keys(window);
			Object.values(window);
			Object.map(window, fn);
			Object.every(window, fn);
			Object.some(window, fn);
			Object.keyOf(window, document);
		}).not.toThrow();
	});

});

})();
