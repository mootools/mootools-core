Object: Cookie {#Cookie}
========================

Sets and accesses cookies.

### Credits:

- Based on the functions by Peter-Paul Koch [QuirksMode][].

### Options: {#Cookie-options}

* domain   - (*string*: defaults to false) The domain the Cookie belongs to.
* path     - (*string*: defaults to false) The path the Cookie belongs to.
* duration - (*number*: defaults to false) The duration of the Cookie before it expires, in days. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed.
* secure   - (*boolean*: defaults to false) Stored cookie information can be accessed only from a secure environment.

### Notes:

- In order to share the Cookie with pages located in a different path, the [Cookie.options.domain][] value must be set.



Cookie Method: write {#Cookie:write}
--------------------------------

Writes a cookie in the browser.

### Syntax:

	var myCookie = Cookie.write(key, value[, options]);

### Arguments:

1. key     - (*string*) The key (or name) of the cookie.
2. value   - (*string*) The value to set. Cannot contain semicolons.
3. options - (*mixed*, optional) See [Cookie][].

### Returns:

* (*object*) An object with the options, the key and the value. You can give it as first parameter to Cookie.remove.

### Examples:

Saves the Cookie for the Duration of the Session:

	var myCookie = Cookie.write('username', 'Harald');

Saves the Cookie for a Day:

	var myCookie  = Cookie.write('username', 'JackBauer', {duration: 1});



Cookie Method: read {#Cookie:read}
--------------------------------

Reads the value of a Cookie.

### Syntax:

	var myCookie = Cookie.read(name);

### Arguments:

1. name - (*string*) The name of the Cookie to retrieve.

### Returns:

* (*mixed*) The cookie string value, or null if not found.

### Examples:

	Cookie.read("username");



Cookie Method: dispose {#Cookie:dispose}
--------------------------------------

Removes a cookie from the browser.

### Syntax:

	var oldCookie = Cookie.dispose(cookie[, options]);

### Arguments:

1. name  - (*string*) The name of the cookie to remove or a previously saved Cookie instance.
2. options - (*object*, optional) See [Cookie][].

### Examples:

Remove a Cookie:

	Cookie.dispose('username'); //Bye-bye JackBauer! Seeya in 24 Hours.

Creating a Cookie and Removing it Right Away:

	var myCookie = Cookie.write('username', 'Aaron', {domain: 'mootools.net'});
	if (Cookie.read('username') == 'Aaron') { Cookie.dispose(myCookie); }



[Cookie]: #Cookie
[Cookie.options]: #Cookie-options
[Cookie.options.domain]: #Cookie-options
[QuirksMode]: http://www.quirksmode.org