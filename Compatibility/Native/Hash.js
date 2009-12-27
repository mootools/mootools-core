Hash.implement({

	keys : function(){
		console.warn('1.1 > 1.2: Hash.keys is deprecated. Use Hash.getKeys');
		return this.getKeys();
	},

	values : function(){
		console.warn('1.1 > 1.2: Hash.values is deprecated. Use Hash.getValues');
		return this.getValues();
	},

	hasKey : function(item){
		console.warn('1.1 > 1.2: Hash.hasKey is deprecated. Use Hash.has');
		return this.has(item);
	},

	merge : function(properties){
		console.warn('1.1 > 1.2: Hash.merge is deprecated. Use Hash.combine');
		return this.combine(properties);
	},

	remove: function(key){
		console.warn('1.1 > 1.2: Hash.remove is deprecated. use Hash.erase');
		return this.erase(key);
	}

});

Object.toQueryString = Hash.toQueryString; // TODO

var Abstract = function(obj){
	console.warn('1.1 > 1.2: Abstract is deprecated. Use Hash');
	return new Hash(obj);
};