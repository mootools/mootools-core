/*
Script: Hash.js
	Specs for Hash.js

License:
	MIT-style license.
*/

(function(){

var hash2 = new Hash({ a: 'string', b: 233, c: {} });

describe("Hash Methods", {

	// Hash.constructor

	'should return a new hash': function(){
		value_of($type(new Hash())).should_be("object");
	},

	// Hash.remove

	'should remove a key and its value from the hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.remove('a')).should_be(new Hash({b:2,c:3}));
		value_of(hash.remove('d')).should_be(new Hash({b:2,c:3}));

		hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.remove('a')).should_be(new Hash({b:2,c:3}));
		value_of(hash.remove('d')).should_be(new Hash({b:2,c:3}));
	},

	// Hash.get

	'should return the value corresponding to the specified key otherwise null': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.get('c')).should_be(3);
		value_of(hash.get('d')).should_be_null();
	},

	// Hash.set

	'should set the key with the corresponding value': function(){
		var myHash = new Hash({a: 1, b: 2, c: 3}).set('c', 7).set('d', 8);
		value_of(myHash).should_be(new Hash({a:1,b:2,c:7,d:8}));
	},

	// Hash.empty

	'should empty the hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.empty()).should_be(new Hash());
	},

	// Hash.hasKey

	'should return true if the hash has the key otherwise false': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.hasKey('a')).should_be_true();
		value_of(hash.hasKey('d')).should_be_false();
	},
	// Hash.extend

	'should extend a Hash with an object': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.extend({a:4,d:7,e:8}).obj).should_be({a:4,b:2,c:3,d:7,e:8});
	},

	// Hash.merge

	'should merge a Hash with an object': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.merge({a: 4, d: 7, e: 8}).obj).should_be({a:4,b:2,c:3,d:7,e:8});
	},

	// Hash.each

	'should iterate through each property': function(){
		var newHash = new Hash();
		var hash = new Hash({a: 1, b: 2, c: 3});
		hash.each(function(value, key){
			newHash.set(key, value);
		});
		value_of(newHash).should_be(hash);
	},

	// Hash.keys

	'keys should return an empty array': function(){
		value_of(new Hash().keys()).should_be([]);
	},

	'should return an array containing the keys of the hash': function(){
		value_of(hash2.keys()).should_be(['a', 'b', 'c']);
	},

	// Hash.values

	'values should return an empty array': function(){
		value_of(new Hash().values()).should_be([]);
	},

	'should return an array with the values of the hash': function(){
		value_of(hash2.values()).should_be(['string', 233, {}]);
	}

});

})();