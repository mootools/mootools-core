Native.implement([Element, Document], {
	getElementsByClassName: function(className){
		return this.getElements('.' + className);
	}
});

document.getElementsBySelector = document.getElements;

function $E(selector, filter){
	return ($(filter) || document).getElement(selector);
};

function $ES(selector, filter){
	return ($(filter) || document).getElements(selector);
};