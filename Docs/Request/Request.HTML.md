[XHR]: /Request/Request

Class: AJAX {#AJAX.Remote}
==========================

An Ajax class, For all your asynchronous needs. Also contains methods to generate querystings from forms and Objects.

### Extends:

[XHR][]

### Syntax:

	var myAjax = new Ajax(url[, options]);

### Arguments:

1. url     - (string, optional) The url pointing to the server-side script.
2. options - (object, optional) In addition to <XHR>'s options object, see "Options" below.

### Options:

* update       - (element: defaults to null) The Element to insert the response text of the XHR into upon completion of the request.
* evalScripts  - (boolean: defaults to false) If set to true, HTMLScript tags inside the response is evaluated.
* evalResponse - (boolean: defaults to false) If set to true, the entire response is evaluated.

### Events:

#### onComplete

* (function) Function to execute when the AJAX request completes.

##### Signature:

	onComplete(responseText, responseXML)

##### Arguments:

1. responseText - (string) The content of the remote response.
2. responseXML  - (string) The XML response of the request.

### Returns:

* (object) A new Ajax instance.

### Examples:

**Simple GET Request:**

	var myAjax = new Ajax(url, {method: 'get'}).request();

**POST Request with Data as String:**

	var myAjax = new Ajax('save/').request("user_id=25&save=true");

**Data from Object Passed via GET:**

	var myAjax = new Ajax('load/').request({'user_id': 25}); //loads url "load/?user_id=25"

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

	//Needs to be in a submit event or the form handler
	var myAjax = new Ajax('save/').request($('user-form'));

### Note:

* If the response's content-type is JavaScript or EcmaScript, everything is evaluated.

### See Also:

[XHR][]



Element Setter,Getter and Method {#Element}
===========================================

Element Setter: html {#Element:Setter:load}
-------------------------------------------

Sets a default Ajax instance for an element

### Syntax:

	el.set('load'[, options]);

### Arguments:

1. options - (object) the Ajax options.

### Returns:

* (element) this element

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

* (object) the Ajax instance

### Example:

	el.set('load', {method: 'get'});
	el.load('test.html');

	el.get('load'); //the Ajax instance



Element Method: load {#Element:load}
------------------------------------

Updates the content of the element with an Ajax get request.

### Syntax:

	myElement.load(url[, options]);

### Arguments:

1. url     - (string) The URL pointing to the server-side document.
2. options - (object, optional) Options object for the <Ajax> request.

### Returns:

* (element) This Element.

### Example:

##### HTML

	<div id="content">Loading content...</div>

##### Javascript

	$('content').load('page_1.html');