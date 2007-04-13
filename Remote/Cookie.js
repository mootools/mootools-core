/*
Script: Cookie.js
	A cookie reader/creator

Credits:
	based on the functions by Peter-Paul Koch (http://quirksmode.org)
*/

/*
Class: Cookie
	Class for creating, getting, and removing cookies.
*/

var Cookie = new Abstract({

	options: {
		domain: false,
		path: false,
		duration: false,
		secure: false
	},

	/*
	Property: set
		Sets a cookie in the browser.

	Arguments:
		key - the key (name) for the cookie
		value - the value to set, cannot contain semicolons
		options - an object representing the Cookie options. See Options below. Default values are stored in Cookie.options.

	Options:
		domain - the domain the Cookie belongs to. If you want to share the cookie with pages located on a different domain, you have to set this value. Defaults to the current domain.
		path - the path the Cookie belongs to. If you want to share the cookie with pages located in a different path, you have to set this value, for example to "/" to share the cookie with all pages on the domain. Defaults to the current path.
		duration - the duration of the Cookie before it expires, in seconds.
					If set to false or 0, the cookie will be a session cookie that expires when the browser is closed. This is default.
		secure - Stored cookie information can be accessed only from a secure environment.

	Example:
		>Cookie.set("username", "Aaron", {duration: {days: 5}}); //save this for 5 days
		>Cookie.set("username", "Harald", {duration: 3600}); //save this for 1 hour
		>Cookie.set("username", "JackBauer", {duration: false}); //session cookie

	*/

	set: function(key, value, options){
		options = $merge(this.options, options);
		value = encodeURIComponent(value);
		if (options.domain) value += '; domain=' + options.domain;
		if (options.path) value += '; path=' + options.path;
		if (options.duration){
			var date = new Date();
			date.setTime(date.getTime() + options.duration / 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (options.secure) value += '; secure';
		document.cookie = key + '=' + value;
		return $extend(options, {'key': key, 'value': value});
	},

	/*
	Property: get
		Gets the value of a cookie.

	Arguments:
		key - the name of the cookie you wish to retrieve.

	Returns:
		The cookie string value, or false if not found.

	Example:
		>Cookie.get("username") //returns Aaron
	*/

	get: function(key){
		var value = document.cookie.match('(?:^|;)\\s*' + key.escapeRegExp() + '=([^;]*)');
		return value ? decodeURIComponent(value[1]) : false;
	},

	/*
	Property: remove
		Removes a cookie from the browser.

	Arguments:
		cookie - the name of the cookie to remove or a previous cookie (for domains)
		options - optional. you can also pass the domain and path here. Same as options in <Cookie.set>

	Examples:
		>Cookie.remove("username") //bye-bye Aaron
		>var myCookie = Cookie.set('user', 'jackbauer', {domain: 'mootools.net'});
		>Cookie.remove(myCookie);
	*/

	remove: function(cookie, options){
		if ($type(cookie) == 'object') this.set(cookie.key, '', $merge(cookie, {duration: -1}));
		else this.set(cookie, '', $merge(options, {duration: -1}));
	}

});