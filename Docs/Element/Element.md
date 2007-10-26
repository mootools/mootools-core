[Element]: #Element
[Elements]: #Elements
[Array]: /Native/Array
[Selector.js]: /Selectors/Selectors
[Element.Setters]: #Element.Setters
[Element.Getters]: #Element.Getters
[Element.Erasers]: #Element.Erasers


Window Methods
==============

The following functions are treated as Window methods



Function: $ {#dollar}
---------------------

[$]: #dollar

The dollar function has a dual purpose: Get the element by its id, and make an element in internet explorer "grab" all the [Element][] Methods.

### Syntax:

	var myElement = $(el);

### Arguments:

1. el - (mixed) A string containing the id of the DOM element desired or a reference to an actual DOM element.

### Returns:

* (mixed) A DOM element
* (null) null if string is passed and no matching ID was found.

### Examples:

#### Get a DOM Element by ID:

	var myElement = $('myElement');

#### Get a DOM Element by reference:

	var div = document.getElementById('myElement');
	div = $(div); //the element with all the [Element][] Methods applied.


You'll use this when you aren't sure if a variable is an actual element or an id, as
well as just shorthand for document.getElementById().

### Notes:

- While the [$][] function needs to be called only once on an element in order to get all the [Element][] Methods, you can pass the same element multiple times without ill effects.
- Browsers with native HTMLElement support, such as Safari, Firefox, or Opera, natively apply all the [Element][] Methods on every dom element, without the need for [$][]. Explorer on the other hand need [$][] to make a dom element "grab" all the methods. Obviously, MooTools detects if an element needs to be forced to have all the methods or not.


Function: $$ {#dollars}
-----------------------

[$$]: #dollars

Selects, and extends DOM elements. Elements arrays returned with $$ will also accept all the [Element][] methods.
The return type of element methods run through [$$][] is always an array.

### Syntax:

	var myElements = $$(aTag[, anElement[, Elements[, ...]);

### Arguments:

* Any number of the following as arguments are accepted: HTMLCollections, arrays of elements, elements, strings as selectors.

### Returns:

* (array) - An array of all the DOM Elements matched, extended with [$][].

### Examples:

#### Get Elements by Their Tags:

	$$('a'); //returns all anchor Elements in the page
	$$('a', 'b'); //returns anchor and bold tags on the page


#### Using CSS Selectors When [Selectors.js][] is Included:

	$$('#myElement'); //returns an array containing only the element with the id 'myElement'
	$$('#myElement a.myClass'); //returns an array of all anchor tags with the class "myClass" within the DOM element with id "myElement"

#### Complex $$:

	$$(myelement, myelement2, 'a', ['myid', myid2, 'myid3'], document.getElementsByTagName('div'));


### Notes:

- If you load [Selectors.js][], [$$][] will also accept CSS Selectors, otherwise the only selectors supported are tag names.
- If an expression doesnt find any elements, an empty array will be returned.



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].

Element Method: constructor {#Element:constructor}
--------------------------------------------------

Creates a new Element of the type passed in.

### Syntax:

	var myEl = new Element(el[, props]);

### Arguments:

1. el - (mixed) The tag name for the Element to be created or an actual dom element.
2. props - (object, optional) If [Element.Setters][] has one of the keys passed in, that function will be used. Otherwise it will default to [Element:setProperty](#Element:setProperty).

### Returns:

* (element) A new HTML Element.

### Example:

	var myAnchor = new Element('a', {
		'styles': {
			'display': 'block',
			'border': '1px solid black'
		},
		'events': {
			'click': function(){
				alert('omg u clicked');
			},
			'mousedown': function(){
				alert('omg ur gonna click');
			}
		},
		'class': 'myClassSuperClass',
		'href': 'http://mad4milk.net'
	});


### See Also:

[$][], [Element:set](#Element:set)



Element Method: getElement {#Element:getElement}
------------------------------------------------

Searches all descendents for the first Element whose tag matches the tag provided.

### Syntax:

	var myElement = myElement.getElement(tag);

### Arguments:

1. tag - (string) String of the tag to match.

### Returns:

* (element) If found returns the Element
* (null) otherwise returns null.

### Example:

	var firstDiv = $(document.body).getElement('div');

### Notes:

- This method is also available for Document instances.
- This method gets replaced when [Selectors.js][] is included. [Selector.js][] enhances getElement so that it maches CSS selectors.


Element Method: getElements {#Element:getElements}
--------------------------------------------------

Searches and returns all descendant Elements that match the tag provided.

### Syntax:

	var myElements = myElement.getElements(tag);

### Arguments:

1. tag - (string) String of the tag to match.

### Returns:

* (array) An array of all matched Elements, as instance of [Elements][].

### Example:

	var allAnchors = $(document.body).getElements('a');

### Notes:

- This method gets replaced when [Selectors.js][] is included. [Selectors.js][] enhances getElements so that it maches CSS selectors.
- This method is also available for the Document instances.


Element Method: getElementById {#Element:getElementById}
--------------------------------------------------------

Targets an element with the specified id found inside the Element.

### Syntax:

	var myElement = anElement.getElementById(id);

### Arguments:

1. id - (string) The ID of the Element to find.

### Returns:

* (element) The Element found
* (null) null if no element with the specified id was found inside this Element

### Example:

	var myParent = $('myParent');
	var myChild = myParent.getElementById('aChild');

### Note:

Does not overwrite document.getElementById.




Element Method: set {#Element:set}
----------------------------

This is a "dynamic arguments" method. The first argument can be one of the properties of the [Element.Properties][] Hash.

### Syntax:

	myElement.set(property[, value]);

### Arguments:

1. property - (mixed) Accepts a string for setting the property and value, or an object with its keys/values representing properties for the Element.
2. value - (mixed, optional) Any value to set for the given property.

### Returns:

* (element) This Element.

### Examples:

#### With an Object:

	var body = $(document.body).set({
		'styles': { // property styles passes the object to <Element.setStyles>
			'font': '12px Arial',
			'color': 'blue'
		},
		'events': { // property events passes the object to <Element.addEvents>
			'click': function(){ alert('click'); },
			'scroll': function(){
		},
		'id': 'documentBody' //any other property uses setProperty
	});


#### With Property and Value:

	var body = $(document.body).set('styles', { // property styles passes the object to <Element.setStyles>
		'font': '12px Arial',
		'color': 'blue'
	});

### Notes:

- All the arguments starting from 1 are passed to the relative method of the [Element.Setters][] Hash.
- If no matching property is found in [Element.Setters][], it falls back to [Element:setProperty](#Element:setProperty)

### See Also:

[Element][], [Element.Setters][], [Element:setStyles](/Element/Element.Style/#Element:setStyles), [Element:addEvents](/Element/Element.event/#Element:addEvents)



Element Method: get {#Element:get}
----------------------------------

This is a "dynamic arguments" method. The first argument can be one of the properties of the [Element.Getters][] Hash.


### Syntax:

	myElement.get(property);

### Arguments:

1. property - (string) Accepts a string for getting the value of a certain property.

### Returns:

* (mixed) Whatever the result of the function in the [Element.Getters][] Hash is, or the value of [Element:getProperty](#Element:getProperty) on the first Argument.

### Examples:

#### Using Custom Getters:

	var tag = $('myDiv').get('tag'); //returns 'div'

#### Fallback to Element Attributes:

	var id = $('myDiv').get('id); //returns 'myDiv'
	var value = $('myInput').get('value'); //returns this input element's value

### Notes:

If no matching property is found in Element.Getters, it falls back to [Element:getProperty](#Element:getProperty)

### See Also:

[Element][], <Element.Getters>



Element Method: erase {#Element:erase}
--------------------------------------

This is a "dynamic arguments" method. The first argument can be one of the properties of the [Element.Erasers][] Hash.


### Syntax:

	myElement.clear(property);

### Arguments:

1. property - (mixed) Accepts a string representing the property to be cleared.

### Returns:

* (mixed) Whatever the result of the function in the [Element.Erasers][] Hash is.

### Examples:

	$('myDiv').erase('id'); //removes the id from myDiv
	$('myDiv').erase('class'); //myDiv element no longer has any classNames set

### Note:

If no matching property is found in <Element.Clearer>, this method falls back to [Element:removeProperty](#Element:removeProperty)

### See Also:

[Element.Erasers][]


Element Method: match {#Element:match}
--------------------------------------

Tests this element to see if it matches the given tagName.

### Syntax:

	myElement.match(tag);

### Arguments:

1. tag - (string) The tagName to test against this element.

### Returns:

* (boolean) If the element has the specified tagName, returns true. Otherwise, returns false.

### Example:

	$('myDiv').match('div'); //true if myDiv is a div


### Note:

This method is overwritten by a more powerful version when [Selectors.js][] is included.
See [Element:match](/Selectors/Selectors/#Element:match)



Element Method: inject {#Element:inject}
----------------------------------------

Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the argument).

### Syntax:

	myElement.inject(el[, where]);

### Arguments:

1. el	- (mixed) el can be the id of an element or an element.
2. where - (string, optional) The place to inject this Element to (defaults to the bottom of the element passed in).

### Returns:

* (element) This Element.

### Example:

	var myFirstElement = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('div', {id: 'mySecondElement'});
	var myThirdElement = new Element('div', {id: 'myThirdElement'});


#### Inject to the bottom:

	myFirstElement.inject(mySecondElement);

	//	<div id="mySecondElement">
	//		<div id="myFirstElement"></div>
	//	</div>

#### Inject to the top:

	myThirdElement.inject(mySecondElement, 'top');

	//	<div id="mySecondElement">
	//		<div id="myThirdElement"></div>
	//		<div id="myFirstElement"></div>
	//	</div>

#### Inject before:

	myFirstElement.inject(mySecondElement, 'before');

	//	<div id="myFirstElement"></div>
	//	<div id="mySecondElement"></div>

#### Inject After:

	myFirstElement.inject(mySecondElement, 'after');

	//	<div id="mySecondElement"></div>
	//	<div id="myFirstElement"></div>

### See Also:

[Element:adopt](#Element:adopt), [Element:grab](#Element:grab), [Element:wraps](#Element:wraps)



Element Method: grab {#Element:grab}
------------------------------------

Works as [Element:inject](#Element:inject), but in reverse.

Appends the Element at a particular place relative to the Element's children (specified by the second the paramter).

### Syntax:

	myElement.grab(el[, where]);

### Arguments:

1. el - (mixed) el can be the id of an element or an element.
2. where - (string, optional) The place to append this Element to (defaults to 'bottom'). can be either top and bottom.

### Returns:

* (element) This Element.

### Example:

	var myFirstElement = new Element('div', {id: 'myFirstElement'});
	var mySecondElement = new Element('div', {id: 'mySecondElement'});
	myFirstElement.grab(mySecondElement);

	//	<div id="myFirstElement">
	//		<div id="mySecondElement"></div>
	//	</div>

### See Also:

[Element:adopt](#Element:adopt), [Element:inject](#Element:inject), [Element:wraps](#Element:wraps)



Element Method: wraps {#Element:wraps}
--------------------------------------

Works as [Element:grab](#Element:grab), but instead of moving the grabbed element from its place, this method moves this Element.


Element Method: appendText {#Element:appendText}
------------------------------------------------

Works as [Element:grab](#Element:grab), but instead of accepting an id or an element, it only accepts text.
A textnode will be created inside this Element, in either top or bottom position.

### Syntax:

	myElement.appendText(text);

### Arguments:

1. text - (string) The text to append.
1. where - (string, optional) The position to inject the text to. defaults to 'bottom'.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement">hey</div>

	$('myElement').appendText(' howdy');

	//	<div id="myElement">hey. howdy</div>



Element Method: dispose {#Element:dispose}
------------------------------------------

Removes the Element from the DOM.


### Syntax:

	var removedElement = myElement.dispose();

### Returns:

* (element) This Element. Useful to always grab the return from this function, as the element could be [injected](#Element:inject) back.

### Example:

	// <div id="myElement"></div>
	// <div id="mySecondElement"></div>

	$('myElement').dispose();

	// <div id="mySecondElement"></div>

### See Also:

[MDC Element:removeChild](http://developer.mozilla.org/en/docs/DOM:element.removeChild)



Element Method: clone {#Element:clone}
--------------------------------------

Clones the Element and returns the cloned one.


### Syntax:

	var copy = myElement.clone([contents]);

### Arguments:

1. contents - (boolean, optional: defaults to true) When true the Element is cloned with childNodes.

### Returns:

* (element) The cloned Element.

### Example:

	// <div id="myElement"></div>


	var clone = $('myElement').clone().injectAfter('myElement'); //clones the Element and append the clone after the Element.

	//	<div id="myElement">ciao</div>
	//	<div>ciao</div>

### Note:

- The returned Element does not have an attached events. To clone the events use [Element:cloneEvents](/Element/Element.Events/#Element:cloneEvents).
- The clone element and its children are stripped of ids.

### See Also:

[Element:cloneEvents](/Element/Element.Events/#Element:cloneEvents).



Element Method: replaceWith {#Element:replaceWith}
--------------------------------------------------

Replaces the Element with an Element passed.

### Syntax:

	var element = myElement.replaceWidth(el);

### Arguments:

1. el - (mixed) A string id representing the Element to be replaced with, or an Element reference.

### Returns:

* (element) This Element.

### Example:

	$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.

### See Also:

[MDC Element:replaceChild](http://developer.mozilla.org/en/docs/DOM:element.replaceChild)



Element Method: hasClass {#Element:hasClass}
--------------------------------------------

Tests the Element to see if it has the passed in className.

### Syntax:

	var result = myElement.hasClass(className);

### Arguments:

1. className - (string) The class name to test.

### Returns:

* (boolean) Returns true if the Element has the class, otherwise false.

### Example:

	//	<div id="myElement" class="testClass"></div>

	$('myElement').hasClass('testClass'); //returns true



Element Method: addClass {#Element:addClass}
--------------------------------------------

Adds the passed in class to the Element, if the Element doesnt already have it.

### Syntax:

	myElement.addClass(className);

### Arguments:

1. className - (string) The class name to add.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement" class="testClass"></div>

	$('myElement').addClass('newClass');
	
	//	<div id="myElement" class="testClass newClass"></div>



Element Method: removeClass {#Element:removeClass}
----------------------------

Works like [Element:addClass](#Element:addClass), but removes the class from the Element.


### Syntax:

	myElement.removeClass(className);

### Arguments:

1. className - (string) The class name to remove.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement" class="testClass newClass"></div>

	$('myElement').removeClass('newClass');

	//	<div id="myElement" class="testClass"></div>


Element Method: toggleClass {#Element:toggleClass}
--------------------------------------------------

Adds or removes the passed in class name to the Element, depending on if it's present or not.

### Syntax:

	myElement.toggleClass(className);

### Arguments:

1. className - (string) The class to add or remove.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement" class="myClass"></div>

	$('myElement').toggleClass('myClass');

	//	<div id="myElement" class=""></div>

	$('myElement').toggleClass('myClass');

	//	<div id="myElement" class="myClass"></div>



Element Method: getPrevious {#Element:getPrevious}
--------------------------------------------------

[Element:getPrevious]: (#Element:getPrevious)

Returns the previousSibling of the Element (excluding text nodes).

### Syntax:

	var previousSibling = myElement.getPrevious([tagName/selector]);
	
### Arguments:

1. match - (string): A tagName to match the the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (mixed) The previous sibling Element
* (null) or returns null if none found


Element Method: getAllPrevious {#Element:getAllPrevious}
--------------------------------------------------------

like [Element:getPrevious][], but returns a collection of all the matched previousSiblings.



Element Method: getNext {#Element:getNext}
------------------------------------------

Works as [Element:getPrevious][], but tries to find the nextSibling (excluding text nodes).


### Syntax:

	var nextSibling = myElement.getNext();
	
### Arguments:

1. match - (string): A tagName to match the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (mixed) The next sibling Element
* (null) or returns null if none found.


Element Method: getAllNext {#Element:getAllNext}
------------------------------------------------

like Element.getNext, but returns a collection of all the matched nextSiblings.


Element Method: getFirst {#Element:getFirst}
--------------------------------------------

Works as [Element:getPrevious][], but tries to find the firstChild (excluding text nodes).


### Syntax:

	var firstElement = myElement.getFirst();
	
### Arguments:

1. match - (string): A tagName to match the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (mixed) The first sibling Element
* (null) or returns null if none found.



Element Method: getLast {#Element:getLast}
------------------------------------------

Works as [Element:getPrevious][], but tries to find the lastChild.

### Syntax:

	var lastElement = myElement.getLast();
	
### Arguments:

1. match - (string): A tagName to match the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (mixed) The first sibling Element, or returns null if none found.



Element Method: getParent {#Element:getParent}
----------------------------------------------

Works as [Element:getPrevious][], but tries to find the parentNode.

### Syntax:

	var parent = myElement.getParent();
	
### Arguments:

1. match - (string): A tagName to match the the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (element) This Element's parent
* (null) or null if no matching parent is found

Element Method: getParents {#Element:getParents}
------------------------------------------------

like [Element:getParent](#Element:getParent), but returns a collection of all the matched parentNodes up the tree.



Element Method: getChildren {#Element:getChildren}
--------------------------------------------------

Returns all the Element's children (excluding text nodes). Returns as [Elements][].


### Syntax:

	var children = myElement.getChildren();
	
### Arguments:

1. match - (string): A tagName to match the found element(s) with. if [Selectors.js][] is included, you can pass a full css selector.

### Returns:

* (array) A [Elements](#Elements) array with all of the Element's children, except the text nodes.



Element Method: hasChild {#Element:hasChild}
--------------------------------------------

Checks all descendants of this Element for a match.


### Syntax:

	var result = myElement.hasChild(el);

### Arguments:

1. el - (mixed) Can be a Element reference or string id.

### Returns:

* (boolean) Returns true if the passed in Element is a child of the Element, otherwise false.

### Example:

	//<div id="Darth_Vader">
	//	<div id="Luke"></div>
	//</div>

	if ($('Darth_Vader').hasChild('Luke')) alert('Luke, I am your father.'); // tan tan tannn.....



Element Method: empty {#Element:empty}
--------------------------------------

Empties an Element of all its children.

### Syntax:

	myElement.empty();

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement">
	//		<p></p>
	//		<span></span>
	//	</div>


	$('myElement').empty()

	//	<div id="myElement"></div>



Element Method: destroy {#Element:destroy}
------------------------------------------

Empties an Element of all its children, removes and garbages the Element.
Useful to clear memory before the pageUnload.

### Syntax:

	myElement.destroy();

### Returns:

* (null)



Element Method: toQueryString {#Element:toQueryString}
------------------------------------------------------

Reads the children inputs of the Element and generates a query string based on their values.


### Syntax:

	var query = myElement.toQueryString();

### Returns:

* (string) A string representation of a all the inputs elements names/values.

### Example:

	//	<form id="myForm" action="submit.php">
	//		<input name="email" value="bob@bob.com">
	//		<input name="zipCode" value="90210">
	//	</form>

	$('myForm').toQueryString() //email=bob@bob.com&zipCode=90210\



Element Method: getProperties {#Element:getProperties}
------------------------------------------------------

Gets multiple element attributes.

### Syntax:

	var myProps = myElement.getProperties();
	
### Arguments:

* (strings) any number of properties you want to get.

### Returns:

* (object) An object containing all of the Element's properties.

### Example:

	<img id="myImage" src="mootools.png" title="MooTools, the compact JavaScript framework" alt="" />


	var imgProps = $('myImage').getProperties('id', 'src', 'title', 'alt');
	// returns: { id: 'myImage', src: 'mootools.png', title: 'MooTools, the compact JavaScript framework', alt: '' }
	

Element Method: setProperty {#Element:setProperty}
--------------------------------------------------

Sets an attribute or special property for this Element.

### Arguments:

1. property - (string) The property to assign the value passed in.
2. value - (mixed) The value to assign to the property passed in.

### Returns:

* (element) - This Element.

### Example:

	//	<img id="myImage" />


	$('myImage').setProperty('src', 'mootools.png');

	//	<img id="myImage" src="mootools.png" />



Element Method: setProperties {#Element:setProperties}
------------------------------------------------------

Sets numerous attributes for the Element.


### Arguments:

1. properties - (object) An object with key/value pairs.

### Returns:

* (element) This Element.

### Example:

	// <img id="myImage" />


	$('myImage').setProperties({
		src: 'whatever.gif',
		alt: 'whatever dude'
	});

	//	<img id="myImage" src="whatever.gif" alt="whatever dude" />



Element Method: removeProperty {#Element:removeProperty}
--------------------------------------------------------

Removes an attribute from the Element.


### Syntax:

	myElement.removeProperty(property);

### Arguments:

1. property - (string) The attribute to remove.

### Returns:

* (element) This Element.

### Example:

	//	<a id="myAnchor" href="#" onmousedown="alert('click');"></a>


	$('myAnchor').removeProperty('onmousedown'); //eww inline javascript is bad! Let's get rid of it.

	//	<a id="myAnchor" href="#"></a>


Element Setters, Getters and Erasers
====================================

These Hashes have function that respond to the first argument passed in [Element:get](#Element:get), [Element:set](#Element:set) and [Element:erase](#Element:erase)


Element Setter: html {#Element:Setters:html}
--------------------------------------------

Sets the innerHTML of the Element.

### Syntax:

	myElement.set('html', [htmlString[, htmlString2[, htmlString3[, ..]]]);

### Arguments:

1. Any number of string paramters with html.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement"></div>

	$('myElement').set('html', '<div></div>', '<p></p>');

	//	<div id="myElement">
	//		<div></div>
	//		<p></p>
	//	</div>


Element Setter: text {#Element:Setters:text}
--------------------------------------------

Sets the inner text of the Element.

### Syntax:

	myElement.set('text', text);

### Arguments:

1. text - (string) The new text content for the Element.

### Returns:

* (element) This Element.

### Example:

	//	<div id="myElement"></div>


	$('myElement').set('text', 'some text') //the text of myElement is now = 'some text'

	//	<div id="myElement">some text</div>



Element Getter: value {#Element:Getters:value}
----------------------------------------------

Returns the value of the Element, if its tag is textarea, select or input. getValue called on a multiple select will return an array.

### Syntax:

	var value = myElement.get('value');

### Returns:

* (mixed) Returns false if if tag is not a 'select', 'input', or 'textarea'. Otherwise returns the value of the Element.

### Example:

	/*<form id="myForm">
		<select>
			<option value="volvo">Volvo</option>
			<option value="saab" selected="yes">Saab</option>
			<option value="opel">Opel</option>
			<option value="audi">Audi</option>
		</select>
	</form>*/

	var result = $('myForm').getElement('select').get('value'); // returns 'Saab'

Element Getter: tag {#Element:Getters:tag}
------------------------------------------

	Returns the tagName of the Element in lower case.

### Syntax:

	var myTag = myElement.get('tag');

### Returns:

* (string) The tag name in lower case

### Example:

	//	<img id="myImage" />
	
	var myTag = $('myImage').get('tag') // myTag = 'img';



Element Getter: html {#Element:Getters:tag}
-------------------------------------------

returns the innerHTML of the Element.

### Syntax:

	myElement.get('html');

### Returns:

* (element) This Element.



Element Getter: text {#Element:Getters:text}
--------------------------------------------

Gets the inner text of the Element.

### Syntax:

	var myText = myElement.get('text');

### Returns:

* (string) The text of the Element.

### Example:

	//	<div id="myElement">my text</div>

	var myText = $('myElement').get('text'); //myText = 'my text';



Native: IFrame {#IFrame}
========================

Custom Native to create and easily work with IFrames.



IFrame Method: constructor {#IFrame:constructor}
------------------------------------------------

Creates an iframe HTML Element and extends its window and document with MooTools.

### Syntax:

	var myIFrame = new IFrame([el][, props]);

### Arguments:

* el - (mixed, optional) The id of the iframe to be converted, or the actual iframe element. If its not passed, a new iframe will be created (default).
* props - (object, optional) The properties to be applied to the new IFrame. Same as [Element:constructor](#Element:constructor) props argument.

### Returns:

* (element) A new iframe HTML Element.

### Example:

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

* elements - (mixed) An array of elements or an HTMLCollection Object.

### Returns:

* (array) An extended array with the [Element][], [Elements][] and [Array][] methods.

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
- Because Elements is an Array, it accepts all the [Array][] methods, while giving precedence to [Element][] and [Elements](#Elements) methods.
- Every node of the Elements instance already has all the with [Element][] methods.

### See Also:

[$$][], [$][], [Element][], [Elements][], [Array][]

Elements Method: filterBy {#Elements:filterBy}
----------------------------------------------

filters a collection of element by a given tagname.
If [Selectors.js][] is included, this method will be able to filter by any selector

### Syntax:

	var filteredElements = elements.filterBy(selector);

### Arguments:

* selector - (mixed) a single css selector.

### Returns:

* (array) A subset of this [Elments][] instance.
