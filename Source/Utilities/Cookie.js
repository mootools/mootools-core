/*
Script: Cookie.js
	A Cookie reader/creator.

Credits:
	Based on the functions by Peter-Paul Koch (http://quirksmode.org).
*/

/*
Hash: Cookie
	Hash for creating, accessing, and removing cookies.

Properties:
	options - (object) An object to set the default behaviour of Cookie and its derivatives.

	options (continued):
		path     - (string: defaults to false) The path the Cookie belongs to.
		domain   - (string: defaults to false) The domain the Cookie belongs to.
		duration - (number: defaults to false) The duration of the Cookie before it expires, in days. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed.
		secure   - (boolean: defaults to false) Stored cookie information can be accessed only from a secure environment.

Note:
	- In order to share the Cookie with pages located in a different path, the <Cookie.options.domain> value must be set.
*/

var Cookie = new Hash({

	options: {
		path: false,
		domain: false,
		duration: false,
		secure: false
	},

	/*
	Method: set
		Sets a cookie in the browser.

	Syntax:
		>var myCookie = Cookie.set(key, value[, options]);

	Arguments:
		key     - (string) The key (or name) of the cookie.
		value   - (string) The value to set.  Cannot contain semicolons.
		options - (mixed, optional) See <Cookie>.

	Returns:
		(object) An object with the options, the key and the value. You can give it as first parameter to Cookie.remove.

	Examples:
		Saves the Cookie for the Duration of the Session:
		[javascript]
			var myCookie = Cookie.set('username', 'Harald');
		[/javascript]

		Saves the Cookie for a Day:
		[javavascript]
			var myCookie  = Cookie.set('username', 'JackBauer', {duration: 1});
		[/javascript]
	*/

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

	/*
	Method: get
		Gets the value of a Cookie.

	Syntax:
		>var myCookie = Cookie.get(key);

	Arguments:
		key - (string) The name of the Cookie to retrieve.

	Returns:
		(mixed) The cookie string value, or false if not found.

	Example:
		[javascript]
			Cookie.get("username");
		[/javascript]
	*/

	get: function(key){
		var value = document.cookie.match('(?:^|;)\\s*' + key.escapeRegExp() + '=([^;]*)');
		return value ? decodeURIComponent(value[1]) : false;
	},

	/*
	Method: remove
		Removes a cookie from the browser.

	Syntax:
		>var oldCookie = Cookie.remove(cookie[, options]);

	Arguments:
		cookie  - (string) The name of the cookie to remove or a previously saved Cookie instance.
		options - (object, optional) See <Cookie>.

	Examples:
		Remove a Cookie:
		[javascript]
			Cookie.remove('username'); //Bye-bye JackBauer! Seeya in 24 Hours.
		[/javascript]

		Creating a Cookie and Removing it Right Away:
		[javascript]
			//Cookie.set returns an object with all values need to remove the cookie.
			var myCookie = Cookie.set('username', 'Aaron', {domain: 'mootools.net'});
			if (Cookie.get('username') == 'Aaron') { Cookie.remove(myCookie); }
		[/javascript]
	*/

	remove: function(cookie, options){
		if ($type(cookie) == 'object') this.set(cookie.key, '', $merge(cookie, {duration: -1}));
		else this.set(cookie, '', $merge(options, {duration: -1}));
	}

});
