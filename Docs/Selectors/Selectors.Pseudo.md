[Selectors]: /Selectors/Selectors

Selectors.Pseudo
================

Some default Pseudo Selectors for [Selectors][]

### See Also:

- <http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes>

Selectors:
----------

### enabled

Matches all Elements that are enabled.

### Usage:

	':enabled'

### Examples:

	$$('*:enabled')

	$('myElement').getElements(':enabled');

### empty

Matches all elements which are empty.

### Usage:

	':empty'

### Example:

	$$('div:empty');

### contains

Matches all the Elements which contains the text.

### Usage:

	':contains(text)'

### Variables:

* text - (string) The text that the Element should contain.

### Example:

	$$('p:contains("find me")');


### nth

	Matches every nth child.

### Usage:

Nth Expression:

	':nth-child(nExpression)'

### Variables:

* nExpression - (string) A nth expression for the "every" nth-child.

### Examples:

	$$('#myDiv:nth-child(2n)'); //returns every odd child

	$$('#myDiv:nth-child(n)'); //returns every child

	$$('#myDiv:nth-child(2n+1)') //returns every even child

	$$('#myDiv:nth-child(4n+3)') //returns Elements [3, 7, 11, 15, ...]


Every Odd Child:

	':nth-child(odd)'

Every Even Child:

	':nth-child(even)'

Without -Child:

	':nth(nExpression)'
	':nth(odd)'
	':nth(even)'

### even

Matches every even child.

### Usage:

	':even-child'
	':even'

### Example:

	$$('td:even-child');

### odd

Matches every odd child.

### Usage:

	':odd-child'
	':odd'

### Example:

	$$('td:odd-child');

### first

Matches the first child.

### Usage:

	':first-child'
	':first'

### Example:

	$$('td:first-child');


### last

	Matches the last child.

### Usage:

	':last-child'
	':last'

### Example:

	$$('td:last-child');


### only

Matches only child of its parent Element.

### Usage:

	':only-child
	':only'

### Example:

	$$('td:only-child');