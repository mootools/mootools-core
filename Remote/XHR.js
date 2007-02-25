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
	options - an object with options names as keys. See options below.

Options:
	method - 'post' or 'get' - the protocol for the request; optional, defaults to 'post'.
	async - boolean: asynchronous option; true uses asynchronous requests. Defaults to true.
	onRequest - function to execute when the XHR request is fired.
	onSuccess - function to execute when the XHR request completes.
	onStateChange - function to execute when the state of the XMLHttpRequest changes.
	onFailure - function to execute when the state of the XMLHttpRequest changes.
	autoCancel - cancels the already running request if another one is sent. defaults to false.
	headers - accepts an object, that will be set to request headers.
	
Properties:
	running - true if the request is running.
	response - object, text and xml as keys. You can access this property in the onSuccess event.

Example:
	>var myXHR = new XHR({method: 'get'}).send('http://site.com/requestHandler.php', 'name=john&lastname=doe');
*/

var XHR = new Class({

	options: {
		method: 'post',
		async: true,
		onRequest: Class.empty,
		onStateChange: Class.empty,
		onSuccess: Class.empty,
		onFailure: Class.empty,
		urlEncoded: true,
		encoding: 'utf-8',
		autoCancel: false,
		headers: {}
	},

	initialize: function(options){
		this.transport = (window.XMLHttpRequest) ? new XMLHttpRequest() : (window.ie ? new ActiveXObject('Microsoft.XMLHTTP') : false);
		if (!this.transport) return;
		this.setOptions(options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = {};
		if (this.options.urlEncoded && this.options.method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.setHeader('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}
		if (this.options.initialize) this.options.initialize.call(this);
	},

	onStateChange: function(){
		this.fireEvent('onStateChange', this.transport);
		if (this.transport.readyState != 4) return;
		var status = 0;
		try {status = this.transport.status} catch(e){};
		if (this.options.isSuccess(status)) this.onSuccess();
		else this.onFailure();
		this.transport.onreadystatechange = Class.empty;
	},

	isSuccess: function(status){
		return ((status >= 200) && (status < 300));
	},

	onSuccess: function(){
		if (!this.running) return;
		this.running = false;
		this.response = {
			'text': this.transport.responseText,
			'xml': this.transport.responseXML
		};
		this.fireEvent('onSuccess', [this.response.text, this.response.xml]);
		this.callChain();
	},

	onFailure: function(){
		this.running = false;
		this.fireEvent('onFailure', this.transport);
	},

	/*
	Property: setHeader
		Add/modify an header for the request. It will not override headers from the options.

	Example:
		>var myAjax = new Ajax(url, {method: 'get', headers: {'X-Request': 'JSON'}});
		>myAjax.setHeader('Last-Modified','Sat, 1 Jan 2005 05:00:00 GMT');
	*/

	setHeader: function(name, value){
		this.headers[name] = value;
		return this;
	},

	/*
	Property: send
		Opens the xhr connection and sends the data. Data has to be null or a string.

	Example:
		>var myAjax = new Ajax(url, {method: 'get'});
		>myAjax.send(null);
	*/

	send: function(url, data){
		if (this.options.autoCancel) this.cancel();
		else if (this.running) return this;
		this.fireEvent('onRequest');
		(function(){
			this.transport.open(this.options.method, url, this.options.async);
			this.running = true;
			this.transport.onreadystatechange = this.onStateChange.bind(this);
			if ((this.options.method == 'post') && this.transport.overrideMimeType) this.setHeader('Connection', 'close');
			$extend(this.headers, this.options.headers);
			for (var type in this.headers) try { this.transport.setRequestHeader(type, this.headers[type]);} catch(e){}
			this.transport.send(data);
		}).delay(1, this);
		return this;
	},
	
	/*
	Property: cancel
		cancels the running request. No effect is the request is not running.

	Example:
		>var myAjax = new Ajax(url, {method: 'get'});
		>myAjax.send(null);
	*/

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.transport.abort();
		this.transport.onreadystatechange = Class.empty;
		this.fireEvent('onCancel');
		return this;
	}

});

XHR.implement(new Chain);
XHR.implement(new Events);
XHR.implement(new Options);