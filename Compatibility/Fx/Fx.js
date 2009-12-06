Fx.implement({

    custom: function(from, to){
		console.warn('Fx.custom deprecated. Use Fx.start');
        return this.start(from, to);
    },

    clearTimer: function(){
		console.warn('Fx.clearTimer deprecated. Use Fx.cancel');
        return this.cancel();
    },
    
    stop: function(){
	    console.warn('Fx.stop deprecated. Use Fx.cancel');
        return this.cancel();
    }

});

Fx.Base = new Class({
	Extends : Fx,
	initialize : function(options){
		console.warn('Fx.Base is deprecated. Use Fx.');
		return this.parent(options);
	}
});
