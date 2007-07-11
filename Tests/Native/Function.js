/*
Script: Function.js
	Unit Tests for Function.js

License:
	MIT-style license.
*/

Tests.Function = new Test.Suite('Function', {
	
	create: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};
		
		var fn = fnTest.create({'arguments': ['beautiful', 'stupid'], 'bind': 'john'});
		
		var fnTest2 = function(event, adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};
		
		var fn2 = fnTest2.create({'arguments': ['lame', 'noob'], 'bind': 'jack', 'event': true});
		
		return Assert.all(
			Assert.equals(fn(), 'john is beautiful and stupid'),
			Assert.equals(fn2(), 'jack is lame and noob')
		);
		
	}
	
});