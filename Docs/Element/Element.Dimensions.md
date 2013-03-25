Type: Element {#Element}
=========================

Custom Type to allow all of its methods to be used with any DOM element via the dollar function [$][].

### Notes:

* These methods don't take into consideration the body element margins and borders. If you need margin/borders on the body, consider adding a wrapper div, but always reset the margin and borders of body to 0.
* If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.

### Credits:

- Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
- Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).



Element Method: scrollTo {#Element:scrollTo}
--------------------------------------------

Scrolls the element to the specified coordinated (if the element has an overflow).
The following method is also available on the Window object.

### Syntax:

	myElement.scrollTo(x, y);

### Arguments:

1. x - (*number*) The x coordinate.
2. y - (*number*) The y coordinate.

### Example:

	$('myElement').scrollTo(0, 100);

### See Also:

- [MDN Element:scrollLeft][], [MDN Element:scrollTop][]



Element Method: getSize {#Element:getSize}
------------------------------------------

Returns the height and width of the Element, taking into account borders and padding.
The following method is also available on the Window object.

### Syntax:

	myElement.getSize();

### Returns:

* (*object*) An object containing the width (as x) and the height (as y) of the target Element.

### Example:

	var size = myElement.getSize();
	alert('The element is ' + size.x + ' pixels wide and ' + size.y + 'pixels high.');

### Note:

If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.


Element Method: getScrollSize {#Element:getScrollSize}
------------------------------------------------------

Returns an Object representing the size of the target Element, including scrollable area.
The following method is also available on the Window object.

### Syntax:

	myElement.getScrollSize();

### Returns:

* (*object*) An object containing the x and y dimensions of the target Element.

### Example:

	var scroll = $('myElement').getScrollSize();
	alert('My element can scroll to ' + scroll.y + 'px'); // alerts 'My element can scroll down to 820px'

### See Also:

- [MDN Element:scrollLeft][], [MDN Element:scrollTop][], [MDN Element:offsetWidth][], [MDN Element:offsetHeight][], [MDN Element:scrollWidth][], [MDN Element:scrollHeight][]

### Note:

If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.


Element Method: getScroll {#Element:getScroll}
----------------------------------------------

Returns an Object representing how far the target Element is scrolled in either direction.
The following method is also available on the Window object.

### Syntax:

	myElement.getScroll();

### Returns:

* (*object*) An object containing the x and y dimensions of the target Element's scroll.

### Example:

	var scroll = $('myElement').getScroll();
	alert('My element is scrolled down ' + scroll.y + 'px'); // alerts 'My element is scrolled down to 620px'

### Note:

If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.


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

	$('element').getPosition(); // returns {x: 100, y: 500};

### See Also:

- [QuirksMode: Find position](http://www.quirksmode.org/js/findpos.html)

### Note:

If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.


Element Method: setPosition {#Element:setPosition}
--------------------------------------------------

Sets the position of the element's *left* and *top* values to the x/y positions you specify.

### Syntax

	myElement.setPosition(positions);

### Arguments

1. positions - (*object*) an object with x/y values (integers or strings, i.e. 10 or "10px")

### Returns

* (*element*) the element that is positioned.

### Example

	myElement.setPosition({x: 10, y: 100});



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

[Element:getPosition](#Element:getPosition)

### Note:

If you need to measure the properties of elements that are not displayed (either their display style is none or one of their parents display style is none), you will need to use [Element.measure][] to expose it.


Element Method: getOffsetParent {#Element:getOffsetParent}
----------------------------------------------------------

Returns the parent of the element that is positioned, if there is one.

### Syntax

	myElement.getOffsetParent();

### Returns

* (*mixed*) If the element has a parent that is positioned, it returns that element, otherwise it returns *null*.



[$]: /core/Element/Element#Window:dollar
[MDN Element:scrollLeft]: https://developer.mozilla.org/en/DOM/element.scrollLeft
[MDN Element:scrollTop]: https://developer.mozilla.org/en/DOM/element.scrollTop
[MDN Element:offsetWidth]: https://developer.mozilla.org/en/DOM/element.offsetWidth
[MDN Element:offsetHeight]: https://developer.mozilla.org/en/DOM/element.offsetHeight
[MDN Element:scrollWidth]: https://developer.mozilla.org/en/DOM/element.scrollWidth
[MDN Element:scrollHeight]: https://developer.mozilla.org/en/DOM/element.scrollHeight
[Element.measure]: /more/Element/Element.Measure
