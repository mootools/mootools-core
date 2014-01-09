/*
---
name: Array Specs
description: n/a
requires: [Core/Fx]
provides: [1.5base.Fx.Specs]
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

	it('should return the paused state', function(){
		var fx = new Fx({
			duration: 50
		}).start();

		expect(fx.isPaused()).toEqual(false);

		this.clock.tick(30);
		fx.pause();

		expect(fx.isPaused()).toEqual(true);

		fx.resume();
		this.clock.tick(60);
		expect(fx.isPaused()).toEqual(false);
	});

});
