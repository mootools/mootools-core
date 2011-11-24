Class: Request {#Request}
=========================

An XMLHttpRequest Wrapper.

### Implements:

[Chain][], [Events][], [Options][]

### Syntax:

	var myRequest = new Request([options]);

### Arguments:

2. options - (*object*, optional) See below.

### Options:

* url        - (*string*: defaults to *null*) The URL to request. (Note, this can also be an instance of [URI][])
* data       - (*mixed*: defaults to '') The default data for [Request:send][], used when no data is given. Can be an Element, Object or String. If an Object is passed the [Object:toQueryString][] method will be used to convert the object to a string. If an Element is passed the [Element:toQueryString][] method will be used to convert the Element to a string.
* format     - (*string*: defaults to '') If passed, an additional key 'format' will be appended to 'data' with the passed value. e.g. '&format=json'
* link       - (*string*: defaults to 'ignore') Can be 'ignore', 'cancel' and 'chain'.
	* 'ignore' - Any calls made to start while the request is running will be ignored. (Synonymous with 'wait': true from 1.11)
	* 'cancel' - Any calls made to start while the request is running will take precedence over the currently running request. The new request will start immediately, canceling the one that is currently running. (Synonymous with 'wait': false from 1.11)
	* 'chain'  - Any calls made to start while the request is running will be chained up, and will take place as soon as the current request has finished, one after another.
* method     - (*string*: defaults to 'post') The HTTP method for the request, can be either 'post' or 'get'.
* emulation  - (*boolean*: defaults to *true*) If set to true, other methods than 'post' or 'get' are appended as post-data named '\_method' (as used in rails)
* async      - (*boolean*: defaults to *true*) If set to false, the requests will be synchronous and freeze the browser during request.
* timeout    - (*integer*: defaults to 0) In conjunction with `onTimeout` event, it determines the amount of milliseconds before considering a connection timed out. (It's suggested to not use timeout with big files and only when knowing what's expected.)
* headers    - (*object*) An object to use in order to set the request headers.
* urlEncoded - (*boolean*: defaults to *true*) If set to true, the content-type header is set to www-form-urlencoded + encoding
* encoding   - (*string*: defaults to 'utf-8') The encoding to be set in the request header.
* noCache    - (*boolean*; defaults to *false*) If *true*, appends a unique *noCache* value to the request to prevent caching. (IE has a bad habit of caching ajax request values. Including this script and setting the *noCache* value to true will prevent it from caching. The server should ignore the *noCache* value.)
* isSuccess  - (*function*) Overrides the built-in isSuccess function.
* evalScripts  - (*boolean*: defaults to *false*) If set to true, `script` tags inside the response will be evaluated.
* evalResponse - (*boolean*: defaults to *false*) If set to true, the entire response will be evaluated. Responses with javascript content-type will be evaluated automatically.
* user       - (*string*: defaults to *null*) When username is set the Request will open with credentials and try to authenticate.
* password   - (*string*: defaults to *null*) You can use this option together with the `user` option to set authentication credentials when necessary. Note that the password will be passed as plain text and is therefore readable by anyone through the source code. It is therefore encouraged to use this option carefully

### Events:

#### request

Fired when the Request is sent.

##### Signature:

	onRequest()

#### loadstart

Fired when the Request loaded, right before any progress starts. (This is limited to Browsers that support the event. At this time: Gecko and WebKit).

##### Signature:

	onLoadstart(event, xhr)

##### Arguments:

1. event - (Event) The loadstart event.
2. xhr - (XMLHttpRequest) The transport instance.

#### progress

Fired when the Request is making progresses in the download or upload. (This is limited to Browsers that support the event. At this time: Gecko and WebKit).

##### Signature:

	onProgress(event, xhr)

##### Arguments:

1. event - (Event) The progress event, containing currently downloaded bytes and total bytes.
2. xhr - (XMLHttpRequest) The transport instance.

### Example:

	var myRequest = new Request({
		url: 'image.jpg',
		onProgress: function(event, xhr){
			var loaded = event.loaded, total = event.total;

			console.log(parseInt(loaded / total * 100, 10));
		}
	});

	myRequest.send();

### See Also:

 - [MDC: nsIDOMProgressEvent](https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDOMProgressEvent)

#### complete

Fired when the Request is completed.

##### Signature:

	onComplete()

#### cancel

Fired when a request has been cancelled.

##### Signature:

	onCancel()

#### success

Fired when the Request is completed successfully.

##### Signature:

	onSuccess(responseText, responseXML)

##### Arguments:

1. responseText - (*string*) The returned text from the request.
2. responseXML  - (*mixed*) The response XML from the request.

#### failure

Fired when the request failed (error status code).

##### Signature:

	onFailure(xhr)

##### Arguments:

xhr - (XMLHttpRequest) The transport instance.

#### exception

Fired when setting a request header fails.

##### Signature:

	onException(headerName, value)

##### Arguments:

1. headerName - (*string*) The name of the failing header.
2. value      - (*string*) The value of the failing header.

### Properties:

* response - (*object*) Object with text and XML as keys. You can access this property in the 'success' event.

### Returns:

* (*object*) A new Request instance.

### Example:

	var myRequest = new Request({method: 'get', url: 'requestHandler.php'});
	myRequest.send('name=john&lastname=dorian');

### See Also:

 - [Wikipedia: XMLHttpRequest](http://en.wikipedia.org/wiki/XMLHttpRequest)

#### timeout

Fired when a request doesn't change state for `options.timeout` milliseconds.

##### Signature:

	onTimeout()


### Example:

This example fetches some text with Request. When the user clicks the link, the returned text by the server is used to update
the element's text. It uses the `onRequest`, `onSuccess` and `onFailure` events to inform the user about the current state of
the request. The `method` option is set to `get` because we get some text instead of posting it to the server. It gets the
data-userid attribute of the clicked link, which will be used for the querystring.

	var myElement = document.id('myElement');

	var myRequest = new Request({
		url: 'getMyText.php',
		method: 'get',
		onRequest: function(){
			myElement.set('text', 'loading...');
		},
		onSuccess: function(responseText){
			myElement.set('text', responseText);
		},
		onFailure: function(){
			myElement.set('text', 'Sorry, your request failed :(');
		}
	});

	document.id('myLink').addEvent('click', function(event){
		event.stop();
		myRequest.send('userid=' + this.get('data-userid'));
	});



Request Method: setHeader {#Request:setHeader}
--------------------------------------

Add or modify a header for the request. It will not override headers from the options.

### Syntax:

	myRequest.setHeader(name, value);

### Arguments:

1. name  - (*string*) The name for the header.
2. value - (*string*) The value to be assigned.

### Returns:

* (*object*) This Request instance.

### Example:

	var myRequest = new Request({url: 'getData.php', method: 'get', headers: {'X-Request': 'JSON'}});
	myRequest.setHeader('Last-Modified', 'Sat, 1 Jan 2005 05:00:00 GMT');

Request Method: getHeader {#Request:getHeader}
--------------------------------------

Returns the given response header or null if not found.

### Syntax:

	myRequest.getHeader(name);

### Arguments:

1. name - (*string*) The name of the header to retrieve the value of.

### Returns:

* (*string*) The value of the retrieved header.
* (*null*) `null` if the header is not found.

### Example:

	var myRequest = new Request({url: 'getData.php', method: 'get', onSuccess: function(responseText, responseXML){
		alert(this.getHeader('Date')); // alerts the server date (for example, 'Thu, 26 Feb 2009 20:26:06 GMT')
	}});

Request Method: send {#Request:send}
----------------------------

Opens the Request connection and sends the provided data with the specified options.

### Syntax:

	myRequest.send([options]);

### Arguments:

1. options - (*object*, optional) The options for the sent Request.  Will also accept data as a query string for compatibility reasons.

### Returns:

* (*object*) This Request instance.

### Examples:

	var myRequest = new Request({
		url: 'http://localhost/some_url'
	}).send('save=username&name=John');


Request Methods: send aliases {#Request:send-aliases}
-----------------------------------------------------

MooTools provides several aliases for [Request:send][] to make it easier to use different methods.

These aliases are:

- `post()` and `POST()`
- `get()` and `GET()`
- `put()` and `PUT()`
- `delete()` and `DELETE()`

### Syntax:

	myRequest.post([data]);

### Arguments:

1. data - (*string*, optional) Equivalent with the `data` option of Request.

### Returns:

* (*object*) This Request instance.

### Examples:

	var myRequest = new Request({url: 'http://localhost/some_url'});

	myRequest.post('save=username&name=John');
	//...is equivalent to:
	myRequest.send({
		method: 'post',
		data: 'save=username&name=John'
	});

	myRequest.get('save=username&name=John');
	//...is equivalent to:
	myRequest.send({
		method: 'get',
		data: 'save=username&name=John'
	});

### Note:

By default the emulation option is set to true, so the *put* and *delete* send methods are emulated and will actually send as *post* while the method name is sent as e.g. `_method=delete`.

`Async` and `timeout` options are mutually exclusive. If you set `async` to true, then there's no need to set the `timeout` since the server and browser will set their own timeouts to return executing the rest of your script.


Request Method: cancel {#Request:cancel}
--------------------------------

Cancels the currently running request, if any.

### Syntax:

	myRequest.cancel();

### Returns:

* (*object*) This Request instance.

### Example:

	var myRequest = new Request({url: 'mypage.html', method: 'get'}).send('some=data');
	myRequest.cancel();

Request Method: isRunning {#Request:isRunning}
--------------------------------

Returns true if the request is currently running

### Syntax:

	myRequest.isRunning()

### Returns:

* (*boolean*) True if the request is running

### Example:

	var myRequest = new Request({url: 'mypage.html', method: 'get'}).send('some=data');

	if (myRequest.isRunning()) // It runs!


Object: Element.Properties {#Element-Properties}
==============================================

see [Element.Properties][]

Element Property: send {#Element-Properties:send}
-------------------------------------------------

### Setter

Sets a default Request instance for an Element.  This is useful when handling forms.

#### Syntax:

	el.set('send'[, options]);

#### Arguments:

1. options - (*object*) The Request options.

#### Returns:

* (*element*) The original element.

#### Example:

	myForm.set('send', {url: 'contact.php', method: 'get'});
	myForm.send(); //Sends the form.

### Getter

Returns the previously set Request instance (or a new one with default options).

#### Syntax:

	el.get('send');

#### Arguments:

1. property - (*string*) the Request property argument.

### Returns:

* (*object*) The Request instance.

#### Example:

	el.set('send', {method: 'get'});
	el.send();
	el.get('send'); // returns the Request instance.

Type: Element {#Element}
========================

Custom Type to allow all of its methods to be used with any DOM element via the dollar function [$][].


Element Method: send {#Element:send}
------------------------------------

Sends a form or a container of inputs with an HTML request.

### Syntax:

	myElement.send(url);

### Arguments:

1. url - (*string*, optional) The url you want to send the form or the "container of inputs" to. If url is omitted, the action of the form will be used. url cannot be omitted for "container of inputs".

### Returns:

* (element) This Element.

### Example:

##### HTML

	<form id="myForm" action="submit.php">
		<p>
			<input name="email" value="bob@bob.com" />
			<input name="zipCode" value="90210" />
		</p>
	</form>

##### JavaScript

	$('myForm').send();

### Note:

* The URL is taken from the action attribute of the form.



[$]: /core/Element/Element/#Window:dollar
[Request:send]: #Request:send
[Element.Properties]: /core/Element/Element/#Element-Properties
[URI]: /more/Types/URI
[Chain]: /core/Class/Class.Extras#Chain
[Events]: /core/Class/Class.Extras#Events
[Options]: /core/Class/Class.Extras#Options
[Object:toQueryString]: /core/Types/Object#Object:Object-toQueryString
[Element:toQueryString]: /core/Element/Element#Element:toQueryString
