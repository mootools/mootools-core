Class.empty = $empty;

Class.implement({

	extend: function(properties){
		properties.Extends = this;
		return new Class(properties);
	}

});