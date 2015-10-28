/*
---
name: Fx
requires: ~
provides: ~
...
*/

describe('Fx', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	Object.each(Fx.Transitions, function(value, transition){
		if (transition == 'extend') return;

		it('should start a Fx and call the onComplete event with ' + transition + ' as timing function', function(){
			var onComplete = sinon.spy(),
				onStart = sinon.spy();

			var fx = new Fx({
				duration: 500,
				transition: Fx.Transitions[transition],
				onComplete: onComplete,
				onStart: onStart
			});

			expect(onStart.called).to.equal(false);

			fx.start(10, 20);

			this.clock.tick(100);
			expect(onStart.called).to.equal(true);
			expect(onComplete.called).to.equal(false);

			this.clock.tick(1000);
			expect(onComplete.called).to.equal(true);
		});
	});

	it('should cancel a Fx', function(){
		var onCancel = sinon.spy();

		var fx = new Fx({
			duration: 500,
			transition: 'sine:in:out',
			onCancel: onCancel
		});

		fx.start();
		expect(onCancel.called).to.equal(false);

		fx.cancel();
		expect(onCancel.called).to.equal(true);
	});

	it('should set the computed value', function(){
		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 1000
		}).start(0, 10);

		this.clock.tick(2000);
		expect(fx.foo).to.equal(10);
	});

	it('should pause and resume', function(){
		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 2000
		}).start(0, 1);

		this.clock.tick(1000);

		var value;

		fx.pause();
		value = fx.foo;
		expect(fx.foo).to.be.greaterThan(0);
		expect(fx.foo).to.be.lessThan(1);

		this.clock.tick(1000);

		expect(fx.foo).to.equal(value);
		fx.resume();

		this.clock.tick(2000);
		expect(fx.foo).to.equal(1);
	});

	it('should chain the Fx', function(){
		var counter = 0;
		var fx = new Fx({
			duration: 500,
			onComplete: function(){
				counter++;
			},
			link: 'chain'
		});

		fx.start().start();

		this.clock.tick(1000);
		this.clock.tick(1000);

		expect(counter).to.equal(2);
	});

	it('should cancel the Fx after a new Fx:start with the link = cancel option', function(){
		var onCancel = sinon.spy();

		var fx = new Fx({
			duration: 500,
			onCancel: onCancel,
			link: 'cancel'
		});

		fx.start().start();

		this.clock.tick(1000);
		expect(onCancel.called).to.equal(true);
	});

	it('should return the paused state', function(){
		var fx = new Fx({
			duration: 500
		}).start();

		expect(fx.isPaused()).to.equal(false);

		this.clock.tick(300);
		fx.pause();

		expect(fx.isPaused()).to.equal(true);

		fx.resume();
		this.clock.tick(600);
		expect(fx.isPaused()).to.equal(false);
	});

});

describe('Fx (thenable)', function(){

	beforeEach(function(){
		this.fx = new Fx({
			duration: 1,
			transition: 'sine:in:out'
		});

		var self = this;
		this.onFulfilled = sinon.spy(function(){ self.expectations.apply(self, arguments); });
		this.onRejected = sinon.spy(function(){ self.expectations.apply(self, arguments); });

		this.fx.then(this.onFulfilled, this.onRejected);
	});

	it('should fulfill when completed', function(done){
		this.fx.start(10, 20);

		expect(this.onRejected.called).to.equal(false);
		expect(this.onFulfilled.called).to.equal(false);

		this.expectations = function(){
			var error;
			try {
				expect(this.onRejected.called).to.equal(false);
				expect(this.onFulfilled.called).to.equal(true);
				expect(this.onFulfilled.args[0][0]).to.equal(null);
			} catch (thrown){
				error = thrown;
			}
			done(error);
		};
	});

	it('should reject when cancelled', function(done){
		this.fx.start();

		expect(this.onFulfilled.called).to.equal(false);
		expect(this.onRejected.called).to.equal(false);

		this.fx.cancel();

		this.expectations = function(){
			var error;
			try {
				expect(this.onFulfilled.called).to.equal(false);
				expect(this.onRejected.called).to.equal(true);
				expect(this.onRejected.args[0][0]).to.equal(this.fx);
			} catch (thrown){
				error = thrown;
			}
			done(error);
		};
	});

});
