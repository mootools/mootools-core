/*
---
name: Array
description: Array prototypes and generics.
requires: Type
provides: Array
...
*/

Array.implement({
	
	/* standard */

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	indexOf: function(item, from){
		for (var l = this.length, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},
	
	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	
	/* non standard */
	
	pair: function(fn, bind){
		var object = {};
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) object[this[i]] = fn.call(bind, this[i], i, this);
		}
		return object;
	},
	
	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},
	
	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},
	
	invoke: function(name){
		var args = Array.slice(arguments, 1), results = [];
		for (var i = 0, j = this.length; i < j; i++){
			var item = this[i];
			results.push(item[name].apply(item, args));
		}
		return results;
	},
	
	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	last: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	random: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--; i){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},
	
	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var ti = this[i], t = typeOf(this[i]);
			if (t == 'null') continue;
			array = array.concat((t == 'array' || t == 'collection' || t == 'arguments' || instanceOf(ti, Array)) ? Array.flatten(ti) : ti);
		}
		return array;
	},

	item: function(at){
		if (at < 0) at = (at % this.length) + this.length;
		return (at < 0 || at >= this.length || this[at] == null) ? null : this[at];
	}

});
