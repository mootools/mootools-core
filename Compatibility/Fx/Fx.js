Fx.implement({

	custom: function(from, to){
		console.warn('1.1 > 1.2: Fx.custom is deprecated. use Fx.start.');
		return this.start(from, to);
	},

	clearTimer: function(){
		console.warn('1.1 > 1.2: Fx.clearTimer is deprecated. use Fx.cancel.');
		return this.cancel();
	},

	stop: function(){
		console.warn('1.1 > 1.2: Fx.stop is deprecated. use Fx.cancel.');
		return this.cancel();
	}

});

Fx.Base = new Class({
	Extends: Fx,
	initialize: function(){
		console.warn('1.1 > 1.2: Fx.Base is deprecated. use Fx.');
		this.parent.apply(this, arguments);
	}
});
