/*
Script: Function.js
	Examples for Function.js

License:
	MIT-style license.
*/

describe('Function', {
	
	create_with_arguments_and_bind: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.create({'arguments': ['beautiful', 'stupid'], 'bind': 'john'});
		
		value_of(fn()).should_be('john is beautiful and stupid');
	},
	
	create_with_arguments_and_bind_and_event: function(){
		var fnTest2 = function(event, adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn2 = fnTest2.create({'arguments': ['lame', 'noob'], 'bind': 'jack', 'event': true});
		
		value_of(fn2()).should_be('jack is lame and noob');
	}
	
});