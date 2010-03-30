/*
---
name: Storage
description: Storage
requires: Type
provides: Storage
...
*/

this.Storage = function(){
	
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
	}.overloadSetter();
	
	return this;
	
};
