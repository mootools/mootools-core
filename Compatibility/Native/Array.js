Array.implement({

    copy: function(start, length){
		console.warn('Array.copy is deprecated. Use Array.splice');
        return $A(this, start, length);
    },

	remove : function(item){
		console.warn('Array.remove is deprecated. Use Array.erase');
		return this.erase(item);
	},
	
	merge : function(array){
		console.warn('Array.merge is deprecated. Use Array.combine');
		return this.combine(array);
	}

});
