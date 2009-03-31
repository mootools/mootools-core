/*
Script: Table.js
	Lua-style tables for everyone

License:
	MIT-style license.
*/

var Table = new Native('Table', function(){
	this.table = {};
});

(function(){
	
	var index = 0, items = {'nil': null}, primitives = {'string': {}, 'number': {}};
	
	var valueOf = function(item){
		return (item == null) ? null : (item.valueOf) ? item.valueOf() : item;
	};

	var uidOf = function(item){
		var type = typeOf((item = valueOf(item)));
		if (type == 'nil') return 'nil';
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

		each: Array.prototype.each,
		
		length: function(){
			var length = 0;
			for (var uid in this.table) length++;
			return length;
		}

	});
	
})();
