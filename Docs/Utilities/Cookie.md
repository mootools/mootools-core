Class: Cookie {#Cookie}
=======================

A Cookie reader/creator.

### Credits:

Based on the functions by Peter-Paul Koch (http://quirksmode.org).

### Hash: Cookie

Hash for creating, accessing, and removing cookies.

### Properties:

1. options - (object) An object to set the default behaviour of Cookie and its derivatives.

###	Options:

* domain   - (string: defaults to false) The domain the Cookie belongs to.
* path     - (string: defaults to false) The path the Cookie belongs to.
* duration - (number: defaults to false) The duration of the Cookie before it expires, in days. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed.
* secure   - (boolean: defaults to false) Stored cookie information can be accessed only from a secure environment.

###Note:

In order to share the Cookie with pages located in a different path, the <Cookie.options.domain> value must be set.

Cookie Method: set {#Cookie:set}
--------------------------------

Sets a cookie in the browser.

###	Syntax:

	var myCookie = Cookie.set(key, value[, options]);

###	Arguments:

1. key     - (string) The key (or name) of the cookie.
2. value   - (string) The value to set.  Cannot contain semicolons.
3. options - (mixed, optional) See <Cookie>.

###	Returns:

* (object) An object with the options, the key and the value. You can give it as first parameter to Cookie.remove.

###	Examples:

**Saves the Cookie for the Duration of the Session:**

	var myCookie = Cookie.set('username', 'Harald');

**Saves the Cookie for a Day:**

	var myCookie  = Cookie.set('username', 'JackBauer', {duration: 1});

Cookie Method: get {#Cookie:get}
--------------------------------

Gets the value of a Cookie.

###	Syntax:

	var myCookie = Cookie.get(key);

###	Arguments:

1. key - (string) The name of the Cookie to retrieve.

###	Returns:

* (mixed) The cookie string value, or false if not found.

###	Example:

	Cookie.get("username");

Cookie Method: remove {#Cookie:remove}
--------------------------------------

Removes a cookie from the browser.

###	Syntax:

	var oldCookie = Cookie.remove(cookie[, options]);

###	Arguments:

1. cookie  - (string) The name of the cookie to remove or a previously saved Cookie instance.
2. options - (object, optional) See <Cookie>.

###	Examples:

**Remove a Cookie:**

	Cookie.remove('username'); //Bye-bye JackBauer! Seeya in 24 Hours.

**Creating a Cookie and Removing it Right Away:**

	//Cookie.set returns an object with all values need to remove the cookie.

	var myCookie = Cookie.set('username', 'Aaron', {domain: 'mootools.net'});
	if (Cookie.get('username') == 'Aaron') { Cookie.remove(myCookie); }