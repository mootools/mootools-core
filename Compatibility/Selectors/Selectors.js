Element.$domCompatMethods = {
	getElementsByClassName: function(className){
		return this.getElements('.' + className);
	}
};

function $E(selector, filter){
	return ($(filter) || document).getElement(selector);
};

function $ES(selector, filter){
	return ($(filter) || document).getElementsBySelector(selector);
};

Element.extend(Element.$domCompatMethods);
document.extend(Element.$domCompatMethods);