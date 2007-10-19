/*
Script: XHR.js
	Contains the basic XMLHttpRequest Class Wrapper.

License:
	MIT-style license.
*/

/*
Class: XHR
	An XMLHttpRequest Wrapper.

Implements:
	<Chain>, <Events>, <Options>

Syntax:
	>var myXHR = new XHR([url[, options]]);

Arguments:
	url     - (string, optional) The URL pointing to the server-side script.
	options - (object, optional) See below.

	options (continued):
		method     - (string: defaults to 'post') The HTTP method for the request, can be either 'post' or 'get'.
		data       - (string: defaults to '') The default data for <XHR.send>, used when no data is given.
		async      - (boolean: defaults to true) If set to false, the requests will be synchronous and freeze the browser during request.
		encoding   - (string: defaults to "utf-8") The encoding to be set in the request header.
		autoCancel - (boolean: defaults to false) When set to true, automatically cancels the already running request if another one is sent. Otherwise, ignores any new calls while a request is in progress.
		headers    - (object) An object to use in order to set the request headers.
		isSuccess  - (function) Overrides the built-in isSuccess function.

Events:
	onRequest - (function) Function to execute when the XHR request is fired.
		Signature:
			>onRequest(instance)

		Arguments:
			instance - (XHR) The transport instance.

	onSuccess - (function) Function to execute when the XHR request completes.
		Signature:
			>onSuccess(reponseText, responseXML)

		Arguments:
			responseText - (string) The returned text from the request.
			responseXML  - (mixed) The response XML from the request.

	onFailure - (function) Function to execute when the request failes (error status code).
		Signature:
			>onFailure(instance)

		Arguments:
			instance - (XHR) The transport instance.

	onException - (function) Function to execute when setting a request header fails.
		Signature:
			>onException(headerName, value)

		Arguments:
			headerName - (string) The name of the failing header.
			value      - (string) The value of the failing header.

	onCancel - (function) Function to execute when a request has been cancelled.
		Signature:
			>onCancel()

Properties:
	running  - (boolean) True if the request is running.
	response - (object) Object with text and xml as keys. You can access this property in the onSuccess event.

Returns:
	(object) A new XHR instance.

Example:
	[javascript]
		var myXHR = new XHR({method: 'get', url: 'http://site.com/requestHandler.php'}).send('name=john&lastname=dorian');
	[/javascript]

See Also:
	<http://en.wikipedia.org/wiki/XMLHttpRequest>
*/

var XHR = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: $empty,
		onSuccess: $empty,
		onFailure: $empty,
		onException: $empty,*/
		data: '',
		async: true,
		method: 'post',
		urlEncoded: true,
		encoding: 'utf-8',
		autoCancel: false,
		headers: {},
		isSuccess: null
	},

	setTransport: function(){
		this.transport = (window.XMLHttpRequest) ? new XMLHttpRequest() : (Browser.Engine.trident ? new ActiveXObject('Microsoft.XMLHTTP') : false);
	},

	initialize: function(){
		var params = Array.link(arguments, {'url': String.type, 'options': Object.type});
		this.setTransport();
		this.setURL(params.url).setOptions(params.options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = new Hash(this.options.headers);
		if (this.options.urlEncoded && this.options.method != 'get'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.setHeader('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}
		this.setHeader('X-Requested-With', 'XMLHttpRequest');
	},

	onStateChange: function(){
		if (this.transport.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		$try(function(){
			this.status = this.transport.status;
		}, this);
		if (this.options.isSuccess.call(this, this.status)) this.onSuccess();
		else this.onFailure();
		this.transport.onreadystatechange = $empty;
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	onSuccess: function(){
		this.response = {
			text: this.transport.responseText,
			xml: this.transport.responseXML
		};
		this.fireEvent('onSuccess', [this.response.text, this.response.xml]);
		this.callChain();
	},

	onFailure: function(){
		this.fireEvent('onFailure', this.transport);
	},

	/*
	Method: setHeader
		Add or modify a header for the request. It will not override headers from the options.

	Syntax:
		>myXHR.setHeader(name, value);

	Arguments:
		name  - (string) The name for the header.
		value - (string) The value to be assigned.

	Returns:
		(object) This XHR instance.

	Example:
		[javascript]
			var myXHR = new XHR(url, {method: 'get', headers: {'X-Request': 'JSON'}});
			myXHR.setHeader('Last-Modified','Sat, 1 Jan 2005 05:00:00 GMT');
		[/javascript]
	*/

	setHeader: function(name, value){
		this.headers.set(name, value);
		return this;
	},

	/*
	Method: getHeader
		Returns the given response header or null if not found.

	Syntax:
		>myXHR.getHeader(name);

	Arguments:
		name - (string) The name of the header to retrieve the value of.

	Returns:
		(string) The value of the retrieved header.

	Example:
		var myXHR = new XHR(url, {method: 'get', headers: {'X-Request': 'JSON'}});
		var headers = myXHR.getHeader('X-Request'); // returns 'JSON'
	*/

	getHeader: function(name){
		return $try(function(){
			return this.getResponseHeader(name);
		}, this.transport) || null;
	},

	/*
	Method: setURL
		Sets, or changes the instance URL.

	Syntax:
		>myRequest.setURL(url);

	Arguments:
		url - (string) The URL to be used for this XHR.

	Returns:
		(object) This XHR instance.

	Example:
		[javascript]
			var myXHR = new XHR({method: 'get', url: 'http://localhost/some_url'});
			myXHR.send('some=data');
			myXHR.setURL('http://localhost/my_other_url');
			myXHR.send('some=data');
		[/javascript]
	*/

	setURL: function(url){
		this.url = url;
		return this;
	},

	/*
	Method: send
		Opens the XHR connection and sends the provided data.

	Syntax:
		>myXHR.send([data]);

	Arguments:
		data - (string, optional) The request data as query string.

	Returns:
		(object) This XHR instance.

	Examples:
		[javascript]
			var myXHR = new XHR({url: 'http://localhost/some_url'}).send("save=username&name=John");
		[/javascript]
	*/

	send: function(data){
		if (this.options.autoCancel) this.cancel();
		else if (this.running) return this;
		this.running = true;
		data = data || this.options.data;
		var url = this.url;
		if (data && this.options.method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}
		this.transport.open(this.options.method.toUpperCase(), url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		this.headers.each(function(value, key){
			try{
				this.transport.setRequestHeader(key, value);
			} catch(e){
				this.fireEvent('onException', [e, key, value]);
			}
		}, this);
		this.fireEvent('onRequest');
		this.transport.send(data);
		if (!this.options.async) this.onStateChange();
		return this;
	},

	/*
	Method: send
		Opens the XHR connection and sends the provided data. Allows to override the URL.

	Syntax:
		>myAjax.request(data[, url]);

	Arguments:
		data - (mixed) Same as the data argument for <XHR.send>.
		url - (string, optional) Overrides default URL given during initialize or <XHR.setURL>.

	Returns:
		(object) This Ajax instance.
	*/

	request: function(data, url){
		if (url) this.url = url;
		return this.send(data);
	},

	/*
	Method: cancel
		Cancels the currently running request, if any.

	Syntax:
		>myRequest.cancel();

	Returns:
		(object) This XHR instance.

	Example:
		[javascript]
			var myXHR = new XHR({method: 'get'}).send('some=data');
			myXHR.cancel();
		[/javascript]
	*/

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.transport.abort();
		this.transport.onreadystatechange = $empty;
		this.setTransport();
		this.fireEvent('onCancel');
		return this;
	}

});
