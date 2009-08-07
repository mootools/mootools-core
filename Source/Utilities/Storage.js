/*=
name: Storage
description: yo!
requires:
  - Array
  - Function
  - Number
  - String
  - Object
  - Table
=*/

this.Storage = function(){
	
	var storage = {};
	
	this.store = function(object){
		for (var key in object) storage[key] = object[key];
		return this;
	}.overload(Function.overloadPair);
	
	this.retrieve = function(object){
		var keys = [];
		for (var key in object){
			keys.push(key);
			var dflt = object[key], value = storage[key];
			if (dflt != null && value == null) storage[key] = Function.from(dflt)();
		}
		return Object.subset(storage, keys);
	}.overload(Function.overloadPair);

	this.dump = function(){
		return Object.subset(storage, arguments, true);
	}.overload(Function.overloadList);
	
	return this;
	
};
