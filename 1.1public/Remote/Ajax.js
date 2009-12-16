/*
Script: Ajax.js
	Public Specs for Ajax.js 1.1.2

License:
	MIT-style license.
*/
describe('Object.toQueryString', {

	'should convert an object to a query string': function(){
		value_of(Object.toQueryString({a: 'b', c: [1,2,3], d: true, e: false})).should_be('a=b&c=1%2C2%2C3&d=true&e=false');
	}

});

describe('Ajax', {
	
	'should create an Ajax instance': function(){
		value_of($type(new Ajax().request)).should_be('function');
	}

});
