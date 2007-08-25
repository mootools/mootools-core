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
	url - (string) [required] The url pointing to the server-side script.
	options - (object) [optional] See "Options" below. Also utilizes <XHR> options and events.

Options:
	update - (element) [optional] To insert the response text of the XHR into, upon completion of the request.
	evalScripts - (boolean) [false] Execute scripts in the response text onComplete. When the response is javascript the whole response is evaluated.
	evalResponse - (boolean) [false] Force global evalulation of the whole response, no matter what content-type it is.

Events:
	onComplete - (function) Function to execute when the ajax request completes. Arguments are response text and xml.

Example:
	Simple GET request:
	>var myAjax = new Ajax(url, {method: 'get'}).request();

	POST request with data as string
	>var myAjax = new Ajax('save/').request("user_id=25&save=true");

	Data from object via GET
	>var myAjax = new Ajax('load/').request({'user_id': 25}); // loads url "load/?user_id=25"

	Data from Element via POST
	(start code)
	<form action="save/" method="post" id="user-form">
	Search:
	<input type="text" name="search" />
	Search in description:
	<input type="checkbox" name="search_description" value="yes" />
	<input type="submit" />
	</form>
	<script>
	// Needs to be in a submit event or your form handler
	var myAjax = new Ajax('save/').request($('user-form'));
	</script>
	(end)
*/

var Ajax = new Class({

	Extends: XHR,

	options: {
		/*onComplete: $empty,*/
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
	Property: request
		Executes the ajax request.

	Arguments:
		data - (mixed) [optional] The request data, can be a String, an Object (used in <Object.toQueryString>) or an Element holding input elements (used in <Element.toQueryString>).

	Example:
		>var myAjax = new Ajax(url, {method: 'get'});
		>myAjax.request();

		OR

		>new Ajax(url, {method: 'get'}).request();
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

/* Section: Object related Functions */

/*
Function: Object.toQueryString
	Generates a querystring from key/pair values in an object

Arguments:
	source - (object) The object to generate the querystring from.

Returns:
	(string) The querystring.

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
		Sends a form with an ajax request.
		The url is taken from the action attribute, also the method which defaults to post. 

	Arguments:
		options - (object) [optional] Option collection for Ajax request. See <Ajax> for the options list.

	Returns:
		The Ajax Class Instance

	Example:
		(start code)
		<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
		</form>
		<script>
		$('myForm').send();
		</script>
		(end)
	*/

	send: function(options){
		var send = this.$attributes.send;
		if (!send) send = this.$attributes.send = new Ajax(this.getProperty('action'), {method: this.method || 'post', autoCancel: true});
		if (options) send.setOptions(options);
		return send.request(this);
	},

	/*
	Property: update
		Updates the content of the element with an Ajax get request.
		It saves the Ajax instance to the Element, so it uses the same instance every update call.

	Arguments:
		url - (string) [required] The url pointing to the server-side document.
		options - (object) [optional] Option collection for Ajax request. See <Ajax> for the options list.

	Returns:
		The Ajax Class Instance

	Example:
		(start code)
		<div id="content">Loading content ...</>
		<script>
		$('content').update('page_1.html');
		</script>
		(end)
	*/

	update: function(url, options){
		var update = this.$attributes.update;
		if (!update) update = this.$attributes.update = new Ajax({update: this, method: 'get', autoCancel: true});
		if (options) update.setOptions(options);
		update.url = url;
		return update.request();
	}

});