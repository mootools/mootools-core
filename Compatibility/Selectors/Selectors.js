Native.implement([Element, Document], {
	getElementsByClassName: function(className){
		return this.getElements('.' + className);
	},
	getElementsBySelector: document.getElements
});

$E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

function $ES(selector, filter){
	return ($(filter) || document).getElements(selector);
};