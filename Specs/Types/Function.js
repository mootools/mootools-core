/*
---
name: Function
requires: ~
provides: ~
...
*/

var dit = /*<1.2compat>*/xit || /*</1.2compat>*/it; // Don't run unless no compat.

(function(){

var MooTools = new String('MooTools');

var fn = function(){
	return Array.convert(arguments).slice();
};

var Rules = function(){
	return this + ' rules';
};

var Args = function(){
	return [this].concat(Array.prototype.slice.call(arguments));
};

describe('Function Method', function(){

//<1.2compat>
	describe('Function.create', function(){

		it('should return a new function', function(){
			var fnc = $empty.create();
			expect($empty).to.not.equal(fnc);
		});

		it('should return a new function with specified argument', function(){
			var fnc = fn.create({'arguments': 'rocks'});
			expect(fnc()).to.eql(['rocks']);
		});

		it('should return a new function with multiple arguments', function(){
			var fnc = fn.create({'arguments': ['MooTools', 'rocks']});
			expect(fnc()).to.eql(['MooTools', 'rocks']);
		});

		it('should return a new function bound to an object', function(){
			var fnc = Rules.create({'bind': 'MooTools'});
			expect(fnc()).to.equal('MooTools rules');
		});

		it('should return a new function as an event', function(){
			var fnc = fn.create({'arguments': [0, 1], 'event': true});
			expect(fnc('an Event occurred')).to.eql(['an Event occurred', 0, 1]);
		});
	});
//</1.2compat>

	describe('Function.bind', function(){

		it('should return the function bound to an object', function(){
			var fnc = Rules.bind('MooTools');
			expect(fnc()).to.equal('MooTools rules');
		});

		it('should return the function bound to an object with specified argument', function(){
			var results = Args.bind(MooTools, 'rocks')();
			expect(results[0]).to.equal(MooTools);
			expect(results[1]).to.equal('rocks');
		});

		dit('should return the function bound to an object with multiple arguments', function(){
			var results = Args.bind(MooTools, ['rocks', 'da house'])();
			expect(results[0]).to.equal(MooTools);
			expect(results[1]).to.eql(['rocks', 'da house']);
		});

//<1.2compat>
		it('should return the function bound to an object with specified argument', function(){
			var fnc = Args.bind(MooTools, 'rocks');
			var result = fnc();
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'rocks']);
		});

		it('should return the function bound to an object with multiple arguments', function(){
			var fnc = Args.bind(MooTools, ['rocks', 'da house']);
			var result = fnc();
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'rocks', 'da house']);
		});

		it('should return the function bound to an object and make the function an event listener', function(){
			var fnc = Args.bindWithEvent(MooTools);
			var result = fnc('an Event occurred');
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'an Event occurred']);
		});

		it('should return the function bound to an object and make the function event listener with multiple arguments', function(){
			var fnc = Args.bindWithEvent(MooTools, ['rocks', 'da house']);
			var result = fnc('an Event occurred');
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'an Event occurred', 'rocks', 'da house']);
		});
//</1.2compat>

	});

	describe('Function.pass', function(){

		it('should return a function that when called passes the specified arguments to the original function', function(){
			var fnc = fn.pass('MooTools is beautiful and elegant');
			expect(fnc()).to.eql(['MooTools is beautiful and elegant']);
		});

		it('should pass multiple arguments and bind the function to a specific object when it is called', function(){
			var fnc = Args.pass(['rocks', 'da house'], MooTools);
			var result = fnc();
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'rocks', 'da house']);
		});

	});

//<1.2compat>
	describe('Function.run', function(){

		it('should run the function', function(){
			var result = fn.run();
			expect(result).to.eql([]);
		});

		it('should run the function with multiple arguments', function(){
			var result = fn.run(['MooTools', 'beautiful', 'elegant']);
			expect(result).to.eql(['MooTools', 'beautiful', 'elegant']);
		});

		it('should run the function with multiple arguments and bind the function to an object', function(){
			var result = Args.run(['beautiful', 'elegant'], MooTools);
			expect(result[0]).to.equal(MooTools);
			expect(result).to.eql([MooTools, 'beautiful', 'elegant']);
		});

	});
