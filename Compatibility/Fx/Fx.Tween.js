Fx.Style = function(element, property, options){
	return new Fx.Tween(element, $extend({property: property}, options));
};

Element.implement({

	effect: function(property, options){
		return new Fx.Tween(this, $extend({property: property}, options));
	}

});