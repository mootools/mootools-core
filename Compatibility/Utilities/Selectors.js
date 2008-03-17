Native.implement([Element, Document], {

	getElementsByClassName: function(className){
		return this.getElements('.' + className);
	},

	getElementsBySelector: function(selector){
		return this.getElements(selector);
	}

});

Elements.implement({

	filterByTag: function(tag){
		return this.filter(tag);
	},

	filterByClass: function(className){
		return this.filter('.' + className);
	},

	filterById: function(id){
		return this.filter('#' + id);
	},

	filterByAttribute: function(name, operator, value){
		return this.filter('[' + name + (operator || '') + (value || '') + ']');
	}

});

var $E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	return ($(filter) || document).getElements(selector);
};