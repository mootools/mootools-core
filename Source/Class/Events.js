/*
---
name: Events
description: Events
requires: [Type, Array, Function, Class, Table]
provides: Events
...
*/

(function(){

var uid = '$' + String.uniqueID();

this.Events = new Class({

	listen: function(type, fn){
		if (!this[uid]) this[uid] = {};

		if (!this[uid][type]) this[uid][type] = new Table;
		var events = this[uid][type];
		if (events.get(fn)) return this;

		var bound = fn.bind(this);
		
		events.set(fn, bound);

		return this;
	}.overloadSetter(),

	ignore: function(type, fn){
		if (!this[uid]) return this;

		var events = this[uid][type];
		if (!events) return this;
		
		if (type == null){ //ignore all
			for (var ty in this[uid]) this.ignore(ty);
		} else if (fn == null){ // ignore every of type
			events.each(function(fn){
				this.ignore(type, fn);
			}, this);
		} else { // ignore one
			events.unset(fn);
		}

		return this;
	}.overloadSetter(),

	fire: function(type){
		if (!this[uid]) return this;
		var events = this[uid][type];
		if (!events) return this;

		var args = Array.slice(arguments, 1);

		events.each(function(fn, bound){
			fn.apply(this, args);
		}, this);

		return this;
	}

});

})();
