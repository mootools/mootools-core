/*
Script: Ajax.js
	Contains the <Ajax> class. Also contains methods to generate querystings from forms and Objects.

License:
	MIT-style license.
*/

/*
Class: Ajax
	An Ajax class, For all your asynchronous needs.

Extends:
	<XHR>

Syntax:
	>var myAjax = new Ajax(url[, options]);

Arguments:
	url     - (string) The url pointing to the server-side script.
	options - (object, optional) In addition to <XHR>'s options object, see "Options" below.

	options (continued):
		update       - (element: defaults to null) The Element to insert the response text of the XHR into upon completion of the request.
		evalScripts  - (boolean: defaults to false) If set to true, HTMLScript tags inside the response is evaluated.
		evalResponse - (boolean: defaults to false) If set to true, the entire response is evaluated.

Events:
	onComplete - (function) Function to execute when the AJAX request completes.
		Signature:
			>onComplete(responseText, responseXML)

		Arguments:
			responseText - (string) The content of the remote response.
			responseXML  - (string) The XML response of the request.

Returns:
	(class) A new Ajax instance.

Examples:
	Simple GET Request:
	[javascript]
		var myAjax = new Ajax(url, {method: 'get'}).request();
	[/javascript]

	POST Request with Data as String:
	[javascript]
		var myAjax = new Ajax('save/').request("user_id=25&save=true");
	[/javascript]

	Data from Object Passed via GET:
	[javascript]
		var myAjax = new Ajax('load/').request({'user_id': 25}); //loads url "load/?user_id=25"
	[javascript]

	Data from Element via POST:
	[html]
		<form action="save/" method="post" id="user-form">
			<p>
				Search: <input type="text" name="search" />
				Search in description: <input type="checkbox" name="search_description" value="yes" />
				<input type="submit" />
			</p>
		</form>
	[/html]
	[javascript]
		//Needs to be in a submit event or the form handler
		var myAjax = new Ajax('save/').request($('user-form'));
	[/javascript]

Note:
	If the response's content-type is JavaScript or EcmaScript, everything is evaluated.

See Also:
	<XHR>
*/

var Ajax = new Class({

	Extends: XHR,

	options: {
		update: null,
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(url, options){
		this.addEvent('onSuccess', this.onComplete, true);
		this.parent(url, options);
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

	Syntax:
		>myAjax.request([data]);

	Arguments:
		data - (mixed, optional: defaults to options.data) A String, Object (used in <Object.toQueryString>), or an Element with input elements (used in <Element.toQueryString>) which represents the data to request.

	Returns:
		(class) This Ajax instance.

	Examples:
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
	Generates a query string from key/pair values in an object and URI encodes the values.

Syntax:
	>var myQuery = Object.toQueryString(source);

Arguments:
	source - (object) The object to generate the query string from.

Returns:
	(string) The query string.

Example:
	[javascript]
		Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
	[/javascript]

Note:
	This function gets added to the Object, not to the Object.prototypes.
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

	Syntax:
		>myElement.send([options]);

	Arguments:
		options - (object, optional) Options object for the <Ajax> request.

	Returns:
		(class) An Ajax Class instance.

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

	send: function(options){
		var send = this.$attributes.send;
		if (!send) send = this.$attributes.send = new Ajax(this.getProperty('action'), {method: this.method || 'post', autoCancel: true});
		if (options) send.setOptions(options);
		return send.request(this);
	},

	/*
	Method: update
		Updates the content of the element with an Ajax get request.

	Syntax:
		>myElement.update(url[, options]);

	Arguments:
		url     - (string) The URL pointing to the server-side document.
		options - (object, optional) Options object for the <Ajax> request.

	Returns:
		(class) An Ajax Class instance.

	Example:
		[html]
			<div id="content">Loading content...</div>
		[/html]
		[javascript]
			$('content').update('page_1.html');
		[/javascript]

	Note:
		It saves the Ajax instance to the Element, so it uses the same instance every update call.
	*/

	update: function(url, options){
		var update = this.$attributes.update;
		if (!update) update = this.$attributes.update = new Ajax({update: this, method: 'get', autoCancel: true});
		if (options) update.setOptions(options);
		update.url = url;
		return update.request();
	}

});
