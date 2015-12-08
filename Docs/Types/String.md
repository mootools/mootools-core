Type: String {#String}
====================

A collection of the String Object methods and functions.

### See Also:

- [MDN String][]



Function: String.convert {#String:String:convert}
------------------------------------

Returns the passed parameter as a String.

### Syntax:

	String.convert(arg);

### Arguments:

1. arg - (*mixed*) The argument to return as a string.

### Returns:

* (*string*) The argument as a string.

### Example:

	String.convert(2); // returns '2'
	String.convert(true); // returns 'true'



Function: String.uniqueID {#String:String-uniqueID}
---------------------------------------------------

Generates a unique ID

### Syntax:

	String.uniqueID();

### Returns:

* (*string*) A unique ID.

### Example:

	String.uniqueID();


String method: test {#String:test}
---------------------------

Searches for a match between the string and a regular expression.
For more information see [MDN Regexp:test][].

### Syntax:

	myString.test(regex[, params]);

### Arguments:

1. regex  - (*mixed*) The string or regular expression you want to match the string with.
2. params - (*string*, optional) If first parameter is a string, any parameters you want to pass to the regular expression ('g' has no effect).

### Returns:

* (*boolean*) `true`, if a match for the regular expression is found in this string.
* (*boolean*) `false` if is not found

### Examples:

	'I like cookies'.test('cookie'); // returns true
	'I like cookies'.test('COOKIE', 'i'); // returns true (ignore case)
	'I like cookies'.test('cake'); // returns false

### See Also:

- [MDN Regular Expressions][]



String method: contains {#String:contains}
-----------------------------------

Checks to see if the string passed in is contained in this string.
If the position parameter is passed, it will only check for the string from that point.

### Syntax:

	myString.contains(string[, position]);

### Arguments:

1. string    - (*string*) The string to search for.
2. position - (*number*, optional) Position in the string to begin searching for `string`, defaults to `0`.

### Returns:

* (*boolean*) `true` if the string is contained in this string
* (*boolean*) `false` if not.

### Examples:

	'a bc'.contains('bc'); // returns true
	'abc'.contains('b', 1); // returns true
	'abc'.contains('b', 2); // returns false

### See Also:

- [MDN String:indexOf][]
- [MDN String:contains][]

### Note:

Since MooTools 1.5 the second parameter changed from `separator` to `position` so it conforms the ES6 specification.
If using the 1.4 compatibility layer, this method will be overwritten to have the old behavior.

String method: trim {#String:trim}
---------------------------

Trims the leading and trailing spaces off a string.

### Syntax:

	myString.trim();

### Returns:

* (*string*) The trimmed string.

### Examples:

	'    i like cookies     '.trim(); // returns 'i like cookies'

### See Also:

- [MDN String:trim][]

String method: clean {#String:clean}
-----------------------------

Removes all extraneous whitespace from a string and trims it ([String:trim][]).

### Syntax:

	myString.clean();

### Returns:

* (*string*) The cleaned string.

### Examples:

	' i      like     cookies      \n\n'.clean(); // returns 'i like cookies'



String method: camelCase {#String:camelCase}
-------------------------------------

Converts a hyphenated string to a camelcased string.

### Syntax:

	myString.camelCase();

### Returns:

* (*string*) The camelcased string.

### Examples:

	'I-like-cookies'.camelCase(); // returns 'ILikeCookies'



String method: hyphenate {#String:hyphenate}
-------------------------------------

Converts a camelcased string to a hyphenated string.

### Syntax:

	myString.hyphenate();

### Returns:

* (*string*) The hyphenated string.

### Examples:

	'ILikeCookies'.hyphenate(); // returns '-i-like-cookies'



String method: capitalize {#String:capitalize}
---------------------------------------

Converts the first letter of each word in a string to uppercase.

### Syntax:

	myString.capitalize();

### Returns:

* (*string*) The capitalized string.

### Examples:

	'i like cookies'.capitalize(); // returns 'I Like Cookies'



String method: escapeRegExp {#String:escapeRegExp}
-------------------------------------------

Escapes all regular expression characters from the string.

### Syntax:

	myString.escapeRegExp();

### Returns:

* (*string*) The escaped string.

### Examples:

	'animals.sheep[1]'.escapeRegExp(); // returns 'animals\.sheep\[1\]'



String method: toInt {#String:toInt}
-----------------------------

Parses this string and returns a number of the specified radix or base.

### Syntax:

	myString.toInt([base]);

### Arguments:

1. base - (*number*, optional) The base to use (defaults to 10).

### Returns:

* (*number*) The number.
* (*NaN*) If the string is not numeric, returns NaN.

### Examples:

	'4em'.toInt(); // returns 4
	'10px'.toInt(); // returns 10

### See Also:

- [MDN parseInt][]



String method: toFloat {#String:toFloat}
---------------------------------

Parses this string and returns a floating point number.

### Syntax:

	myString.toFloat();

### Returns:

* (*number*) The float.
* (*NaN*) If the string is not numeric, returns NaN.

### Examples:

		'95.25%'.toFloat(); // returns 95.25
		'10.848'.toFloat(); // returns 10.848

### See Also:

- [MDN parseFloat][]



String method: hexToRgb {#String:hexToRgb}
-----------------------------------

Converts a hexadecimal color value to RGB. Input string must be in one of the following hexadecimal color formats (with or without the hash).
'#ffffff', #fff', 'ffffff', or 'fff'

### Syntax:

	myString.hexToRgb([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (e.g. \[255, 51, 0\]) instead of a string (e.g. 'rgb(255, 51, 0)').

### Returns:

* (*string*) A string representing the color in RGB.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	'#123'.hexToRgb(); // returns 'rgb(17, 34, 51)'
	'112233'.hexToRgb(); // returns 'rgb(17, 34, 51)'
	'#112233'.hexToRgb(true); // returns [17, 34, 51]



String method: rgbToHex {#String:rgbToHex}
-----------------------------------

Converts an RGB color value to hexadecimal. Input string must be in one of the following RGB color formats.
'rgb(255, 255, 255)', or 'rgba(255, 255, 255, 1)'

### Syntax:

	myString.rgbToHex([array]);

### Arguments:

1. array - (*boolean*, optional) If true is passed, will output an array (e.g. \['ff', '33', '00'\]) instead of a string (e.g. '#ff3300').

### Returns:

* (*string*) A string representing the color in hexadecimal, or transparent if the fourth value of rgba in the input string is 0.
* (*array*) If the array flag is set, an array will be returned instead.

### Examples:

	'rgb(17, 34, 51)'.rgbToHex(); // returns '#112233'
	'rgb(17, 34, 51)'.rgbToHex(true); // returns ['11', '22', '33']
	'rgba(17, 34, 51, 0)'.rgbToHex(); // returns 'transparent'

### See Also:

- [Array:rgbToHex][]



String method: substitute {#String:substitute}
---------------------------------------

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

	var myString = '{subject} is {property_1} and {property_2}.';
	var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'saviour'};
	myString.substitute(myObject); // returns Jack Bauer is our lord and saviour



String method: stripScripts {#String:stripScripts}
----------------------------------------------------

Strips the String of its `<script>` tags and anything in between them.

### Syntax:

	myString.stripScripts([evaluate]);

### Arguments:

1. evaluate - (*boolean*, optional) If true is passed, the scripts within the String will be evaluated.

### Returns:

* (*string*) - The String without the stripped scripts.

### Examples:

	var myString = "<script>alert('Hello')</script>Hello, World.";
	myString.stripScripts(); // returns 'Hello, World.'
	myString.stripScripts(true); // alerts 'Hello', then returns 'Hello, World.'



[MDN String]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String
[MDN String:contains]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/contains
[MDN String:indexOf]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/indexOf
[MDN String:trim]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/trim
[MDN Regexp:test]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/RegExp/test
[MDN Regular Expressions]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Regular_Expressions
[MDN parseInt]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Functions/parseInt
[MDN parseFloat]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Functions/parseFloat
[MDN Array]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array
[String:trim]: #String:trim
[Array:rgbToHex]: /core/Types/Array/#Array:rgbToHex
[String:trim]: #String:trim
