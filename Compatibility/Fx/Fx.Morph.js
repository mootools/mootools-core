Fx.Styles = new Class({
		Extends : Fx.Morph,
		initialize : function(el,options){
			console.warn('Fx.Styles is deprecated. Use Fx.Morph');
			return this.parent(el,options);
		}
	});
	