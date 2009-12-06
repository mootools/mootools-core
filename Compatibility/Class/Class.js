Class.empty = function(){ 
	console.warn('replace Class.empty with $empty');
	return $empty;
};

//legacy .extend support

Class.prototype.extend = function(properties){
	console.warn('Class.extend is deprecated. See class mutators.');
    properties.Extends = this;
    return new Class(properties);
};

