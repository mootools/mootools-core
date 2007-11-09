Script: Selectors.Pseudo.js
	Some default Pseudo Selectors for <Selectors.js>

License:
	MIT-style license.

See Also:
	<http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes>



Selector: enabled
	Matches all Elements that are enabled.

Usage:
	>':enabled'

Examples:
	[javascript]
		$$('*:enabled')
	[/javascript]

	[javascript]
		$('myElement').getElements(':enabled');
	[/javascript]



Selector: empty
	Matches all elements which are empty.

Usage:
	>':empty'

Example:
	[javascript]
		$$('div:empty');
	[/javascript]



Selector: contains
	Matches all the Elements which contains the text.

Usage:
	>':contains(text)'

	Variables:
		text - (string) The text that the Element should contain.

Example:
	[javascript]
		$$('p:contains("find me")');
	[/javascript]



Selector: nth
	Matches every nth child.

Usage:
	Nth Expression:
		>':nth-child(nExpression)'

		Variables:
			nExpression - (string) A nth expression for the "every" nth-child.

			Examples:
				[javascript]
					$$('#myDiv:nth-child(2n)'); //returns every odd child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(n)'); //returns every child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(2n+1)') //returns every even child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(4n+3)') //returns Elements [3, 7, 11, 15, ...]
				[/javascript]

Every Odd Child:
	>':nth-child(odd)'

Every Even Child:
	>':nth-child(even)'

Without -Child:
	>':nth(nExpression)'
	>':nth(odd)'
	>':nth(even)'



Selector: even
	Matches every even child.

Usage:
	>':even-child'
	>':even'

Example:
	[javascript]
		$$('td:even-child');
	[/javascript]



Selector: odd
	Matches every odd child.

Usage:
	>':odd-child'
	>':odd'

Example:
	[javascript]
		$$('td:odd-child');
	[/javascript]



Selector: first
	Matches the first child.

Usage:
	>':first-child'
	>':first'

Example:
	[javascript]
		$$('td:first-child');
	[/javascript]



Selector: last
	Matches the last child.

Usage:
	>':last-child'
	>':last'

Example:
	[javascript]
		$$('td:last-child');
	[/javascript]



Selector: only
	Matches only child of its parent Element.

Usage:
	>':only-child
	>':only'

Example:
	[javascript]
		$$('td:only-child');
	[/javascript]
