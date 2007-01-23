/*
Script: Ajax.js
	Contains the <Ajax> class. Also contains methods to generate querystings from forms and Objects.

Authors:
	- Valerio Proietti, <http://mad4milk.net>
	- Christophe Beyls, <http://digitalia.be>

Credits:
	Loosely based on the version from prototype.js <http://prototype.conio.net>

License:
	MIT-style license.
*/

/*
Class: Ajax
	An Ajax class, For all your asynchronous needs. Inherits methods, properties and options from <XHR>.

Arguments:
	url - the url pointing to the server-side script.
	options - optional, an object containing options.

Options:
	postBody - if method is post, you can write parameters here. Can be a querystring, an object or a Form element.
	onComplete - function to execute when the ajax request completes.
	update - $(element) to insert the response text of the XHR into, upon completion of the request.
	evalScripts - boolean; default is false. Execute scripts in the response text onComplete.
	evalResponse - boolean; should you eval the whole responsetext? I dont know, but this option makes it possible.
	encoding - the encoding, defaults to utf-8.

Example:
	>var myAjax = new Ajax(url, {method: 'get'}).request();
*/

var Ajax = XHR.extend({

	moreOptions: function(){
		return {
			postBody: null,
			update: null,
			onComplete: Class.empty,
			evalScripts: false,
			evalResponse: false,
			encoding: 'utf-8'
		};
	},

	initialize: function(url, options){
		this.addEvent('onSuccess', this.onComplete);
		this.setOptions(this.moreOptions(), options);
		this.parent(this.options);
		if (!['post', 'get'].test(this.options.method)){
			this._method = '_method='+this.options.method;
			this.options.method = 'post';
		}
		if (this.options.method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.setHeader('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}
		this.setHeader('X-Requested-With', 'XMLHttpRequest');
		this.setHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*');
		this.url = url;
	},

	onComplete: function(){
		if (this.options.update) $(this.options.update).setHTML(this.response.text);
		if (this.options.evalResponse) eval(this.response.text);
		if (this.options.evalScripts) this.evalScripts.delay(30, this);
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

	request: function(){
		var data = null;
		switch ($type(this.options.postBody)){
			case 'element': data = $(this.options.postBody).toQueryString(); break;
			case 'object': data = Object.toQueryString(this.options.postBody); break;
			case 'string': data = this.options.postBody;
		}
		if (this._method) data = (data) ? [this._method, data].join('&') : this._method;
		return this.send(this.url, data);
	},

	/*
	Property: evalScripts
		Executes scripts in the response text
	*/

	evalScripts: function(){
		var script, regexp = /<script[^>]*>([\s\S]*?)<\/script>/gi;
		while ((script = regexp.exec(this.response.text))) eval(script[1]);
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
		$$(this.getElementsByTagName('input'), this.getElementsByTagName('select'), this.getElementsByTagName('textarea')).each(function(el){
			var name = $(el).name;
			var value = el.getValue();
			if ((value !== false) && name) obj[name] = value;
		});
		return obj;
	},

	toQueryString: function(){
		return Object.toQueryString(this.toObject());
	}

});