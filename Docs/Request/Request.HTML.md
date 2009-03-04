[Request]: /Request/Request

Class: Request.HTML {#Request-HTML}
===================================

Request Specifically made for receiving HTML.

### Extends:

[Request][]

### Syntax:

	var myHTMLRequest = new Request.HTML([options]);

### Arguments:

1. options - (*object*, optional) See options below.  Also inherited are all the options from [Request][].

### Options:

* evalScripts  - (*boolean*: defaults to true) If set to true, `script` tags inside the response will be evaluated. This overrides the `false` default from Request.
* update - (*element*: defaults to null) The Element to insert the response text of the Request into upon completion of the request.

### Events:

#### success

* (*function*) Function to execute when the HTML request completes. This overrides the signature of the Request success event.

##### Signature:

	onSuccess(responseTree, responseElements, responseHTML, responseJavaScript)

##### Arguments:

1. responseTree 	  - (*element*) The node list of the remote response.
2. responseElements   - (*array*)   An array containing all elements of the remote response.
3. responseHTML		  - (*string*)  The content of the remote response.
4. responseJavaScript - (*string*)  The portion of JavaScript from the remote response.

### Returns:

* (*object*) A new Request.HTML instance.

### Examples:

#### Simple GET Request:

	var myHTMLRequest = new Request.HTML().get('myPage.html');

#### POST Request with data as String:

	var myHTMLRequest = new Request.HTML({url:'myPage.html'}).post("user_id=25&save=true");

#### Data from Object Passed via GET:

	//Loads "load/?user_id=25".
	var myHTMLRequest = new Request.HTML({url:'load/'}).get({'user_id': 25});

#### Data from Element via POST:

##### HTML

	<form action="save/" method="post" id="user-form">
		<p>
			Search: <input type="text" name="search" />
			Search in description: <input type="checkbox" name="search_description" value="yes" />
			<input type="submit" />
		</p>
	</form>

##### JavaScript

	//Needs to be in a submit event or the form handler.
	var myHTMLRequest = new Request.HTML({url:'save/'}).post($('user-form'));

### See Also:

[Request][]


Hash: Element.Properties {#Element-Properties}
==============================================

see [Element.Properties](/Element/Element/#Element-Properties)

Element Property: load {#Element-Properties:load}
-------------------------------------------------

### Setter

Sets a default Request.HTML instance for an Element.

#### Syntax:

	el.set('load'[, options]);

#### Arguments:

1. options - (*object*) The Request options.

#### Returns:

* (*element*) The target Element.

#### Example:

	el.set('load', {evalScripts: true});
	el.load('some/request/uri');


### Getter

Returns either the previously set Request.HTML instance or a new one with default options.

#### Syntax:

	el.get('load', options);

#### Arguments:

1. options - (*object*, optional) The Request.HTML options.  If these are passed in, a new instance will be generated, regardless of whether or not one is set.

#### Returns:

* (*object*) The Request instance.

#### Example:

	el.set('load', {method: 'get'});
	el.load('test.html');
	//The getter returns the Request.HTML instance, making its class methods available.
	el.get('load').post('http://localhost/script');



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].

Element Method: load {#Element:load}
------------------------------------

Updates the content of the Element with a Request.HTML GET request.

### Syntax:

	myElement.load(url);

### Arguments:

1. url - (*string*) The URL pointing to the server-side document.

### Returns:

* (*element*) The target Element.

### Example:

##### HTML

	<div id="content">Loading content...</div>

##### JavaScript

	$('content').load('page_1.html');



### See Also:

- [$][], [Request](/Request/Request)

[$]: /Element/Element/#dollar
