Client.expand({
	getElementsByClassName: function(className){
		var self = (this == window) ? document : this;
		return self.getElements('.' + className);
	}
});

function $E(selector, filter){
	return ($(filter) || document).getElement(selector);
};

function $ES(selector, filter){
	return ($(filter) || document).getElementsBySelector(selector);
};