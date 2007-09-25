Class.empty = $empty;

Class.prototype.extend = function(properties){
	return new Class($extend(properties, {Extends: this}));
};