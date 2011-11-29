/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

(function(){

var fn = function(){
	return $A(arguments);
};

var Rules = function(){
	return this + ' rules';
};

var Args = function(){
	return [this].concat($A(arguments));
};

describe("Function Methods", {

	// Function.create

	'should return a new function': function(){
		var fnc = $empty.create();
		expect($empty === fnc).toBeFalsy();
	},

	'should return a new function with specified argument': function(){
		var fnc = fn.create({'arguments': 'rocks'});
		expect(fnc()).toEqual(['rocks']);
	},

	'should return a new function with multiple arguments': function(){
		var fnc = fn.create({'arguments': ['MooTools', 'rocks']});
		expect(fnc()).toEqual(['MooTools', 'rocks']);
	},

	'should return a new function bound to an object': function(){
		var fnc = Rules.create({'bind': 'MooTools'});
		expect(fnc()).toEqual('MooTools rules');
	},

	'should return a new function as an event': function(){
		var fnc = fn.create({'arguments': [0, 1], 'event': true});
		expect(fnc('an Event occurred')).toEqual(['an Event occurred', 0, 1]);
	},

	// Function.bind

	'should return the function bound to an object': function(){
		var fnc = Rules.bind('MooTools');
		expect(fnc()).toEqual('MooTools rules');
	},

	'should return the function bound to an object with specified argument': function(){
		var fnc = Args.bind('MooTools', 'rocks');
		expect(fnc()).toEqual(['MooTools', 'rocks']);
	},

	'should return the function bound to an object with multiple arguments': function(){
		var fnc = Args.bind('MooTools', ['rocks', 'da house']);
		expect(fnc()).toEqual(['MooTools', 'rocks', 'da house']);
	},

	'should return the function bound to an object and make the function an event listener': function(){
		var fnc = Args.bindWithEvent('MooTools');
		expect(fnc('an Event ocurred')).toEqual(['MooTools', 'an Event ocurred']);
	},

	'should return the function bound to an object and make the function event listener with multiple arguments': function(){
		var fnc = Args.bindWithEvent('MooTools', ['rocks', 'da house']);
		expect(fnc('an Event ocurred')).toEqual(['MooTools', 'an Event ocurred', 'rocks', 'da house']);
	},

	// Function.pass

	'should return a function that when called passes the specified arguments to the original function': function(){
		var fnc = fn.pass('MooTools is beautiful and elegant');
		expect(fnc()).toEqual(['MooTools is beautiful and elegant']);
	},

	'should pass multiple arguments and bind the function to a specific object when it is called': function(){
		var fnc = Args.pass(['rocks', 'da house'], 'MooTools');
		expect(fnc()).toEqual(['MooTools', 'rocks', 'da house']);
	},

	// Function.run

	'should run the function': function(){
		var result = fn.run();
		expect(result).toEqual([]);
	},

	'should run the function with multiple arguments': function(){
		var result = fn.run(['MooTools', 'beautiful', 'elegant']);
		expect(result).toEqual(['MooTools', 'beautiful', 'elegant']);
	},

	'should run the function with multiple arguments and bind the function to an object': function(){
		var result = Args.run(['beautiful', 'elegant'], 'MooTools');
		expect(result).toEqual(['MooTools', 'beautiful', 'elegant']);
	},

	// Function.extend

	"should extend the function's properties": function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		expect(fnc.a).toEqual(1);
		expect(fnc.b).toEqual('c');
	},

	// Function.attempt

	'should call the function without raising an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		fnc.attempt();
	},

	"should return the function's return value": function(){
		var fnc = $lambda('hello world!');
		expect(fnc.attempt()).toEqual('hello world!');
	},

	'should return null if the function raises an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		expect(fnc.attempt()).toBeNull();
	},

	// Function.delay

	'delay should return a timer pointer': function(){
		var timer = $empty.delay(10000);
		expect(Number.type(timer)).toBeTruthy();
		$clear(timer);
	},

	// Function.periodical

	'periodical should return a timer pointer': function(){
		var timer = $empty.periodical(10000);
		expect(Number.type(timer)).toBeTruthy();
		$clear(timer);
	}

});

})();