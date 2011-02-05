/*
---
name: Store
description: Store
requires: [Type, String.uniqueID, Class]
provides: Store
...
*/

(function(){
	
var uid = String.uniqueID();

var storageOf = function(object){
	return object[uid] || (object[uid] = {});
};

var Store = this.Store = new Class({

	store: function(key, value){
		storageOf(this)[key] = value;
	}.overloadSetter(),

	retrieve: function(key, defaultValue){
		var storage = storageOf(this);
		var value = storage[key];
		if (defaultValue != null && value == null) storage[key] = Function.from(defaultValue).call(this);
		return storage[key];
	},

	dump: function(key){
		var storage = storageOf(this);
		var value = storage[key];
		delete storage[key];
		return value;
	}.overloadGetter()

});

})();
