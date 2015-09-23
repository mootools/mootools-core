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

			expect(onStart.called).toBe(false);

			fx.start(10, 20);

			this.clock.tick(100);
			expect(onStart.called).toBe(true);
			expect(onComplete.called).toBe(false);

			this.clock.tick(1000);
			expect(onComplete.called).toBe(true);

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

		expect(onCancel.called).toBe(false);

		fx.cancel();

		expect(onCancel.called).toBe(true);

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

		expect(fx.foo).toEqual(10);

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
		expect(fx.foo).toBeGreaterThan(0);
		expect(fx.foo).toBeLessThan(1);

		this.clock.tick(1000);

		expect(fx.foo).toEqual(value);
		fx.resume();

		this.clock.tick(2000);

		expect(fx.foo).toEqual(1);

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

		expect(counter).toEqual(2);
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

		expect(onCancel.called).toBe(true);

	});

});

describe('Fx', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should return the paused state', function(){
		var fx = new Fx({
			duration: 500
		}).start();

		expect(fx.isPaused()).toEqual(false);

		this.clock.tick(300);
		fx.pause();

		expect(fx.isPaused()).toEqual(true);

		fx.resume();
		this.clock.tick(600);
		expect(fx.isPaused()).toEqual(false);
	});

});
