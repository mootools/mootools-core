/*
Script: Cookie.js
	Class for creating, loading, and saving browser Cookies.

License:
	MIT-style license.

Credits:
	Based on the functions by Peter-Paul Koch (http://quirksmode.org).
*/

var Cookie = new Class({

	Implements: Options,

	Options: {
		path: null,
		domain: null,
		duration: null,
		secure: null,
		document: document
	},

	initialize: function(key, options){
		this.key = key;
		this.setOptions(options);
	},

	write: function(value){
		value = encodeURIComponent(value);
		if (this.getOption('domain')) value += '; domain=' + this.getOption('domain');
		if (this.getOption('path')) value += '; path=' + this.getOption('path');
		if (this.getOption('duration')){
			var date = new Date();
			date.setTime(date.getTime() + this.getOption('duration') * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (this.getOption('secure')) value += '; secure';
		this.getOption('document').cookie = this.key + '=' + value;
		return this;
	},

	read: function(){
		var value = this.getOption('document').cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},

	dispose: function(){
		new Cookie(this.key, Object.merge(this.getOptions(), {duration: -1})).write('');
		return this;
	}

});

Cookie.write = function(key, value, options){
	return new Cookie(key, options).write(value);
};

Cookie.read = function(key){
	return new Cookie(key).read();
};

Cookie.dispose = function(key, options){
	return new Cookie(key, options).dispose();
};
