[Request]: /Request/Request

Class: HTML {#Request.HTML}
==========================

An Ajax class, for all your asynchronous needs. Also contains methods to generate querystings from forms and Objects.

### Extends:

[Request][/Request/Request]

### Syntax:

	var myHTMLRequest = new Request.HTML([options]);

### Arguments:

1. url     - (string, optional) The URL pointing to the server-side script.
2. options - (object, optional) In addition to <Request>'s options object, see "Options" below.

### Options:

* url          - (string: defaults to null)  The URL to load.  This can also be passed within the .get() and .post() methods.
* update       - (element: defaults to null) The Element to insert the response text of the Request into upon completion of the request.
* evalScripts  - (boolean: defaults to false) If set to true, <script> tags inside the response will be evaluated.
* evalResponse - (boolean: defaults to false) If set to true, the entire response will be evaluated.

### Events:

#### onComplete

* (function) Function to execute when the HTML request completes.

##### Signature:

	onComplete(responseText, responseXML)

##### Arguments:

1. responseText - (string) The content of the remote response.
2. responseXML  - (string) The XML response of the request.

### Returns:

* (object) A new Ajax instance.

### Examples:

**Simple GET Request:**

	var myHTMLRequest = new Request.HTML().get('myPage.html');

**POST Request with data as String:**

	var myHTMLRequest = new Request.HTML({url:'myPage.html'}).post("user_id=25&save=true");

**Data from Object Passed via GET:**

	var myHTMLRequest = new Request.HTML({url:'load/'}).get({'user_id': 25}); //loads url "load/?user_id=25"

**Data from Element via POST:**

##### HTML
	<form action="save/" method="post" id="user-form">
		<p>
			Search: <input type="text" name="search" />
			Search in description: <input type="checkbox" name="search_description" value="yes" />
			<input type="submit" />
		</p>
	</form>

##### Javascript

	//Needs to be in a submit event or the form handler.
	var myHTMLRequest = new Request.HTML({url:'save/'}).post($('user-form'));

### Note:

* If the response's content-type is JavaScript or EcmaScript, everything is evaluated.

### See Also:

[Request][/Request/Request]



Element Setter,Getter and Method {#Element}
===========================================

Element Setter: html {#Element:Setter:load}
-------------------------------------------

Sets a default Ajax instance for an element

### Syntax:

	el.set('load'[, options]);

### Arguments:

1. options - (object) The Request options.

### Returns:

* (element) The target Element.

### Example:

	el.set('load', {evalScripts: true});
	el.load('some/request/uri');



Element Getter: load {#Element:Getter:load}
-------------------------------------------

Gets the previously setted Ajax instance or a new one with default options

### Syntax:

	el.get('load', url);

### Arguments:

1. **url** - (*string*) the url to associate the Ajax instance with.
2. **options** - (*object*, *optional*) the Ajax options. if passed in will generate a new instance.

### Returns:

* (object) The Request instance.

### Example:

	el.set('load', {method: 'get'});
	el.load('test.html');
	el.get('load'); //Returns the Request.HTML instance.



Element Method: load {#Element:load}
------------------------------------

Updates the content of the element with an Ajax get request.

### Syntax:

	myElement.load(url[, options]);

### Arguments:

1. url     - (string) The URL pointing to the server-side document.
2. options - (object, optional) Options object for the <Ajax> request.

### Returns:

* (element) The target Element.

### Example:

##### HTML

	<div id="content">Loading content...</div>

##### Javascript

	$('content').load('page_1.html');
