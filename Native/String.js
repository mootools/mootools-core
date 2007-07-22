/*
Script: String.js
	Contains String prototypes.

License:
	MIT-style license.
*/

/*
Class: String
	A collection of the String Object prototype methods.
	For more information on the JavaScript String Object see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:String>
*/

String.extend({

	/*
	Property: test
		Searches for a match between the string and a regular expression.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:RegExp:test>.

	Syntax:
		>myString.test(regex[,params]);

	Arguments:
		regex  - (mixed) The string or regular expression you want to match the string with.
		params - (string, optional) If first parameter is a string, any parameters you want to pass to the regular expression ('g' has no effect).

	Returns:
		(boolean) If a match for the regular expression is found in this string returns true. Otherwise, returns false.

	Example:
		(start code)
		"I like cookies".test("cookie"); //returns true
		"I like cookies".test("COOKIE", "i"); //returns true (ignore case)
		"I like cookies".test("cake"); //returns false
		(end)
	*/

	test: function(regex, params){
		return (($type(regex) == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	/*
	Property: contains
		Checks to see if the string passed in is contained in this string.
		If the separator parameter is passed, will check to see if the string is contained in the list of values separated by that parameter.

	Syntax:
		>myString.contains(string[, separator]);

	Arguments:
		string    - (string) The string to search for.
		separator - (string, optional) The string that separates the values in this string (eg. Element classNames are separated by a ' ').

	Returns:
		(boolean) If the string is contained in this string, returns true. Otherwise, returns false.

	Example:
		(start code)
		'a bc'.contains('bc'); //returns true
		'a b c'.contains('c', ' '); //returns true
		'a bc'.contains('b', ' '); //returns false
		(end)
	*/

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	/*
	Property: trim
		Trims the leading and trailing spaces off a string.

	Syntax:
		>myString.trim();

	Returns:
		(string) The trimmed string.

	Example:
		(start code)
		"    i like cookies     ".trim(); //"i like cookies"
		(end)
	*/

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	/*
	Property: clean
		Removes all extraneous whitespace from a string and trims (<String.trim>) it.

	Syntax:
		>myString.clean();

	Returns:
		(string) The cleaned string.

	Example:
		(start code)
		" i      like     cookies      \n\n".clean(); //returns "i like cookies"
		(end)
	*/

	clean: function(){
		return this.replace(/\s{2,}/g, ' ').trim();
	},

	/*
	Property: camelCase
		Converts a hyphenated string to a camelcased string.

	Syntax:
		>myString.camelCase();

	Returns:
		(string) The camelcased string.

	Example:
		(start code)
		"I-like-cookies".camelCase(); //returns "ILikeCookies"
		(end)
	*/

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	/*
	Property: hyphenate
		Converts a camelcased string to a hyphenated string.

	Syntax:
		>myString.hyphenate();

	Returns:
		(string) The hyphenated string.

	Example:
		(start code)
		"ILikeCookies".hyphenate(); //returns "I-like-cookies"
		(end)
	*/

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	/*
	Property: capitalize
		Converts the first letter of each word in a string to uppercase.

	Syntax:
		>myString.capitalize();

	Returns:
		(string) The capitalized string.

	Example:
		(start code)
		"i like cookies".capitalize(); //returns "I Like Cookies"
		(end)
	*/

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	/*
	Property: escapeRegExp
		Escapes all regular expression characters from the string.

	Syntax:
		>myString.escapeRegExp();

	Returns:
		(string) The escaped string.

	Example:
		(start code)
		'animals.sheep[1]'.escapeRegExp(); //returns 'animals\.sheep\[1\]'
		(end)
	*/

	escapeRegExp: function(){
		return this.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	/*
	Property: toInt
		Parses this string and returns an integer of the specified radix or base.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseInt>.

	Syntax:
		>myString.toInt(base);

	Arguments:
		base - (integer, optional) The base to use (defaults to 10).

	Returns:
		(mixed) The integer. If the string is not numeric, returns NaN.

	Example:
		(start code)
		"4em".toInt(); //returns 4
		"10px".toInt(); //returns 10
		(end)
	*/


	toInt: function(base){
		return parseInt(this, base || 10);
	},

	/*
	Property: toFloat
		Parses this string and returns a floating point number.
		For more information see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseFloat>.

	Syntax:
		>myString.toFloat();

	Returns:
		(mixed) The float. If the string is not numeric, returns NaN.

	Example:
		(start code)
		"95.25%".toFloat(); //returns 95.25
		"10.848".toFloat(); //returns 10.848
		(end)
	*/

	toFloat: function(){
		return parseFloat(this);
	},

	/*
	Property: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be in one of the following hexidecimal color formats (with or without the hash).
		>'#ffffff', #fff', 'ffffff', or 'fff'

	Syntax:
		myString.hexToRgb([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in RGB. If the array flag is set, an array will be returned instead.

	Example:
		(start code)
		"#123".hexToRgb(); //returns "rgb(17,34,51)"
		"112233".hexToRgb(); //returns "rgb(17,34,51)"
		"#112233".hexToRgb(true); //returns [17,34,51]
		(end)

	See Also:
		 <Array.hexToRgb>
	*/

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : false;
	},

	/*
	Property: rgbToHex
		Converts an RGB color value to hexidecimal. Input string must be in one of the following RGB color formats.
		>"rgb(255,255,255)", or "rgba(255,255,255,1)"

	Syntax:
		>myString.rgbToHex([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in hexadecimal,
		or transparent if the fourth value of rgba in the input string is 0. If the array flag is set, an array will be returned instead.

	Example:
		(start code)
		"rgb(17,34,51)".rgbToHex(); //returns "#112233"
		"rgb(17,34,51)".rgbToHex(true); //returns ['11','22','33']
		"rgba(17,34,51,0)".rgbToHex(); //returns "transparent"
		(end)

	See Also:
		 <Array.rgbToHex>
	*/

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : false;
	}

});

Array.extend({

	/*
	Property: hexToRgb
		Converts a hexidecimal color value to RGB. Input array must be in one of the following hexidecimal color formats.
		>['ff', 'ff', 'ff'], or ['f', 'f', 'f']

	Syntax:
		myArray.hexToRgb([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in RGB. If the array flag is set, an array will be returned instead.

	Example:
		(start code)
		["1", "2", "3"].hexToRgb(); //returns "rgb(17,34,51)"
		["11", "22", "33"].hexToRgb(); //returns "rgb(17,34,51)"
		["11", "22", "33"].hexToRgb(true); //returns [17,34,51]
		(end)

	See Also:
		 <String.hexToRgb>
	*/

	hexToRgb: function(array){
		if (this.length != 3) return false;
		var rgb = [];
		for (var i = 0; i < 3; i++){
			rgb.push(((this[i].length == 1) ? this[i] + this[i] : this[i]).toInt(16));
		}
		return array ? rgb : 'rgb(' + rgb.join(',') + ')';
	},

	/*
	Property: rgbToHex
		Converts an RGB color value to hexidecimal. Input array must be in one of the following RGB color formats.
		>[255,255,255], or [255,255,255,1]

	Syntax:
		>myArray.rgbToHex([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in hexadecimal, or transparent if the fourth value of rgba in the input array is 0.
		If the array flag is set, an array will be returned instead.

	Example:
		(start code)
		[17,34,51].rgbToHex(); //returns "#112233"
		[17,34,51].rgbToHex(true); //returns ['11','22','33']
		[17,34,51,0].rgbToHex(); //returns "transparent"
		(end)

	See Also:
		 <String.rgbToHex>
	*/

	rgbToHex: function(array){
		if (this.length < 3) return false;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return array ? hex : '#' + hex.join('');
	}

});