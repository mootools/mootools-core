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
	}

});

Element.alias({'dispose': 'remove', 'getLast': 'getLastChild'});

Element.implement({

	getText: function(){
		return this.get('text');
	},

	setText: function(text){
		return this.set('text', text);
	},

	setHTML: function(){
		return this.set('html', arguments);
	},

	getHTML: function(){
		return this.get('html');
	},

	getTag: function(){
		return this.get('tag');
	}

});