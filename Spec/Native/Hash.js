/*
Script: Hash.js
	Specs for Hash.js

License:
	MIT-style license.
*/

describe('Hash', {
	
	each: function(){
		var oldHash = new Hash({a:1,b:2,c:3});
		var newHash = new Hash;
		oldHash.each(function(value, key){
			newHash.set(key, value);
		});
		value_of(newHash).should_be(oldHash);
	},
	
	keyOf: function(){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.keyOf(1)).should_be('a');
		value_of(myHash.keyOf(4)).should_be_null();
		
	},
	
	has: function(key){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.has('a')).should_be_true();
		value_of(myHash.has('d')).should_be_false();
	},
	
	hasValue: function(value){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.hasValue(1)).should_be_true();
		value_of(myHash.hasValue(4)).should_be_false();
	},
	
	getClean: function(){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.getClean()).should_be({a:1,b:2,c:3});
	},

	extend: function(properties){
		var myHash = new Hash({a:1,b:2,c:3});
		var xHash = new Hash({a:4,d:7,e:8});
		
		value_of(myHash.extend(xHash)).should_be(new Hash({a:4,b:2,c:3,d:7,e:8}));
	},

	merge: function(properties){
		var myHash = new Hash({a:1,b:2,c:3});
		var xHash = new Hash({a:4,d:7,e:8});
		
		value_of(myHash.merge(xHash)).should_be(new Hash({a:1,b:2,c:3,d:7,e:8}));
	},

	remove: function(key){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.remove('a')).should_be(new Hash({b:2,c:3}));
		value_of(myHash.remove('d')).should_be(new Hash({b:2,c:3}));
	},

	get: function(key){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.get('c')).should_be(3);
		value_of(myHash.get('d')).should_be_null();
	},

	set: function(key, value){
		var myHash = new Hash({a:1,b:2,c:3});
		myHash.set('c', 7);
		myHash.set('d', 8);
		
		value_of(myHash).should_be(new Hash({a:1,b:2,c:7,d:8}));
	},

	empty: function(){
		var myHash = new Hash({a:1,b:2,c:3});
		
		value_of(myHash.empty()).should_be(new Hash());
	},

	include: function(key, value){
		var myHash = new Hash({a:1,b:2,c:3});
		myHash.include('a', 7);
		
		value_of(myHash).should_be(new Hash({a:1,b:2,c:3}));
	},

	map: function(fn, bind){
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.map($type.number)).should_be(new Hash({a:false,b:true,c:false}));
	},

	filter: function(fn, bind){
		
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.filter($type.number)).should_be(new Hash({b:233}));

	},

	every: function(fn, bind){
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.every($type.number)).should_be_false();
		value_of(myHash.every($defined)).should_be_true();
	},

	some: function(fn, bind){
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.some($type.number)).should_be_true();
		value_of(myHash.some($defined)).should_be_true();
		value_of(myHash.some($type.array)).should_be_false();
	},

	getKeys: function(){
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.getKeys()).should_be(['a', 'b', 'c']);
	},

	getValues: function(){
		var myHash = new Hash({a:'string',b:233,c:{}});
		
		value_of(myHash.getValues()).should_be(['string', 233, {}]);
	}
	
});

describe('Hash Generics', {
	
	each: function(){
		var oldHash = {a:1,b:2,c:3};
		var newHash = {};
		Hash.each(oldHash, function(value, key){
			Hash.set(newHash, key, value);
		});
		value_of(newHash).should_be(oldHash);
	},
	
	keyOf: function(){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.keyOf(myHash, 1)).should_be('a');
		value_of(Hash.keyOf(myHash, 4)).should_be_null();
		
	},
	
	has: function(key){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.has(myHash, 'a')).should_be_true();
		value_of(Hash.has(myHash, 'd')).should_be_false();
	},
	
	hasValue: function(value){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.hasValue(myHash, 1)).should_be_true();
		value_of(Hash.hasValue(myHash, 4)).should_be_false();
	},
	
	getClean: function(){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.getClean(myHash)).should_be({a:1,b:2,c:3});
	},

	extend: function(properties){
		var myHash = {a:1,b:2,c:3};
		var xHash = {a:4,d:7,e:8};
		
		value_of(Hash.extend(myHash, xHash)).should_be({a:4,b:2,c:3,d:7,e:8});
	},

	merge: function(properties){
		var myHash = {a:1,b:2,c:3};
		var xHash = {a:4,d:7,e:8};
		
		value_of(Hash.merge(myHash, xHash)).should_be({a:1,b:2,c:3,d:7,e:8});
	},

	remove: function(key){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.remove(myHash, 'a')).should_be({b:2,c:3});
		value_of(Hash.remove(myHash, 'd')).should_be({b:2,c:3});
	},

	get: function(key){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.get(myHash, 'c')).should_be(3);
		value_of(Hash.get(myHash, 'd')).should_be_null();
	},

	set: function(key, value){
		var myHash = {a:1,b:2,c:3};
		Hash.set(myHash, 'c', 7);
		Hash.set(myHash, 'd', 8);
		
		value_of(myHash).should_be({a:1,b:2,c:7,d:8});
	},

	empty: function(){
		var myHash = {a:1,b:2,c:3};
		
		value_of(Hash.empty(myHash)).should_be({});
	},

	include: function(key, value){
		var myHash = {a:1,b:2,c:3};
		Hash.include(myHash, 'a', 7);
		
		value_of(myHash).should_be({a:1,b:2,c:3});
	},

	map: function(fn, bind){
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.map(myHash, $type.number)).should_be(new Hash({a:false,b:true,c:false}));
	},

	filter: function(fn, bind){
		
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.filter(myHash, $type.number)).should_be(new Hash({b:233}));

	},

	every: function(fn, bind){
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.every(myHash, $type.number)).should_be_false();
		value_of(Hash.every(myHash, $defined)).should_be_true();
	},

	some: function(fn, bind){
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.some(myHash, $type.number)).should_be_true();
		value_of(Hash.some(myHash, $defined)).should_be_true();
		value_of(Hash.some(myHash, $type.array)).should_be_false();
	},

	getKeys: function(){
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.getKeys(myHash)).should_be(['a', 'b', 'c']);
	},

	getValues: function(){
		var myHash = {a:'string',b:233,c:{}};
		
		value_of(Hash.getValues(myHash)).should_be(['string', 233, {}]);
	}
	
});