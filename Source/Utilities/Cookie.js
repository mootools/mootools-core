/*
Script: Cookie.js
	Class for creating, loading, and saving browser Cookies.

License:
	MIT-style license.

Credits:
	Based on the functions by Peter-Paul Koch (http://quirksmode.org).
*/

var Cookie = {

	options: {
		path: false,
		domain: false,
		duration: false,
		secure: false
	},

	set: function(key, value, options){
		options = $merge(this.options, options);
		value = encodeURIComponent(value);
		if (options.domain) value += '; domain=' + options.domain;
		if (options.path) value += '; path=' + options.path;
		if (options.duration){
			var date = new Date();
			date.setTime(date.getTime() + options.duration * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (options.secure) value += '; secure';
		document.cookie = key + '=' + value;
		return $extend(options, {'key': key, 'value': value});
	},

	get: function(key){
		var value = document.cookie.match('(?:^|;)\\s*' + key.escapeRegExp() + '=([^;]*)');
		return value ? decodeURIComponent(value[1]) : false;
	},

	remove: function(cookie, options){
		if ($type(cookie) == 'object') this.set(cookie.key, '', $merge(cookie, {duration: -1}));
		else this.set(cookie, '', $merge(options, {duration: -1}));
	}

};
