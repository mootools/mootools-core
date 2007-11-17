[$]: /Element/Element#dollar
[Element]: /Element/Element

Native: Element {#Element}
==========================

Custom class to allow all of its methods to be used with any Selectors element via the dollar function [$][].

Element Property: getElements {#Element:getElements}
----------------------------------------------------

Gets all the elements within an element that match the given selector.

### Syntax:

	var myElements = myElement.getElements(selector[, nocash]);

### Arguments:

1. selector - (*string*) The CSS Selector to match.
2. nocash   - (*boolean*, optional: defaults to false) If true, the found Elements are not extended.

### Returns:

* (*array*) An <Elements> collections.

### Examples:

	$('myElement').getElements('a'); // get all anchors within myElement

	$('myElement').getElements('input[name=dialog]') //get all input tags with name 'dialog'

	$('myElement').getElements('input[name$=log]') //get all input tags with names ending with 'log'

	$(document.body).getElements('a.email').addEvents({
		'mouseenter': function(){
			this.href = 'real@email.com';
		},
		'mouseleave': function(){
			this.href = '#';
		}
	});

### Notes:

- Supports these operators in attribute selectors:

	- = : is equal to
	- ^= : starts-with
	- $= : ends-with
	- != : is not equal to

- Xpath is used automatically for compliant browsers.

Element Property: getElement {#Element:getElement}
--------------------------------------------------

Same as [Element:getElements](#Element:getElements), but returns only the first.

###	Syntax:

	var anElement = myElement.getElement(selector);

###	Arguments:

1. selector - (*string*) The CSS Selector to match.

###	Returns:

* (*mixed*) An extended [Element][], or null if not found.

### Example:

	var found = $('myElement').getElement('.findMe').setStyle('color', '#f00');

### Note:

- Alternate syntax for [$E](#Element:E), where filter is the Element.

Function: $E {#Element:E}
--------------------------

Alias for [Element:getElement](#Element:getElement), using document as context.


Element Method: match {#Element:match}
--------------------------------------

Matches the Element with the given selector.

### Syntax:

	var matched = myElement.match(selector);

###	Arguments:

1. selector - (*string*) Selectors to match the element to.

### Returns:

* (*boolean*) true if matched, false otherwise.

### Example:

	var elem = $('myelement');
	//later in the code, for whatever reason
	elem.match('div[name=somename]'); //returns true if the element is a div and has as name "somename".