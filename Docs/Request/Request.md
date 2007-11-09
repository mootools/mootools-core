Class: XHR {#XHR}
=================

An XMLHttpRequest Wrapper.

### Implements:

[Chain](/Class/Class.Extras#Chain), [Events](/Class/Class.Extras#Events), [Options](/Class/Class.Extras#Options)

### Syntax:

	var myXHR = new XHR([url[, options]]);

### Arguments:

1. url     - (string, optional) The URL pointing to the server-side script.
2. options - (object, optional) See below.

###	Options:

* method     - (string: defaults to 'post') The HTTP method for the request, can be either 'post' or 'get'.
* data       - (string: defaults to '') The default data for <XHR.send>, used when no data is given.
* async      - (boolean: defaults to true) If set to false, the requests will be synchronous and freeze the browser during request.
* encoding   - (string: defaults to "utf-8") The encoding to be set in the request header.
* autoCancel - (boolean: defaults to false) When set to true, automatically cancels the already running request if another one is sent. Otherwise, ignores any new calls while a request is in progress.
* headers    - (object) An object to use in order to set the request headers.
* isSuccess  - (function) Overrides the built-in isSuccess function.

XHR Events: events {#XHR:events}
--------------------------------

### onRequest

(function) Function to execute when the XHR request is fired.

#### Signature:

	onRequest(instance)

#### Arguments:

1. instance - (XHR) The transport instance.

### onSuccess

(function) Function to execute when the XHR request completes.

#### Signature:

	onSuccess(reponseText, responseXML)

#### Arguments:

1. responseText - (string) The returned text from the request.
2. responseXML  - (mixed) The response XML from the request.

### onFailure

(function) Function to execute when the request failes (error status code).

#### Signature:

	onFailure(instance)

#### Arguments:

instance - (XHR) The transport instance.

### onException

(function) Function to execute when setting a request header fails.

#### Signature:

	onException(headerName, value)

#### Arguments:

1. headerName - (string) The name of the failing header.
2. value      - (string) The value of the failing header.

###	onCancel

(function) Function to execute when a request has been cancelled.

#### Signature:

	onCancel()

### Properties:

* running  - (boolean) True if the request is running.
* response - (object) Object with text and xml as keys. You can access this property in the onSuccess event.

### Returns:

* (object) A new XHR instance.

### Example:

	var myXHR = new XHR({method: 'get', url: 'http://site.com/requestHandler.php'}).send('name=john&lastname=dorian');

### See Also:

<http://en.wikipedia.org/wiki/XMLHttpRequest>

XHR Method: setHeader {#XHR:setHeader}
--------------------------------------

Add or modify a header for the request. It will not override headers from the options.

###	Syntax:

	myXHR.setHeader(name, value);

###	Arguments:

1. name  - (string) The name for the header.
2. value - (string) The value to be assigned.

###	Returns:

* (object) This XHR instance.

###	Example:

	var myXHR = new XHR(url, {method: 'get', headers: {'X-Request': 'JSON'}});
	myXHR.setHeader('Last-Modified','Sat, 1 Jan 2005 05:00:00 GMT');

XHR Method: getHeader {#XHR:getHeader}
--------------------------------------

Returns the given response header or null if not found.

###	Syntax:

	myXHR.getHeader(name);

###	Arguments:

1. name - (string) The name of the header to retrieve the value of.

### Returns:

* (string) The value of the retrieved header.

### Example:

	var myXHR = new XHR(url, {method: 'get', headers: {'X-Request': 'JSON'}});
	var headers = myXHR.getHeader('X-Request'); // returns 'JSON'

XHR Method: send {#XHR:send}
----------------------------

Opens the XHR connection and sends the provided data.

###	Syntax:

	myXHR.send([data]);

###	Arguments:

1. data - (string, optional) The request data as query string.

###	Returns:

* (object) This XHR instance.

###	Examples:

	var myXHR = new XHR({url: 'http://localhost/some_url'}).send("save=username&name=John");

XHR Method: cancel {#XHR:cancel}
--------------------------------

Cancels the currently running request, if any.

###	Syntax:

	myRequest.cancel();

###	Returns:

* (object) This XHR instance.

###	Example:

	var myXHR = new XHR({method: 'get'}).send('some=data');
	myXHR.cancel();

Element Setter,Getter and Method {#Element}
===========================================

Element Setter: send {#Element:Setter:send}
-------------------------------------------

Sets a default Ajax instance for an element (possibly a form!)

### Syntax:

	el.set('send'[, options]);

### Arguments:

1. options - (object) the Ajax options.

### Returns:

* (element) this element

### Example:

	myForm.set('send', {method: 'get'});
	myForm.send(); //form sent!

Element Getter: send {#Element:send}
------------------------------------

Gets the previously setted Ajax instance or a new one with default options

### Syntax:

	el.get('send'[, options]);

### Arguments:

1. options - (object, optional) the Ajax options. if passed in will generate a new instance.

### Returns:

* (object) the Ajax instance

### Example:

	el.get('send', {method: 'get'});
	el.send();

	el.get('send'); //the Ajax instance


Element Method: send {#Element:send}
------------------------------------

Sends a form with an Ajax request.

### Syntax:

	myElement.send([options]);

### Arguments:

1. options - (object, optional) Options object for the [Ajax](/Request/Request.HTML) request.

### Returns:

* (element) This Element.

### Example:

##### HTML

	<form id="myForm" action="submit.php">
		<p>
			<input name="email" value="bob@bob.com">
			<input name="zipCode" value="90210">
		</p>
	</form>

##### Javascript

	$('myForm').send();

### Note:

* The URL is taken from the action attribute, as well as the method, which defaults to post if not found.