Fx.Style = Fx.Tween;

Element.implement({

	effect: function(property, options){
		return new Fx.Style(this, property, options);
	}

});