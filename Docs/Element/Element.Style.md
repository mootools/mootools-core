Element.Style.js
----------------

Contains useful Element methods to get/set styles in a fashionable way.

### License:

MIT-style license.



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: setStyle {#Element:setStyle}
--------------------------------------------

**Sets a CSS property to the Element.**

###	Syntax:

	myElement.setStyle(property, value);

###	Arguments:

1. **property** - (*string*) The property to set.
2. **value**    - (*mixed*) The value to which to set it. For numeric values that require "px" you can pass an number.

###	Returns:

* (*element*) This element.

###	Example:

	$('myElement').setStyle('width', '300px'); //the width is now 300px

	//or

	$('myElement').setStyle('width', 300); //the width is now 300px

###	Notes:

- All number values will automatically be rounded to the nearest whole number.



Element Method: getStyle {#Element:getStyle}
--------------------------------------------

**Returns the style of the Element given the property passed in.**

###	Syntax:

	var style = myElement.getStyle(property);

###	Arguments:

1. **property** - (*string*) The css style property you want to retrieve.

###	Returns:

* (*string*) The style value.

###	Examples:

	$('myElement').getStyle('width'); //returns "400px"

	//but you can also use

	$('myElement').getStyle('width').toInt(); //returns 400



Element Method: setStyles {#Element:setStyles}
----------------------------------------------

**Applies a collection of styles to the Element.**

###	Syntax:

	myElement.setStyles(styles);

###	Arguments:

1. **styles** - (*mixed*) An object, or string, containing all the styles to apply.

###	Returns:

* (*element*) This element.

###	Example:

	$('myElement').setStyles({
		border: '1px solid #000',
		width: 300,
		height: 400
	});

	//or

	$('myElement').setStyles('border: 1px solid #000; width: 300px; height: 400px;'); // See the Note

###	Notes:

- When styles is a CSS string, all the CSS styles are overridden.

###	See Also:

- [Element:getStyle][]



Element Method: getStyles {#Element:getStyles}
----------------------------------------------

**Returns an object of styles of the Element for each argument passed in.**

###	Syntax:

	var styles = myElement.getStyles(property[, property2[, property3[, ...]]]);

###	Arguments:

1. **properties** - (*strings*) Any number of style properties.

###	Returns:

* (*object*) An key/value object with the CSS styles as computed by the browser.

###	Examples:

	$('myElement').getStyles('width', 'height', 'padding'); 
	//returns {width: "10px", height: "10px", padding: "10px 0px 10px 0px"}

###	See Also:

- [Element:getStyle][]



[$]: /Element/#dollar
[Function]: /Native/Function
[Element:getStyle]: #Element:getStyle