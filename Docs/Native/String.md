Native: String {#String}
========================

A collection of the String Object prototype methods.

### See Also:

- [MDC String][]



String Method: test {#String:test}
----------------------------------

Searches for a match between the string and a regular expression.
For more information see [MDC Regexp:test][].

### Syntax:

	myString.test(regex[,params]);

### Arguments:

1. regex  - (*mixed*) The string or regular expression you want to match the string with.
2. params - (*string*, optional) If first parameter is a string, any parameters you want to pass to the regular expression ('g' has no effect).

### Returns:

* (*boolean*) `true`, if a match for the regular expression is found in this string.
* (*boolean*) `false` if is not found

### Examples:

	"I like cookies".test("cookie"); //returns true
	"I like cookies".test("COOKIE", "i"); //returns true (ignore case)
	"I like cookies".test("cake"); //returns false

### See Also:

- [MDC Regular Expressions][]



String Method: contains {#String:contains}
------------------------------------------

Checks to see if the string passed in is contained in this string.
If the separator parameter is passed, will check to see if the string is contained in the list of values separated by that parameter.

### Syntax:

	myString.contains(string[, separator]);

### Arguments:

1. string    - (*string*) The string to search for.
2. separator - (*string*, optional) The string that separates the values in this string (eg. Element classNames are separated by a ' ').

### Returns:

* (*boolean*) `true` if the string is contained in this string
* (*boolean*) `false` if not.

### Examples:

	'a bc'.contains('bc'); //returns true
	'a b c'.contains('c', ' '); //returns true
	'a bc'.contains('b', ' '); //returns false



String Method: trim {#String:trim}
----------------------------------

Trims the leading and trailing spaces off a string.

### Syntax:

	myString.trim();

### Returns:

* (*string*) The trimmed string.

### Examples:

	"    i like cookies     ".trim(); //"i like cookies"



String Method: clean {#String:clean}
------------------------------------

Removes all extraneous whitespace from a string and trims it ([String:trim][]).

### Syntax:

	myString.clean();

### Returns:

* (*string*) The cleaned string.

### Examples:

	" i      like     cookies      \n\n".clean(); //returns "i like cookies"



String Method: camelCase {#String:camelCase}
--------------------------------------------

Converts a hyphenated string to a camelcased string.

### Syntax:

	myString.camelCase();

### Returns:

* (*string*) The camelcased string.

### Examples:

	"I-like-cookies".camelCase(); //returns "ILikeCookies"



String Method: hyphenate {#String:hyphenate}
--------------------------------------------

Converts a camelcased string to a hyphenated string.

### Syntax:

	myString.hyphenate();

### Returns:

* (*string*) The hyphenated string.

### Examples:

	"ILikeCookies".hyphenate(); //returns "I-like-cookies"



String Method: capitalize {#String:capitalize}
----------------------------------------------

Converts the first letter of each word in a string to uppercase.

### Syntax:

	myString.capitalize();

### Returns:

* (*string*) The capitalized string.

### Examples:

	"i like cookies".capitalize(); //returns "I Like Cookies"



String Method: escapeRegExp {#String:escapeRegExp}
--------------------------------------------------

Escapes all regular expression characters from the string.

### Syntax:

	myString.escapeRegExp();

### Returns:

* (*string*) The escaped string.

### Examples:

	'animals.sheep[1]'.escapeRegExp(); //returns 'animals\.sheep\[1\]'



String Method: toInt {#String:toInt}
------------------------------------

Parses this string and returns a number of the specified radix or base.

### Syntax:

	myString.toInt([base]);

### Arguments:

1. base - (*number*, optional) The base to use (defaults to 10).

### Returns:

* (*number*) The number.
* (*NaN*) If the string is not numeric, returns NaN.

### Examples:

	"4em".toInt(); //returns 4
	"10px".toInt(); //returns 10

### See Also:

- [MDC parseInt][]



String Method: toFloat {#String:toFloat}
----------------------------------------

Parses this string and returns a floating point number.

### Syntax:

	myString.toFloat();

### Returns:

* (*number*) The float.
* (*NaN*) If the string is not numeric, returns NaN.

### Examples:

		"95.25%".toFloat(); //returns 95.25
		"10.848".toFloat(); //returns 10.848

### See Also:

- [MDC parseFloat][]



String Method: hexToRgb {#String:hexToRgb}
------------------------------------------

Converts a hexidecimal color value to RGB. Input string must be in one of the following hexidecimal color formats (with or without the hash).
'#ffffff', #fff', 'ffffff', or 'fff'

### Syntax:

	myString.hexToRgb([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (eg. \[255, 51, 0\]) instead of a string (eg. "rgb(255,51,0)").

### Returns:

* (*string*) A string representing the color in RGB.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	"#123".hexToRgb(); //returns "rgb(17,34,51)"
	"112233".hexToRgb(); //returns "rgb(17,34,51)"
	"#112233".hexToRgb(true); //returns [17, 34, 51]



String Method: rgbToHex {#String:rgbToHex}
------------------------------------------

Converts an RGB color value to hexidecimal. Input string must be in one of the following RGB color formats.
"rgb(255,255,255)", or "rgba(255,255,255,1)"

### Syntax:

	myString.rgbToHex([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (eg. \['ff','33','00'\]) instead of a string (eg. "#ff3300").

### Returns:

* (*string*) A string representing the color in hexadecimal, or transparent if the fourth value of rgba in the input string is 0.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	"rgb(17,34,51)".rgbToHex(); //returns "#112233"
	"rgb(17,34,51)".rgbToHex(true); //returns ['11','22','33']
	"rgba(17,34,51,0)".rgbToHex(); //returns "transparent"

### See Also:

- [Array:rgbToHex][]



String Method: stripScripts {#String:stripScripts}
------------------------------------------

Strips the String of its `<script>` tags and anything in between them.

### Syntax:

	myString.stripScripts([evaluate]);

### Arguments:

1. evaluate - (*boolean*, optional) If true is passed, the scripts within the String will be evaluated.

### Returns:

* (*string*) - The String without the stripped scripts.

### Examples:

	var myString = "<script>alert('Hello')</script>Hello, World.";
	myString.stripScripts(); //Returns "Hello, World."
	myString.stripScripts(true); //Alerts "Hello", then returns "Hello, World."


String Method: substitute {#String:substitute}
------------------------------------------

Substitutes keywords in a string using an object/array.
Removes undefined keywords and ignores escaped keywords.

### Syntax:

	myString.substitute(object[, regexp]);

### Arguments:

1. object - (*mixed*) The key/value pairs used to substitute a string.
1. regexp - (*regexp*, optional) The regexp pattern to be used in the string keywords, with global flag. Defaults to /\\?\{([^}]+)\}/g .

### Returns:

* (*string*) - The substituted string.

### Examples:

	var myString = "{subject} is {property_1} and {property_2}.";
	var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'savior'};
	myString.substitute(myObject); //Jack Bauer is our lord and savior



[MDC String]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:String
[MDC Regexp:test]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:RegExp:test
[MDC Regular Expressions]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Guide:Regular_Expressions
[MDC parseInt]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseInt
[MDC parseFloat]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseFloat
[MDC Array]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array
[String:trim]: #String:trim
[Array:rgbToHex]: /Native/Array/#Array:rgbToHex