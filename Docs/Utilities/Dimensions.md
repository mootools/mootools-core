Element.Dimensions.js
---------------------

Contains Element methods to work with element size, scroll, or position in space.

### License:

MIT-style license.

### Remark:

- The functions in this script require a XHTML doctype.

### See Also:

<http://en.wikipedia.org/wiki/XHTML>



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: scrollTo {#Element:scrollTo}
--------------------------------------------

Scrolls the element to the specified coordinated (if the element has an overflow).

### Syntax:

	myElement.scrollTo(x, y);

### Arguments:

1. x - (*integer*) The x coordinate.
2. y - (*integer*) The y coordinate.

### Examples:

	$('myElement').scrollTo(0, 100);

### See Also:

- <http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>,
- <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>



Element Method: getSize {#Element:getSize}
------------------------------------------

Returns an Object representing the different size dimensions of the element.

### Syntax:

	myElement.getSize();

### Returns:

* (*object*) An object containing 'client', 'offset', and 'scroll' objects, each with x and y values.

Return Example:
	
	{
		'client': {'x': 135, 'y': 125}, //total visible size of the content of the element
		'offset': {'x': 155, 'y': 145}, //total visible size of the element including borders, paddings, and scrollbars
		'scroll': {'x': 135, 'y': 400}  //total size of the element including hidden scrollable content
	}

### Examples:

	var size = $('myElement').getSize();
	alert('My element is ' + size.offset.x + 'px wide'); //alerts 'My element is 155px wide'

### See Also:

- <http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>,
- <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>,
- <http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>,
- <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>,
- <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>,
- <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>



Element Method: getScroll {#Element:getScroll}
----------------------------------------------

Returns an Object representing the size/scroll values of the element.

### Syntax:

	myElement.getSize();

### Returns:

* (*object*) An object containing the x and y scroll positions of the element.

### Examples:

	var scroll = $('myElement').getScroll();
	alert('My element is scrolled down ' + scroll.y + 'px'); //alerts 'My element is scrolled down 20px'

### See Also:

- <http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
- <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
- <http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>
- <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>
- <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
- <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>



Element Method: getPosition {#Element:getPosition}
--------------------------------------------------

Returns the real offsets of the element.

### Syntax:

	myElement.getPosition(relative);

### Arguments:

1. relative - (*element*, optional) if set, the position will be relative to this element, otherwise relative to the document.

### Returns:

* (*object*) An object with properties: x and y coordinates of the Element's position.

### Examples:

	$('element').getPosition(); //returns {x: 100, y: 500};

### See Also:

- <http://www.quirksmode.org/js/findpos.html>



Element Method: getTop {#Element:getTop}
----------------------------------------

Returns the distance from the top of the window to the Element.

### Syntax:

	myElement.getTop(relative);

### Arguments:

1. relative - (*element*, optional) if set, the position will be relative to this element, otherwise relative to the document.

### Returns:

* (*integer*) The top position of this Element.

### Examples:

	$('myElement').getTop(); //returns 20

### See Also:

- [Element.getPosition](#Element:getPosition)



Element Method: getLeft {#Element:getLeft}
------------------------------------------

Returns the distance from the left of the window to the Element.

### Syntax:

	myElement.getLeft(relative);

### Arguments:

1. relative - (*element*, optional) if set, the position will be relative to this element, otherwise relative to the document.

### Returns:

* (*integer*) The left position of this Element.

### Examples:

	$('myElement').getLeft(); //returns 20

### See Also:

- [Element.getPosition](#Element:getPosition)



Element Method: getCoordinates {#Element:getCoordinates}
--------------------------------------------------------

Returns an object with width, height, left, right, top, and bottom, representing the values of the Element.

### Syntax:

	myElement.getCoordinates(relative);

### Arguments:

1. relative - (*element*, optional) if set, the position will be relative to this element, otherwise relative to the document.

### Returns:

* (*object*) An object containing the Element's current: top, left, width, height, right, and bottom.

### Examples:

	var myValues = $('myElement').getCoordinates();

#### Returns:

	{
		top: 50,
		left: 100,
		width: 200,
		height: 300,
		right: 300,
		bottom: 350
	}

### See Also:

- [Element.getPosition][]



[$]: /Element/#dollar
[Element.getPosition]: #Element:getPosition