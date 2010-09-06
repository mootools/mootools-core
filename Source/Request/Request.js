/*
---

name: Request

description: Powerful all purpose Request Class. Uses XMLHTTPRequest.

license: MIT-style license.

requires: [Object, Element, Chain, Events, Options, Browser]

provides: Request

...
*/


(function(){

var progressSupport = ('onprogress' in new Browser.Request);

var parseXML;
if (this.DOMParser){
	var domParser = new DOMParser();
	parseXML = function(text){
		return domParser.parseFromString(text, 'text/xml');
	};
} else {
	var xml = Function.attempt(function(){
		return new ActiveXObject('MSXML2.DOMDocument');
	}, function(){
		return new ActiveXObject('Microsoft.XMLDOM');
	});
	if (xml) xml.async = 'false';

	parseXML = function(text){
		if (!xml) return null;

		xml.loadXML(text);
		return xml;
	};
}

var Request = this.Request = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: function(){},
		onLoadstart: function(event, xhr){},
		onProgress: function(event, xhr){},
		onComplete: function(){},
		onCancel: function(){},
		onSuccess: function(responseText, responseXML){},
		onFailure: function(xhr){},
		onException: function(headerName, value){},
		onTimeout: function(){},*/
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
		evalScripts: false,
		evalResponse: false,
		timeout: 0,
		noCache: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
		this.headers = this.options.headers;
	},

	onStateChange: function(){
		if (this.xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		Function.attempt(function(){
			var status = this.xhr.status;
			this.status = (status == 1223) ? 204 : status;
		}.bind(this));
		this.xhr.onreadystatechange = function(){};
		clearTimeout(this.timer);
		
		var text = this.xhr.responseText || '',
			xml = this.xhr.responseXML;

		// forces xml parsing
		if (text && (!xml || !(xml && xml.documentElement))) xml = parseXML(text);

		this.response = {text: text, xml: xml};
		if (this.options.isSuccess.call(this, this.status))
			this.success(this.response.text, this.response.xml);
		else
			this.failure();
	},

	isSuccess: function(){
		var status = this.status;
		return (status >= 200 && status < 300);
	},

	isRunning: function(){
		return !!this.running;
	},

	processScripts: function(text){
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return Browser.exec(text);
		return text.stripScripts(this.options.evalScripts);
	},

	success: function(text, xml){
		this.onSuccess(this.processScripts(text), xml);
	},

	onSuccess: function(){
		this.triggerEvent('complete', arguments).triggerEvent('success', arguments).callChain();
	},

	failure: function(){
		this.onFailure();
	},

	onFailure: function(){
		this.triggerEvent('complete').triggerEvent('failure', this.xhr);
	},
	
	loadstart: function(event){
		this.triggerEvent('loadstart', [event, this.xhr]);
	},
	
	progress: function(event){
		this.triggerEvent('progress', [event, this.xhr]);
	},
	
	timeout: function(){
		this.triggerEvent('timeout', this.xhr);
	},

	setHeader: function(name, value){
		this.headers[name] = value;
		return this;
	},

	getHeader: function(name){
		return Function.attempt(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},
	
	send: function(options){
		if (!this.check(options)) return this;

		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.running = true;

		var type = typeOf(options);
		if (type == 'string' || type == 'element') options = {data: options};

		var old = this.options;
		options = Object.append({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = String(options.url), method = options.method.toLowerCase();

		switch (typeOf(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		if (this.options.format){
			var format = 'format=' + this.options.format;
			data = (data) ? format + '&' + data : format;
		}

		if (this.options.emulation && !['get', 'post'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.options.urlEncoded && ['post', 'put'].contains(method)){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
		}

		if (!url) url = document.location.pathname;
		
		var trimPosition = url.lastIndexOf('/');
		if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) url = url.substr(0, trimPosition);

		if (this.options.noCache)
			url += (url.contains('?') ? '&' : '?') + String.generateUID();

		if (data && method == 'get'){
			url += (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		if (progressSupport){
			this.xhr.onloadstart = this.loadstart.bind(this);
			this.xhr.onprogress = this.progress.bind(this);
		}
		
		this.xhr.open(method.toUpperCase(), url, this.options.async);
		
		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		Object.each(this.headers, function(value, key){
			try {
				this.xhr.setRequestHeader(key, value);
			} catch (e){
				this.triggerEvent('exception', [key, value]);
			}
		}, this);

		this.triggerEvent('request');
		this.xhr.send(data);
		if (!this.options.async) this.onStateChange();
		if (this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		clearTimeout(this.timer);
		this.xhr.onreadystatechange = this.xhr.onprogress = this.xhr.onloadstart = function(){};
		this.xhr = new Browser.Request();
		this.triggerEvent('cancel');
		return this;
	}

});

var methods = {};
['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(data){
		return this.send({
			data: data,
			method: method
		});
	};
});

Request.implement(methods);

Element.Properties.send = {

	set: function(options){
		var send = this.get('send').cancel();
		send.setOptions(options);
		return this;
	},

	get: function(){
		var send = this.retrieve('send');
		if (!send){
			send = new Request({
				data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
			});
			this.store('send', send);
		}
		return send;
	}

};

Element.implement({

	send: function(url){
		var sender = this.get('send');
		sender.send({data: this, url: url || sender.options.url});
		return this;
	}

});

})();