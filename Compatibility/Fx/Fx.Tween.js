Fx.Style = new Class({
	Extends: Fx.Tween,
	initialize: function(){
		console.warn('1.1 > 1.2: Fx.Style is deprecated. use Fx.Tween.');
		this.parent.apply(this, arguments);
	}
});

Element.implement({

	effect: function(options){
		console.warn('1.1 > 1.2: Element.effect is deprecated; use Fx.Tween or Element.tween.');
		return new Fx.Tween(this, options);
	}

})