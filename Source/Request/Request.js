/*
Script: Request.js
	Powerful all purpose Request Class. Uses XMLHTTPRequest.

License:
	MIT-style license.
*/

var Request = new Class({

	Implements: [Chain, Events, Options],

	Options: {
		/*
		onRequest: Function.empty,
		onComplete: Function.empty,
		onCancel: Function.empty,
		onSuccess: Function.empty,
		onFailure: Function.empty,
		onException: Function.empty,
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
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
		this.setOption('isSuccess', this.getOption('isSuccess') || this.isSuccess);
		this.headers = this.getOption('headers');
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
		this.xhr.onreadystatechange = Function.empty;
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	processScripts: function(text){
		if (this.getOption('evalResponse') || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return String.exec(text);
		return text.stripScripts(this.getOption('evalScripts'));
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
		this.headers[name] = value;
		return this;
	},

	getHeader: function(name){
		return Function.stab(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(caller){
		if (!this.running) return true;
		switch (this.getOption('link')){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(caller.bind(this, Array.slice(arguments, 1))); return false;
		}
		return false;
	},

	send: function(options){
		if (!this.check(arguments.callee, options)) return this;
		this.running = true;

		if (['string', 'element'].contains(typeOf(options))) options = {data: options};

		var oldOptions = this.getOptions();
		options = Object.append({data: oldOptions.data, url: oldOptions.url, method: oldOptions.method}, options);
		var data = options.data, url = options.url, method = options.method;

		switch (typeOf(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': data = Object.toQueryString(data);
		}

		if (this.getOption('format')){
			var format = 'format=' + this.getOption('format');
			data = (data) ? format + '&' + data : format;
		}

		if (this.getOption('emulation') && ['put', 'delete'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.getOption('urlEncoded') && method == 'post'){
			var encoding = (this.getOption('encoding')) ? '; charset=' + this.getOption('encoding') : '';
			this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
		}

		if (data && method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		this.xhr.open(method.toUpperCase(), url, this.getOption('async'));

		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		for (var key in this.headers){
			var value = this.headers[key];
			if (!Function.stab(function(){
				this.xhr.setRequestHeader(key, value);
			}.bind(this))) this.fireEvent('exception', [key, value]);
		}

		this.fireEvent('request');
		this.xhr.send(data);
		if (!this.getOption('async')) this.onStateChange();
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		this.xhr.onreadystatechange = Function.empty;
		this.xhr = new Browser.Request();
		this.fireEvent('cancel');
		return this;
	}

});

(function(){

var methods = {};

['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(){
		var params = Array.link(arguments, {url: Type.isString, data: Type.isDefined});
		return this.send(Object.append(params, {method: method.toLowerCase()}));
	};
});

Request.implement(methods);

})();

Element.addSetter('send', function(options){
	var send = this.retrieve('send');
	if (send) send.cancel();
	return this.dump('send').store('send:options', Object.append({
		data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
	}, options));
});

Element.addGetter('send', function(options){
	if (options || !this.retrieve('send')){
		if (options || !this.retrieve('send:options')) this.set('send', options);
		this.store('send', new Request(this.retrieve('send:options')));
	}
	return this.retrieve('send');
});

Element.implement({

	send: function(url){
		var sender = this.get('send');
		sender.send({data: this, url: url || sender.getOption('url')});
		return this;
	}

});
