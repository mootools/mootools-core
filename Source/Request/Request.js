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

var Request = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*onRequest: $empty,
		onSuccess: $empty,
		onFailure: $empty,
		onException: $empty,*/
		url: '',
		data: '',
		headers: {},
		async: true,
		method: 'post',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		autoCancel: false,
		evalScripts: false,
		evalResponse: false
	},

	getXHR: function(){
		return (window.XMLHttpRequest) ? new XMLHttpRequest() : ((window.ActiveXObject) ? new ActiveXObject('Microsoft.XMLHTTP') : false);
	},

	initialize: function(options){
		if (!(this.xhr = this.getXHR())) return;
		this.setOptions(options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = new Hash(this.options.headers).extend({
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		});
		['get', 'post', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
			this[method] = function(){
				var params = Array.link(arguments, {url: String.type, data: Object.type});
				return this.send($extend(params, {method: method.toLowerCase()}));
			};
		}, this);
	},

	onStateChange: function(){
		if (this.xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		$try(function(){
			this.status = this.xhr.status;
		}, this);
		if (this.options.isSuccess.call(this, this.status)){
			this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
			this.onSuccess(this.response.text, true);
		} else {
			this.response = {text: null, xml: null};
			this.onFailure();
		}
		this.xhr.onreadystatechange = $empty;
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	processScripts: function(text){
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	},

	onSuccess: function(args, process){
		if (process && $type(args) == 'string') args = this.processScripts(args);
		this.fireEvent('onComplete', args).fireEvent('onSuccess', args).callChain();
	},

	onFailure: function(){
		this.fireEvent('onComplete', arguments).fireEvent('onFailure', arguments);
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
		}, this.xhr) || null;
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

	send: function(options){
		if ($type(options) == 'string') options = {data: options};
		var old = this.options;
		options = $extend({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = options.url, method = options.method;

		if (this.options.autoCancel) this.cancel();
		else if (this.running) return this;
		this.running = true;

		switch($type(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': case 'hash': data = Hash.toQueryString(data);
		}

		if (this.options.emulation && ['put', 'delete'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.options.urlEncoded && method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.headers.set('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}

		if (data && method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		this.xhr.open(method.toUpperCase(), url, this.options.async);

		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		this.headers.each(function(value, key){
			try{
				this.xhr.setRequestHeader(key, value);
			} catch(e){
				this.fireEvent('onException', [e, key, value]);
			}
		}, this);

		this.fireEvent('onRequest');
		this.xhr.send(data);
		if (!this.options.async) this.onStateChange();
		return this;
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
		this.xhr.abort();
		this.xhr.onreadystatechange = $empty;
		this.xhr = this.getXHR();
		this.fireEvent('onCancel');
		return this;
	}

});

/*
Element Setter: send
	sets a default Ajax instance for an element (possibly a form!)

Syntax:
	>el.set('send'[, options]);

Arguments:
	options - (object) the Ajax options.

Returns:
	(element) this element

Example:
	[javascript]
		myForm.set('send', {method: 'get'});
		myForm.send(); //form sent!
	[/javascript]
*/

/*
Element Getter: send
	gets the previously setted Ajax instance or a new one with default options

Syntax:
	>el.get('send'[, options]);

Arguments:
	options - (object, optional) the Ajax options. if passed in will generate a new instance.

Returns:
	(object) the Ajax instance

Example:
	[javascript]
		el.get('send', {method: 'get'});
		el.send();

		el.get('send'); //the Ajax instance
	[/javascript]
*/

Element.Properties.send = {

	get: function(options){
		if (options || !this.retrieve('send')) this.set('send', options);
		return this.retrieve('send');
	},

	set: function(options){
		var send = this.retrieve('send');
		if (send) send.cancel();
		return this.store('send', new Request($extend({
			data: this, autoCancel: true, method: this.get('method') || 'post', url: this.get('action')
		}, options)));
	}

};

/*
Method: send
	Sends a form with an Ajax request.

Syntax:
	>myElement.send([options]);

Arguments:
	options - (object, optional) Options object for the <Ajax> request.

Returns:
	(element) This Element.

Example:
	[html]
		<form id="myForm" action="submit.php">
			<p>
				<input name="email" value="bob@bob.com">
				<input name="zipCode" value="90210">
			</p>
		</form>
	[/html]
	[javascript]
		$('myForm').send();
	[/javascript]

Note:
	The URL is taken from the action attribute, as well as the method, which defaults to post if not found.
*/

Element.implement('send', function(url){
	this.get('send').send({data: this, url: url});
	return this;
});
