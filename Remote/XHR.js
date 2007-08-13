/*
Script: XHR.js
	Contains the basic XMLHttpRequest Class Wrapper.

License:
	MIT-style license.
*/

/*
Class: XHR
	Basic XMLHttpRequest Wrapper.

Arguments:
	url - (string) [optional] The url pointing to the server-side script.
	options - (object) [optional] See "Options" below.

Options:
	method - (string) ['post'] The HTTP method for the request, 'post' or 'get'.
	data - (string) [null] The default data for <XHR.send>, used when no data is given.
	async - (boolean) [true] Asynchronous option; true uses asynchronous requests.
	encoding - (string) ["utf-8"] The encoding (Note: This sets the correct request header, it does not encode the data).
	autoCancel - (boolean) [false] Cancels the already running request if another one is sent. When false, it will ignore another send when a request is already running.
	headers - (object) Accepts an object, that will be set to request headers.
	isSuccess - (function) Overrides the in-build isSuccess, that checks the response status code

Events:
	onRequest - (function) Function to execute when the XHR request is fired. Argument is the transport instance.
	onSuccess - (function) Function to execute when the XHR request completes. Arguments are response text and xml.
	onFailure - (function) Function to execute when the request failes (error status code). Argument is the transport instance.
	onException - (function) Function to execute when setting a request header failes. Arguments are the header name and value.

Properties:
	running - (boolean) True if the request is running.
	response - (object) Object with text and xml as keys. You can access this property in the onSuccess event.

Example:
	>var myXHR = new XHR({method: 'get'}).send('http://site.com/requestHandler.php', 'name=john&lastname=dorian');
*/

var XHR = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*onRequest: $empty,
		onSuccess: $empty,
		onFailure: $empty,
		onException: $empty,*/
		method: 'post',
		async: true,
		data: null,
		urlEncoded: true,
		encoding: 'utf-8',
		autoCancel: false,
		headers: {},
		isSuccess: null
	},

	setTransport: function(){
		this.transport = (window.XMLHttpRequest) ? new XMLHttpRequest() : (Client.Engine.ie ? new ActiveXObject('Microsoft.XMLHTTP') : false);
	},

	initialize: function(){
		var params = Array.associate(arguments, {'url': 'string', 'options': 'object'});
		this.url = params.url;
		this.setTransport();
		this.setOptions(params.options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = $merge(this.options.headers);
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
	Property: setHeader
		Add/modify an header for the request. It will not override headers from the options.

	Example:
		>var myXhr = new XHR(url, {method: 'get', headers: {'X-Request': 'JSON'}});
		>myXhr.setHeader('Last-Modified','Sat, 1 Jan 2005 05:00:00 GMT');
	*/

	setHeader: function(name, value){
		this.headers[name] = value;
		return this;
	},

	/*
	Property: getHeader
		Returns the given response header or null
	*/

	getHeader: function(name){
		return $try(function(name){
			return this.getResponseHeader(name);
		}, this.transport, name) || null;
	},

	/*
	Property: send
		Opens the XHR connection and sends the data.

	Arguments:
		data - (string) [optional] The request data as query string or null.

	Example:
		Simple POST request:
		>var myXhr = new XHR().send(url, "save=username&name=John"); // method is 'post' by default

		Synchron request (freezes browser during request):
		(start code)
		var syncXhr = new XHR({async: false}); // sync request
		syncXhr.send(url, null);
		alert(syncXhr.response.text); // alerts the response text
		(end)
	*/

	send: function(url, data){
		if (this.options.autoCancel) this.cancel();
		else if (this.running) return this;
		this.running = true;
		data = data || this.options.data;
		if (data && this.options.method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}
		this.transport.open(this.options.method.toUpperCase(), url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if ((this.options.method == 'post') && this.transport.overrideMimeType) this.setHeader('Connection', 'close');
		for (var type in this.headers){
			try{
				this.transport.setRequestHeader(type, this.headers[type]);
			} catch(e){
				this.fireEvent('onException', [e, type, this.headers[type]]);
			}
		}
		this.fireEvent('onRequest');
		this.transport.send($pick(data, null));
		if (!this.options.async) this.onStateChange();
		return this;
	},

	request: function(data){
		return this.send(this.url, data);
	},

	/*
	Property: cancel
		Cancels the running request. No effect if the request is not running.

	Example:
		>var myXhr = new XHR({method: 'get'}).send(url);
		>myXhr.cancel();
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