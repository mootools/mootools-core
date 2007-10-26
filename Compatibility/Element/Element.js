Element.extend = Element.implement;
Elements.extend = Elements.implement;

Element.implement({

	getFormElements: function(){
		return this.getElements('input, textarea, select');
	},
	
	getValue: function(){
		return this.get('value');
	},
	
	getText: function(){
		return this.get('text');
	},
	
	setText: function(text){
		return this.set('text', text);
	},
	
	setHTML: function(){
		return this.set('html', $A(arguments));
	},
	
	getTag: function(){
		return this.get('tag');
	}

});

(function(){
	var methods = {};
	Element.Inserters.each(function(value, key){
		methods['inject' + key.capitalize()] = function(el){
			return Element.inject(this, el, key);
		};
	});
	Element.implement(methods);
})();