//</1.2compat>

	describe('Function.extend', function(){

		it('should extend the properties of a function', function(){
			var fnc = (function(){}).extend({a: 1, b: 'c'});
			expect(fnc.a).to.equal(1);
			expect(fnc.b).to.equal('c');
		});

	});

	describe('Function.attempt', function(){

		it('should call the function without raising an exception', function(){
			var fnc = function(){
				this_should_not_work();
			};
			fnc.attempt();
		});

		it('should return the return value of a function', function(){
			var fnc = Function.convert('hello world!');
			expect(fnc.attempt()).to.equal('hello world!');
		});

		it('should return null if the function raises an exception', function(){
			var fnc = function(){
				this_should_not_work();
			};
			expect(fnc.attempt()).to.equal(null);
		});

	});

	describe('Function.delay', function(){

		it('delay should return a timer pointer', function(){
			var referenceTimer = setTimeout(function(){}, 10000);
			var timer = (function(){}).delay(10000);
			expect(typeOf(timer)).to.equal(typeOf(referenceTimer));
			clearTimeout(timer);
			clearTimeout(referenceTimer);
		});

	});

	describe('Function.periodical', function(){

		it('periodical should return a timer pointer', function(){
			var referenceTimer = setInterval(function(){}, 10000);
			var timer = (function(){}).periodical(10000);
			expect(typeOf(timer)).to.equal(typeOf(referenceTimer));
			clearInterval(timer);
			clearInterval(referenceTimer);
		});

	});

});

describe('Function.attempt', function(){

	it('should return the result of the first successful function without executing successive functions', function(){
		var calls = 0;
		var attempt = Function.attempt(function(){
			calls++;
			throw new Exception();
		}, function(){
			calls++;
			return 'success';
		}, function(){
			calls++;
			return 'moo';
		});
		expect(calls).to.equal(2);
		expect(attempt).to.equal('success');
	});

	it('should return null when no function succeeded', function(){
		var calls = 0;
		var attempt = Function.attempt(function(){
			calls++;
			return I_invented_this();
		}, function(){
			calls++;
			return uninstall_ie();
		});
		expect(calls).to.equal(2);
		expect(attempt).to.equal(null);
	});

});

})();

describe('Function.bind', function(){

	it('should return the function bound to an object', function(){
		var spy = sinon.spy();
		var f = spy.bind('MooTools');
		expect(spy.called).to.equal(false);
		f();
		expect(spy.calledWith()).to.equal(true);
		f('foo', 'bar');
		expect(spy.calledWith('foo', 'bar')).to.equal(true);
	});

	it('should return the function bound to an object with specified argument', function(){
		var binding = {some: 'binding'};
		var spy = sinon.stub().returns('something');
		var f = spy.bind(binding, 'arg');

		expect(spy.called).to.equal(false);
		expect(f('additional', 'arguments')).to.equal('something');
		expect(spy.lastCall.thisValue).to.equal(binding);
	});

	it('should return the function bound to an object with multiple arguments', function(){
		var binding = {some: 'binding'};
		var spy = sinon.stub().returns('something');
		var f = spy.bind(binding, ['foo', 'bar']);

		expect(spy.called).to.equal(false);
		expect(f('additional', 'arguments')).to.equal('something');
		expect(spy.lastCall.thisValue).to.equal(binding);
	});

	dit('should still be possible to use it as constructor', function(){
		function Alien(type){
			this.type = type;
		}

		var thisArg = {};
		var Tribble = Alien.bind(thisArg, 'Polygeminus grex');

		// `thisArg` should **not** be used for the `this` binding when called as a constructor.
		var fuzzball = new Tribble('Klingon');
		expect(fuzzball.type).to.equal('Polygeminus grex');
	});

	dit('when using .call(thisArg) on a bound function, it should ignore the thisArg of .call', function(){
		var fn = function(){
			return [this.foo].concat(Array.slice(arguments));
		};

		expect(fn.bind({foo: 'bar'})()).to.eql(['bar']);
		expect(fn.bind({foo: 'bar'}, 'first').call({foo: 'yeah!'}, 'yooo')).to.eql(['bar', 'first', 'yooo']);

		var bound = fn.bind({foo: 'bar'});
		var bound2 = fn.bind({foo: 'yep'});
		var inst = new bound;
		inst.foo = 'noo!!';
		expect(bound2.call(inst, 'yoo', 'howdy')).to.eql(['yep', 'yoo', 'howdy']);
	});

});

