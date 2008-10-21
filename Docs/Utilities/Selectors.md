Native: Element {#Element}
==========================

Custom class to allow all of its methods to be used with any Selectors element via the dollar function [$][].

Element Property: getElements {#Element:getElements}
----------------------------------------------------

Gets all the elements within an element that match the given selector.

### Syntax:

	var myElements = myElement.getElements(selector);

### Arguments:

1. selector - (*string*) The CSS Selector to match.

### Returns:

* (*array*) An [Element][] collection.

### Examples:

    //Returns all anchors within myElement.
	$('myElement').getElements('a');

    //Returns all input tags with name "dialog".
	$('myElement').getElements('input[name=dialog]');

    //Returns all input tags with names ending with 'log'.
	$('myElement').getElements('input[name$=log]');

	//Returns all email links (starting with "mailto:").
	$('myElement').getElements('a[href^=mailto:]');

    //Adds events to all Elements with the class name 'email'.
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

	- '=' : is equal to
	- '*=': contains
	- '^=' : starts-with
	- '$=' : ends-with
	- '!=' : is not equal to
	- '~=' : contained in a space separated list
	- '|=' : contained in a '-' separated list



Element Property: getElement {#Element:getElement}
--------------------------------------------------

Same as [Element:getElements](#Element:getElements), but returns only the first.

### Syntax:

	var anElement = myElement.getElement(selector);

### Arguments:

1. selector - (*string*) The CSS Selector to match.

### Returns:

* (*mixed*) An extended [Element][], or null if not found.

### Example:

	var found = $('myElement').getElement('.findMe').setStyle('color', '#f00');



Selectors.Pseudo {#Selectors}
=============================

Some default Pseudo Selectors for [Selectors][].

### See Also:

- [W3C Pseudo Classes](http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes)


Selector: enabled {#Selector:enabled}
-------------------------------------

Matches all Elements that are enabled.

### Usage:

	':enabled'

### Examples:

	$$('*:enabled')

	$('myElement').getElements(':enabled');

Selector: empty {#Selector:empty}
---------------------------------

Matches all elements which are empty.

### Usage:

	':empty'

### Example:

	$$('div:empty');

Selector: contains {#Selector:contains}
---------------------------------------

Matches all the Elements which contains the text.

### Usage:

	':contains(text)'

### Variables:

* text - (string) The text that the Element should contain.

### Example:

	$$('p:contains("find me")');


Selector: nth-child {#Selector:nth-child}
-----------------------------------------

Matches every nth child.

### Usage:

Nth Expression:

	':nth-child(nExpression)'

### Variables:

* nExpression - (string) A nth expression for the "every" nth-child.

### Examples:

	$$('#myDiv:nth-child(2n)'); //Returns every even child.

	$$('#myDiv:nth-child(n)'); //Returns all children.

	$$('#myDiv:nth-child(2n+1)') //Returns every odd child.

	$$('#myDiv:nth-child(4n+3)') //Returns Elements 3, 7, 11, 15, etc.


Every Odd Child:

	':nth-child(odd)'

Every Even Child:

	':nth-child(even)'

Only Child:

	':nth-child(only)'

First Child:

	'nth-child(first)'

Last Child:

	'nth-child(last)'

### Note:

This selector respects the w3c specifications, so it has 1 as its first child, not 0. Therefore nth-child(odd) will actually select the even children, if you think in zero-based indexes.

Selector: even {#Selector:even}
-------------------------------

Matches every even child.

### Usage:

	':even'

### Example:

	$$('td:even');

### Note:

This selector is not part of the w3c specification, therefore its index starts at 0. This selector is highly recommended over nth-child(even), as this will return the real even children.

Selector: odd {#Selector:odd}
-----------------------------

Matches every odd child.

### Usage:

	':odd'

### Example:

	$$('td:odd');

### Note:

This selector is not part of the w3c specification, therefore its index starts at 0. This selector is highly recommended over nth-child(odd), as this will return the real odd children.

Selector: first {#Selector:first-child}
---------------------------------

Matches the first child.

### Usage:

	':first-child'

### Example:

	$$('td:first-child');


Selector: last {#Selector:last-child}
-------------------------------------

	Matches the last child.

### Usage:

	':last-child'

### Example:

	$$('td:last-child');


Selector: only {#Selector:only-child}
-------------------------------------

Matches an only child of its parent Element.

### Usage:

	':only-child'

### Example:

	$$('td:only-child');

[$]: /Element/Element#dollar
[Element]: /Element/Element
[Selectors]: /Selectors/Selectors
