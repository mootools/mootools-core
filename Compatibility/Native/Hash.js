
Hash.implement({
	
	keys : function(){
		console.warn('Hash.keys is deprecated. Use Hash.getKeys');
		return this.getKeys();
	},
	
	values : function(){
		console.warn('Hash.values is deprecated. Use Hash.getValues');
		return this.getValues();
	},
	
	hasKey : function(item){
		console.warn('Hash.hasKey is deprecated. Use Hash.has');
		return this.has(item);
	},
	
	merge : function(properties){
		console.warn('Hash.merge is deprecated. Use Hash.combine');
		return this.combine(properties);
	},
	
    remove: function(key){
		console.warn('Hash.remove is deprecated. use Hash.erase');
        return this.erase(key)
    }
});

Object.toQueryString = Hash.toQueryString; // TODO

var Abstract = new Class({
		initialize : function(obj){
			console.warn('Abstract is deprecated. Use Hash');
			return new Hash(obj);
		}
});


