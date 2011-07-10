Slick {#Slick}
==========================

Slick is the selector engine used by MooTools. It supports many CSS3 selectors and more!

### See Also:

- [W3C Pseudo Classes](http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes)


Reverse Combinators
-------------------------------------

Reversed Combinators redirect the flow of selectors and combinators. Slick implements these by prepending ! to a selector or combinator.

### Examples:

	$$('p ! div')		// A <div> that is a parent of a <p>
	$$('p !> div')		// A <div> that is a direct parent of a <p>
	$$('.foo !+ p')		// Gets the previous adjacent <p> sibling


Selector: Next Siblings ('~') {#Selector:nextsiblings}
-------------------------------------

Gets the next siblings.

### Example:
	
	$$('p.foo ~')		// Gets all next siblings of <p class='foo'>


Selector: Previous Siblings ('!~') {#Selector:previoussiblings}
-------------------------------------

Gets the previous siblings.

### Example:
	
	$$('p.foo !~')		// Gets all previous siblings of <p class='foo'>
	

Selector: All Siblings ('~~') {#Selector:allsiblings}
-------------------------------------

Gets all siblings.

### Example:

	$$('p.foo ~~')		// Gets all previous and next siblings of <p class='foo'>
	

Selector: First Child ('^') {#Selector:firstchild}
-------------------------------------

Gets the first child of an element.

### Example:

	$$('p.foo ^')		// Gets the first child of <p class='foo'>
	

Selector: Last Child ('!^') {#Selector:lastchild}
-------------------------------------

Gets the last child of an element.

### Example:

	$$('p.foo !^')		// Gets the last child of <p class='foo'>



Selector: checked {#Selector:checked}
-------------------------------------

Matches all Elements that are checked.

### Usage:

	':checked'

### Examples:

	$$('*:checked')

	$('myForm').getElements('input:checked');


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


Selector: not {#Selector:not}
-------------------------------------

Matches all elements that do not match the single selector.

### Usage:

	':not(selector)'

### Examples:

	$$(':not(div.foo)'); // all elements except divs with class 'foo'

	$$('input:not([type="submit"])'); // all inputs except submit buttons

	myElement.getElements(':not(a)');

	$$(':not(ul li)'); // NOT allowed! Only single selectors might be passed.


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


Selector: first-child {#Selector:first-child}
---------------------------------

Matches the first child.

### Usage:

	':first-child'

### Example:

	$$('td:first-child');


Selector: last-child {#Selector:last-child}
-------------------------------------

	Matches the last child.

### Usage:

	':last-child'

### Example:

	$$('td:last-child');


Selector: only-child {#Selector:only-child}
-------------------------------------

Matches an only child of its parent Element.

### Usage:

	':only-child'

### Example:

	$$('td:only-child');



[Slick]: /core/Slick/Slick