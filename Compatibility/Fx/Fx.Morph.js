Fx.Styles = new Class({
	Extends: Fx.Morph,
	initialize: function(){
		console.warn('1.1 > 1.2: Fx.Styles is deprecated. use Fx.Morph.');
		this.parent.apply(this, arguments);
	}
});

Element.implement({

	effects: function(options){
		console.warn('1.1 > 1.2: Element.effects is deprecated; use Fx.Morph or Element.morph.');
		return new Fx.Morph(this, options);
	}

});