/*
Script: String.js
	Contains String prototypes.

License:
	MIT-style license.
*/

/*
Native: String
	A collection of the String Object prototype methods.

See Also:
	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:String>
*/

String.implement({

	/*
	Method: test
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
		[javascript]
			"I like cookies".test("cookie"); //returns true
			"I like cookies".test("COOKIE", "i"); //returns true (ignore case)
			"I like cookies".test("cake"); //returns false
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Guide:Regular_Expressions>
	*/

	test: function(regex, params){
		return (($type(regex) == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	/*
	Method: contains
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
		[javascript]
			'a bc'.contains('bc'); //returns true
			'a b c'.contains('c', ' '); //returns true
			'a bc'.contains('b', ' '); //returns false
		[/javascript]
	*/

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	/*
	Method: trim
		Trims the leading and trailing spaces off a string.

	Syntax:
		>myString.trim();

	Returns:
		(string) The trimmed string.

	Example:
		[javascript]
			"    i like cookies     ".trim(); //"i like cookies"
		[/javascript]
	*/

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	/*
	Method: clean
		Removes all extraneous whitespace from a string and trims (<String.trim>) it.

	Syntax:
		>myString.clean();

	Returns:
		(string) The cleaned string.

	Example:
		[javascript]
			" i      like     cookies      \n\n".clean(); //returns "i like cookies"
		[/javascript]
	*/

	clean: function(){
		return this.replace(/\s{2,}/g, ' ').trim();
	},

	/*
	Method: camelCase
		Converts a hyphenated string to a camelcased string.

	Syntax:
		>myString.camelCase();

	Returns:
		(string) The camelcased string.

	Example:
		[javascript]
			"I-like-cookies".camelCase(); //returns "ILikeCookies"
		[/javascript]
	*/

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	/*
	Method: hyphenate
		Converts a camelcased string to a hyphenated string.

	Syntax:
		>myString.hyphenate();

	Returns:
		(string) The hyphenated string.

	Example:
		[javascript]
			"ILikeCookies".hyphenate(); //returns "I-like-cookies"
		[/javascript]
	*/

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	/*
	Method: capitalize
		Converts the first letter of each word in a string to uppercase.

	Syntax:
		>myString.capitalize();

	Returns:
		(string) The capitalized string.

	Example:
		[javascript]
			"i like cookies".capitalize(); //returns "I Like Cookies"
		[/javascript]
	*/

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	/*
	Method: escapeRegExp
		Escapes all regular expression characters from the string.

	Syntax:
		>myString.escapeRegExp();

	Returns:
		(string) The escaped string.

	Example:
		[javascript]
			'animals.sheep[1]'.escapeRegExp(); //returns 'animals\.sheep\[1\]'
		[/javascript]
	*/

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	/*
	Method: toInt
		Parses this string and returns a number of the specified radix or base.

	Syntax:
		>myString.toInt([base]);

	Arguments:
		base - (number, optional) The base to use (defaults to 10).

	Returns:
		(mixed) The number. If the string is not numeric, returns NaN.

	Example:
		[javascript]
			"4em".toInt(); //returns 4
			"10px".toInt(); //returns 10
		[/javascript]

	See Also:
		 <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseInt>
	*/

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	/*
	Method: toFloat
		Parses this string and returns a floating point number.

	Syntax:
		>myString.toFloat();

	Returns:
		(mixed) The float. If the string is not numeric, returns NaN.

	Example:
		[javascript]
			"95.25%".toFloat(); //returns 95.25
			"10.848".toFloat(); //returns 10.848
		[/javascript]

		See Also:
			<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:parseFloat>
	*/

	toFloat: function(){
		return parseFloat(this);
	},
	
	/*
	Method: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be in one of the following hexidecimal color formats (with or without the hash).
		>'#ffffff', #fff', 'ffffff', or 'fff'

	Syntax:
		>myString.hexToRgb([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in RGB. If the array flag is set, an array will be returned instead.

	Example:
		[javascript]
			"#123".hexToRgb(); //returns "rgb(17,34,51)"
			"112233".hexToRgb(); //returns "rgb(17,34,51)"
			"#112233".hexToRgb(true); //returns [17,34,51]
		[/javascript]

	See Also:
		 <Array.hexToRgb>
	*/

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	/*
	Method: rgbToHex
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
		[javascript]
			"rgb(17,34,51)".rgbToHex(); //returns "#112233"
			"rgb(17,34,51)".rgbToHex(true); //returns ['11','22','33']
			"rgba(17,34,51,0)".rgbToHex(); //returns "transparent"
		[/javascript]

	See Also:
		 <Array.rgbToHex>
	*/

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},
	
	evaluate: function(){
		(window.execScript) ? window.execScript(this) : window.setTimeout(this, 0);
		return this;
	},
	
	stripScripts: function(evaluate){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (evaluate && scripts) scripts.evaluate();
		return text;
	}

});