Fx.Styles = Fx.Morph;

Element.implement({

	effects: function(options){
		return new Fx.Morph(this, options);
	}

});