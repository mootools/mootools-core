/*
Script: XHR.js
	Contains the basic XMLHttpRequest Class Wrapper.

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: XHR
	Basic XMLHttpRequest Wrapper.

Arguments:
	

Options:
	method - 'post' or 'get' - the prototcol for the request; optional, defaults to 'post'.
	async - boolean: asynchronous option; true uses asynchronous requests. Defaults to true.
	onRequest - function to execute when the XHR request is fired.
	onSuccess - function to execute when the XHR request completes.
	onStateChange - function to execute when the state of the XMLHttpRequest changes.
	onFailure - function to execute when the state of the XMLHttpRequest changes.
	headers - accepts an object, that will be set to request headers.

Example:
	>var myXHR = new XHR({method: 'get'}).send('http://site.com/requestHandler.php', 'name=john&lastname=doe');
*/

var XHR = new Class({

	getOptions: function(){
		return {
			method: 'post',
			async: true,
			onRequest: Class.empty,
			onStateChange: Class.empty,
			onSuccess: Class.empty,
			onFailure: Class.empty,
			headers: {},
			isSuccess: this.isSuccess
		}
	},

	initialize: function(options){
		this.transport = window.XMLHttpRequest ? new XMLHttpRequest() : (window.ie ? new ActiveXObject('Microsoft.XMLHTTP') : false);
		this.setOptions(this.getOptions(), options);
		if (!this.transport) return;
		this.headers = {};
		if (this.options.initialize) this.options.initialize.call(this);
	},

	onStateChange: function(){
		this.fireEvent('onStateChange', this.transport);
		if (this.transport.readyState != 4) return;
		var status = 0;
		try {status = this.transport.status} catch (e){}
		if (this.options.isSuccess(status)) this.onSuccess();
		else this.onFailure();
		this.transport.onreadystatechange = Class.empty;
	},
	
	isSuccess: function(status){
		return ((status >= 200) && (status < 300));
	},
	
	onSuccess: function(){
		this.response = {
			'text': this.transport.responseText,
			'xml': this.transport.responseXML
		};
		this.fireEvent('onSuccess', [this.response.text, this.response.xml]);
		this.callChain();
	},
	
	onFailure: function(){
		this.fireEvent('onFailure', this.transport);
	},

	setHeader: function(name, value){
		this.headers[name] = value;
		return this;
	},

	send: function(url, data){
		this.fireEvent('onRequest');
		this.transport.open(this.options.method, url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if ((this.options.method == 'post') && this.transport.overrideMimeType) this.setHeader('Connection', 'close');
		Object.extend(this.headers, this.options.headers);
		for (var type in this.headers) this.transport.setRequestHeader(type, this.headers[type]);
		this.transport.send(data);
		return this;
	}

});

XHR.implement(new Chain);
XHR.implement(new Events);
XHR.implement(new Options);