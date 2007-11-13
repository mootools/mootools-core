/*
Script: Hash.js
	Specs for Hash.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe('Hash', {

	'before each': function(){
		Local.hash = new Hash({a: 1, b: 2, c: 3});
		Local.hash2 = new Hash({a:'string',b:233,c:{}});
	},

	'should return a new hash': function(){
		value_of(Hash.type(new Hash())).should_be_true();
	},

	'should return a copy of a hash': function(){
		var copy = new Hash(Local.hash);
		value_of(copy !== Local.hash).should_be_true();
		value_of(copy).should_be(Local.hash);
	},

	'should `remove` a key and its value from the hash': function(){
		value_of(Local.hash.remove('a')).should_be(new Hash({b:2,c:3}));
		value_of(Local.hash.remove('d')).should_be(new Hash({b:2,c:3}));
	},

	'should `get` the value corresponding to the specified key, otherwise null': function(){
		value_of(Local.hash.get('c')).should_be(3);
		value_of(Local.hash.get('d')).should_be_null();
	},

	'should `set` the key with the corresponding value': function(){
		var myHash = new Hash(Local.hash);
		myHash.set('c', 7);
		myHash.set('d', 8);

		value_of(myHash).should_be(new Hash({a:1,b:2,c:7,d:8}));
	},

	'should `empty` the hash': function(){
		value_of(Local.hash.empty()).should_be(new Hash());
	},

	'should `include` a key/value if the hash does not have the key': function(){
		value_of(Local.hash.include('e', 7)).should_be(new Hash({a:1,b:2,c:3,e:7}));
	},

	'should not `include` a key/value if the the hash has the key': function(){
		value_of(Local.hash.include('a', 7)).should_not_be(new Hash({a:1,b:2,c:3,e:7}));
	},

	'should return the `keyOf` the value': function(){
		value_of(Local.hash.keyOf(1)).should_be('a');
	},

	'should return null if the `keyOf` the value is not found': function(){
		value_of(Local.hash.keyOf('not found')).should_be_null();
	},

	'should return true if the hash `has` the key, otherwise false': function(){
		value_of(Local.hash.has('a')).should_be_true();
		value_of(Local.hash.has('d')).should_be_false();
	},

	'should return true if the hash `hasValue`, otherwise false': function(){
		value_of(Local.hash.hasValue(1)).should_be_true();
		value_of(Local.hash.hasValue('not found')).should_be_false();
	},

	'should `getClean` JavaScript object': function(){
		value_of(Local.hash.getClean()).should_be({a:1,b:2,c:3});
	},

	'should `extend` a Hash with an object': function(){
		value_of(Local.hash.extend({a:4,d:7,e:8})).should_be(new Hash({a:4,b:2,c:3,d:7,e:8}));
	},

	'should `extend` a Hash with another Hash': function(){
		value_of(Local.hash.extend(new Hash({a:4,d:7,e:8}))).should_be(new Hash({a:4,b:2,c:3,d:7,e:8}));
	},

	'should `merge` a Hash with an object': function(){
		value_of(Local.hash.merge({a:4,d:7,e:8})).should_be(new Hash({a:1,b:2,c:3,d:7,e:8}));
	},

	'should `merge` a Hash with another Hash': function(){
		value_of(Local.hash.merge(new Hash({a:4,d:7,e:8}))).should_be(new Hash({a:1,b:2,c:3,d:7,e:8}));
	},

	'should iterate through `each` property': function(){
		var newHash = new Hash();
		Local.hash.each(function(value, key){
			newHash.set(key, value);
		});
		value_of(newHash).should_be(Local.hash);
	},

	'should `map` a new Hash according to the comparator': function(){
		value_of(Local.hash2.map(Number.type)).should_be(new Hash({a:false,b:true,c:false}));
	},

	'should `filter` the Hash according to the comparator': function(){
		value_of(Local.hash2.filter(Number.type)).should_be(new Hash({b:233}));
	},

	'should return true if `every` value matches the comparator, otherwise false': function(){
		value_of(Local.hash2.every($defined)).should_be_true();
		value_of(Local.hash2.every(Number.type)).should_be_false();
	},

	'should return true if `some` of the values match the comparator, otherwise false': function(){
		value_of(Local.hash2.some(Number.type)).should_be_true();
		value_of(Local.hash2.some(Array.type)).should_be_false();
	},

	'should `getKeys` of the hash': function(){
		value_of(Local.hash2.getKeys()).should_be(['a', 'b', 'c']);
	},

	'should `getValues` of the hash': function(){
		value_of(Local.hash2.getValues()).should_be(['string', 233, {}]);
	}

});