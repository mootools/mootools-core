/*
Script: Hash.Cookie.js
	Class for creating, reading, and deleting Cookies in JSON format.

License:
	MIT-style license.
*/

Hash.Cookie = new Class({

	Implements: Options,

	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.name = name;
		this.setOptions(options);
		this.load();
	},

	save: function(){
		var str = JSON.encode(this.hash);
		if (str.length > 4096) return false; //cookie would be truncated!
		if (str.length == 2) Cookie.remove(this.name, this.options);
		else Cookie.set(this.name, str, this.options);
		return true;
	},

	load: function(){
		this.hash = new Hash(JSON.decode(Cookie.get(this.name), true));
		return this;
	}

});

(function(){
	var methods = {};
	Hash.getKeys(Hash.prototype).each(function(method){
		methods[method] = function(){
			var value = Hash.prototype[method].apply(this.hash, arguments);
			if (this.options.autoSave) this.save();
			return value;
		};
	});
	Hash.Cookie.implement(methods);
})();
