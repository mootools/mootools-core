var $E = function(selector, filter){
	console.warn('$E is deprecated.');
    return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	console.warn('$ES is deprecated.');
    return ($(filter) || document).getElements(selector);
};

