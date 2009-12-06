Fx.Style = function(element, property, options){
	console.warn('Fx.Style is deprecated. Use Fx.Tween');
    return new Fx.Tween(element, $extend({property: property}, options));
};