describe('Function.pass', function(){

	it('should return a function that when called passes the specified arguments to the original function', function(){
		var spy = sinon.stub().returns('the result');
		var fnc = spy.pass('an argument');
		expect(spy.called).to.equal(false);
		expect(fnc('additional', 'arguments')).to.equal('the result');
		expect(spy.calledWith('an argument')).to.equal(true);
		expect(spy.callCount).to.equal(1);
	});

	it('should pass multiple arguments and bind the function to a specific object when it is called', function(){
		var spy = sinon.stub().returns('the result');
		var binding = {some: 'binding'};
		var fnc = spy.pass(['multiple', 'arguments'], binding);
		expect(spy.called).to.equal(false);
		expect(fnc('additional', 'arguments')).to.equal('the result');
		expect(spy.lastCall.thisValue).to.equal(binding);
		expect(spy.calledWith('multiple', 'arguments')).to.equal(true);
	});

});

describe('Function.extend', function(){

	it('should extend the properties of a function', function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		expect(fnc.a).to.equal(1);
		expect(fnc.b).to.equal('c');
	});

});

describe('Function.attempt', function(){

	it('should call the function without raising an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		fnc.attempt();
	});

	it('should return the return value of a function', function(){
		var spy = sinon.stub().returns('hello world!');
		expect(spy.attempt()).to.equal('hello world!');
	});

	it('should return null if the function raises an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		expect(fnc.attempt()).to.equal(null);
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
		var spyA = sinon.spy();
		var spyB = sinon.spy();

		var timerA = spyA.delay(200);
		var timerB = spyB.delay(200);

		this.clock.tick(100);

		expect(spyA.called).to.equal(false);
		expect(spyB.called).to.equal(false);
		clearTimeout(timerB);

		this.clock.tick(250);
		expect(spyA.callCount).to.equal(1);
		expect(spyB.callCount).to.equal(0);
		clearTimeout(timerA);
	});

	it('should pass parameter 0', function(){
		var spy = sinon.spy();
		spy.delay(50, null, 0);

		this.clock.tick(100);
		expect(spy.calledWith(0)).to.equal(true);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		spy.delay(50);
		this.clock.tick(100);
		expect(argumentCount).to.equal(0);
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
		var spy = sinon.spy();

		var interval = spy.periodical(10);
		expect(spy.called).to.equal(false);

		this.clock.tick(100);

		expect(spy.callCount).to.be.greaterThan(2);
		expect(spy.callCount).to.be.lessThan(15);
		clearInterval(interval);
		spy.reset();
		expect(spy.called).to.equal(false);

		this.clock.tick(100);

		expect(spy.called).to.equal(false);
	});

	it('should pass parameter 0', function(){
		var spy = sinon.spy();
		var timer = spy.periodical(10, null, 0);

		this.clock.tick(100);

		expect(spy.calledWith(0)).to.equal(true);
		clearInterval(timer);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		var timer = spy.periodical(50);
		this.clock.tick(100);

		expect(argumentCount).to.equal(0);
		clearInterval(timer);
	});

});
