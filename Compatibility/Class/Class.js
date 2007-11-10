Class.empty = $empty;

Class.prototype.extend = function(properties){
	properties.Extends = this;
	return new Class(properties);
};