/*
Script: Object.js
	Specs for Object.js

License:
	MIT-style license.
*/

describe("Object Methods", {

	// Object.from

	'should associate an array with a specified array': function(){
		var obj = Object.from(['a', 'b', 'c', 'd'], [1,2,3,0,0,0]);
		value_of(obj).should_be({a: 1, b: 2, c: 3, d: 0});
	},
	
	// Object.clone

	"should clone an object recursivly": function(){
		var inner = {b: 2};
		var obj = {a: 1, inner: inner};
		var copy = Object.clone(obj);
		obj.a = 10;
		inner.b = 20;

		value_of(obj.a).should_be(10);
		value_of(obj.inner.b).should_be(20);
		value_of(typeOf(obj)).should_be('object');

		value_of(copy.a).should_be(1);
		value_of(copy.inner.b).should_be(2);
		value_of(typeOf(copy)).should_be('object');
	},

	'should dereference objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = Object.clone(obj1);
		value_of(obj1 === obj2).should_be_false();
	},
	
	// Object.append

	'should extend two objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4};
		Object.append(obj1, obj2);
		value_of(obj1).should_be({a: 1, b: 3, c: 4});
	},

	'should overwrite properties': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4, a: 5};
		Object.append(obj1, obj2);
		value_of(obj1).should_be({a: 5, b: 3, c: 4});
	},

	'should not extend with null argument': function(){
		var obj1 = {a: 1, b: 2};
		Object.append(obj1);
		value_of(obj1).should_be({a: 1, b: 2});
	},
	
	// Object.mixin

	'should merge any arbitrary number of nested objects': function(){
		var obj1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var obj2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var obj3 = {a: {a: 3}, b: 3, c: false};
		value_of(Object.mixin(obj1, obj2, obj3)).should_be({a: {a: 3, b: 8, c: 3, d: 8}, b: 3, c: false});
	}

});