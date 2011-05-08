/*
---
name: Class
description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.
requires: [Type, Array, String, Function, Number, Object, Accessor]
provides: Class
...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
	
	if (instanceOf(params, Function)) params = {'initialize': params};
	
	var newClass = function(){
		reset(this);
		if (newClass.$prototyping) return this;
		this.$caller = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.$caller = this.caller = null;
		return value;
	}.extend(this).hide();

	newClass.implement(params);
	
	newClass.$constructor = Class;
	newClass.prototype.$constructor = newClass;
	newClass.prototype.parent = parent;

	return newClass;

});

var parent = function(){
	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name, parent = this.$caller.$owner.parent;
	var previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
}.hide();

var reset = function(object){
	for (var key in object){
		var value = object[key];
		switch (typeOf(value)){
			case 'object':
				var F = function(){};
				F.prototype = value;
				var instance = new F;
				object[key] = reset(instance);
			break;
			case 'array': object[key] = value.clone(); break;
		}
	}
	return object;
};

var wrap = function(self, key, method){
	if (method.$origin) method = method.$origin;
	
	return function(){
		if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.$caller;
		this.caller = current; this.$caller = arguments.callee;
		var result = method.apply(this, arguments);
		this.$caller = current; this.caller = caller;
		return result;
	}.extend({$owner: self, $origin: method, $name: key});
};

Class.extend(new Accessor('Mutator'));

var implement = function(key, value, retainOwner){
	
	var mutator = Class.matchMutator(key) || Class.lookupMutator(key);
	
	if (mutator){
		value = mutator.call(this, value);
		if (value == null) return;
	}

	var hooks = this.$hooks;
	if (hooks) for (var i = 0, l = hooks.length; i < l; i++){
		if (typeOf(hooks[i]) == 'class') hooks[i].implement(key, value);
		else hooks[i].call(this, key, value);
	}

	if (typeOf(value) == 'function'){
		if (value.$hidden) return;
		this.prototype[key] = (retainOwner) ? value : wrap(this, key, value);
	} else {
		Object.merge(this.prototype, key, value);
	}
	
};

var implementClass = function(item){
	var instance = new item;
	for (var key in instance) implement.call(this, key, instance[key], true);
};

Class.implement('implement', function(a, b){
	
	switch (typeOf(a)){
		case 'string': implement.call(this, a, b); break;
		case 'class': implementClass.call(this, a); break;
		default: for (var p in a) implement.call(this, p, a[p]); break;
	}
	
	return this;
	
}).implement('mirror', function(hook){

	(this.$hooks || (this.$hooks = [])).push(hook);
	return this;

}).defineMutators({

	Extends: function(parent){
		this.parent = parent;
		parent.$prototyping = true;
		var proto = new parent;
		delete parent.$prototyping;
		this.prototype = proto;
	},

	Implements: function(items){
		Array.from(items).each(function(item){
			this.implement(item);
		}, this);
	}

}).defineMutator(/^protected\s(\w+)$/, function(fn, name){
	implement.call(this, name, fn.protect());
}).defineMutator(/^linked\s(\w+)$/, function(value, name){
	this.prototype[name] = value;
});

})();
