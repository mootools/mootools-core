Class: Color {#Color}
=====================

Creates a new Color Class, which is an array with some color specific methods.

### Syntax:

	var myColor = new Color(color[, type]);

### Arguments:

1. color - (*mixed*) A string or an array representation of a color.
2. type  - (*string*, optional) A string representing the type of the color to create.

### Color:

There are three typical representations of color: String, RGB, and HSB. For String representation see [Element:setStyle][] for more information.

### Examples:

##### String Representation:

	'#fff'

##### RGB and HSB Representation:

	[255, 255, 255]
	//Or:
	[255, 255, 255, 1] //(For transparency.)


### Returns:

* (*array*) A new Color instance.

### Examples:

	var black = new Color('#000');
	var purple = new Color([255,0,255]);

### Notes:

- For HSB colors, you need to specify the second argument.



Color Method: mix {#Color:mix}
------------------------------

Mixes two or more colors with the Color.

###	Syntax:

	var myMix = myColor.mix(color[, color2[, color3[, ...][, alpha]);

###	Arguments:

1. color - (*mixed*) A single or many colors, in hex or rgb representation, to mix with this Color.
2. alpha - (*number*, optional) If the last argument is a number, it will be treated as the amount of the color to mix.

###	Returns:

* (*array*) A new Color instance.

###	Examples:

	// mix black with white and purple, each time at 10% of the new color
	var darkpurple = new Color('#000').mix('#fff', [255, 0, 255], 10);

	$('myDiv').setStyle('background-color', darkpurple);



Color Method: invert {#Color:Invert}
------------------------------------

Inverts the Color.

###	Syntax:

	var myInvert = myColor.invert();

###	Returns:

* (*array*) A new Color instance.

###	Examples:

	var white = new Color('#fff');
	var black = white.invert();



Color Method: setHue {#Color:setHue}
------------------------------------

Modifies the hue of the Color, and returns a new one.

###	Syntax:

	var hue = myColor.setHue(value);

###	Arguments:

1. value - (*number*) The hue to set.

###	Returns:

* (arrays) A new Color instance.

###	Example:

	var myColor = new Color('#f00');
	var myElement = $('myElement');

	(function(){
		myElement.setStyle('color', myColor.setHue(myColor.hsb[0]++)));
	}).periodical(250);



Color Method: setSaturation {#Color:setSaturation}
--------------------------------------------------

Changes the saturation of the Color, and returns a new one.

###	Syntax:

	var saturate = myColor.setSaturation(percent);

###	Arguments:

1. percent - (*number*) The percentage of the saturation to set.

### Returns:

* (*array*) A new Color instance.

###	Examples:

	var myColor = new Color('#f00');
	$('myElement').addEvent('mouseenter', function(){
		this.setStyle('background-color', myColor.setSaturation(myColor.hsb[1]++));
	});



Color Method: setBrightness {#Color:setBrightness}
--------------------------------------------------

Changes the brightness of the Color, and returns a new one.

###	Syntax:

	var brighten = myColor.setBrightness(percent);

### Arguments:

1. percent - (*number*) The percentage of the brightness to set.

###	Returns:

* (*array*) A new Color instance.

###	Examples:

	var myColor = new Color('#000');
	$('myElement').addEvent('mouseenter', function(){
		this.setStyle('background-color', myColor.setBrightness(myColor.hsb[2]++));
	});



Function: $RGB {#RGB}
---------------------

Shortcut to create a new color, based on red, green, blue values.

### Syntax:

	var myColor = $RGB(r, g, b);

### Arguments:

1. r - (*number*) A red value from 0 to 255.
2. g - (*number*) A green value from 0 to 255.
3. b - (*number*) A blue value from 0 to 255.

### Returns:

* (*array*) A new Color instance.

### Examples:

	var myColor = $RGB($random(0,255), $random(0,255), $random(0,255));



Function: $HSB {#HSB}
---------------------

Shortcut to create a new color, based on: hue, saturation, brightness values.

### Syntax:

	var myColor = $HSB(h, s, b);

### Arguments:

1. h - (*number*) A hue value from 0 to 359.
2. s - (*number*) A saturation value from 0 to 100.
3. b - (*number*) A brightness value from 0 to 100.

### Returns:

* (*array*) A new Color instance.

### Examples:

	var myColor = $HSB(50, 50, 100);



Native: Array {#Array}
======================

Contains Array prototypes.

### See Also:

- [MDC Array][]



Array Method: rgbToHsb {#Array:rgbToHsb}
----------------------------------------

Converts a RGB array to an HSB array.

###	Syntax:

	var myHSB = myRGBArray.rgbToHsb();

###	Returns:

* (*array*) An array with HSB values.

###	Example:

	var myHSB = [255, 0, 0].rgbToHsb(); //Returns [0, 100, 100].



Array Method: hsbToRgb {#Array:hsbToRgb}
----------------------------------------

Converts an HSB array to a RGB array.

###	Syntax:

	var myHSB = myRGBArray.hsbToRgb();

###	Returns:

* (*array*) An array with RGB values.

###	Examples:

	var myRGB = [0, 100, 100].hsbToRgb(); //myRGB = [255, 0, 0]



[Element:setStyle]: /Element/Element.Style#Element:setStyles
[MDC Array]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array