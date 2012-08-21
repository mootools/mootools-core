Type: Window {#Window}
======================

The following functions are treated as Window methods.

Function: document.id {#Window:document-id}
-------------------------------------------

The document.id function has a dual purpose: Getting the element by its id, and making an element in Internet Explorer "grab" all the [Element][] methods.

### Syntax:

	var myElement = document.id(el);

### Arguments:

1. el - The Element to be extended. Can be one of the following types:
	* (*element*) The element will be extended if it is not already.
	* (*string*) A string containing the id of the DOM element desired.
	* (*object*) If the object has a toElement method, toElement will be called to get the Element.

### Returns:

* (*element*) A DOM element.
* (*null*) Null if no matching id was found or if toElement did not return an element.

### Examples:

#### Get a DOM Element by ID:

	var myElement = document.id('myElement');

#### Get a DOM Element by reference:

	var div = document.getElementById('myElement');
	div = document.id(div); // the element with all the Element methods applied.

### Notes:

- This method is useful when it's unclear if working with an actual element or an id.  It also serves as a shorthand for document.getElementById().
- In Internet Explorer, the [Element][] is extended the first time document.id is called on it, and all the [Element][] Methods become available.
- Browsers with native HTMLElement support, such as Safari, Firefox, and Opera, apply all the [Element][] Methods to every DOM element automatically.
- Because MooTools detects if an element needs to be extended or not, this function may be called on the same Element many times with no ill effects.


Function: $ {#Window:dollar}
----------------------------

The dollar function is an alias for [document:id][] if the $ variable is not set already.
However it is not recommended to use more frameworks, the $ variable can be set by another framework or script. MooTools will detect this and determine if it will set the $ function so it will not be overwritten.

### Examples:

	var myElement = $('myElement');
	var myElement2 = document.id('myElement');

	myElement == myElement2; // returns true


	(function($){

		// Now you can use $ safely in this closure

	})(document.id)


### See Also:
 - MooTools Blogpost: [The Dollar Safe Mode][]


Function: $$ {#Window:dollars}
------------------------------

Selects and extends DOM elements. Return an Elements instance.
The Element instance returned is an array-like object, supporting every [Array][] method and every [Element][] method.

### Syntax:

	var myElements = $$(argument);

### Arguments:

* selector - (*string*) A CSS selector
* elements - (*elements*), (*collection*) or (*array*) An enumerable list of elements
* element, element - (*element*) any number of elements as arguments

### Returns:

* (*elements*) - An array-like Elements collection of all the DOM elements matched, extended with [document:id][].

### Examples:

#### Get Elements by Their Tag Names:

	$$('a'); // returns all anchor elements in the page.

#### Get an Elements instance by passing multiple elements:

	$$(element1, element2, element3); // returns an Elements instance containing these 3 elements.

#### Convert any array or collection of elements to an Elements instance:

	$$([element1, element2, element3]); // returns an Elements instance containing these 3 elements.
	$$(document.getElementsByTagName('a')); // returns an Elements instance containing the result of the getElementsByTagName call.

#### Using CSS Selectors:

	$$('#myElement'); // returns an Elements instance containing only the element with the id 'myElement'.
	$$('#myElement a.myClass'); // returns an Elements instance of all anchor tags with the class 'myClass' within the DOM element with id 'myElement'.
	$$('a, b'); // returns an array of all anchor and bold elements in the page.

### Notes:

- Since MooTools 1.3 this function does not accept multiple collections or multiple strings as arguments.
- If an expression doesn't find any elements, an empty Elements instance will be returned.
- The return type of element methods run through [$$][] is always an Elements instance, regardless of the amount of results.
- Default Selectors supported are the same as you can find on [W3C CSS3 selectors](http://www.w3.org/TR/css3-selectors/#selectors).


Type: Element {#Element}
========================

Custom Type to allow all of its methods to be used with any extended DOM Element.



Element Method: constructor {#Element:constructor}
--------------------------------------------------

Creates a new Element of the type passed in.

### Syntax:

	var myEl = new Element(element[, properties]);

### Arguments:

1. element - (*mixed*) The tag name for the Element to be created or an actual DOM element or a CSS selector.
2. properties - (*object*, optional) Calls the Single Argument version of [Element:set][] with the properties object passed in.

### Returns:

* (*element*) A new MooTools extended HTML Element.

### Examples:

	// Creating an new anchor with an Object
	var myAnchor = new Element('a', {
		href: 'http://mootools.net',
		'class': 'myClass',
		html: 'Click me!',
		styles: {
			display: 'block',
			border: '1px solid black'
		},
		events: {
			click: function(){
				alert('clicked');
			},
			mouseover: function(){
				alert('mouseovered');
			}
		}
	});

	// Using Selectors
	var myNewElement = new Element('a.myClass');

### Note:

Because the element name is parsed as a CSS selector, colons in namespaced tags have to be escaped. So `new Element('fb\:name)` becomes `<fb:name>`.

### See Also:

- [$][], [Element:set][]



Element Method: getElement {#Element:getElement}
------------------------------------------------

Gets the first descendant element whose tag name matches the tag provided. CSS selectors may also be passed.

### Syntax:

	var myElement = myElement.getElement(tag);

### Arguments:

1. tag - (*string*) Tag name of the element to find or a CSS Selector.

### Returns:

* (*mixed*) If a match is found, the Element will be returned. Otherwise, returns null.

### Examples:

	var firstDiv = $(document.body).getElement('div');

### Notes:

- This method is also available for Document instances.
- Default Selectors supported are the same as you can find on [W3C CSS3 selectors](http://www.w3.org/TR/css3-selectors/#selectors).



Element Method: getElements {#Element:getElements}
--------------------------------------------------

Collects all descendant elements whose tag name matches the tag provided. CSS selectors may also be passed.

### Syntax:

	var myElements = myElement.getElements(tag);

### Arguments:

1. tag - (*string*) String of the tag to match  or a CSS Selector.

### Returns:

* (*array*) An [Elements][] array of all matched Elements.

### Examples:

	var allAnchors = $(document.body).getElements('a');

### Notes:

- This method is also available for Document instances.
- Default Selectors supported are the same as you can find on [W3C CSS3 selectors](http://www.w3.org/TR/css3-selectors/#selectors).



Element Method: getElementById {#Element:getElementById}
--------------------------------------------------------

Gets the element with the specified id found inside the current Element.

### Syntax:

	var myElement = anElement.getElementById(id);

### Arguments:

1. id - (*string*) The ID of the Element to find.

### Returns:

* (*mixed*) If a match is found, returns that Element. Otherwise, returns null.

### Examples:

	var myChild = $('myParent').getElementById('myChild');

### Notes:

- This method is not provided for Document instances as document.getElementById is provided natively.



Element Method: set {#Element:set}
----------------------------

This is a "dynamic arguments" method. Properties passed in can be any of the 'set' properties in the [Element.Properties][] Object.

### Syntax:

	myElement.set(arguments);

### Arguments:

- Two Arguments (property, value)
	1. property - (*string*) The string key from the [Element.Properties][] Object representing the property to set.
	2. value - (*mixed*) The value to set for the specified property.
- One Argument (properties)
	1. properties - (*object*) Object with its keys/value pairs representing the properties and values to set for the Element (as described below).

### Returns:

* (*element*) This Element.

### Examples:

#### With Property and Value:

	$('myElement').set('text', 'text goes here');
	$('myElement').set('class', 'active');
	// the 'styles' property passes the object to Element:setStyles.
	var body = $(document.body).set('styles', {
		font: '12px Arial',
		color: 'blue'
	});

#### With an Object:

	var myElement = $('myElement').set({
		// the 'styles' property passes the object to Element:setStyles.
		styles: {
			font: '12px Arial',
			color: 'blue',
			border: '1px solid #f00'
		},
		// the 'events' property passes the object to Element:addEvents.
		events: {
			click: function(){ alert('click'); },
			mouseover: function(){ this.addClass('over'); }
		},
		//Any other property uses Element:setProperty.
		id: 'documentBody'
	});

### Notes:

- All the property arguments are passed to the corresponding method of the [Element.Properties][] Object.
- If no matching property is found in [Element.Properties][], it falls back to [Element:setProperty][].
- Whenever using [Element:setProperty][] to set an attribute, pass in the lowercase, simplified form of the property. For example:
	- use 'for', not 'htmlFor',
	- use 'class', not 'className'
	- use 'frameborder', not 'frameBorder'
	- etc.
- In IE8 or lower, it is not possible to set `type` multiple times. It will throw an error.


### See Also:

- [Element][], [Element.Properties][], [Element:setProperty][], [Element:addEvents][], [Element:setStyles][]



Element Method: get {#Element:get}
----------------------------------

This is a "dynamic arguments" method. Properties passed in can be any of the 'get' properties in the [Element.Properties][] Object.

### Syntax:

	myElement.get(property);

### Arguments:

1. property - (*string*) The string key from the [Element.Properties][] Object representing the property to get.

### Returns:

* (*mixed*) The result of calling the corresponding 'get' function in the [Element.Properties][] Object.

### Examples:

#### Using Custom Getters:

	var tag = $('myDiv').get('tag'); // returns "div".

#### Fallback to Element Attributes:

	var id = $('myDiv').get('id'); // returns "myDiv".
	var value = $('myInput').get('value'); // returns the myInput element's value.

### Notes:

-  If the corresponding accessor doesn't exist in the [Element.Properties][] Object, the result of [Element:getProperty][] on the property passed in is returned.

### See Also:

- [Element][], [Element.Properties][], [Element:getProperty][]



Element Method: erase {#Element:erase}
--------------------------------------

This is a "dynamic arguments" method. Properties passed in can be any of the 'erase' properties in the [Element.Properties][] Object.

### Syntax:

	myElement.erase(property);

### Arguments:

1. property - (*string*) The string key from the [Element.Properties][] Object representing the property to erase.

### Returns:

* (*mixed*) The result of calling the corresponding 'erase' function in the [Element.Properties][] Object.

### Examples:

	$('myDiv').erase('id'); //Removes the id from myDiv.
	$('myDiv').erase('class'); //myDiv element no longer has any class names set.

### Note:

-  If the corresponding eraser doesn't exist in the  [Element.Properties][] Object, [Element:removeProperty][] is called with the property passed in.

### See Also:

- [Element][], [Element.Properties][], [Element:removeProperty][]



Element Method: match {#Element:match}
--------------------------------------

Tests this Element to see if it matches the argument passed in.

### Syntax:

	myElement.match(match);

### Arguments:

1. match - can be a string or element
	- (*string*) The tag name to test against this element. Any single CSS selectors may also be passed.
	- (*element*) An element to match; returns true if this is the actual element passed in.

### Returns:

* (*boolean*) If the element matched, returns true. Otherwise, returns false.

### Examples:

#### Using a Tag Name:

	// returns true if #myDiv is a div.
	$('myDiv').match('div');

#### Using a CSS Selector:

	// returns true if #myDiv has the class foo and is named "bar"
	$('myDiv').match('.foo[name=bar]');

#### Using an Element:

	var el = $('myDiv');
	$('myDiv').match(el); // returns true
	$('otherElement').match(el); // returns false



Element Method: contains {#Element:contains}
--------------------------------------------

Checks all descendants of this Element for a match.


### Syntax:

	var result = myElement.contains(el);

### Arguments:

1. el - (*element*) The element to search for.

### Returns:

* (*boolean*) Returns true if the element contains passed in Element is a child, otherwise false.

### Examples:

##### HTML

	<div id="Darth_Vader">
		<div id="Luke"></div>
	</div>

##### JavaScript

	if ($('Darth_Vader').contains($('Luke'))) alert('Luke, I am your father.'); //tan tan tannn...



Element Method: inject {#Element:inject}
----------------------------------------

Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the argument).

### Syntax:

	myElement.inject(el[, where]);

### Arguments:

1. el	- (*mixed*) el can be the id of an element or an element.
2. where - (*string*, optional: defaults to 'bottom') The place to inject this Element.  Can be 'top', 'bottom', 'after', or 'before'.

### Returns:

* (*element*) This Element.

### Examples:

##### JavaScript

	var myFirstElement  = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('div', {id: 'mySecondElement'});
	var myThirdElement  = new Element('div', {id: 'myThirdElement'});

##### Resulting HTML

	<div id="myFirstElement"></div>
	<div id="mySecondElement"></div>
	<div id="myThirdElement"></div>

#### Inject to the bottom:

##### JavaScript

	myFirstElement.inject(mySecondElement);

##### Resulting HTML

	<div id="mySecondElement">
		<div id="myFirstElement"></div>
	</div>

#### Inject to the top:

##### JavaScript

	myThirdElement.inject(mySecondElement, 'top');

##### Resulting HTML

	<div id="mySecondElement">
		<div id="myThirdElement"></div>
		<div id="myFirstElement"></div>
	</div>

#### Inject before:

##### JavaScript

	myFirstElement.inject(mySecondElement, 'before');

##### Resulting HTML

	<div id="myFirstElement"></div>
	<div id="mySecondElement"></div>

#### Inject After:

##### JavaScript

	myFirstElement.inject(mySecondElement, 'after');

##### Resulting HTML

	<div id="mySecondElement"></div>
	<div id="myFirstElement"></div>

### See Also:

[Element:adopt](#Element:adopt), [Element:grab](#Element:grab), [Element:wraps](#Element:wraps)



Element Method: grab {#Element:grab}
------------------------------------

Works as [Element:inject](#Element:inject), but in reverse.

Appends the Element at a particular place relative to the Element's children (specified by the where parameter).

### Syntax:

	myElement.grab(el[, where]);

### Arguments:

1. el - (*mixed*) el can be the id of an element or an Element.
2. where - (*string*, optional: default 'bottom') The place to append this Element. Can be 'top', 'bottom', 'before' or 'after'.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="first">
		<div id="child"></div>
	</div>

##### JavaScript

	var mySecondElement = new Element('div#second');
	$('first').grab(mySecondElement);

##### Resulting HTML

	<div id="first">
		<div id="child"></div>
		<div id="second"></div>
	</div>

##### JavaScript

	var mySecondElement = new Element('div#second');
	myFirstElement.grab(mySecondElement, 'top');

##### Resulting HTML

	<div id="first">
		<div id="second"></div>
		<div id="child"></div>
	</div>

### See Also:

[Element:adopt](#Element:adopt), [Element:inject](#Element:inject), [Element:wraps](#Element:wraps)



Element Method: adopt {#Element:adopt}
--------------------------------------

Works like [Element:grab](#Element:grab), but allows multiple elements to be adopted and only appended at the bottom.

Inserts the passed element(s) inside the Element (which will then become the parent element).

### Syntax:

	myParent.adopt(el[, others]);

### Arguments:

1. el - (*mixed*) The id of an element, an Element, or an array of elements.
2. others - (*mixed*, optional) One or more additional Elements separated by a comma or as an array.

### Returns:

* (*element*) This Element.

### Examples:

##### JavaScript

	var myFirstElement  = new Element('div#first');
	var mySecondElement = new Element('p#second');
	var myThirdElement  = new Element('ul#third');
	var myFourthElement = new Element('a#fourth');

	var myParentElement = new Element('div#parent');

	myFirstElement.adopt(mySecondElement);
	mySecondElement.adopt(myThirdElement, myFourthElement);
	myParentElement.adopt([myFirstElement, new Element('span#another')]);

##### Resulting HTML

	<div id="parent">
		<div id="first">
			<p id="second">
				<ul id="third"></ul>
				<a id="fourth"></a>
			</p>
		</div>
		<span id="another"></span>
	</div>

### See Also:

[Element:grab](#Element:grab), [Element:inject](#Element:inject), [Element:wraps](#Element:wraps)



Element Method: wraps {#Element:wraps}
--------------------------------------

Works like [Element:grab](#Element:grab), but replaces the element in its place, and then appends the replaced element in the location specified inside the this element.

### Syntax:

	myParent.wraps(el[, where]);

### Arguments:

1. el - (*mixed*) The id of an element or an Element.
2. where - (*string*, optional: default 'bottom') The place to insert the passed in element. Can be 'top' or 'bottom'.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="first"></div>

##### JavaScript

	var mySecondElement = new Element('div#second').wraps('first');

##### Resulting HTML

	<div id="second">
		<div id="first"></div>
	</div>

##### HTML

	<div id="first"></div>
	<div id="second">
		<div id="child"></div>
	</div>

##### JavaScript

	$('second').wraps('first');

##### Resulting HTML

	<div id="second">
		<div id="child"></div>
		<div id="first"></div>
	</div>

##### JavaScript

	$('second').wraps('first', 'top');

##### Resulting HTML

	<div id="second">
		<div id="first"></div>
		<div id="child"></div>
	</div>

Element Method: appendHTML {#Element:appendHTML}
------------------------------------------------

Works like [Element:grab](#Element:grab), but instead of accepting an id or an element, it only accepts an HTML string.
The HTML string will be parsed to create new DOM elements, and then injected relative to the element from where the method
was called.

### Syntax:

	myElement.appendHTML(html[, where]);

### Arguments:

1. html - (*string*) The HTML string to append.
1. where - (*string*, optional: default 'bottom') The position to inject the text to. Values accepted are 'top', 'bottom', 'before' and 'after'.

### Returns:

* (*element*) The current Element instance.

### Examples:

##### HTML

	<div id="myElement">Hey.</div>

##### JavaScript

	$('myElement').appendHTML(' <strong>Howdy.</strong>');

##### Resulting HTML

	<div id="myElement">Hey. <strong>Howdy.</strong></div>

### Notes:

- This method does *not* use the `innerHTML` property of an element but instead creates elements
directly before injecting them. Thus, it is safe to use in cases where you don't want to destroy
any descendant elements already present in the parent.
- This method uses `insertAdjacentHTML` when available.

### See Also:

- [MDC Element:insertAdjacentHTML][].


Element Method: appendText {#Element:appendText}
------------------------------------------------

Works like [Element:grab](#Element:grab), but instead of accepting an id or an element, it only accepts text.
A text node will be created inside this Element, in either the top or bottom position.

### Syntax:

	myElement.appendText(text[, where]);

### Arguments:

1. text  - (*string*) The text to append.
1. where - (*string*, optional: default 'bottom') The position to inject the text to. Values accepted are 'top', 'bottom', 'before' and 'after'.

### Returns:

* (*element*) The current Element instance.

### Examples:

##### HTML

	<div id="myElement">Hey.</div>

##### JavaScript

	$('myElement').appendText(' Howdy.');

##### Resulting HTML

	<div id="myElement">Hey. Howdy.</div>



Element Method: dispose {#Element:dispose}
------------------------------------------

Removes the Element from the DOM.


### Syntax:

	var removedElement = myElement.dispose();

### Returns:

* (*element*) This Element. Useful to always grab the return from this function, as the element could be [injected](#Element:inject) back.

### Examples:

##### HTML

	<div id="myElement"></div>
	<div id="mySecondElement"></div>

##### JavaScript

	$('myElement').dispose();

##### Resulting HTML

	<div id="mySecondElement"></div>

### See Also:

- [MDC Element:removeChild][]



Element Method: clone {#Element:clone}
--------------------------------------

Clones the Element and returns the cloned one.


### Syntax:

	var copy = myElement.clone([contents, keepid]);

### Arguments:

1. contents - (*boolean*, optional: defaults to true) When set to false the Element's contents are not cloned.
2. keepid - (*boolean*, optional: defaults to false) When true the cloned Element keeps the id attribute, if present. Same goes for any of the cloned childNodes.


### Returns:

* (*element*) The cloned Element.

### Examples:

##### HTML

	<div id="myElement">ciao</div>

##### JavaScript

	// clones the Element and appends the clone after the Element.
	var clone = $('myElement').clone().inject('myElement','after');

##### Resulting HTML

	<div id="myElement">ciao</div>
	<div>ciao</div>

### Note:

- The returned Element does not have attached events. To clone the events use [Element:cloneEvents](/Element/Element.Event#Element:cloneEvents).
- Values stored in Element.Storage are not cloned.
- The clone element and its children are stripped of ids, unless otherwise specified by the keepid parameter.

### See Also:

- [Element:cloneEvents](/Element/Element.Event#Element:cloneEvents).



Element Method: replaces {#Element:replaces}
--------------------------------------------------

Replaces the passed Element with Element.

### Syntax:

	var element = myElement.replaces(el);

### Arguments:

1. el - (*mixed*) A string id representing the Element to be replaced, or an Element reference.

### Returns:

* (*element*) This Element.

### Examples:

	$('myNewElement').replaces($('myOldElement'));
	//$('myOldElement') is gone, and $('myNewElement') is in its place.

### See Also:

- [MDC Element:replaceChild][]



Element Method: hasClass {#Element:hasClass}
--------------------------------------------

Tests the Element to see if it has the passed in className.

### Syntax:

	var result = myElement.hasClass(className);

### Arguments:

1. className - (*string*) The class name to test.

### Returns:

* (*boolean*) Returns true if the Element has the class, otherwise false.

### Examples:

##### HTML

	<div id="myElement" class="testClass"></div>

##### JavaScript

	$('myElement').hasClass('testClass'); // returns true



Element Method: addClass {#Element:addClass}
--------------------------------------------

Adds the passed in class to the Element, if the Element doesnt already have it.

### Syntax:

	myElement.addClass(className);

### Arguments:

1. className - (*string*) The class name to add.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="myElement" class="testClass"></div>

##### JavaScript

	$('myElement').addClass('newClass');

##### Resulting HTML

	<div id="myElement" class="testClass newClass"></div>



Element Method: removeClass {#Element:removeClass}
----------------------------

Works like [Element:addClass](#Element:addClass), but removes the class from the Element.


### Syntax:

	myElement.removeClass(className);

### Arguments:

1. className - (*string*) The class name to remove.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="myElement" class="testClass newClass"></div>

##### JavaScript

	$('myElement').removeClass('newClass');

##### Resulting HTML

	<div id="myElement" class="testClass"></div>



Element Method: toggleClass {#Element:toggleClass}
--------------------------------------------------

Adds or removes the passed in class name to the Element, depending on whether or not it's already present.

### Syntax:

	myElement.toggleClass(className, force);

### Arguments:

1. className - (*string*) The class to add or remove.
2. force - (*boolean*, optional) Force the class to be either added or removed

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="myElement" class="myClass"></div>

##### JavaScript

	$('myElement').toggleClass('myClass');

##### Resulting HTML

	<div id="myElement" class=""></div>

##### JavaScript

	$('myElement').toggleClass('myClass');

##### Resulting HTML

	<div id="myElement" class="myClass"></div>



Element Method: getPrevious {#Element:getPrevious}
--------------------------------------------------

Returns the previousSibling of the Element (excluding text nodes).

### Syntax:

	var previousSibling = myElement.getPrevious([match]);

### Arguments:

1. match - (*string*, optional): A tag name to match the the found element(s) with. A full CSS selector can be passed.

### Returns:

* (*mixed*) The previous sibling Element or null if none found.



Element Method: getAllPrevious {#Element:getAllPrevious}
--------------------------------------------------------

Like [Element:getPrevious][], but returns a collection of all the matched previousSiblings.



Element Method: getNext {#Element:getNext}
------------------------------------------

As [Element:getPrevious][], but tries to find the nextSibling (excluding text nodes).


### Syntax:

	var nextSibling = myElement.getNext([match]);

### Arguments:

1. match - (*string*, optional): A comma seperated list of tag names to match the found element(s) with. A full CSS selector can be passed.

### Returns:

* (*mixed*) The next sibling Element or null if none found.


Element Method: getAllNext {#Element:getAllNext}
------------------------------------------------

Like Element.getNext, but returns a collection of all the matched nextSiblings.



Element Method: getFirst {#Element:getFirst}
--------------------------------------------

Gets the first element that matches the passed in expression.


### Syntax:

	var firstElement = myElement.getFirst([match]);

### Arguments:

1. match - (*string*, optional): A full CSS selector to match the found element(s) with.

### Returns:

* (*mixed*) The first found element or null if none found.



Element Method: getLast {#Element:getLast}
------------------------------------------

Gets the last element that matches the passed in expression.

### Syntax:

	var lastElement = myElement.getLast([match]);

### Arguments:

1. match - (*string*, optional): A full CSS selector to match the found element(s) with.

### Returns:

* (*mixed*) The last found element, or returns null if none found.



Element Method: getParent {#Element:getParent}
----------------------------------------------

Works as [Element:getPrevious][], but tries to find the parentNode.


### Syntax:

	var parent = myElement.getParent([match]);

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. A full CSS selector can be passed.

### Returns:

* (*mixed*) The target Element's parent or null if no matching parent is found.



Element Method: getParents {#Element:getParents}
------------------------------------------------

Like [Element:getParent](#Element:getParent), but returns a collection of all the matched parentNodes up the tree.

### Returns:

* (*array*) If no matching parents are found, an empty array is returned.



Element Method: getSiblings {#Element:getSiblings}
--------------------------------------------------

Like [Element:getAllPrevious][] but returns all Element's previous and next siblings (excluding text nodes). Returns as [Elements][].


### Syntax:

	var siblings = myElement.getSiblings([match]);

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. A full CSS selector can be passed.

### Returns:

* (*array*) A [Elements](#Elements) array with all of the Element's siblings, except the text nodes.



Element Method: getChildren {#Element:getChildren}
--------------------------------------------------

Returns all the Element's children (excluding text nodes). Returns as [Elements][].


### Syntax:

	var children = myElement.getChildren([match]);

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. A full CSS selector can be passed.

### Returns:

* (*array*) A [Elements](#Elements) array with all of the Element's children, except the text nodes.

### Note:

The difference between the methods *getChildren* and *getElements* is that getChildren will only return its direct children while getElements searches for all the Elements in any depth.

Element Method: empty {#Element:empty}
--------------------------------------

Empties an Element of all its children.


### Syntax:

	myElement.empty();

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<div id="myElement">
		<p></p>
		<span></span>
	</div>

##### JavaScript

	$('myElement').empty();

##### Resulting HTML

	<div id="myElement"></div>



Element Method: destroy {#Element:destroy}
------------------------------------------

Removes the Element and its children from the DOM and prepares them for garbage collection.

### Syntax:

	myElement.destroy();

### Returns:

* (*null*)



Element Method: toQueryString {#Element:toQueryString}
------------------------------------------------------

Reads the child inputs of the Element and generates a query string based on their values.


### Syntax:

	var query = myElement.toQueryString();

### Returns:

* (*string*) A string representation of a all the input Elements' names and values.

### Examples:

##### HTML

	<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com" />
		<input name="zipCode" value="90210" />
	</form>

##### JavaScript

	$('myForm').toQueryString(); // returns "email=bob@bob.com&zipCode=90210".


Element Method: getSelected {#Element:getSelected}
--------------------------------------------------

Returns the selected options of a select element.


### Syntax:

	var selected = mySelect.getSelected();

### Returns:

* (*array*) An array of the selected elements.

### Examples:

##### HTML

	<select id="country-select" name="country">
		<option value="US">United States</option
		<option value ="IT">Italy</option>
	</select>

##### JavaScript

	$('country-select').getSelected(); // returns whatever the user selected.

### Note:

This method returns an array, regardless of the multiple attribute of the select element.
If the select is single, it will return an array with only one item.



Element Method: getProperty {#Element:getProperty}
--------------------------------------------------

Returns a single element attribute.

### Syntax:

	var myProp = myElement.getProperty(property);

### Arguments:

* property - (*string*) The property to be retrieved.

### Returns:

* (*string*) A string containing the Element's requested property.

### Examples:

##### HTML

	<img id="myImage" src="mootools.png" title="MooTools, the compact JavaScript framework" alt="" />

##### JavaScript

	var imgProps = $('myImage').getProperty('src'); // returns: 'mootools.png'.



Element Method: getProperties {#Element:getProperties}
------------------------------------------------------

Gets multiple element attributes.

### Syntax:

	var myProps = myElement.getProperties(properties);

### Arguments:

* properties - (*strings*) Any number of properties to be retrieved.

### Returns:

* (*object*) An object containing all of the Element's requested properties.

### Examples:

##### HTML

	<img id="myImage" src="mootools.png" title="MooTools, the compact JavaScript framework" alt="" />

##### JavaScript

	var imgProps = $('myImage').getProperties('id', 'src', 'title', 'alt');
	// returns: { id: 'myImage', src: 'mootools.png', title: 'MooTools, the compact JavaScript framework', alt: '' }



Element Method: setProperty {#Element:setProperty}
--------------------------------------------------

Sets an attribute or special property for this Element.


### Arguments:

1. property - (*string*) The property to assign the value passed in.
2. value - (*mixed*) The value to assign to the property passed in.

### Returns:

* (*element*) - This Element.

### Examples:

##### HTML

	<img id="myImage" />

##### JavaScript

	$('myImage').setProperty('src', 'mootools.png');

##### Resulting HTML

	<img id="myImage" src="mootools.png" />

### Note

- Whenever using [Element:setProperty][] to set an attribute, pass in the lowercase, simplified form of the property. For example:
	- use 'for', not 'htmlFor',
	- use 'class', not 'className'
	- use 'frameborder', not 'frameBorder'
	- etc.
- When setting the `src` property for an image file, be sure to remove the `width` and `height` attribute (use `Element.removeAttribute`). IE7, and less, set and freeze the `width` and `height` of an image if previously specified.

Element Method: setProperties {#Element:setProperties}
------------------------------------------------------

Sets numerous attributes for the Element.


### Arguments:

1. properties - (*object*) An object with key/value pairs.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<img id="myImage" />

##### JavaScript

	$('myImage').setProperties({
		src: 'whatever.gif',
		alt: 'whatever dude'
	});

##### Resulting HTML

	<img id="myImage" src="whatever.gif" alt="whatever dude" />



Element Method: removeProperty {#Element:removeProperty}
--------------------------------------------------------

Removes an attribute from the Element.


### Syntax:

	myElement.removeProperty(property);

### Arguments:

1. property - (*string*) The attribute to remove.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<a id="myAnchor" href="#" onmousedown="alert('click');"></a>

##### JavaScript

	//Eww... inline JavaScript is bad! Let's get rid of it.
	$('myAnchor').removeProperty('onmousedown');

##### Resulting HTML

	<a id="myAnchor" href="#"></a>



Element Method: removeProperties {#Element:removeProperties}
------------------------------------------------------------

Removes numerous attributes from the Element.


### Syntax:

	myElement.removeProperties(properties);

### Arguments:

1. properties - (*strings*) The attributes to remove, separated by comma.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML

	<a id="myAnchor" href="#" title="hello world"></a>

##### JavaScript

	$('myAnchor').removeProperties('id', 'href', 'title');

##### Resulting HTML

	<a></a>


Element Method: store {#Element:store}
--------------------------------------

Stores an item in the Elements Storage, linked to this Element.


### Syntax:

	myElement.store(key, value);

### Arguments:

1. key - (*string*) The key you want to assign to the stored value.
2. value - (*mixed*) Any value you want to store.

### Returns:

* (*element*) This Element.

### Example:

	$('element').store('someProperty', someValue);


Element Method: retrieve {#Element:retrieve}
--------------------------------------------

Retrieves a value from the Elements storage.


### Syntax:

	myElement.retrieve(key[, default]);

### Arguments:

1. key - (*string*) The key you want to retrieve from the storage.
2. default - (*mixed*, optional) Default value to store and return if no value is stored.

### Returns:

* (*mixed*) The value linked to the key.

### Example:

	$('element').retrieve('someProperty'); // returns someValue (see example above)


Element Method: eliminate {#Element:eliminate}
--------------------------------------------

Eliminates a key from the Elements storage.


### Syntax:

	myElement.eliminate(key);

### Arguments:

1. key - (*string*) The key you want to eliminate from the storage.

### Returns:

* (*mixed*) The element/window/document.

### Example:

	$('element').eliminate('someProperty');





Object: Element.Properties {#Element-Properties}
==============================================

This Object contains the functions that respond to the first argument passed in [Element:get][], [Element:set][] and [Element:erase][].

### Adding a Custom Element Property

	Element.Properties.disabled = {

		get: function(){
			return this.disabled;
		},

		set: function(value){
			this.disabled = !!value;
			this.setAttribute('disabled', !!value);
		}

	};

### Using a Custom Element Property

	// gets the "disabled" property
	$(element).get('disabled');
	// sets the "disabled" property to true, along with the attribute
	$(element).set('disabled', true);


### Using an Object:

Additionally, you can access these custom getters and setters using an object as the parameter for the [set](#Element:set) method.

#### Example:

	// using set:
	$(divElement).set({html: '<p>Hello <em>People</em>!</p>', style: 'background:red'});

	// for new Elements (works the same as set):
	new Element('input', {type: 'checkbox', checked: true, disabled: true});


### Notes:

- Automatically returns the element for setters.
- Since MooTools 1.3 this is a native JavaScript Object and not an instance of the deprecated Hash



Element Property: html {#Element-Properties:html}
-------------------------------------------------

### Setter:

Sets the innerHTML of the Element.

#### Syntax:

	myElement.set('html', html);

#### Arguments:

1. html - (*string*) The new content as HTML string.

#### Returns:

* (*element*) This Element.

#### Examples:

##### HTML

	<div id="myElement"></div>

##### JavaScript

	$('myElement').set('html', '<div></div><p></p>');

##### Resulting HTML

	<div id="myElement">
		<div></div>
		<p></p>
	</div>

### Getter:

Returns the inner HTML of the Element.

#### Syntax:

	myElement.get('html');

#### Returns:

* (*text*) This Element's innerHTML.



Element Property: text {#Element-Properties:text}
-------------------------------------------------

### Setter:

Sets the inner text of the Element.

#### Syntax:

	myElement.set('text', text);

#### Arguments:

1. text - (*string*) The new text content for the Element.

#### Returns:

* (*element*) This Element.

#### Examples:

##### HTML

	<div id="myElement"></div>

##### JavaScript

	$('myElement').set('text', 'some text');
	// the text of myElement is now 'some text'.

##### Resulting HTML

	<div id="myElement">some text</div>

### Getter:

Gets the inner text of the Element.

#### Syntax:

	var myText = myElement.get('text');

#### Returns:

* (*string*) The text of the Element.

#### Examples:

##### HTML

	<div id="myElement">my text</div>

##### JavaScript

	var myText = $('myElement').get('text'); // myText = 'my text'.



Element Property: tag {#Element-Properties:tag}
-----------------------------------------------

### Getter:

Returns the tag name of the Element in lower case.

#### Syntax:

	var myTag = myElement.get('tag');

#### Returns:

* (*string*) The tag name in lower case.

#### Examples:

##### HTML

	<img id="myImage" />

##### JavaScript

	var myTag = $('myImage').get('tag'); // myTag = 'img'



Type: IFrame {#IFrame}
========================

Custom Type to create and easily work with IFrames.



IFrame Method: constructor {#IFrame:constructor}
------------------------------------------------

Creates an IFrame HTML Element and extends its window and document with MooTools.


### Syntax:

	var myIFrame = new IFrame([el][, props]);

### Arguments:

1. el - (*mixed*, optional) The id of the IFrame to be converted, or the actual IFrame element. If its not passed, a new IFrame will be created (default).
2. props - (*object*, optional) The properties to be applied to the new IFrame. Same as [Element:constructor](#Element:constructor) props argument.

### Returns:

* (*element*) A new IFrame HTML Element.

### Examples:

	var myIFrame = new IFrame({

		src: 'http://mootools.net/',

		styles: {
			width: 800,
			height: 600,
			border: '1px solid #ccc'
		},

		events: {

			mouseenter: function(){
				alert('Welcome aboard.');
			},

			mouseleave: function(){
				alert('Goodbye!');
			},

			load: function(){
				alert('The iframe has finished loading.');
			}

		}

	});


### Notes:

- If the IFrame already exists and has a different name than id, the name will be made the same as the id.
- An IFrame's window and document will not be extended with MooTools methods.



Type: Elements {#Elements}
============================

The Elements class allows [Element][] methods to work on an [Elements][] array, as well as [Array][] Methods.



Elements Method: constructor {#Elements:constructor}
----------------------------------------------------


### Syntax:

	var myElements = new Elements(elements[, options]);

### Arguments:

1. elements - (*mixed*) An array of elements or an HTMLCollection Object.

### Returns:

* (*array*) An array-like Elements collection with the [Element][], [Elements][] and [Array][] methods.

### Examples:

#### Set Every Paragraph's Color to Red:

	$$('p').each(function(el){
		el.setStyle('color', 'red');
	});

	// Because $$('myselector') also accepts Element methods, the below
	// example has the same effect as the one above.
	$$('p').setStyle('color', 'red');


#### Create Elements From an Array:

	var myElements = new Elements(['myElementID', $('myElement'), 'myElementID2', document.getElementById('myElementID3')]);


### Notes:

- In MooTools, every DOM function which returns a collection of nodes (such as [$$][]) returns the nodes as instances of Elements.
- Because Elements is an array-like-object, it accepts all the [Array][] methods, while giving precedence to [Element][] and [Elements][] methods.
- Every node of the Elements instance has all the [Element][] methods.

### See Also:

- [$$][], [$][], [Element][], [Elements][], [Array][]


Elements Method: append {#Elements:append}
------------------------------------------

Adds the items of the collection to this [Elements][] array, and return the this array.

### Syntax:

	elements.append(collection);

### Arguments:

1. collection - (*array*) [Elements][] array or an array of HTML Elements.

### Returns:

* (*array*) This [Elements][] array.

### Notes:

- This method doesn't process ([document:id][] or filters) the items of the array.


Elements Method: concat {#Elements:concat}
------------------------------------------

Adds the element, or array of Elements, to this [Elements][] array, and returns a new [Elements][] array.

### Syntax:

	var newElements = elements.concat(element[, list, id, ...]]);

### Arguments:

1. element - (*mixed*) An HTML Element, or a string id.
2. list, id, ... - (*mixed*) Additional [Elements][], array of ids, or string ids.

### Returns:

* (*array*) A new [Elements][] array.


Elements Method: empty {#Elements:empty}
------------------------------------------

Removes every item from the [Elements][] array, and the empty array.

### Syntax:

	elements.empty();

### Returns:

* (*array*) This empty [Elements][] array.

### Note:

`Elements.empty` does not destroy the elements inside. As best practice, always destroy your elements if they're no longer in use. For example:

    $$('div').destroy().empty();

### See Also

 - [Element:destroy][]



Elements Method: filter {#Elements:filter}
------------------------------------------

Filters a collection of elements by a given css selector, or filtering function like [Array:filter][].


### Syntax:

	var filteredElements = elements.filter(selector);

### Arguments:

1. selector - (*mixed*) A single CSS selector, or filtering function.

### Returns:

* (*array*) A subset of this [Elements][] instance.


Elements Method: push {#Elements:push}
--------------------------------------

Adds the element, or elements, to the end of this [Elements][] array and returns the length of the array.


### Syntax:

	var length = elements.push(element[, id, ...]]);

### Arguments:

1. element - (*mixed*) An HTML Element, or a string id.
2. id, ... - (*mixed*) Additional HTML Element, or string ids.

### Returns:

* (*number*) The new length of the [Elements][] array.


Elements Method: unshift {#Elements:unshift}
--------------------------------------------

Adds the element, or elements, to the front of this [Elements][] array and returns the length of the array.

### Syntax:

	var length = elements.unshift(element[, id, ...]]);

### Arguments:

1. element - (*mixed*) An HTML Element, or a string id.
2. id, ... - (*mixed*) Additional HTML Element, or string ids.

### Returns:

* (*number*) The new length of the [Elements][] array.


Deprecated Functions {#Deprecated-Functions}
============================================

Element Method: hasChild {#Deprecated-Functions:hasChild}
---------------------------------------------------------

This method has been deprecated. Use [Element:contains][] instead.

### Example:

	var myElement = document.id('element1');
	var myElement2 = document.id('element2');
	myElement !== myElement2 && myElement.contains(element2);

	// could be implemented as:
	Element.implement('hasChild', function(element){
		return this !== element && this.contains(element);
	});

Element Method: injectBefore {#Deprecated-Functions:injectBefore}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:inject][] instead.

Element Method: injectAfter {#Deprecated-Functions:injectAfter}
---------------------------------------------------------------

This method has been deprecated. Use [Element:inject][] instead.

Element Method: injectBottom {#Deprecated-Functions:injectBottom}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:inject][] instead.

Element Method: injectTop {#Deprecated-Functions:injectTop}
-----------------------------------------------------------

This method has been deprecated. Use [Element:inject][] instead.

Element Method: injectInside {#Deprecated-Functions:injectInside}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:inject][] instead.

Element Method: grabBefore {#Deprecated-Functions:grabBefore}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:grab][] instead.

Element Method: grabAfter {#Deprecated-Functions:grabAfter}
---------------------------------------------------------------

This method has been deprecated. Use [Element:grab][] instead.

Element Method: grabBottom {#Deprecated-Functions:grabBottom}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:grab][] instead.

Element Method: grabTop {#Deprecated-Functions:grabTop}
-----------------------------------------------------------

This method has been deprecated. Use [Element:grab][] instead.

Element Method: grabInside {#Deprecated-Functions:grabInside}
-----------------------------------------------------------------

This method has been deprecated. Use [Element:grab][] instead.


Elements Method: extend {#Deprecated-Functions:extend}
------------------------------------------------------

This method has been deprecated. Use [Elements:append][] instead.


[document:id]: #Window:document-id
[$]: #Window:dollar
[$$]: #Window:dollars

[Array]: /core/Types/Array
[Array:filter]: /core/Types/Array#Array:filter

[Element]: #Element
[Elements]: #Elements
[Elements:append]: #Elements:append
[Element:inject]: #Element:inject
[Element:set]: #Element:set
[Element:get]: #Element:get
[Element:destroy]: #Element:destroy
[Element:grab]: #Element:grab
[Element:erase]: #Element:erase
[Element:setProperty]: #Element:setProperty
[Element:getProperty]: #Element:getProperty
[Element:removeProperty]: #Element:removeProperty
[Element:getElement]: #Element:getElement
[Element:getElements]: #Element:getElements
[Element.Properties]: #Element-Properties
[Element:getPrevious]: #Element:getPrevious
[Element:getAllPrevious]: #Element:getAllPrevious
[Element:contains]: #Element:contains

[Element:addEvents]: /core/Element/Element.Event#Element:addEvents
[Element:setStyles]: /core/Element/Element.Style#Element:setStyles

[The Dollar Safe Mode]: http://mootools.net/blog/2009/06/22/the-dollar-safe-mode/

[MDC Element:removeChild]: https://developer.mozilla.org/En/DOM/Node.removeChild
[MDC Element:replaceChild]: https://developer.mozilla.org/En/DOM/Node.replaceChild
[MDC Element:insertAdjacentHTML]: https://developer.mozilla.org/en/DOM/Element.insertAdjacentHTML
