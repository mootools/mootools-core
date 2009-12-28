Element.implement({

	setOpacity: function(op){
		console.warn('1.1 > 1.2: Element.setOpacity is deprecated; use Element.setStyle("opacity", value).');
		return this.set('opacity', op);
	}

});

Element.Properties.styles = {
	
	set: function(styles){
		console.warn('1.1 > 1.2: Element.set("styles") no longer accepts a string as an argument. Pass an object instead.');
		if ($type(styles) == 'string'){
			styles.split(";").each(function(style){
				this.setStyle(style.split(":")[0], style.split(":")[1]);
			}, this);
		} else {
			this.setStyles(styles);
		}
	}
	
};