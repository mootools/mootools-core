Fx.Style = Fx.Tween;

Element.implement('effect', function(property, options){
	return this.get('tween', property, options);
});