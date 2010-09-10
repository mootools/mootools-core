
describe('Fx', function(){

	it('should start a Fx and call the onComplete event', function(){

		var onComplete = jasmine.createSpy('complete'),
			onStart = jasmine.createSpy('start');

		var fx = new Fx({
			duration: 100,
			onComplete: onComplete,
			onStart: onStart
		});

		fx.start(10, 10);

		expect(onStart).toHaveBeenCalled();

		waits(150);

		runs(function(){
			expect(onComplete).toHaveBeenCalled();
		});

	});

	it('should cancel a Fx', function(){

		onCancel = jasmine.createSpy();

		var fx = new Fx({
			duration: 50,
			onCancel: onCancel
		});

		fx.start();
		fx.cancel();

		expect(onCancel).toHaveBeenCalled();

	});

	it('should set the computed value', function(){

		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 100
		}).start(0, 10);

		waits(150);

		runs(function(){
			expect(fx.foo).toEqual(10);
		});

	});

	it('should pause and resume', function(){

		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 100
		}).start(0, 5);

		waits(50);

		runs(function(){
			fx.pause();
		});

		waits(10);

		runs(function(){
			fx.resume();
		});

		waits(70);

		runs(function(){
			// Does not work... fx.foo is the (last-1)th result
			expect(fx.foo).toEqual(5);
		});

	});

	it('should chain the Fx', function(){

		var counter = 0;
		var fx = new Fx({
			duration: 50,
			onComplete: function(){
				counter++;
			},
			link: 'chain'
		});

		fx.start().start();

		waits(210);

		runs(function(){
			expect(counter).toEqual(2);
		});
	});

	it('should cancel the Fx after a new Fx:start with the link = cancel option', function(){

		var onCancel = jasmine.createSpy('cancel');

		var counter = 0;
		var fx = new Fx({
			duration: 50,
			onCancel: onCancel,
			link: 'cancel'
		});

		fx.start().start();

		expect(onCancel).toHaveBeenCalled();

	});

});

