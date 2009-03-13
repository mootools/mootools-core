/*
Script: Object.js
	Specs for Object.js

License:
	MIT-style license.
*/

describe("Object Methods", {

	'should associate an array with a specified array': function(){
		var obj = Object.from(['a', 'b', 'c', 'd'], [1,2,3,0,0,0]);
		value_of(obj).should_be({a:1, b:2, c:3, d:0});
	},

});