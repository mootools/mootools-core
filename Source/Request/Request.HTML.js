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
	url     - (string, optional) The url pointing to the server-side script.
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
	(object) A new Ajax instance.

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

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		evalScripts: true,
		filter: false
	},

	bodyRegExp: (/<body[^>]*>([\s\S]*?)<\/body>/i),

	processHTML: function(text){
		var match = text.match(this.bodyRegExp);
		return (match) ? match[1] : text;
	},

	onSuccess: function(text){
		var opts = this.options, res = this.response;
		res.html = this.processScripts(this.processHTML(text));
		var node = new Element('div', {html: res.html});
		res.elements = node.getElements('*');
		res.tree = (opts.filter) ? res.elements.filterBy(opts.filter) : $A(node.childNodes).filter(function(el){
			var type = $type(el);
			return (type != 'whitespace' && (type == 'textnode' || !el.match('script')));
		});
		if (opts.update) $(opts.update).empty().adopt(res.tree);
		arguments.callee.parent([res.tree, res.elements, res.html], false);
	}

});

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

Element.Properties.load = {

	get: function(options){
		if (options || !this.retrieve('load')) this.set('load', options);
		return this.retrieve('load');
	},

	set: function(options){
		var load = this.retrieve('load');
		if (load) load.cancel();
		return this.store('load', new Request.HTML($extend({autoCancel: true, update: this, method: 'get'}, options)));
	}

};

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

Element.implement('load', function(){
	this.get('load').send(Array.link(arguments, {data: Object.type, url: String.type}));
	return this;
});