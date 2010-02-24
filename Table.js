/*
---

name: Table
description: LUA-Style table implementation.
provides: Table

...
*/

var Table = function(){
	this.keys = [];
	this.values = [];
	this.length = 0;
};

Table.prototype = {

	set: function(key, value){
		var index = this.keys.indexOf(key);
		if (index == -1){
			var length = this.keys.length;
			this.keys[length] = key;
			this.values[length] = value;
			this.length++;
		} else {
			this.values[index] = value;
		}
		return this;
	},

	get: function(key){
		var index = this.keys.indexOf(key);
		return (index == -1) ? null : this.values[index];
	},

	erase: function(key){
		var index = this.keys.indexOf(key);
		if (index != -1){
			this.length--;
			this.keys.splice(index, 1);
			return this.values.splice(index, 1)[0];
		}
		return null;
	},

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this.keys[i], this.values[i], this);
	}

};

Table.prototype.each = Table.prototype.forEach;
