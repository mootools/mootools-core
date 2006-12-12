/*
Script: Ajax.js
	Contains the <Ajax> class. Also contains methods to generate querystings from forms and Objects.

Author:
	Valerio Proietti, <http://mad4milk.net>

Credits:
	Loosely based on the version from prototype.js <prototype.conio.net>
	Christophe Beyls <http://digitalia.be>, for the implementation of onFailure and optimization of evalScripts;

License:
	MIT-style license.
*/

/*
Class: Ajax
	For all your asynchronous needs. Note: this class implements <Chain>

Arguments:
	url - the url pointing to the server-side script.
	options - optional, an object containing options.

Options:
	method - 'post' or 'get' - the prototcol for the request; optional, defaults to 'post'.
	postBody - if method is post, you can write parameters here. Can be a querystring, an object or a Form element.
	async - boolean: asynchronous option; true uses asynchronous requests. Defaults to true.
	onComplete - function to execute when the ajax request completes.
	onStateChange - function to execute when the state of the XMLHttpRequest changes.
	update - $(element) to insert the response text of the XHR into, upon completion of the request.
	evalScripts - boolean; default is false. Execute scripts in the response text onComplete.

Example:
	>var myAjax = new Ajax(url, {method: 'get'}).request();
*/

var XHR = new Class({

	getOptions: function(){
		return {
			method: 'post',
			async: true,
			onRequest: Class.empty,
			onStateChange: Class.empty,
			onComplete: Class.empty,
			onFailure: Class.empty,
			headers: {}
		}
	},

	initialize: function(options){
		this.setOptions(this.getOptions(), options);
		this.transport = window.XMLHttpRequest ? new XMLHttpRequest() : (window.ie ? new ActiveXObject('Microsoft.XMLHTTP') : false);
		if (this.transport && this.options.initialize) this.options.initialize.call(this);
	},

	onStateChange: function(){
		this.fireEvent('onStateChange', this.transport);
		if (this.transport.readyState != 4) return;
		var status = 0;
		try {status = this.transport.status} catch (e){}
		if (status >= 200 && status < 300){
			this.fireEvent('onComplete', [this.transport.responseText, this.transport.responseXML]);
			this.callChain();
		} else this.fireEvent('onFailure', this.transport);
	},

	setHeaders: function(source){
		for (var type in source) this.transport.setRequestHeader(type, source[type]);
		return this;
	},

	send: function(url, data){
		this.fireEvent('onRequest');
		this.transport.open(this.options.method, url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		this.setHeaders({'X-Requested-With': 'XMLHttpRequest'});
		this.setHeaders(this.options.headers);
		if (this.options.method == 'post'){
			this.setHeaders({'Content-type' : 'application/x-www-form-urlencoded'});
			if (this.transport.overrideMimeType) this.setHeaders({'Connection': 'close'});
		}
		this.transport.send(data);
		return this;
	}

});

XHR.implement(new Chain);
XHR.implement(new Events);
XHR.implement(new Options);

var Ajax, ajax;

Ajax = ajax = XHR.extend({

	moreOptions: function(){
		return {
			postBody: null,
			update: null,
			evalScripts: false,
			onStateChange: Class.empty
		};
	},

	initialize: function(url, options){
		this.addEvent('onComplete', this.onComplete);
		this.setOptions(this.moreOptions(), options);
		this.parent(this.options);
		this.url = url;
	},

	onComplete: function(){
		if (this.options.update) $(this.options.update).setHTML(this.transport.responseText);
		if (this.options.evalScripts) this.evalScripts.delay(30, this);
	},

	/*
	Property: request
		Executes the ajax request.

	Example:
		>var myAjax = new Ajax(url, {method: 'get'});
		>myAjax.request();

		OR

		>new Ajax(url, {method: 'get'}).request();
	*/

	request: function(){
		switch ($type(this.options.postBody)){
			case 'element': this.options.postBody = $(this.options.postBody).toQueryString(); break;
			case 'object': this.options.postBody = Object.toQueryString(this.options.postBody); break;
			case 'string': break;
			default: this.options.postBody = null;
		}
		return this.send(this.url, this.options.postBody);
	},

	/*
	Property: evalScripts
		Executes scripts in the response text
	*/

	evalScripts: function(){
		var scripts = this.transport.responseText.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
		if (scripts) for (var i = 0; i < scripts.length; i++) eval(scripts[i]);
	}

});

/* Section: Object related Functions */

/*
Function: Object.toQuerySTring
	Generates a querysting from a key/pair values in an object

Arguments:
	source - the object to generate the querystring from.

Returns:
	the query string.

Example:
	>Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
*/

Object.toQueryString = function(source){
	var queryString = [];
	for (var property in source) queryString.push(encodeURIComponent(property)+'='+encodeURIComponent(source[property]));
	return queryString.join('&');
};

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: send
		Sends a form with an ajax post request

	Arguments:
		options - option collection for ajax request. See <Ajax.initialize> for option list.

	Returns:
		The Ajax Class Instance

	Example:
		(start code)
		<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
		</form>
		<script>
		$('myForm').send()
		</script>
		(end)
	*/

	send: function(options){
		options = Object.extend(options || {}, {postBody: this.toQueryString(), method: 'post'});
		return new Ajax(this.getProperty('action'), options).request();
	},

	/*
	Property: toQueryString
		Reads the children inputs of the Element and generates a query string, based on their values. Used internally in <Ajax>

	Example:
		(start code)
		<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
		</form>

		<script>
		 $('myForm').toQueryString()
		</script>
		(end)

		Returns:
			email=bob@bob.com&zipCode=90210
	*/
	
	toObject: function(){
		var obj = {};
		$each(this.getElementsByTagName('*'), function(el){
			var name = $(el).name;
			var value = el.getValue();
			if (value && name) obj[encodeURIComponent(name)] = encodeURIComponent(value);
		});
		return obj;
	},

	toQueryString: function(){
		return Object.toQueryString(this.toObject());
	}

});