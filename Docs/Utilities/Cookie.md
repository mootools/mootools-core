# Object: Cookie {#Cookie}

Reads and writes a cookie.

## Options: {#Cookie-options}

* domain   - (*string*: defaults to false) The domain the cookie belongs to.
* path     - (*string*: defaults to '/') The path the cookie belongs to.
* duration - (*number*: defaults to false) The duration of the cookie (in days) before it expires. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed.
* secure   - (*boolean*: defaults to false) Stored cookie information can be accessed only from a secure environment.

## Cookie Method: write {#Cookie:write}

Writes a cookie in the browser.

### Syntax:

	var myCookie = Cookie.write(key, value[, options]);

### Arguments:

1. key     - (*string*) The key (or name) of the cookie.
2. value   - (*string*) The value to set. Cannot contain semicolons.
3. options - (*mixed*, optional) See [Cookie][].

### Returns:

* (*object*) An object with the options, the key and the value. You can give it as first parameter to [Cookie.dispose][].

### Examples:

Saves the cookie for the duration of the session:

	var myCookie = Cookie.write('username', 'JackBauer');

Saves the cookie for a day:

	var myCookie = Cookie.write('username', 'JackBauer', {duration: 1});

### Note:

In order to share the cookie with pages located in a different path, the [Cookie.options.domain][Cookie.options] value must be set.

## Cookie Method: read {#Cookie:read}

Reads the value of a cookie.

### Syntax:

	var myCookie = Cookie.read(name);

### Arguments:

1. name - (*string*) The name of the cookie to read.

### Returns:

* (*mixed*) The cookie string value, or null if not found.

### Example:

	Cookie.read('username');

## Cookie Method: dispose {#Cookie:dispose}

Removes a cookie from the browser.

### Syntax:

	var oldCookie = Cookie.dispose(name[, options]);

### Arguments:

1. name - (*string*) The name of the cookie to remove or a previously saved Cookie instance.
2. options - (*object*, optional) See [Cookie][].

### Examples:

Remove a Cookie:

	Cookie.dispose('username'); // Bye-bye JackBauer!

Creating a cookie and removing it right away:

	var myCookie = Cookie.write('username', 'JackBauer', {domain: 'mootools.net'});
	if (Cookie.read('username') == 'JackBauer') { myCookie.dispose(); }

### Credits:

- Based on the functions by Peter-Paul Koch of [QuirksMode][].

[Cookie.dispose]: #Cookie:dispose
[Cookie.options]: #Cookie-options
[Cookie]: #Cookie
[QuirksMode]: http://www.quirksmode.org
