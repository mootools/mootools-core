Element.extend = Element.implement;

Elements.extend = Elements.implement;

Element.implement({

	getFormElements: function(){
		return this.getElements('input, textarea, select');
	},

	replaceWith: function(el){
		el = $(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},
	
	removeElements: function(){
		return this.dispose();
	},
	
	getValue: function(){
		return this.get('value');
	}

});

Element.alias('dispose', 'remove').alias('getLast', 'getLastChild');