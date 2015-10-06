/*
---
name: Object
requires: ~
provides: ~
...
*/

(function(){

var object = { a: 'string', b: 233, c: {} };

describe('Object Method', function(){

	describe('Object.subset', function(){

		it('should return an object with only the specified keys', function(){
			expect(Object.subset(object, ['a', 'b'])).to.eql({a:'string', b:233});
		});

		it('should ignore undefined keys', function(){
			var obj = {
				b: 'string',
				d: null
			};
			var subset = Object.subset(obj, ['a', 'b', 'c', 'd']);
			expect(subset).to.eql({b: 'string', d: null});
			expect('a' in subset).to.equal(false);
			expect('c' in subset).to.equal(false);
		});

	});

	describe('Object.keyOf', function(){

		it('should return the key of the value or null if not found', function(){
			expect(Object.keyOf(object, 'string')).to.equal('a');
			expect(Object.keyOf(object, 'not found')).to.equal(null);
		});

	});

	describe('Object.contains', function(){

		it('should return true if the object contains value otherwise false', function(){
			expect(Object.contains(object, 'string')).to.equal(true);
			expect(Object.contains(object, 'not found')).to.equal(false);
		});

	});

	describe('Object.map', function(){

		it('should map a new object according to the comparator', function(){
			expect(Object.map(object, Type.isNumber)).to.eql({a:false, b:true, c:false});
		});

	});

	describe('Object.filter', function(){

		it('should filter the object according to the comparator', function(){
			expect(Object.filter(object, Type.isNumber)).to.eql({b:233});
		});

	});

	describe('Object.every', function(){

		it('should return true if every value matches the comparator, otherwise false', function(){
			expect(Object.every(object, typeOf)).to.equal(true);
			expect(Object.every(object, Type.isNumber)).to.equal(false);
		});

	});

	describe('Object.some', function(){

		it('should return true if some of the values match the comparator, otherwise false', function(){
			expect(Object.some(object, Type.isNumber)).to.equal(true);
			expect(Object.some(object, Type.isArray)).to.equal(false);
		});

	});

	describe('Object.values', function(){

		it('values should return an empty array', function(){
			expect(Object.values({})).to.eql([]);
		});

		it('should return an array with the values of the object', function(){
			expect(Object.values(object)).to.eql(['string', 233, {}]);
		});

	});

	describe('Object.toQueryString', function(){

		it('should return a query string', function(){
			var myObject = {apple: 'red', lemon: 'yellow'};
			expect(Object.toQueryString(myObject)).to.equal('apple=red&lemon=yellow');

			var myObject2 = {apple: ['red', 'yellow'], lemon: ['green', 'yellow']};
			expect(Object.toQueryString(myObject2)).to.equal('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

			var myObject3 = {fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}};
			expect(Object.toQueryString(myObject3)).to.equal('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
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

			expect(Object.getLength(object)).to.equal(5);

			object.n = null;

			expect(Object.getLength(object)).to.equal(5);
		});

	});

	describe('Object.hasOwnProperty', function(){

		var dit = (typeof window === 'undefined' ? xit : it);
		dit('should not fail on window', function(){
			expect(function(){
				var fn = function(){};
				Object.each(window, fn);
				Object.keys(window);
				Object.values(window);
				Object.map(window, fn);
				Object.every(window, fn);
				Object.some(window, fn);
				Object.keyOf(window, document);
			}).to.not.throwError();
		});

	});

});

})();
