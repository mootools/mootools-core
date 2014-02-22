/*
---
name: Function
requires: ~
provides: ~
...
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

describe('Function.bind', function(){

	it('should return the function bound to an object', function(){
		var spy = jasmine.createSpy('Function.bind');
		var f = spy.bind('MooTools');
		expect(spy).not.toHaveBeenCalled();
		f();
		expect(spy).toHaveBeenCalledWith();
		f('foo', 'bar');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
	});

	it('should return the function bound to an object with specified argument', function(){
		var binding = {some: 'binding'};
		var spy = jasmine.createSpy('Function.bind with arg').andReturn('something');
		var f = spy.bind(binding, 'arg');

		expect(spy).not.toHaveBeenCalled();
		expect(f('additional', 'arguments')).toEqual('something');
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

	it('should return the function bound to an object with multiple arguments', function(){
		var binding = {some: 'binding'};
		var spy = jasmine.createSpy('Function.bind with multiple args').andReturn('something');
		var f = spy.bind(binding, ['foo', 'bar']);

		expect(spy).not.toHaveBeenCalled();
		expect(f('additional', 'arguments')).toEqual('something');
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

	it('should still be possible to use it as constructor', function(){
		function Alien(type) {
			this.type = type;
		}

		var thisArg = {};
		var Tribble = Alien.bind(thisArg, 'Polygeminus grex');

		// `thisArg` should **not** be used for the `this` binding when called as a constructor
		var fuzzball = new Tribble('Klingon');
		expect(fuzzball.type).toEqual('Polygeminus grex');
	});

	it('when using .call(thisArg) on a bound function, it should ignore the thisArg of .call', function(){
		var fn = function(){
			return [this.foo].concat(Array.slice(arguments));
		};

		expect(fn.bind({foo: 'bar'})()).toEqual(['bar']);
		expect(fn.bind({foo: 'bar'}, 'first').call({foo: 'yeah!'}, 'yooo')).toEqual(['bar', 'first', 'yooo']);

		var bound = fn.bind({foo: 'bar'});
		var bound2 = fn.bind({foo: 'yep'});
		var inst = new bound;
		inst.foo = 'noo!!';
		expect(bound2.call(inst, 'yoo', 'howdy')).toEqual(['yep', 'yoo', 'howdy']);
	});

});

describe('Function.pass', function(){

	it('should return a function that when called passes the specified arguments to the original function', function(){
		var spy = jasmine.createSpy('Function.pass').andReturn('the result');
		var fnc = spy.pass('an argument');
		expect(spy).not.toHaveBeenCalled();
		expect(fnc('additional', 'arguments')).toBe('the result');
		expect(spy).toHaveBeenCalledWith('an argument');
		expect(spy.callCount).toBe(1);
	});

	it('should pass multiple arguments and bind the function to a specific object when it is called', function(){
		var spy = jasmine.createSpy('Function.pass with bind').andReturn('the result');
		var binding = {some: 'binding'};
		var fnc = spy.pass(['multiple', 'arguments'], binding);
		expect(spy).not.toHaveBeenCalled();
		expect(fnc('additional', 'arguments')).toBe('the result');
		expect(spy.mostRecentCall.object).toEqual(binding);
		expect(spy).toHaveBeenCalledWith('multiple', 'arguments');
	});

});

describe('Function.extend', function(){

	it("should extend the function's properties", function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		expect(fnc.a).toEqual(1);
		expect(fnc.b).toEqual('c');
	});

});

describe('Function.attempt', function(){

	it('should call the function without raising an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		fnc.attempt();
	});

	it("should return the function's return value", function(){
		var spy = jasmine.createSpy('Function.attempt').andReturn('hello world!');
		expect(spy.attempt()).toEqual('hello world!');
	});

	it('should return null if the function raises an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		expect(fnc.attempt()).toBeNull();
	});

});

describe('Function.delay', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should return a timer pointer', function(){
		var spyA = jasmine.createSpy('Alice');
		var spyB = jasmine.createSpy('Bob');

		var timerA = spyA.delay(200);
		var timerB = spyB.delay(200);

		this.clock.tick(100);

		expect(spyA).not.toHaveBeenCalled();
		expect(spyB).not.toHaveBeenCalled();
		clearTimeout(timerB);

		this.clock.tick(250);
		expect(spyA.callCount).toBe(1);
		expect(spyB.callCount).toBe(0);
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy('Function.delay with 0');
		spy.delay(50, null, 0);

		this.clock.tick(100);
		expect(spy).toHaveBeenCalledWith(0);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		spy.delay(50);
		this.clock.tick(100);
		expect(argumentCount).toEqual(0);
	});

});

describe('Function.periodical', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should return an interval pointer', function(){
		var spy = jasmine.createSpy('Bond');

		var interval = spy.periodical(10);
		expect(spy).not.toHaveBeenCalled();

		this.clock.tick(100);

		expect(spy.callCount).toBeGreaterThan(2);
		expect(spy.callCount).toBeLessThan(15);
		clearInterval(interval);
		spy.reset();
		expect(spy).not.toHaveBeenCalled();

		this.clock.tick(100);

		expect(spy).not.toHaveBeenCalled();
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy('Function.periodical with 0');
		var timer = spy.periodical(10, null, 0);

		this.clock.tick(100);

		expect(spy).toHaveBeenCalledWith(0);
		clearInterval(timer);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		var timer = spy.periodical(50);
		this.clock.tick(100);

		expect(argumentCount).toEqual(0);
		clearInterval(timer);
	});

});
