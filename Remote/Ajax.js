/*
Script: Ajax.js
	Contains the <Ajax> class. Also contains methods to generate querystings from forms and Objects.

License:
	MIT-style license.
*/

/*
Class: Ajax
	An Ajax class, For all your asynchronous needs.
	Inherits methods, properties, options, and events from <XHR>.

Extends:
	<XHR>

Arguments:
	url - (string) The url pointing to the server-side script.
	options - (object, optional) See "Options" below. Also utilizes <XHR> options and events.

	options (continued):
		update - (element, optional) The Element to insert the response text of the XHR into upon completion of the request.
		evalScripts - (boolean, optional: defaults to false) If set to true, JavaScript inside the reponseText will be evaluated. If the response's content-type is JavaScript, everything is evaluated.
		evalResponse - (boolean, optional: defaults to false) If set to true, the entire response will be evaluated, regardless of its content-type.

Events:
	onComplete - (function) Function to execute when the AJAX request completes. The response text and XML will be passed as arguments.
		Signature:
			>onComplete(responseText);

		Arguments:
			responseText - (string) The content of the remote response.

Examples:
	Simple GET request:
	[javascript]
		var myAjax = new Ajax(url, {method: 'get'}).request();
	[/javascript]

	POST request with data as string:
	[javascript]
		var myAjax = new Ajax('save/').request("user_id=25&save=true");
	[/javascript]

	Data from object passed via GET:
	[javascript]
		var myAjax = new Ajax('load/').request({'user_id': 25}); //loads url "load/?user_id=25"
	[javascript]

	Data from Element via POST:
	[html]
		<form action="save/" method="post" id="user-form">
			Search:
			<input type="text" name="search" />
			Search in description:
			<input type="checkbox" name="search_description" value="yes" />
			<input type="submit" />
		</form>
	[/html]
	[javascript]
		//Needs to be in a submit event or the form handler
		var myAjax = new Ajax('save/').request($('user-form'));
	[/javascript]
*/

var Ajax = new Class({

	Extends: XHR,

	options: {
		update: null,
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(url, options){
		this.parent(url, options);
		this.addEvent('onSuccess', this.onComplete, true);
		if (!['post', 'get'].contains(this.options.method)){
			this._method = '_method=' + this.options.method;
			this.options.method = 'post';
		}
		this.setHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*');
	},

	onComplete: function(){
		var scripts;
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))){
			scripts = this.response.text;
		} else{
			scripts = (this.options.evalScripts) ? '' : null;
			this.response.text = this.response.text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
				if (scripts !== null) scripts += arguments[1] + '\n';
				return '';
			});
		}
		if (this.options.update) $(this.options.update).empty().setHTML(this.response.text);
		if (scripts) (window.execScript) ? window.execScript(scripts) : window.setTimeout(scripts, 0);
		this.fireEvent('onComplete', [this.response.text, this.response.xml], 20);
	},

	/*
	Method: request
		Executes the AJAX request.

	Arguments:
		data - (mixed, optional) The request data. Can be a String, an Object (used in <Object.toQueryString>) or an Element holding input elements (used in <Element.toQueryString>).

	Example:
		Reusable Example:
		[javascript]
			var myAjax = new Ajax(url, {method: 'get'});
			myAjax.request();
		[/javascript]

		One Shot Example:
		[javascript]
			new Ajax(url, {method: 'get'}).request();
		[/javascript]
	*/

	request: function(data){
		data = data || this.options.data;
		switch ($type(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': data = Object.toQueryString(data);
		}
		if (this._method) data = (data) ? this._method + '&' + data : this._method;
		return this.parent(data);
	}

});

/*
Function: Object.toQueryString
	Generates a query string from key/pair values in an object.

Arguments:
	source - (object) The object to generate the query string from.

Returns:
	(string) The query string.

Example:

	[javascript]
		Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
	[/javascript]
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
	Method: send
		Sends a form with an Ajax request.
		The URL is taken from the action attribute, as well as the method, which defaults to post if not found. 

	Arguments:
		options - (object, optional) Option collection for Ajax request. See <Ajax> for the options list.

	Returns:
		(object) This Ajax Class instance.

	Example:
		[html]
			<form id="myForm" action="submit.php">
				<input name="email" value="bob@bob.com">
				<input name="zipCode" value="90210">
			</form>
		[/html]	
		[javascript]
			$('myForm').send();
		[/javascript]
	*/

	send: function(options){
		var send = this.$attributes.send;
		if (!send) send = this.$attributes.send = new Ajax(this.getProperty('action'), {method: this.method || 'post', autoCancel: true});
		if (options) send.setOptions(options);
		return send.request(this);
	},

	/*
	Method: update
		Updates the content of the element with an Ajax get request.
		It saves the Ajax instance to the Element, so it uses the same instance every update call.

	Arguments:
		url - (string) The URL pointing to the server-side document.
		options - (object, optional) Option collection for Ajax request. See <Ajax> for the options list.

	Returns:
		(object) This Ajax Class instance.

	Example:
		[html]
			<div id="content">Loading content...</div>
		[/html]
		[javascript]
			$('content').update('page_1.html');
		[/javascript]
	*/

	update: function(url, options){
		var update = this.$attributes.update;
		if (!update) update = this.$attributes.update = new Ajax({update: this, method: 'get', autoCancel: true});
		if (options) update.setOptions(options);
		update.url = url;
		return update.request();
	}

});
