Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].

Element Method: scrollTo {#Element:scrollTo}
--------------------------------------------

Scrolls the element to the specified coordinated (if the element has an overflow).

### Syntax:

	myElement.scrollTo(x, y);

### Arguments:

1. x - (*number*) The x coordinate.
2. y - (*integer*) The y coordinate.

### Example:

	$('myElement').scrollTo(0, 100);

### See Also:

<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>,
<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>



Element Method: positioned {#Element:positioned}
------------------------------------------------

Returns true if the Element has been absolutely or relatively positioned.

### Syntax:

	myElement.positioned();

### Returns:

* (*boolean*) True if the positioning of the Element is absolute, fixed, or relative, false if it's static.

### Example:

	if($('myElement').positioned()) {
		alert("This element has been positioned.");
	}




Element Method: getOffsetParent {#Element:getOffsetParent}
------------------------------------------

Returns the first positioned parent Element of the target.

### Syntax:

	myElement.getOffsetParent();

### Returns:

* (*object*) The first positioned parent of the target Element.

### Example:

	myElement.getOffsetParent();



Element Method: getOffsetSize {#Element:getOffsetSize}
----------------------------------------

Returns the height and width of the Element, taking into account borders and padding.

### Syntax:

	myElement.getOffsetSize();

### Returns:

* (*object*) An object containing the width (as x) and the height (as y) of the target Element. 

### Example:

	var size = myElement.getOffsetSize();
	alert("The element is "+size.x+" pixels wide and "+size.y+"pixels high.");




Element Method: getScrollSize {#Element:getScrollSize}
------------------------------------------------------

Returns an Object representing the size of the target Element, including scrollable area.

### Syntax:

	myElement.getScrollSize();

### Returns:

* (*object*) An object containing the x and y dimensions of the target Element.

### Example:

	var scroll = $('myElement').getScrollSize();
	alert('My element can scroll to ' + scroll.y + 'px'); //alerts 'My element can scroll down to 820px'

### See Also:

* <http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
* <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
* <http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>
* <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>
* <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
* <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>

Element Method: getScroll {#Element:getScroll}
----------------------------------------------

Returns an Object representing how far the target Element is scrolled in either direction.

### Syntax:

	myElement.getScroll();

### Returns:

* (*object*) An object containing the x and y dimensions of the target Element's scroll.

### Example:

	var scroll = $('myElement').getScroll();
	alert('My element is scrolled down ' + scroll.y + 'px'); //alerts 'My element is scrolled down to 620px'


Element Method: getPosition {#Element:getPosition}
--------------------------------------------------

Returns the real offsets of the element.

### Syntax:

	myElement.getPosition(relative);

### Arguments:

relative - (Element, defaults to the document) If set, the position will be relative to this Element.

### Returns:

* (*object*) An object with the x and y coordinates of the Element's position.

### Example:

	$('element').getPosition(); //returns {x: 100, y: 500};

### See Also:

* <http://www.quirksmode.org/js/findpos.html>


Element Method: getCoordinates {#Element:getCoordinates}
--------------------------------------------------------

Returns an object with width, height, left, right, top, and bottom coordinate values of the Element.

### Syntax:

	myElement.getCoordinates(relative);

### Arguments:

relative - (*element*, optional) if set, the position will be relative to this element, otherwise relative to the document.

### Returns:

* (*object*) An object containing the Element's current: top, left, width, height, right, and bottom.

### Example:

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

[Element.getPosition](#Element:getPosition)
