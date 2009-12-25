
Element.extend = function(obj){
	console.warn('1.1 > 1.2: Element.extend is deprecated. Use Element.implement');
	Element.implement(obj);
};

Elements.extend = function(obj){
	console.warn('1.1 > 1.2: Elements.extend is deprecated. Use Elements.implement');
	Elements.implement(obj);
};

(function(){

	var toQueryString = Element.prototype.toQueryString;
	Element.implement({
	
		remove : function(){
			console.warn('1.1 > 1.2: Element.remove is deprecated - use Element.dispose.'); 
			return this.dispose();
		},
	
		getLastChild : function(){
			console.warn('1.1 > 1.2: Element.getLastChild is deprecated. Use Element.getLast');
			return this.getLast();
		},

		getFormElements: function(){
			console.warn('1.1 > 1.2: Element.getFormElements is deprecated.');
			return this.getElements('input, textarea, select');
		},

		replaceWith: function(el){
			console.warn('1.1 > 1.2: Element.replaceWith is deprecated.');
			el = $(el);
			$(this.parentNode).replaceChild(el, this); // wrapped for ie
			return el;
		},

		removeElements: function(){
			console.warn('1.1 > 1.2: Element.removeElements is deprecated. use Element.dispose()');
					return this.dispose();
		},

		getText: function(){
			console.warn('1.1 > 1.2: Element.getText is deprecated - use Element.get("text").'); 
			return this.get('text');
		},

		setText: function(text){
			console.warn('1.1 > 1.2: Element.setText is deprecated. use Element.set("text",value)');
			return this.set('text', text);
		},

		setHTML: function(){
			console.warn('1.1 > 1.2: Element.setHTML is deprecated. use Element.set("html",value)');
			return this.set('html', arguments);
		},

		getHTML: function(){
			console.warn('1.1 > 1.2: Element.getHTML is deprecated. use Element.get("html")');
			return this.get('html');
		},

		getTag: function(){
			console.warn('1.1 > 1.2: Element.getTag is deprecated. use Element.get("tag")');
			return this.get('tag');
		},

		setOpacity: function(op){
			console.warn('1.1 > 1.2: Element.setOpacity is deprecated. use Element.set("opacity",value)');
			return this.set('opacity', op);
		},

		getValue: function(){
			console.warn('1.1 > 1.2: Element.getValue is deprecated. use Element.get("value")');
			return this.get('value');
		},
		
		toQueryString: function(){
			console.warn('1.1 > 1.2: warning Element.toQueryString is slightly different; inputs without names are excluded, inputs with type == submit, reset, and file are excluded, and inputs with undefined values are excluded.');
			return toQueryString.apply(this, arguments);
		}

	});

})();

window.extend = document.extend = function(properties){
	console.warn('1.1 > 1.2: (window||document).extend is deprecated');
	for (var property in properties) this[property] = properties[property];
};


Element.Properties.properties = {
	
	set: function(props){
		console.warn('1.1 > 1.2: Element.set({properties: {}}) is deprecated; instead of properties, just name the values at the root of the object (Element.set({src: url})).');
		$H(props).each(function(value, property){
			this.set(property, value);
		}, this);
	}
	
};


Element.Properties.styles = {
	
	set: function(styles){
		if ($type(styles) == 'string' && !styles.contains('{')){
			this.style.cssText = styles;
		} else {
			this.setStyles(styles);
		}
	}

};