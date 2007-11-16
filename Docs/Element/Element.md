Native: Window {#Window}
========================

The following functions are treated as Window methods.


Function: $ {#dollar}
---------------------

The dollar function has a dual purpose: Get the element by its id, and make an element in Internet Explorer "grab" all the [Element][] Methods.

### Syntax:

	var myElement = $(el);

### Arguments:

1. el - (*mixed*) A string containing the id of the DOM element desired or a reference to an actual DOM element.

### Returns:

* (*mixed*) A DOM element or null if no matching ID was found.

### Examples:

#### Get a DOM Element by ID:

	var myElement = $('myElement');

#### Get a DOM Element by reference:

	var div = document.getElementById('myElement');
	div = $(div); // The element with all the Element methods applied.

### Notes:

- You'll use this function when you aren't sure if a variable is an actual element or an id, as well as just shorthand for document.getElementById().
- In Internet Explorer, the [Element][] is extended the first time $ is called on it, and all the [Element][] Methods become available.
- Browsers with native HTMLElement support, such as Safari, Firefox, and Opera, apply all the [Element][] Methods to every DOM element automatically.
- MooTools detects if an element needs to be extended or not, so you can call the function on the same element as many times as you want without ill effect.



Function: $$ {#dollars}
-----------------------

Selects and extends DOM elements. Elements arrays returned with $$ will also accept all the [Element][] methods.

### Syntax:

	var myElements = $$(aTag[, anElement[, Elements[, ...]);

### Arguments:

* Any number of the following as arguments are accepted: HTMLCollections, arrays of elements, elements, or strings as selectors.

### Returns:

* (array) - An array of all the DOM Elements matched, extended with [$][].

### Examples:

#### Get Elements by Their Tags:

	$$('a'); //returns all anchor elements in the page
	$$('a', 'b'); //returns anchor and bold tags on the page

#### Using CSS Selectors When [Selectors][] is Included:

	$$('#myElement'); //returns an array containing only the element with the id 'myElement'
	$$('#myElement a.myClass'); //returns an array of all anchor tags with the class 'myClass' within the DOM element with id 'myElement'

#### More Complex $$ Usage:

	$$(myelement1, myelement2, 'a', '#myid, #myid2, #myid3', document.getElementsByTagName('div'));

### Notes:

- If you load [Selectors][], [$$][] will also accept CSS Selectors, otherwise the only selectors supported are tag names.
- If an expression doesn't find any elements, an empty array will be returned.
- The return type of element methods run through [$$][] is always an array.

### See Also:

- See [Selectors][] for documentation on selectors for use anywhere they are accepted throughout the framework.



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any extended DOM Element.



Element Method: constructor {#Element:constructor}
--------------------------------------------------

Creates a new Element of the type passed in.

### Syntax:

	var myEl = new Element(element[, properties]);

### Arguments:

1. element - (*mixed*) The tag name for the Element to be created or an actual DOM element.
2. properties - (*object*, optional) Calls the Single Argument version of [Element:set][] with the properties object passed in.

### Returns:

* (*element*) A new MooTools extended HTML Element.

### Examples:

	var myAnchor = new Element('a', {
		'href': 'http://mootools.net',
		'class': 'myClass',
		'html': 'click me!',
		'styles': {
			'display': 'block',
			'border': '1px solid black'
		},
		'events': {
			'click': function(){
				alert('clicked');
			},
			'mouseover': function(){
				alert('omg ur gonna click');
			}
		}
	});

### See Also:

- [$][], [Element:set][]



Element Method: getElement {#Element:getElement}
------------------------------------------------

Gets the first descendant element whose tag name matches the tag provided.

### Syntax:

	var myElement = myElement.getElement(tag);

### Arguments:

1. tag - (*string*) Tag name of the element to find.

### Returns:

* (*mixed*) If a match is found, the Element will be returned. Otherwise, returns null.

### Examples:

	var firstDiv = $(document.body).getElement('div');

### Notes:

- This method is also available for Document instances.
- This method gets replaced when [Selectors][] is included.
- [Selectors][] enhances [Element:getElement][] so that it matches based on CSS selectors.

### See Also:

- See [Selectors][] for documentation on selectors for use anywhere they are accepted throughout the framework.



Element Method: getElements {#Element:getElements}
--------------------------------------------------

Collects all decedent elements whose tag name matches the tag provided.

### Syntax:

	var myElements = myElement.getElements(tag);

### Arguments:

1. tag - (*string*) String of the tag to match.

### Returns:

* (*array*) An [Elements][] array of all matched Elements.

### Examples:

	var allAnchors = $(document.body).getElements('a');

### Notes:

- This method is also available for Document instances.
- This method gets replaced when [Selectors][] is included.
- [Selectors][] enhances [Element:getElements][] so that it matches based on CSS selectors.

### See Also:

- See [Selectors][] for documentation on selectors for use anywhere they are accepted throughout the framework.



Element Method: getElementById {#Element:getElementById}
--------------------------------------------------------

Gets the element with the specified id found inside this Element.

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

This is a "dynamic arguments" method. Properties passed in can be any of the 'set' properties in the [Element.Properties][] Hash.

### Syntax:

	myElement.set(arguments);

### Arguments:

- Two Arguments (property, value)
	1. property - (*string*) The string key from the [Element.Properties][] Hash representing the property to set.
	2. value - (*mixed*) The value to set for the specified property.
- One Argument (properties)
	1. properties - (*object*) Object with its keys/value pairs representing the properties and values to set for the Element (as described below).

### Returns:

* (*element*) This Element.

### Examples:

#### With Property and Value:

	$('myElement').set('text', 'text goes here');

	$('myElement').set('class', 'active');

	var body = $(document.body).set('styles', { //styles property passes the object to Element:setStyles
		'font': '12px Arial',
		'color': 'blue'
	});

#### With an Object:

	var myElement = $('myElement').set({
		'styles': { //property styles passes the object to Element.setStyles
			'font': '12px Arial',
			'color': 'blue',
			'border': '1px solid #f00'
		},
		'events': { //property events passes the object to Element.addEvents
			'click': function(){ alert('click'); },
			'mouseover': function(){ this.addClass('over') }
		},
		'id': 'documentBody' //any other property uses setProperty
	});

### Notes:

- All the property arguments are passed to the corresponding method of the [Element.Properties][] Hash.
- If no matching property is found in [Element.Properties][], it falls back to [Element:setProperty][].

### See Also:

- [Element][], [Element.Properties][], [Element:setProperty][], [Element:addEvents][], [Element:setStyles][]



Element Method: get {#Element:get}
----------------------------------

This is a "dynamic arguments" method. Properties passed in can be any of the 'get' properties in the [Element.Properties][] Hash.

### Syntax:

	myElement.get(property);

### Arguments:

1. property - (*string*) The string key from the [Element.Properties][] Hash representing the property to get.

### Returns:

* (*mixed*) The result of calling the corresponding 'get' function in the [Element.Properties][] Hash.

### Examples:

#### Using Custom Getters:

	var tag = $('myDiv').get('tag'); // Returns "div".

#### Fallback to Element Attributes:

	var id = $('myDiv').get('id'); // Returns "myDiv".
	var value = $('myInput').get('value'); // Returns the myInput element's value.

### Notes:

-  If the corresponding accessor doesn't exist in the [Element.Properties][] Hash, the result of [Element:getProperty][] on the property passed in is returned.

### See Also:

- [Element][], [Element.Properties][], [Element:getProperty][]



Element Method: erase {#Element:erase}
--------------------------------------

This is a "dynamic arguments" method. Properties passed in can be any of the 'erase' properties in the [Element.Properties][] Hash.

### Syntax:

	myElement.erase(property);

### Arguments:

1. property - (*string*) The string key from the [Element.Properties][] Hash representing the property to erase.

### Returns:

* (*mixed*) The result of calling the corresponding 'erase' function in the [Element.Properties][] Hash.

### Examples:

	$('myDiv').erase('id'); //removes the id from myDiv
	$('myDiv').erase('class'); //myDiv element no longer has any classNames set

### Note:

-  If the corresponding eraser doesn't exist in the  [Element.Properties][] Hash, [Element:removeProperty][] is called with the property passed in.

### See Also:

- [Element][], [Element.Properties][], [Element:removeProperty][]



Element Method: match {#Element:match}
--------------------------------------

Tests this element to see if it's tag name is the same as the tag passed in.

### Syntax:

	myElement.match(tag);

### Arguments:

1. tag - (*string*) The tag name to test against this element.

### Returns:

* (*boolean*) If the element has the specified tag name, returns true. Otherwise, returns false.

### Examples:

	$('myDiv').match('div'); //true if myDiv is a div

### Notes:

- See [Element:match](/Selectors/Selectors#Element:match)
- This method is overwritten by a more powerful version when [Selectors][] is included.



Element Method: inject {#Element:inject}
----------------------------------------

Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the argument).

### Syntax:

	myElement.inject(el[, where]);

### Arguments:

1. el	- (*mixed*) el can be the id of an element or an element.
2. where - (*string*, optional) The place to inject this Element to (defaults to the bottom of the element passed in).

### Returns:

* (*element*) This Element.

### Examples:

##### Javascript

	var myFirstElement = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('div', {id: 'mySecondElement'});
	var myThirdElement = new Element('div', {id: 'myThirdElement'});

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

Appends the Element at a particular place relative to the Element's children (specified by the second the parameter).

### Syntax:

	myElement.grab(el[, where]);

### Arguments:

1. el - (*mixed*) el can be the id of an element or an element.
2. where - (*string*, optional) The place to append this Element to (defaults to 'bottom'). can be either top and bottom.

### Returns:

* (*element*) This Element.

### Examples:

##### JavaScript

	var myFirstElement = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('div', {id: 'mySecondElement'});

	myFirstElement.grab(mySecondElement);

##### Resulting HTML

	<div id="myFirstElement">
		<div id="mySecondElement"></div>
	</div>

### See Also:

[Element:adopt](#Element:adopt), [Element:inject](#Element:inject), [Element:wraps](#Element:wraps)



Element Method: adopt {#Element:adopt}
--------------------------------------

Works like [Element:grab](#Element:grab), but allows multiple elements to be adopted.

Inserts the passed element(s) inside the Element (that will become the parent).


### Syntax:
	
	myParent.adopt(el[, others]);
	
### Arguments:

1. el - (*mixed*) el can be the id of an element or an element.
2. others - (*mixed*, optional) You can pass more then one elements separated by comma or as array.

### Returns:

* (*element*) This Element.

### Examples:

##### Javascript

	var myFirstElement = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('a', {id: 'mySecondElement'});
	var myThirdElement = new Element('ul', {id: 'myThirdElement'});
	
	myParent.adopt(myFirstElement);
	myParent2.adopt(myFirstElement, 'mySecondElement');
	myParent3.adopt([myFirstElement, mySecondElement, myThirdElement]);

##### Resulting HTML

	<div id="myParent">
		<div id="myFirstElement" />
	</div>
	<div id="myParent2">
		<div id="myFirstElement" />
		<a />
	</div>
	<div id="myParent3">
		<div id="myFirstElement" />
		<a />
		<ul />
	</div>

### See Also:

[Element:grab](#Element:grab), [Element:inject](#Element:inject), [Element:wraps](#Element:wraps)



Element Method: wraps {#Element:wraps}
--------------------------------------

Works like [Element:grab](#Element:grab), but instead of moving the grabbed element from its place, this method moves this Element around its target.



Element Method: appendText {#Element:appendText}
------------------------------------------------

Works like [Element:grab](#Element:grab), but instead of accepting an id or an element, it only accepts text.
A text node will be created inside this Element, in either the top or bottom position.

### Syntax:

	myElement.appendText(text);

### Arguments:

1. text - (*string*) The text to append.
1. where - (*string*, optional) The position to inject the text to. defaults to 'bottom'.

### Returns:

* (*element*) The current Element instance.

### Examples:

##### HTML

	<div id="myElement">hey.</div>

##### JavaScript

	$('myElement').appendText(' howdy');

##### Resulting HTML

	<div id="myElement">hey. howdy</div>



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

- [MDC Element:removeChild](http://developer.mozilla.org/en/docs/DOM:element.removeChild)



Element Method: clone {#Element:clone}
--------------------------------------

Clones the Element and returns the cloned one.


### Syntax:

	var copy = myElement.clone([contents]);

### Arguments:

1. contents - (*boolean*, optional: defaults to true) When true the Element is cloned with childNodes.

### Returns:

* (*element*) The cloned Element.

### Examples:

##### HTML

	<div id="myElement"></div>

##### JavaScript

	//Clones the Element and appends the clone after the Element.
	var clone = $('myElement').clone().injectAfter('myElement');

##### Resulting HTML

	<div id="myElement">ciao</div>
	<div>ciao</div>

### Note:

- The returned Element does not have an attached events. To clone the events use [Element:cloneEvents](/Element/Element.Event/#Element:cloneEvents).
- The clone element and its children are stripped of ids.

### See Also:

- [Element:cloneEvents](/Element/Element.Events#Element:cloneEvents).



Element Method: replaces {#Element:replaces}
--------------------------------------------------

Replaces the Element with an Element passed.

### Syntax:

	var element = myElement.replaces(el);

### Arguments:

1. el - (*mixed*) A string id representing the Element to be replaced with, or an Element reference.

### Returns:

* (*element*) This Element.

### Examples:

	$('myOldElement').replaces($('myNewElement'));
	//$('myOldElement') is gone, and $('myNewElement') is in its place.

### See Also:

- [MDC Element:replaceChild](http://developer.mozilla.org/en/docs/DOM:element.replaceChild)



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

##### Javascript

	$('myElement').hasClass('testClass'); //returns true



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

##### Javascript

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

Adds or removes the passed in class name to the Element, depending on if it's present or not.

### Syntax:

	myElement.toggleClass(className);

### Arguments:

1. className - (*string*) The class to add or remove.

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

	var previousSibling = myElement.getPrevious([tagName/selector]);

### Arguments:

1. match - (*string*, optional): A tag name to match the the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*mixed*) The previous sibling Element or null if none found.



Element Method: getAllPrevious {#Element:getAllPrevious}
--------------------------------------------------------

Like [Element:getPrevious][], but returns a collection of all the matched previousSiblings.



Element Method: getNext {#Element:getNext}
------------------------------------------

As [Element:getPrevious][], but tries to find the nextSibling (excluding text nodes).


### Syntax:

	var nextSibling = myElement.getNext();

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*mixed*) The next sibling Element or null if none found.


Element Method: getAllNext {#Element:getAllNext}
------------------------------------------------

Like Element.getNext, but returns a collection of all the matched nextSiblings.



Element Method: getFirst {#Element:getFirst}
--------------------------------------------

Works as [Element:getPrevious][], but tries to find the firstChild (excluding text nodes).


### Syntax:

	var firstElement = myElement.getFirst();

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*mixed*) The first sibling Element or null if none found.



Element Method: getLast {#Element:getLast}
------------------------------------------

Works as [Element:getPrevious][], but tries to find the lastChild.

### Syntax:

	var lastElement = myElement.getLast();

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*mixed*) The first sibling Element, or returns null if none found.



Element Method: getParent {#Element:getParent}
----------------------------------------------

Works as [Element:getPrevious][], but tries to find the parentNode.


### Syntax:

	var parent = myElement.getParent();

### Arguments:

1. match - (*string*, optional): A tag name to match the the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*mixed*) The target Element's parent or null if no matching parent is found.



Element Method: getParents {#Element:getParents}
------------------------------------------------

Like [Element:getParent](#Element:getParent), but returns a collection of all the matched parentNodes up the tree.



Element Method: getChildren {#Element:getChildren}
--------------------------------------------------

Returns all the Element's children (excluding text nodes). Returns as [Elements][].


### Syntax:

	var children = myElement.getChildren();

### Arguments:

1. match - (*string*, optional): A tag name to match the found element(s) with. if [Selectors][] is included, a full CSS selector can be passed.

### Returns:

* (*array*) A [Elements](#Elements) array with all of the Element's children, except the text nodes.



Element Method: hasChild {#Element:hasChild}
--------------------------------------------

Checks all descendants of this Element for a match.


### Syntax:

	var result = myElement.hasChild(el);

### Arguments:

1. el - (*mixed*) Can be a Element reference or string id.

### Returns:

* (*boolean*) Returns true if the passed in Element is a child of the Element, otherwise false.

### Examples:

##### HTML

	<div id="Darth_Vader">
		<div id="Luke"></div>
	</div>

##### JavaScript

	if ($('Darth_Vader').hasChild('Luke')) alert('Luke, I am your father.'); // tan tan tannn...



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

	$('myElement').empty()

##### Resulting HTML

	<div id="myElement"></div>



Element Method: destroy {#Element:destroy}
------------------------------------------

Empties an Element of all its children, removes and garbages the Element.
Useful to clear memory before the pageUnload.

### Syntax:

	myElement.destroy();

### Returns:

* (*null*)



Element Method: toQueryString {#Element:toQueryString}
------------------------------------------------------

Reads the children inputs of the Element and generates a query string based on their values.


### Syntax:

	var query = myElement.toQueryString();

### Returns:

* (*string*) A string representation of a all the input Elements' names and values.

### Examples:

##### HTML

	<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
	</form>

##### JavaScript

	$('myForm').toQueryString() //Returns "email=bob@bob.com&zipCode=90210".



Element Method: getProperty {#Element:getProperty}
------------------------------------------------------

Gets a single element attribute.

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

	var imgProps = $('myImage').getProperty('src');

	// returns: 'mootools.png'



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
--------------------------------------------------------

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


Hash: Element.Properties {#Element-Properties}
==============================================

These Hash contains the functions that respond to the first argument passed in [Element:get][], [Element:set][] and [Element:erase][].

### Example of a custom Element Property

	Element.Properties.checked = {
		
		get: function(){
			return this.checked;
		}
		
		set: function(value){
			this.checked = !!value;
			this.setAttribute('checked', !!value);
		}
		
	};
	
	//usage
	
	$(element).get('checked'); //gets the checked property.
	
	$(element).set('checked', true); //sets the checked property to true, along with the attribute.

### Note

Automatically returns the element for setters.


Element Property: html {#Element-Properties:html}
-------------------------------------------------

### Setter:

Sets the innerHTML of the Element.

#### Syntax:

	myElement.set('html', [htmlString[, htmlString2[, htmlString3[, ..]]]);

#### Arguments:

1. Any number of string parameters with HTML.

#### Returns:

* (*element*) This Element.

#### Examples:

##### HTML

	<div id="myElement"></div>

##### Javascript

	$('myElement').set('html', '<div></div>', '<p></p>');

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

	$('myElement').set('text', 'some text'); //the text of myElement is now = 'some text'

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

	var myText = $('myElement').get('text'); //myText = 'my text';



Element Property: value {#Element-Properties:value}
---------------------------------------------------

### Getter:

Returns the value of the Element, if its tag is textarea, select or input. getValue called on a multiple select will return an array.


#### Syntax:

	var value = myElement.get('value');

#### Returns:

* (*mixed*) Returns false if if tag is not a 'select', 'input', or 'textarea'. Otherwise returns the value of the Element.

#### Examples:

##### HTML

	<form id="myForm">
		<select>
			<option value="volvo">Volvo</option>
			<option value="saab" selected="yes">Saab</option>
			<option value="opel">Opel</option>
			<option value="audi">Audi</option>
		</select>
	</form>

##### JavaScript

	var result = $('myForm').getElement('select').get('value'); // returns 'Saab'



Element Property: tag {#Element-Properties:tag}
-----------------------------------------------

### Getter:

Returns the tagName of the Element in lower case.

#### Syntax:

	var myTag = myElement.get('tag');

#### Returns:

* (*string*) The tag name in lower case.

#### Examples:

##### HTML

	<img id="myImage" />

##### Javascript

	var myTag = $('myImage').get('tag'); // myTag = 'img';



Native: IFrame {#IFrame}
========================

Custom Native to create and easily work with IFrames.



IFrame Method: constructor {#IFrame:constructor}
------------------------------------------------

Creates an iframe HTML Element and extends its window and document with MooTools.


### Syntax:

	var myIFrame = new IFrame([el][, props]);

### Arguments:

1. el - (*mixed*, optional) The id of the iframe to be converted, or the actual iframe element. If its not passed, a new iframe will be created (default).
2. props - (*object*, optional) The properties to be applied to the new IFrame. Same as [Element:constructor](#Element:constructor) props argument.

### Returns:

* (*element*) A new iframe HTML Element.

### Examples:

	var myIFrame = new IFrame({

		src: 'http://mootools.net/',

		onload: function(){
			alert('my iframe finished loading');
		},

		styles: {
			width: 800,
			height: 600,
			border: '1px solid #ccc'
		},

		events: {

			mouseenter: function(){
				alert('welcome aboard');
			},

			mouseleave: function(){
				alert('oo noes');
			}

		}

	});


### Notes:

- If the IFrame is from the same domain as the "host", its document and window will be extended with MooTools functionalities, allowing you to fully use MooTools within iframes.
- If the iframe already exists, and it has different id/name, the name will be made the same as the id.
- If the frame is from a different domain, its window and document will not be extended with MooTools methods.



Native: Elements {#Elements}
============================

The Elements class allows [Element][] methods to work also on an [Elements][] array, as well as [Array][] Methods.



Elements Method: constructor {#Elements:constructor}
----------------------------------------------------


### Syntax:

	var myElements = new Elements(elements[, options]);

### Arguments:

1. elements - (*mixed*) An array of elements or an HTMLCollection Object.

### Returns:

* (*array*) An extended array with the [Element][], [Elements][] and [Array][] methods.

### Examples:

#### Set Every Paragraph's Color to Red:

	$$('p').each(function(el){
		el.setStyle('color', 'red');
	});

	//However, because $$('myselector') also accepts [Element][] methods, the below example would have the same effect as the one above.
	$$('p').setStyle('color', 'red');


#### Create Elements From an Array:

	var myElements = new Elements(['myElementID', $('myElement'), 'myElementID2', document.getElementById('myElementID3')]);
	myElements.removeElements('found'); //notice how 'remove' is an Array method


### Notes:

- In MooTools, every DOM function, such as [$$][] (and every other function that returns a collection of nodes) returns them as an Elements instance.
- Because Elements is an Array, it accepts all the [Array][] methods, while giving precedence to [Element][] and [Elements][] methods.
- Every node of the Elements instance already has all the with [Element][] methods.

### See Also:

- [$$][], [$][], [Element][], [Elements][], [Array][]



Elements Method: filterBy {#Elements:filterBy}
----------------------------------------------

Filters a collection of element by a given tagname.
If [Selectors][] is included, this method will be able to filter by any selector.


### Syntax:

	var filteredElements = elements.filterBy(selector);

### Arguments:

1. selector - (*mixed*) A single CSS selector.

### Returns:

* (*array*) A subset of this [Elements][] instance.



[$]: #dollar
[$$]: #dollars

[Array]: /Native/Array
[Selectors]: /Selectors/Selectors

[Element]: #Element
[Elements]: #Elements
[Element:set]: #Element:set
[Element:get]: #Element:get
[Element:erase]: #Element:erase
[Element:setProperty]: #Element:setProperty
[Element:getProperty]: #Element:getProperty
[Element:removeProperty]: #Element:removeProperty
[Element:getElement]: #Element:getElement
[Element:getElements]: #Element:getElements
[Element.Properties]: #Element-Properties
[Element:getPrevious]: #Element:getPrevious

[Element:addEvents]: /Element/Element.Event#Element:addEvents
[Element:setStyles]: /Element/Element.Style#Element:setStyles