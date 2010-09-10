/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

(function(){

var fn = function(){
	return Array.from(arguments);
};

var Rules = function(){
	return this + ' rules';
};

var Args = function(){
	return [this].concat(Array.from(arguments));
};

describe("Function Methods 1.3", {

	// Function.bind

	'should return the function bound to an object': function(){
		var fnc = Rules.bind('MooTools');
		value_of(fnc()).should_be('MooTools rules');
	},

	'should return the function bound to an object with specified argument': function(){
		var fnc = Args.bind('MooTools', 'rocks');
		value_of(fnc()).should_be(['MooTools', 'rocks']);
	},

	'should return the function bound to an object with multiple arguments': function(){
		var fnc = Args.bind('MooTools', ['rocks', 'da house']);
		value_of(fnc()).should_be(['MooTools', 'rocks', 'da house']);
	},

	// Function.pass

	'should return a function that when called passes the specified arguments to the original function': function(){
		var fnc = fn.pass('MooTools is beautiful and elegant');
		value_of(fnc()).should_be(['MooTools is beautiful and elegant']);
	},

	'should pass multiple arguments and bind the function to a specific object when it is called': function(){
		var fnc = Args.pass(['rocks', 'da house'], 'MooTools');
		value_of(fnc()).should_be(['MooTools', 'rocks', 'da house']);
	},

	// Function.run

	'should run the function': function(){
		var result = fn.run();
		value_of(result).should_be([]);
	},

	'should run the function with multiple arguments': function(){
		var result = fn.run(['MooTools', 'beautiful', 'elegant']);
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	'should run the function with multiple arguments and bind the function to an object': function(){
		var result = Args.run(['beautiful', 'elegant'], 'MooTools');
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	// Function.extend

	"should extend the function's properties": function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		value_of(fnc.a).should_be(1);
		value_of(fnc.b).should_be('c');
	},

	// Function.attempt

	'should call the function without raising an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		fnc.attempt();
	},

	"should return the function's return value": function(){
		var fnc = Function.from('hello world!');
		value_of(fnc.attempt()).should_be('hello world!');
	},

	'should return null if the function raises an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		value_of(fnc.attempt()).should_be_null();
	},

	// Function.delay

	'should return a timer pointer': function(){
		var timer = fn.delay(10000);
		// NodeJS uses Timer Objects
		value_of(Type.isNumber(timer) || (Type.isObject(timer) && timer.start)).should_be_true();
		fn(timer);

		// Third argument == 0
		var value;
		(function(arg){
			value = arg;
		}).delay(2, null, 0);

		waits(3);

		runs(function(){
			expect(value).toEqual(0);
		});		
	},

	// Function.periodical

	'should return a periodical timer pointer': function(){
		var timer = fn.periodical(10000);
		value_of(Type.isNumber(timer) || (Type.isObject(timer) && timer.start)).should_be_true();
		fn(timer);

		// Third argument == 0
		var value;
		var timer2 = (function(arg){
			value = arg;
		}).periodical(2, null, 0);

		waits(3);

		runs(function(){
			clearInterval(timer2);
			expect(value).toEqual(0);
		});
	}

});

})();