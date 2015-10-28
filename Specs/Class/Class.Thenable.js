/*
---
name: Class.Thenable
requires: ~
provides: ~
...
*/

describe('Class.Thenable', function(){

	var Thenable = Class.Thenable;

	var Thing = new Class({

		Implements: Thenable

	});

	function asyncExpectations(done, fn){
		var error,
			finished = false;

		function notFinished(){
			finished = false;
		}

		return function(){
			finished = true;
			try {
				fn(notFinished);
			} catch (thrown){
				error = thrown;
			}
			if (finished) return done(error);
		};
	}

	describe('(Promises/A+)', function(){
		var specs;
		try {
			specs = require('promises-aplus-tests');
		} catch (error){
			xspecify('specs cannot be run in this environment');
		}
		if (specs){
			specs.mocha({
				resolved: Thenable.resolve,
				rejected: Thenable.reject,
				deferred: function(){
					var thenable = new Thenable();
					return {
						promise: thenable,
						resolve: thenable.resolve.bind(thenable),
						reject: thenable.reject.bind(thenable)
					};
				}
			});
		}
	});

	// Tests below are adapted versions of the tests in domenic/promises-unwrapping:
	// https://github.com/domenic/promises-unwrapping/tree/master/reference-implementation/test
	it('should call its fulfillment handler when fulfilled', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onFulfilled.called).to.equal(true);
			expect(onRejected.called).to.equal(false);
			expect(onFulfilled.args[0][0]).to.equal(5);
		});

		var onFulfilled = sinon.spy(expectations);
		var onRejected = sinon.spy(expectations);

		Thenable.resolve(5).then(onFulfilled, onRejected);
	});

	it('should call its rejection handler when rejected', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onRejected.called).to.equal(true);
			expect(onRejected.args[0][0]).to.equal(12);
		});

		var onRejected = sinon.spy(expectations);

		Thenable.reject(12)['catch'](onRejected);
	});

	describe('implemented', function(){

		it('should call its fulfillment handler when fulfilled', function(done){
			var expectations = asyncExpectations(done, function(){
				expect(onFulfilled.called).to.equal(true);
				expect(onRejected.called).to.equal(false);
				expect(onFulfilled.args[0][0]).to.equal(4);
			});

			var instance = new Thing();
			var onFulfilled = sinon.spy(expectations);
			var onRejected = sinon.spy(expectations);

			instance.then(onFulfilled, onRejected);
			instance.resolve(4);
		});

		it('should call its rejection handler when rejected', function(done){
			var expectations = asyncExpectations(done, function(){
				expect(onRejected.called).to.equal(true);
				expect(onRejected.args[0][0]).to.equal(41);
			});

			var instance = new Thing();
			var onRejected = sinon.spy(expectations);

			instance.reject(41);
			instance['catch'](onRejected);
		});

	});

	it('should refuse to be resolved with itself', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onFulfilled.called).to.equal(false);
			expect(onRejected.called).to.equal(true);
			expect(onRejected.args[0][0] instanceof TypeError).to.equal(true);
		});

		var onFulfilled = sinon.spy(expectations);
		var onRejected = sinon.spy(expectations);

		var thenable = new Thenable();
		thenable.resolve(thenable).then(onFulfilled, onRejected);
	});

	it('should call handlers in the order they are queued, when added before resolution', function(done){
		var expectations = asyncExpectations(done, function(notFinished){
			if (onFulfilled.callCount == 2){
				expect(calls[0]).to.equal(2);
				expect(calls[1]).to.equal(1);
			} else {
				notFinished();
			}
		});

		var onFulfilled = sinon.spy(expectations);
		var calls = [];

		var t1 = new Thenable();
		var t2 = new Thenable();

		t1.then(function(){
			calls.push(1);
		}).then(onFulfilled);

		t2['catch'](function(){
			calls.push(2);
		}).then(onFulfilled);

		t2.reject();
		t1.resolve();
	});

	it('should call handlers in the order they are queued, when added after resolution', function(done){
		var expectations = asyncExpectations(done, function(notFinished){
			if (onFulfilled.callCount == 2){
				expect(calls[0]).to.equal(1);
				expect(calls[1]).to.equal(2);
			} else {
				notFinished();
			}
		});

		var onFulfilled = sinon.spy(expectations);
		var calls = [];

		var t1 = new Thenable();
		var t2 = new Thenable();

		t2.reject();
		t1.resolve();

		t1.then(function(){
			calls.push(1);
		}).then(onFulfilled);

		t2['catch'](function(){
			calls.push(2);
		}).then(onFulfilled);
	});

	it('should call handlers in the order they are queued, when added asynchronously after resolution', function(done){
		var expectations = asyncExpectations(done, function(notFinished){
			if (onFulfilled.callCount == 2){
				expect(calls[0]).to.equal(1);
				expect(calls[1]).to.equal(2);
			} else {
				notFinished();
			}
		});

		var onFulfilled = sinon.spy(expectations);
		var calls = [];

		var t1 = new Thenable();
		var t2 = new Thenable();

		t2.reject();
		t1.resolve();

		setTimeout(function(){
			t1.then(function(){
				calls.push(1);
			}).then(onFulfilled);

			t2['catch'](function(){
				calls.push(2);
			}).then(onFulfilled);
		}, 0);
	});

	it('should resolve only once, even when resolved to a thenable that calls its handlers twice', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onFulfilled.callCount).to.equal(1);
			expect(onFulfilled.args[0][0]).to.equal(1);
		});

		var onFulfilled = sinon.spy(expectations);

		var evilThenable = Thenable.resolve();
		evilThenable.then = function(f){
			f(1);
			f(2);
		};

		var resolvedToEvil = new Thenable();
		resolvedToEvil.resolve(evilThenable);
		resolvedToEvil.then(onFulfilled);
	});

	it('should correctly store the first resolved value if resolved to a thenable which calls back with different values each time', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onFulfilled.called).to.equal(true);
		});

		var onFulfilled = sinon.spy(expectations);

		var thenable = {
			i: 0,
			then: function(f){
				f(this.i++);
			}
		};
		var t = Thenable.resolve(thenable);

		t.then(function(value){
			expect(value).to.equal(0);

			t.then(function(value){
				expect(value).to.equal(0);

				t.then(function(value){
					expect(value).to.equal(0);
				});
			});
		});

		t.then(onFulfilled);
	});

	it('should call then methods with a clean stack when it resolves to a thenable', function(){
		var then = sinon.spy();

		var thenable = {
			then: then
		};

		Thenable.resolve(thenable);

		expect(then.called).to.equal(false);
	});

	it('should call then methods with a clean stack when it resolves to an (evil) Thenable', function(){
		var then = sinon.spy();

		var evilThenable = Thenable.resolve();
		evilThenable.then = then;

		Thenable.resolve(evilThenable);
		expect(then.called).to.equal(false);
	});

	it('should reset correctly', function(){
		var thenable = new Thenable.resolve(3);
		expect(thenable.getThenableState()).to.equal('fulfilled');

		thenable.resetThenable();
		expect(thenable.getThenableState()).to.equal('pending');
	});

	it('should reject before resetting, if still pending', function(done){
		var expectations = asyncExpectations(done, function(){
			expect(onRejected.called).to.equal(true);
			expect(onRejected.args[0][0]).to.equal(7);
			expect(thenable.getThenableState()).to.equal('pending');
		});

		var onRejected = sinon.spy(expectations);

		var thenable = new Thenable();
		expect(thenable.getThenableState()).to.equal('pending');

		thenable.then(null, onRejected);

		thenable.resetThenable(7);
	});

});
