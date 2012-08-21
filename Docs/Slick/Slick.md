Slick {#Slick}
==========================

Slick is the selector engine used by MooTools. It supports many CSS3 selectors and more!

### See Also:

- [W3C Pseudo Classes](http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes)


Reverse Combinators
-------------------

Reverse Combinators redirect the flow of selectors and combinators. Slick implements these by prepending `!` to a selector or combinator.

### Examples:

	document.getElement('p ! div')    // A <div> that is an ancestor of a <p>
	document.getElement('p !> div')   // A <div> that is a direct parent of a <p>
	document.getElement('.foo !+ p')  // Gets the previous adjacent <p> sibling

### Notes:

Reverse Combinators are used internally by MooTools for many of our traversal methods. They offer an extremely concise and powerful alternative to traversal methods like `getParent()`.


Function: Slick.definePseudo  {#Slick:Slick-definePseudo}
---------------------------------------------------------

definePseudo allows you to create your own custom pseudo selectors.

### Examples:

	Slick.definePseudo('display', function(value){
   		return Element.getStyle(this, 'display') == value;
	});

	<div style="display: none">foo</div>
	<div style="display: block">bar</div>

	$$(':display(block)');		// Will return the block element

	Slick.definePseudo('my-custom-pseudo', function(){
		// 'this' is the node to check
		return Element.retrieve(this, 'something-custom').isAwesome;
	});

	$$(':my-custom-pseudo')		// Will return the first <p> tag that is awesome


Selector: Next Siblings ('~') {#Slick:nextSiblings}
---------------------------------------------------

Gets the next siblings.

### Example:

	$$('p.foo ~')		 // Gets all next siblings of <p class="foo">
	$$('p.foo ~ blockquote') // Gets every <blockquote> with a <p class="foo"> sibling somewhere *before* it


Selector: Previous Siblings ('!~') {#Slick:previouSiblings}
------------------------------------------------------------

Gets the previous siblings.

### Example:

	$$('p.foo !~')            // Gets all previous siblings of <p class="foo">
	$$('p.foo !~ blockquote') // Gets every <blockquote> with a <p class="foo"> sibling somewhere *after* it


Selector: All Siblings ('~~') {#Slick:allSiblings}
--------------------------------------------------

Gets all siblings.

### Example:

	$$('p.foo ~~')            // Gets all previous and next siblings of <p class="foo">
	$$('p.foo ~~ blockquote') // Gets every <blockquote> with a <p class="foo"> sibling before OR after it

Selector: First Child ('^') {#Slick:firstChild}
-----------------------------------------------

Gets the first child of an element.

### Example:

	$$('p.foo ^')		// Gets the first child of <p class="foo">
	$$('p.foo ^ strong')	// Gets every <strong> that is the first element child of a <p class="foo">


Selector: Last Child ('!^') {#Slick:lastChild}
----------------------------------------------

Gets the last child of an element.

### Example:

	$$('p.foo !^')		// Gets the last child of <p class="foo">
	$$('p.foo !^ strong')	// Gets every <strong> that is the last element child of a <p class="foo">



Selector: checked {#Slick:checked}
----------------------------------

Matches all Elements that are checked.

### Examples:

	$$(':checked')

	$('myForm').getElements('input:checked');


Selector: enabled {#Slick:enabled}
----------------------------------

Matches all Elements that are enabled.

### Examples:

	$$(':enabled')

	$('myElement').getElements(':enabled');


Selector: empty {#Slick:empty}
------------------------------

Matches all elements which are empty.

### Example:

	$$(':empty');


Selector: contains {#Slick:contains}
------------------------------------

Matches all the Elements which contains the text.

### Variables:

* text - (string) The text that the Element should contain.

### Example:

	$$('p:contains("find me")');


Selector: focus {#Slick:focus}
------------------------------

Gets the element in focus.

### Example:

	$$(':focus');		// Gets the element in focus


Selector: not {#Slick:not}
--------------------------

Matches all elements that do not match the selector.

<small>Note: The Slick implementation of the `:not` pseudoClass is a superset of the standard. i.e. it is more advanced than the specification.</small>

### Examples:

	$$(':not(div.foo)'); // all elements except divs with class 'foo'

	$$('input:not([type="submit"])'); // all inputs except submit buttons

	myElement.getElements(':not(a)');

	$$(':not(ul li)');


Selector: nth-child {#Slick:nth-child}
--------------------------------------

Matches every nth child.

### Usage:

Nth Expression:

	':nth-child(nExpression)'

### Variables:

* nExpression - (string) A nth expression for the "every" nth-child.

### Examples:

	<span id="i1"></span>
	<span id="i2"></span>
	<span id="i3"></span>
	<span id="i4"></span>
	<span id="i5"></span>

	$$(':nth-child(1)'); //Returns Element #i1.

	$$(':nth-child(2n)'); //Returns Elements #i2 and #i4.

	$$(':nth-child(2n+1)') //Returns Elements #i1, #i3 and #i5.

	$$(':nth-child(3n+2)') //Returns Elements #i2 and #i5.


Every Odd Child (same as 2n+1):

	':nth-child(odd)'

Every Even Child (same as 2n):

	':nth-child(even)'

### Note:

This selector respects the w3c specifications, so it has 1 as its first index, not 0. Therefore nth-child(odd) will actually select the even children, if you think in zero-based indexes.


Selector: nth-last-child {#Slick:nth-last-child}
--------------------------------------

Matches every nth child, starting from the last child.

### Usage:

Nth Expression:

	':nth-last-child(nExpression)'

### Variables:

* nExpression - (string) A nth expression for the "every" nth-child.

### Examples:

	<span id="i1"></span>
	<span id="i2"></span>
	<span id="i3"></span>
	<span id="i4"></span>
	<span id="i5"></span>

	$$(':nth-last-child(1)'); //Returns Element #i5.

	$$(':nth-last-child(2n)'); //Returns Elements #i2 and #i4.

	$$(':nth-last-child(2n+1)') //Returns Elements #i1, #i3 and #i5.

	$$(':nth-last-child(3n+2)') //Returns Elements #i1 and #i4.

Every Odd Child (same as 2n+1):

	':nth-last-child(odd)'

Every Even Child  (same as 2n):

	':nth-last-child(even)'

### Note:

This selector respects the w3c specifications, so it has 1 as its first index, not 0. Therefore nth-last-child(odd) will actually select the even last-children, if you think in zero-based indexes.


Selector: even {#Slick:even}
----------------------------

Matches every even child.

### Example:

	$$('td:even');

### Note:

This selector is not part of the w3c specification, therefore its index starts at 0. This selector is highly recommended over nth-child(even), as this will return the real even children.


Selector: odd {#Slick:odd}
--------------------------

Matches every odd child.

### Example:

	$$('td:odd');

### Note:

This selector is not part of the w3c specification, therefore its index starts at 0. This selector is highly recommended over nth-child(odd), as this will return the real odd children.


Selector: index {#Slick:index}
------------------------------

Matches the node at the specified index

### Example:

	$$('p:index(2)');		// Gets the third <p> tag.

### Note:

This is zero-indexed.


Selector: first-child {#Slick:first-child}
------------------------------------------

Matches the first child.

### Usage:

	':first-child'

### Example:

	$$('td:first-child');


Selector: last-child {#Slick:last-child}
----------------------------------------

	Matches the last child.

### Usage:

	':last-child'

### Example:

	$$('td:last-child');


Selector: only-child {#Slick:only-child}
----------------------------------------

Matches an only child of its parent Element.

### Usage:

	':only-child'

### Example:

	$$('td:only-child');



[Slick]: /core/Slick/Slick
