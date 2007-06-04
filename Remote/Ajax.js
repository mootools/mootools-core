/*
Script: Ajax.js
	Contains the <Ajax> class. Also contains methods to generate querystings from forms and Objects.

Credits:
	Loosely based on the version from prototype.js <http://prototype.conio.net>

License:
	MIT-style license.
*/

/*
Class: Ajax
	An Ajax class, For all your asynchronous needs.
	Inherits methods, properties, options and events from <XHR>.

Arguments:
	url - the url pointing to the server-side script.
	options - optional, an object containing options.

Options:
	data - you can write parameters here. Can be a querystring, an object or a Form element.
	update - $(element) to insert the response text of the XHR into, upon completion of the request.
	evalScripts - boolean; default is false. Execute scripts in the response text onComplete. When the response is javascript the whole response is evaluated.
	evalResponse - boolean; default is false. Force global evalulation of the whole response, no matter what content-type it is.
	
Events:
	onComplete - function to execute when the ajax request completes.

Example:
	>var myAjax = new Ajax(url, {method: 'get'}).request();
*/

var Ajax = XHR.extend({

	options: {
		data: null,
		update: null,
		onComplete: Class.empty,
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(url, options){
		this.addEvent('onSuccess', this.onComplete);
		this.setOptions(options);
		/*compatibility*/
		this.options.data = this.options.data || this.options.postBody;
		/*end compatibility*/
		if (!['post', 'get'].contains(this.options.method)){
			this._method = '_method=' + this.options.method;
			this.options.method = 'post';
		}
		this.parent();
		this.setHeader('X-Requested-With', 'XMLHttpRequest');
		this.setHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*');
		this.url = url;
	},

	onComplete: function(){
		if (this.options.update) $(this.options.update).empty().setHTML(this.response.text);
		if (this.options.evalScripts || this.options.evalResponse) this.evalScripts();
		this.fireEvent('onComplete', [this.response.text, this.response.xml], 20);
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

	request: function(data){
		data = data || this.options.data;
		switch($type(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': data = Object.toQueryString(data);
		}
		if (this._method) data = (data) ? [this._method, data].join('&') : this._method;
		return this.send(this.url, data);
	},

	/*
	Property: evalScripts
		Executes scripts in the response text
	*/

	evalScripts: function(){
		var script, scripts;
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) scripts = this.response.text;
		else {
			scripts = [];
			var regexp = /<script[^>]*>([\s\S]*?)<\/script>/gi;
			while ((script = regexp.exec(this.response.text))) scripts.push(script[1]);
			scripts = scripts.join('\n');
		}
		if (scripts) (window.execScript) ? window.execScript(scripts) : window.setTimeout(scripts, 0);
	},

	/*
	Property: getHeader
		Returns the given response header or null
	*/

	getHeader: function(name){
		try {return this.transport.getResponseHeader(name);} catch(e){};
		return null;
	}

});

/* Section: Object related Functions */

/*
Function: Object.toQueryString
	Generates a querystring from key/pair values in an object

Arguments:
	source - the object to generate the querystring from.

Returns:
	the query string.

Example:
	>Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
*/

Object.toQueryString = function(source){
	var queryString = [];
	for (var property in source) queryString.push(encodeURIComponent(property) + '=' + encodeURIComponent(source[property]));
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
		options - option collection for ajax request. See <Ajax> for the options list.

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
		return new Ajax(this.getProperty('action'), $merge({data: this.toQueryString()}, options, {method: 'post'})).request();
	}

});