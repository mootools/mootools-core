Element.$domCompatMethods = {
	getElementsByClassName: function(className){
		return this.getElements('.' + className);
	}	
};

Element.extend(Element.$domCompatMethods);
document.extend(Element.$domCompatMethods);