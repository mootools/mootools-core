/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

describe('Function', {
	
	bind: function(){
		var fnTest = function(){
			return this;
		};

		var fn = fnTest.bind('MooTools is beautiful and elegant');
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	bind_with_arguments: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.bind('MooTools', ['beautiful', 'elegant']);
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	bind_with_arguments_and_event: function(){
		var fnTest = function(event, adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.bindWithEvent('MooTools', ['beautiful', 'elegant']);
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	create: function(){
		var fnTest = function(){
			return 'MooTools is beautiful and elegant';
		};

		var fn = fnTest.create();
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	create_with_arguments: function(){
		var fnTest = function(noun, adj1, adj2){
			return noun + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.create({'arguments': ['MooTools', 'beautiful', 'elegant']});
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	create_with_arguments_and_bind: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.create({'arguments': ['beautiful', 'elegant'], 'bind': 'MooTools'});
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	create_with_arguments_and_bind_and_event: function(){
		var fnTest = function(event, adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.create({'arguments': ['beautiful', 'elegant'], 'bind': 'MooTools', 'event': true});
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	pass: function(){
		var fnTest = function(sentance){
			return sentance;
		};

		var fn = fnTest.pass('MooTools is beautiful and elegant');
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	pass_with_bind: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var fn = fnTest.pass(['beautiful', 'elegant'], 'MooTools');
		
		value_of(fn()).should_be('MooTools is beautiful and elegant');
	},
	
	run: function(){
		var fnTest = function(noun, adj1, adj2){
			return noun + ' is ' + adj1 + ' and ' + adj2;
		};

		var result = fnTest.run(['MooTools', 'beautiful', 'elegant']);
		
		value_of(result).should_be('MooTools is beautiful and elegant');
	},
	
	run_with_bind: function(){
		var fnTest = function(adj1, adj2){
			return this + ' is ' + adj1 + ' and ' + adj2;
		};

		var result = fnTest.run(['beautiful', 'elegant'], 'MooTools');
		
		value_of(result).should_be('MooTools is beautiful and elegant');
	}
	
});