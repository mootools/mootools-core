/*
Script: Table.js
	Lua-style tables for everyone

License:
	MIT-style license.
*/



var Table = new Native('Table', function(){
	this.table = {};
});

Table.implement({
	
	set: function(key, value){
		this.table[UID.uidOf(key)] = value;
		return this;
	},
	
	get: function(key){
		var value = this.table[UID.uidOf(key)];
		return (value != null) ? value : null;
	},
	
	erase: function(key){
		var uid = UID.uidOf(key), value = this.table[uid];
		delete this.table[uid];
		return value;
	},
	
	forEach: function(fn, bind){
		for (var uid in this.table) fn.call(bind, this.table[uid], UID.itemOf(uid), this);
	},
	
	length: function(){
		var length = 0;
		for (var uid in this.table) length++;
		return length;
	},
	
	each: Array.prototype.each

});
