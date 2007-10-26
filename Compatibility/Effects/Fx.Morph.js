Fx.Styles = Fx.Morph;

Element.implement('effects', function(options){
	return this.get('morph', options);
});