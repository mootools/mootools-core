/*
---
name: Events
description: Events
requires: [Type, Array, Function, Class, Table]
provides: Events
...
*/

(function(){
	
var Events = this.Events = new Class({

	listen: function(type, fn, check){
		if (!this.$events) this.$events = {};

		if (!this.$events[type]) this.$events[type] = new Table;
		var events = this.$events[type];
		if (events.get(fn)) return this;

		var bound = fn.bind(this);
		
		events.set(fn, bound);

		return this;
	}.overloadSetter(),

	ignore: function(type, fn){
		if (!this.$events) return this;

		var events = this.$events[type];
		if (!events) return this;
		
		if (type == null){ //ignore all
			for (var ty in this.$events) this.ignore(ty);
		} else if (fn == null){ // ignore every of type
			events.each(function(fn, bound){
				this.ignore(type, fn);
			}, this);
		} else { // ignore one
			events.unset(fn);
		}

		return this;
	}.overloadSetter(),

	fire: function(type){
		if (!this.$events) return this;
		var events = this.$events[type];
		if (!events) return this;

		var args = Array.slice(arguments, 1);

		events.each(function(fn, bound){
			fn.apply(this, args);
		}, this);

		return this;
	}

});

})();
