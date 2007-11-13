/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe('Function', {

	'before all': function(){
		Local.fn = function(){
			return $A(arguments);
		};

		Local.thisRules = function(){
			return this + ' rules';
		};

		Local.thisArgs = function(){
			return [this].concat($A(arguments));
		};
	},

	'should `create` a new function': function(){
		var fn = $empty.create();
		value_of($empty === fn).should_be_false();
	},

	'should `create` a new function with specified argument': function(){
		var fn = Local.fn.create({'arguments': 'rocks'});
		value_of(fn()).should_be(['rocks']);
	},

	'should `create` a new function with multiple arguments': function(){
		var fn = Local.fn.create({'arguments': ['MooTools', 'rocks']});
		value_of(fn()).should_be(['MooTools', 'rocks']);
	},

	'should `create` a new function bound to an object': function(){
		var fn = Local.thisRules.create({'bind': 'MooTools'});
		value_of(fn()).should_be('MooTools rules');
	},

	'should `create` a new function as an event': function(){
		var fn = Local.fn.create({'arguments': [0, 1], 'event': true});
		value_of(fn('an Event occurred')).should_be(['an Event occurred', 0, 1]);
	},

	'should `bind` a function to an object': function(){
		var fn = Local.thisRules.bind('MooTools');
		value_of(fn()).should_be('MooTools rules');
	},

	'should `bind` a function to an object with specified argument': function(){
		var fn = Local.thisArgs.bind('MooTools', 'rocks');
		value_of(fn()).should_be(['MooTools', 'rocks']);
	},

	'should `bind` a function to an object with multiple arguments': function(){
		var fn = Local.thisArgs.bind('MooTools', ['rocks', 'da house']);
		value_of(fn()).should_be(['MooTools', 'rocks', 'da house']);
	},

	'should `bind` a function to an object and make the function an event listener': function(){
		var fn = Local.thisArgs.bindWithEvent('MooTools');
		value_of(fn('an Event ocurred')).should_be(['MooTools', 'an Event ocurred']);
	},

	'should `bind` a function to an object and make the function event listener with multiple arguments': function(){
		var fn = Local.thisArgs.bindWithEvent('MooTools', ['rocks', 'da house']);
		value_of(fn('an Event ocurred')).should_be(['MooTools', 'an Event ocurred', 'rocks', 'da house']);
	},

	'should `pass` the specified arguments when the function is called': function(){
		var fn = Local.fn.pass('MooTools is beautiful and elegant');
		value_of(fn()).should_be(['MooTools is beautiful and elegant']);
	},

	'should `pass` multiple arguments and bind the function to an object': function(){
		var fn = Local.thisArgs.pass(['rocks', 'da house'], 'MooTools');
		value_of(fn()).should_be(['MooTools', 'rocks', 'da house']);
	},

	'shoud `run` the function': function(){
		var result = Local.fn.run();
		value_of(result).should_be([]);
	},

	'should `run` the function with multiple arguments': function(){
		var result = Local.fn.run(['MooTools', 'beautiful', 'elegant']);
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	'should `run` the function with multiple arguments and bind the function to an object': function(){
		var result = Local.thisArgs.run(['beautiful', 'elegant'], 'MooTools');
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	}

});