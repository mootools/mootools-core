/*
---
name: Storage
description: Storage
requires: Type
provides: Storage
...
*/

(function(global){

this.Storage = function(){
	
	if (this === global) return ['store', 'retrieve', 'dump'].pair(function(name){
		return function(){
			Object.append(this, new Storage);
			return this[name].apply(this, arguments);
		};
	});
	
	var storage = {};
	
	this.store = function(key, value){
		storage[key] = value;
	}.overloadSetter();
	
	this.retrieve = function(key, defaultValue){
		var value = storage[key];
		if (defaultValue != null && value == null) storage[key] = Function.from(defaultValue)();
		return storage[key];
	};

	this.dump = function(){
		delete storage[key];
	}.overloadGetter();
	
	return this;
	
};

})(this);
