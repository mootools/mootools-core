
Element.extend = function(obj){
	console.warn('1.1 > 1.2: Element.extend is deprecated. Use Element.implement');
	Element.implement(obj);
};

Elements.extend = function(obj){
	console.warn('1.1 > 1.2: Elements.extend is deprecated. Use Elements.implement');
	Elements.implement(obj);
};

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
		
	// Very slightly modified from mootools
	toQueryString: function(){
		console.warn('warning Element.toQueryString is slightly different');
		var queryString = [];
		this.getElements('input, select, textarea').each(function(el){
				if (!Element.name || Element.disabled) return;
				var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
						return opt.value;
				}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
				$splat(value).each(function(val){
						/*if (val)*/ queryString.push(el.name + '=' + encodeURIComponent(val));
				});
		});
		return queryString.join('&');
	},

	effect: function(property, options){
		console.warn('1.1 > 1.2: Element.effect is deprecated. use Element.tween');
		return new Fx.Tween(this, $extend({property: property}, options));
	},

	effects: function(options){
		console.warn('1.1 > 1.2: Element.effects is deprecated. use Element.morph');
		return new Fx.Morph(this, options);
	},

	filterByTag: function(tag){
		console.warn('1.1 > 1.2: Element.filterByTag is deprecated.');
			return this.filter(tag);
	},

	filterByClass: function(className){
		console.warn('1.1 > 1.2: Element.filterByClass is deprecated.');
		return this.filter('.' + className);
	},

	filterById: function(id){
		console.warn('1.1 > 1.2: Element.filterById is deprecated.');
		return this.filter('#' + id);
	},

	filterByAttribute: function(name, operator, value){
		console.warn('1.1 > 1.2: Element.filterByAttribute is deprecated.');
		return this.filter('[' + name + (operator || '') + (value || '') + ']');
	}

});

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