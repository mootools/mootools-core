Fx.implement({

	custom: function(from, to){
		return this.start(from, to);
	},

	clearTimer: function(){
		return this.cancel();
	},

	stop: function(){
		return this.cancel();
	}

});

Fx.Base = Fx;
