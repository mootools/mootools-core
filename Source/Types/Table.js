/*=
name: Table
description: LUA-Style table implementation.
requires: Core
=*/

(function(){

this.Table = new Type('Table', function(){
	this.table = {};
});
	
var index = 0, items = {'null': null}, primitives = {'string': {}, 'number': {}};

var valueOf = function(item){
	return (item == null) ? null : (item.valueOf) ? item.valueOf() : item;
};

var uidOf = function(item){
	var type = typeOf((item = valueOf(item)));
	if (type == 'null') return 'null';
	if ((type = primitives[type])) item = type[item] || (type[item] = {valueOf: Function.from(item)});
	var uid = item.uid || (item.uid = (index++).toString(16));
	if (!items[uid]) items[uid] = item;
	return uid;
};

var itemOf = function(uid){
	return valueOf(items[uid]);
};

Table.implement({

	set: function(key, value){
		this.table[uidOf(key)] = value;
		return this;
	},

	get: function(key){
		var value = this.table[uidOf(key)];
		return nil(value);
	},

	erase: function(key){
		var uid = uidOf(key), value = this.table[uid];
		delete this.table[uid];
		return nil(value);
	},

	forEach: function(fn, bind){
		for (var uid in this.table) fn.call(bind, this.table[uid], itemOf(uid), this);
	},
	
	length: function(){
		var length = 0;
		for (var uid in this.table) length++;
		return length;
	}

});

Table.alias('each', 'forEach');
	
})();
