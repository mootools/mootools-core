/*
---
name: Hash
requires: ~
provides: ~
...
*/

//<1.2compat>
(function(){

var hash2 = new Hash({ a: 'string', b: 233, c: {} });

describe('Hash Method', function(){

	describe('Hash.constructor', function(){

		it('should return a new hash', function(){
			expect(Hash.type(new Hash())).to.equal(true);
		});

		it('should return a copy of a hash', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			var copy = new Hash(hash);
			expect(copy).to.not.equal(hash);
			expect(copy).to.eql(hash);
		});

	});

	describe('Hash.erase', function(){

		it('should remove a key and its value from the hash', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.erase('a')).to.eql(new Hash({b:2, c:3}));
			expect(hash.erase('d')).to.eql(new Hash({b:2, c:3}));

			hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.erase('a')).to.eql(new Hash({b:2, c:3}));
			expect(hash.erase('d')).to.eql(new Hash({b:2, c:3}));
		});

	});

	describe('Hash.get', function(){

		it('should return the value corresponding to the specified key otherwise null', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.get('c')).to.equal(3);
			expect(hash.get('d')).to.equal(null);
		});

	});

	describe('Hash.set', function(){

		it('should set the key with the corresponding value', function(){
			var myHash = new Hash({a: 1, b: 2, c: 3}).set('c', 7).set('d', 8);
			expect(myHash).to.eql(new Hash({a:1, b:2, c:7, d:8}));
		});

	});

	describe('Hash.empty', function(){

		it('should empty the hash', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.empty()).to.eql(new Hash());
		});

	});

	describe('Hash.include', function(){

		it('should include a key value if the hash does not have the key otherwise ignore', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.include('e', 7)).to.eql(new Hash({a:1, b:2, c:3, e:7}));
			expect(hash.include('a', 7)).to.eql(new Hash({a:1, b:2, c:3, e:7}));
		});

	});

	describe('Hash.keyOf | Hash.indexOf', function(){

		it('should return the key of the value or null if not found', function(){
			var hash = new Hash({a: 1, b: 2, c: 3, d: 1});
			expect(hash.keyOf(1)).to.equal('a');
			expect(hash.keyOf('not found')).to.equal(null);

			expect(hash.indexOf(1)).to.equal('a');
			expect(hash.indexOf('not found')).to.equal(null);
		});

	});

	describe('Hash.has', function(){

		it('should return true if the hash has the key otherwise false', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.has('a')).to.equal(true);
			expect(hash.has('d')).to.equal(false);
		});

	});

	describe('Hash.hasValue | Hash.contains', function(){

		it('should return true if the hash hasValue otherwise false', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.hasValue(1)).to.equal(true);
			expect(hash.hasValue('not found')).to.equal(false);

			expect(hash.contains(1)).to.equal(true);
			expect(hash.contains('not found')).to.equal(false);
		});

	});

	describe('Hash.getClean', function(){

		it('should getClean JavaScript object', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.getClean()).to.eql({a:1, b:2, c:3});
		});

	});

	describe('Hash.extend', function(){

		it('should extend a Hash with an object', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.extend({a:4, d:7, e:8})).to.eql(new Hash({a:4, b:2, c:3, d:7, e:8}));
		});

		it('should extend a Hash with another Hash', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.extend(new Hash({a:4, d:7, e:8}))).to.eql(new Hash({a:4, b:2, c:3, d:7, e:8}));
		});

	});

	describe('Hash.combine', function(){

		it('should merge a Hash with an object', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.combine({a:4, d:7, e:8})).to.eql(new Hash({a:1, b:2, c:3, d:7, e:8}));
		});

		it('should merge a Hash with another Hash', function(){
			var hash = new Hash({a: 1, b: 2, c: 3});
			expect(hash.combine(new Hash({a:4, d:7, e:8}))).to.eql(new Hash({a:1, b:2, c:3, d:7, e:8}));
		});

	});

	describe('Hash.each', function(){

		it('should iterate through each property', function(){
			var newHash = new Hash();
			var hash = new Hash({a: 1, b: 2, c: 3});
			hash.each(function(value, key){
				newHash.set(key, value);
			});
			expect(newHash).to.eql(hash);
		});

	});

	describe('Hash.map', function(){

		it('should map a new Hash according to the comparator', function(){
			expect(hash2.map(Number.type)).to.eql(new Hash({a:false, b:true, c:false}));
		});

	});

	describe('Hash.filter', function(){

		it('should filter the Hash according to the comparator', function(){
			expect(hash2.filter(Number.type)).to.eql(new Hash({b:233}));
		});

	});

	describe('Hash.every', function(){

		it('should return true if every value matches the comparator, otherwise false', function(){
			expect(hash2.every($defined)).to.equal(true);
			expect(hash2.every(Number.type)).to.equal(false);
		});

	});

	describe('Hash.some', function(){

		it('should return true if some of the values match the comparator, otherwise false', function(){
			expect(hash2.some(Number.type)).to.equal(true);
			expect(hash2.some(Array.type)).to.equal(false);
		});

	});

	describe('Hash.getKeys', function(){

		it('getKeys should return an empty array', function(){
			expect(new Hash().getKeys()).to.eql([]);
		});

		it('should return an array containing the keys of the hash', function(){
			expect(hash2.getKeys()).to.eql(['a', 'b', 'c']);
		});

	});

	describe('Hash.getValues', function(){

		it('getValues should return an empty array', function(){
			expect(new Hash().getValues()).to.eql([]);
		});

		it('should return an array with the values of the hash', function(){
			expect(hash2.getValues()).to.eql(['string', 233, {}]);
		});

	});

	describe('Hash.toQueryString', function(){

		it('should return a query string', function(){
			var myHash = new Hash({apple: 'red', lemon: 'yellow'});
			expect(myHash.toQueryString()).to.equal('apple=red&lemon=yellow');

			var myHash2 = new Hash({apple: ['red', 'yellow'], lemon: ['green', 'yellow']});
			expect(myHash2.toQueryString()).to.equal('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

			var myHash3 = new Hash({fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}});
			expect(myHash3.toQueryString()).to.equal('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
		});

	});

});

})();
//</1.2compat>
