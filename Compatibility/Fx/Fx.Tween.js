Fx.Style = function(element, property, options){
	console.warn('Fx.Style is deprecated. Use Fx.Tween');
    return new Fx.Tween(element, $extend({property: property}, options));
};

Element.implement({

	effect: function(property, options){
		console.warn('1.1 > 1.2: Element.effect is deprecated. use Element.tween');
		return new Fx.Tween(this, $extend({property: property}, options));
	}

})