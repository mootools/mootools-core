Array.implement({

	copy: function(start, length){
		return $A(this, start, length);
	}

});

Array.alias({erase: 'remove', combine: 'merge'});