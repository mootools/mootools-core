/*
Script: Object.js
	Specs for Object.js

License:
	MIT-style license.
*/

(function(){

var object = { a: 'string', b: 233, c: {} };

describe("Object Methods", {

	// Object subset

	'should return an object with only the specified keys': function(){
		value_of(Object.subset(object, ['a', 'b'])).should_be({a:'string',b:233});
	},

	// Object keyOf

	'should return the key of the value or null if not found': function(){
		value_of(Object.keyOf(object, 'string')).should_be('a');
		value_of(Object.keyOf(object, 'not found')).should_be_null();
	},

	// Object.contains

	'should return true if the object contains value otherwise false': function(){
		value_of(Object.contains(object, 'string')).should_be_true();
		value_of(Object.contains(object, 'not found')).should_be_false();
	},

	// Object.map

	'should map a new object according to the comparator': function(){
		value_of(Object.map(object, Type.isNumber)).should_be({a:false,b:true,c:false});
	},

	// Object.filter

	'should filter the object according to the comparator': function(){
		value_of(Object.filter(object, Type.isNumber)).should_be({b:233});
	},

	// Object.every

	'should return true if every value matches the comparator, otherwise false': function(){
		value_of(Object.every(object, typeOf)).should_be_true();
		value_of(Object.every(object, Type.isNumber)).should_be_false();
	},

	// Object.some

	'should return true if some of the values match the comparator, otherwise false': function(){
		value_of(Object.some(object, Type.isNumber)).should_be_true();
		value_of(Object.some(object, Type.isArray)).should_be_false();
	},

	// Object.keys

	'keys should return an empty array': function(){
		value_of(Object.keys({})).should_be([]);
	},

	'should return an array containing the keys of the object': function(){
		value_of(Object.keys(object)).should_be(['a', 'b', 'c']);
	},

	// Object.values

	'values should return an empty array': function(){
		value_of(Object.values({})).should_be([]);
	},

	'should return an array with the values of the object': function(){
		value_of(Object.values(object)).should_be(['string', 233, {}]);
	},

	// Object.toQueryString

	'should return a query string': function(){
		var myObject = {apple: "red", lemon: "yellow"};
		value_of(Object.toQueryString(myObject)).should_be('apple=red&lemon=yellow');

		var myObject2 = {apple: ['red', 'yellow'], lemon: ['green', 'yellow']};
		value_of(Object.toQueryString(myObject2)).should_be('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

		var myObject3 = {fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}};
		value_of(Object.toQueryString(myObject3)).should_be('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
	}

});

})();