/*
Script: Request.js
	Powerful all purpose Request Class. Uses XMLHTTPRequest.

License:
	MIT-style license.
*/

var Request = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onRequest: nil,
		onComplete: nil,
		onCancel: nil,
		onSuccess: nil,
		onFailure: nil,
		onException: nil,
		*/
		url: '',
		data: '',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		},
		async: true,
		format: false,
		method: 'post',
		link: 'ignore',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		stripScripts: true,
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
	},

	onStateChange: function(){
		if (this.xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		
		Function.stab(function(){
			this.status = this.xhr.status;
		}.bind(this));
		
		if (this.getOption('isSuccess').call(this, this.status)){
			this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
			this.success(this.response.text, this.response.xml);
		} else {
			this.response = {text: null, xml: null};
			this.failure();
		}
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	processScripts: function(text){
		if (this.getOption('evalResponse') || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return Browser.exec(text);
		return (this.getOption('stripScripts')) ? text.stripScripts(this.getOption('evalScripts')) : text;
	},

	success: function(text, xml){
		this.onSuccess(this.processScripts(text), xml);
	},

	onSuccess: function(){
		this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain();
	},

	failure: function(){
		this.onFailure();
	},

	onFailure: function(){
		this.fireEvent('complete').fireEvent('failure', this.xhr);
	},

	setHeader: function(name, value){
		this.getOption('headers')[name] = value;
		return this;
	},

	getHeader: function(name){
		return Function.stab(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(){
		if (!this.running) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this[this.caller].bind(this, arguments)); return false;
		}
		return false;
	},

	send: function(data){
		
		if (!this.check(data)) return this;
		this.running = true;

		var url = this.getOption('url'), method = this.getOption('method');

		switch (typeOf(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': data = Object.toQueryString(data);
		}
		
		var headers = this.getOption('headers');
		this.setOption('isSuccess', this.getOption('isSuccess') || this.isSuccess);

		if (this.getOption('format')){
			var format = 'format=' + this.getOption('format');
			data = (data) ? format + '&' + data : format;
		}

		if (this.getOption('emulation') && !['get', 'post'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.getOption('urlEncoded') && method == 'post'){
			var encoding = (this.getOption('encoding')) ? '; charset=' + this.getOption('encoding') : '';
			headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
		}

		if (data && method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		this.xhr.open(method.toUpperCase(), url, this.getOption('async'));

		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		Object.each(headers, function(value, key){
			var xhr = this.xhr;
			if (!Function.stab(function(){
				xhr.setRequestHeader(key, value);
			})) this.fireEvent('exception', [key, value]);
		}, this);

		this.fireEvent('request');
		this.xhr.send(data);
		if (!this.getOption('async')) this.onStateChange();

		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		this.xhr = new Browser.Request();
		this.fireEvent('cancel');
		return this;
	}

});

(function(){

	var methods = {};

	['get', 'post', 'put', 'delete'].each(function(method){
		methods[method] = methods[method.toUpperCase()] = function(data){
			this.setOption('method', method);
			return this.send(data);
		};
	});

	Request.implement(methods);

})();

Element.defineSetter('send', function(options){
	this.get('send').cancel().setOptions(options);
});

Element.defineGetter('send', function(){
	if (!this.retrieve('send')) this.store('send', new Request({
		data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
	}));
	return this.retrieve('send');
});

Element.implement({

	send: function(data){
		this.get('send').send(data);
		return this;
	}

});
