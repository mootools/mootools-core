/*
Script: String.js
	Contains String prototypes and Number prototypes.

Dependencies:
	<Moo.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: String
	A collection of The String Object prototype methods.
*/

String.extend({
	
	/*	
	Property: test
		Tests a string with a regular expression.
		
	Arguments:
		regex - the regular expression you want to match the string with
		params - optional, any parameters you want to pass to the regex
		
	Returns:
		an array with the instances of the value searched for or empty array.
		
	Example:
		>"I like cookies".test("cookie"); // returns ["I like cookies", "cookie"]
		>"I like cookies".test("COOKIE", "i") //ignore case
		>"I like cookies because cookies are good".test("COOKIE", "ig"); //ignore case, find all instances.
		>"I like cookies".test("cake"); //returns empty array
	*/
	
	test: function(regex, params){
		return this.match(new RegExp(regex, params));
	},
	
	/*	
	Property: toInt
		parses a string to an integer.
		
		Returns:
			either an int or "NaN" if the string is not a number.
		
		Example:
			>var value = "10px".toInt(); // value is 10
	*/
	toInt: function(){
		return parseInt(this);
	},
	
	/*	
	Property: camelCase
		Converts a hiphenated string to a camelcase string.
		
	Example:
		>"I-like-cookies".camelCase(); //"ILikeCookies"
		
	Returns:
		the camel cased string
	*/
	
	camelCase: function(){
		return this.replace(/-\D/gi, function(match){
			return match.charAt(match.length - 1).toUpperCase();
		});
	},
	
	/*	
	Property: capitalize
		Converts the first letter in each word of a string to Uppercase.
		
	Example:
		>"i like cookies".capitalize(); //"I Like Cookies"
		
	Returns:
		the capitalized string
	*/
	capitalize: function(){
		return this.toLowerCase().replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},
	
	/*	
	Property: trim
		Trims the leading and trailing spaces off a string.
		
	Example:
		>"    i like cookies     ".trim() //"i like cookies"
		
	Returns:
		the trimmed string
	*/
	
	trim: function(){
		return this.replace(/^\s*|\s*$/g, '');
	},
	
	/*	
	Property: clean
		trims (<String.trim>) a string AND removes all the double spaces in a string.
		
	Returns:
		the cleaned string
		
	Example:
		>" i      like     cookies      \n\n".clean() //"i like cookies"
	*/

	clean: function(){
		return this.replace(/\s\s/g, ' ').trim();
	},

	/*	
	Property: rgbToHex
		Converts an RGB value to hexidecimal. The string must be in the format of "rgb(255, 255, 255)" or "rgba(255, 255, 255, 1)";
		
	Arguments:
		array - boolean value, defaults to false. Use true if you want the array ['FF', '33', '00'] as output instead of #FF3300
		
	Returns:
		hex string or array. returns transparent if the fourth value of rgba in input string is 0,
		
	Example:
		>"rgb(17,34,51)".rgbToHex(); //"#112233"
		>"rgba(17,34,51,0)".rgbToHex(); //"transparent"
		>"rgb(17,34,51)".rgbToHex(true); //[11,22,33]
	*/
	
	rgbToHex: function(array){
		var rgb = this.test('([\\d]{1,3})', 'g');
		if (rgb[3] == 0) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (rgb[i]-0).toString(16);
			hex.push(bit.length == 1 ? '0'+bit : bit);
		}
		var hexText = '#'+hex.join('');
		if (array) return hex;
		else return hexText;
	},
	
	/*	
	Property: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be the hex color value (with or without the hash). Also accepts triplets ('333');
		
	Arguments:
		array - boolean value, defaults to false. Use true if you want the array ['255', '255', '255'] as output instead of "rgb(255,255,255)";
		
	Returns:
		rgb string or array.
		
	Example:
		>"#112233".hexToRgb(); //"rgb(17,34,51)"
		>"#112233".hexToRgb(true); //[17,34,51]
	*/
	
	hexToRgb: function(array){
		var hex = this.test('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$');
		var rgb = [];
		for (var i = 1; i < hex.length; i++){
			if (hex[i].length == 1) hex[i] += hex[i];
			rgb.push(parseInt(hex[i], 16));
		}
		var rgbText = 'rgb('+rgb.join(',')+')';
		if (array) return rgb;
		else return rgbText;
	}

});

/*
Class: Number
	contains the internal method toInt.
*/

Number.extend({

	/*
	Property: toInt
		Returns this number; useful because toInt must work on both Strings and Numbers.
	*/

	toInt: function(){
		return this;
	}

});