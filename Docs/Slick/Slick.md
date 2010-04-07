Slick {#Slick}
================

Slick is the standalone selector engine used in MooTools.

Below is a brief explanation of the CSS3 selectors it supports, and how to extend it with custom psuedos.



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



[$]: /core/Element/Element#dollar
[Element]: /core/Element/Element
[Selectors]: /core/Selectors/Selectors