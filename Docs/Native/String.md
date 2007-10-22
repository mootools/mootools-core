Native: String {#String}
========================

A collection of the String Object prototype methods.

### See Also:

[MDC String](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:String)



String Method: test {#String:test}
----------------------------------

Searches for a match between the string and a regular expression.
For more information see [MDC Regexp:test](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:RegExp:test).

### Syntax:

	myString.test(regex[,params]);

### Arguments:

1. regex  - (mixed) The string or regular expression you want to match the string with.
2. params - (string, optional) If first parameter is a string, any parameters you want to pass to the regular expression ('g' has no effect).

### Returns:

* (boolean) `true`, if a match for the regular expression is found in this string.
* (boolean) `false` if is not found

### Example:

	"I like cookies".test("cookie"); //returns true
	"I like cookies".test("COOKIE", "i"); //returns true (ignore case)
	"I like cookies".test("cake"); //returns false

### See Also:

[MDC Regular Expressions](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Guide:Regular_Expressions)



String Method: contains {#String:contains}
------------------------------------------

Checks to see if the string passed in is contained in this string.
If the separator parameter is passed, will check to see if the string is contained in the list of values separated by that parameter.

### Syntax:

	myString.contains(string[, separator]);

### Arguments:

1. string    - (string) The string to search for.
2. separator - (string, optional) The string that separates the values in this string (eg. Element classNames are separated by a ' ').

### Returns:

* (boolean) `true` if the string is contained in this string
* (boolean) `false` if not.

### Example:

	'a bc'.contains('bc'); //returns true
	'a b c'.contains('c', ' '); //returns true
	'a bc'.contains('b', ' '); //returns false
	


String Method: trim {#String:trim}
----------------------------------

Trims the leading and trailing spaces off a string.

### Syntax:
	
	myString.trim();

### Returns:

* (string) The trimmed string.

### Example:

	"    i like cookies     ".trim(); //"i like cookies"
	
	

String Method: clean {#String:clean}
------------------------------------

Removes all extraneous whitespace from a string and trims ([String:trim](#String:trim)) it.

### Syntax:
	
	myString.clean();

### Returns:

* (string) The cleaned string.

### Example:

	" i      like     cookies      \n\n".clean(); //returns "i like cookies"
	
	

String Method: camelCase {#String:camelCase}
--------------------------------------------

Converts a hyphenated string to a camelcased string.

### Syntax:
	
	myString.camelCase();

### Returns:

* (string) The camelcased string.

### Example:

	"I-like-cookies".camelCase(); //returns "ILikeCookies"



String Method: hyphenate {#String:hyphenate}
--------------------------------------------

Converts a camelcased string to a hyphenated string.

### Syntax:

	myString.hyphenate();

### Returns:

* (string) The hyphenated string.

### Example:

	"ILikeCookies".hyphenate(); //returns "I-like-cookies"

String Method: capitalize {#String:capitalize}
----------------------------------------------

Converts the first letter of each word in a string to uppercase.

### Syntax:

	myString.capitalize();

### Returns:

* (string) The capitalized string.

### Example:

	"i like cookies".capitalize(); //returns "I Like Cookies"



String Method: escapeRegExp {#String:escapeRegExp}
--------------------------------------------------

Escapes all regular expression characters from the string.

### Syntax:

	myString.escapeRegExp();

### Returns:

* (string) The escaped string.

### Example:

	'animals.sheep[1]'.escapeRegExp(); //returns 'animals\.sheep\[1\]'



String Method: toInt {#String:toInt}
------------------------------------

Parses this string and returns a number of the specified radix or base.

### Syntax:
	
	myString.toInt([base]);

### Arguments:

1. base - (number, optional) The base to use (defaults to 10).

### Returns:

* (number) The number.
* (false) If the string is not numeric, returns NaN.

### Example:

	"4em".toInt(); //returns 4
	"10px".toInt(); //returns 10

### See Also:

[MDC parseInt](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseInt)



String Method: toFloat {#String:toFloat}
----------------------------------------

Parses this string and returns a floating point number.

### Syntax:

	myString.toFloat();

### Returns:

* (number) The float.
* (false) If the string is not numeric, returns NaN.

### Example:

		"95.25%".toFloat(); //returns 95.25
		"10.848".toFloat(); //returns 10.848

### See Also:

[MDC parseFloat](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseFloat)



String Method: hexToRgb {#String:hexToRgb}
------------------------------------------

Converts a hexidecimal color value to RGB. Input string must be in one of the following hexidecimal color formats (with or without the hash).

	'#ffffff', #fff', 'ffffff', or 'fff'

### Syntax:

	myString.hexToRgb([array]);

### Arguments:

1. array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

### Returns:

* (string) A string representing the color in RGB.
* (array) If the array flag is set, an array will be returned instead.

### Example:

	"#123".hexToRgb(); //returns "rgb(17,34,51)"
	"112233".hexToRgb(); //returns "rgb(17,34,51)"
	"#112233".hexToRgb(true); //returns [17,34,51]

### See Also:

[Array:hexToRgb](#Array:hexToRgb)



String Method: rgbToHex {#String:rgbToHex}
------------------------------------------

Converts an RGB color value to hexidecimal. Input string must be in one of the following RGB color formats.

	"rgb(255,255,255)", or "rgba(255,255,255,1)"

### Syntax:

	myString.rgbToHex([array]);

### Arguments:

1. array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

### Returns:

* (string) A string representing the color in hexadecimal, or transparent if the fourth value of rgba in the input string is 0.
* (array) If the array flag is set, an array will be returned instead.

### Example:

	"rgb(17,34,51)".rgbToHex(); //returns "#112233"
	"rgb(17,34,51)".rgbToHex(true); //returns ['11','22','33']
	"rgba(17,34,51,0)".rgbToHex(); //returns "transparent"

### See Also:

[Array:rgbToHex](#Array:rgbToHex)


Native: Array {#Array}
======================

Array Methods.

## See Also:

[MDC Array](http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array)



Array Method: hexToRgb {#Array:hexToRgb}
----------------------------------------

Converts a hexidecimal color value to RGB. Input array must be in one of the following hexidecimal color formats.

	['ff', 'ff', 'ff'], or ['f', 'f', 'f']

### Syntax:

	myArray.hexToRgb([array]);

### Arguments:

1. array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

### Returns:

* (string) A string representing the color in RGB.
* (array) If the array flag is set, an array will be returned instead.

### Example:

	["1", "2", "3"].hexToRgb(); //returns "rgb(17,34,51)"
	["11", "22", "33"].hexToRgb(); //returns "rgb(17,34,51)"
	["11", "22", "33"].hexToRgb(true); //returns [17,34,51]

### See Also:

[String:hexToRgb](#String:hexToTgb)



Array Method: rgbToHex {#Array:rgbToHex}
----------------------------------------

Converts an RGB color value to hexidecimal. Input array must be in one of the following RGB color formats.

	[255,255,255], or [255,255,255,1]

### Syntax:

	myArray.rgbToHex([array]);

### Arguments:

1. array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

### Returns:

* (string) A string representing the color in hexadecimal, or 'transparent' string if the fourth value of rgba in the input array is 0 (rgba).
* (array) If the array flag is set, an array will be returned instead.

### Example:

	[17,34,51].rgbToHex(); //returns "#112233"
	[17,34,51].rgbToHex(true); //returns ['11','22','33']
	[17,34,51,0].rgbToHex(); //returns "transparent"

### See Also:

[String:rgbToHex](#String:rgbToHex)
