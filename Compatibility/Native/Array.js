Array.implement({

    copy: function(start, length){
		console.warn('1.1 > 1.2: Array.copy is deprecated. Use Array.slice');
        return $A(this, start, length);
    },

	remove : function(item){
		console.warn('1.1 > 1.2: Array.remove is deprecated. Use Array.erase');
		return this.erase(item);
	},
	
	merge : function(array){
		console.warn('1.1 > 1.2: Array.merge is deprecated. Use Array.combine');
		return this.combine(array);
	}

});
