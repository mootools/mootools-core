Fx.Styles = new Class({

	Extends : Fx.Morph,

	initialize : function(el,options){
		console.warn('Fx.Styles is deprecated. Use Fx.Morph');
		return this.parent(el,options);
	}

});

Element.implement({

	effects: function(options){
		console.warn('1.1 > 1.2: Element.effects is deprecated. use Element.morph');
		return new Fx.Morph(this, options);
	}

});