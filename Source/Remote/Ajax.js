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
		/*onComplete: $empty,*/
		update: null,
		evalScripts: false,
		evalResponse: false
	},

	initialize: function(url, options){
		this.addEvent('onSuccess', this.onComplete, true);
		arguments.callee.parent(url, options);
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
		this.fireEvent('onComplete', [this.response.text, this.response.xml]);
	},

	/*
	Method: request
		Executes the AJAX request.

	Syntax:
		>myAjax.request([data]);

	Arguments:
		data - (mixed, optional: defaults to options.data) A String, Object (used in <Hash.toQueryString>), or an Element with input elements (used in <Element.toQueryString>) which represents the data to request.

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
			case 'hash': case 'object': data = Hash.toQueryString(data);
		}
		if (this._method) data = (data) ? this._method + '&' + data : this._method;
		return arguments.callee.parent(data);
	}

});

/*
Native: Hash
	A Custom "Object" ({}) implementation which does not account for prototypes when setting, getting, iterating.
*/

/*
Method: toQueryString
	Generates a query string from key/pair values in an object and URI encodes the values.

Syntax:
	>var myHash = new Hash({...}); = myHash.toQueryString();

Arguments:
	source - (object) The object to generate the query string from.

Returns:
	(string) The query string.

Examples:
	Using Hash generic:
	[javascript]
		Hash.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
	[/javascript]

	Using Hash instance:
	[javascript]
		var myHash = new Hash({apple: "red", lemon: "yellow"});
		myHash.toQueryString(); //returns "apple=red&lemon=yellow"
	[/javascript]
*/

Hash.implement({

	toQueryString: function(){
		var queryString = [];
		Hash.each(this, function(value, key){
			queryString.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
		});
		return queryString.join('&');
	}

});

/*
Native: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.Set.extend({
	
	/*
	Element Setter: send
		sets a default Ajax instance for an element (possibly a form!)

	Syntax:
		>el.set('send'[, options]);

	Arguments: 
		options - (object) the Ajax options.

	Returns:
		(element) this element

	Example:
		[javascript]
			myForm.set('send', {method: 'get'});
			myForm.send(); //form sent!
		[/javascript]
	*/

	send: function(options){
		if (this.$attributes.$send) this.$attributes.$send.cancel();
		this.$attributes.$send = new Ajax(this.get('action'), $merge({autoCancel: true, method: this.get('method') || 'post'}, options));
		return this;
	},
	
	/*
	Element Setter: load
		sets a default Ajax instance for an element

	Syntax:
		>el.set('load'[, options]);

	Arguments: 
		options - (object) the Ajax options.

	Returns:
		(element) this element

	Example:
		[javascript]
			el.set('load', {evalScripts: true});
			el.load('some/request/uri');
		[/javascript]
	*/
	
	load: function(options){
		if (this.$attributes.$load) this.$attributes.$load.cancel();
		this.$attributes.$load = new Ajax($merge({autoCancel: true, update: this, method: 'get'}, options));
		return this;
	}

});


Element.Get.extend({
	
	/*
	Element Getter: send
		gets the previously setted Ajax instance or a new one with default options

	Syntax:
		>el.get('send');

	Arguments:
		options - (object, optional) the Ajax options. if passed in will generate a new instance.

	Returns:
		(object) the Ajax instance

	Example:
		[javascript]
			el.set('send', {method: 'get'});
			el.send();

			el.get('send'); //the Ajax instance
		[/javascript]
	*/
	
	send: function(options){
		if (!this.$attributes.$send || options) this.set('send', options);
		return this.$attributes.$send;
	},
	
	/*
	Element Getter: load
		gets the previously setted Ajax instance or a new one with default options

	Syntax:
		>el.get('load', url);
		
	Arguments:
		url - (string) the url to associate the Ajax instance with.
		options - (object, optional) the Ajax options. if passed in will generate a new instance.

	Returns:
		(object) the Ajax instance

	Example:
		[javascript]
			el.set('load', {method: 'get'});
			el.load('test.html');

			el.get('load'); //the Ajax instance
		[/javascript]
	*/
	
	load: function(url, options){
		if (!this.$attributes.$load || options) this.set('load', options);
		this.$attributes.$load.url = url;
		return this.$attributes.$load;
	}

});

Element.implement({

	/*
	Method: send
		Sends a form with an Ajax request.

	Syntax:
		>myElement.send([options]);

	Arguments:
		options - (object, optional) Options object for the <Ajax> request.

	Returns:
		(element) This Element.

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
		this.get('send', options).request(this);
		return this;
	},

	/*
	Method: load
		Updates the content of the element with an Ajax get request.

	Syntax:
		>myElement.load(url[, options]);

	Arguments:
		url     - (string) The URL pointing to the server-side document.
		options - (object, optional) Options object for the <Ajax> request.

	Returns:
		(element) This Element.

	Example:
		[html]
			<div id="content">Loading content...</div>
		[/html]
		[javascript]
			$('content').load('page_1.html');
		[/javascript]
	*/

	load: function(url, options){
		this.get('load', url, options).request();
		return this;
	}

});