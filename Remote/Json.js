/*
Script: Json.js
	Simple Json parser and Stringyfier, See: <http://www.json.org/>

License:
	MIT-style license.
*/

/*
Class: Json
	Simple Json parser and Stringyfier, See: <http://www.json.org/>
*/

var Json = {

	/*
	Property: toString
		Converts an object to a string, to be passed in server-side scripts as a parameter. Although its not normal usage for this class, this method can also be used to convert functions and arrays to strings.

	Arguments:
		obj - the object to convert to string

	Returns:
		A json string

	Example:
		(start code)
		Json.toString({apple: 'red', lemon: 'yellow'}); '{"apple":"red","lemon":"yellow"}'
		(end)
	*/

	toString: function(obj){
		switch($type(obj)){
			case 'string':
				return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
			case 'array':
				return '[' + obj.map(Json.toString).join(',') + ']';
			case 'object':
				var string = [];
				for (var property in obj) string.push(Json.toString(property) + ':' + Json.toString(obj[property]));
				return '{' + string.join(',') + '}';
			case 'number':
				if (isFinite(obj)) break;
			case false:
				return 'null';
		}
		return String(obj);
	},

	/*
	Property: evaluate
		converts a json string to an javascript Object.

	Arguments:
		str - the string to evaluate. if its not a string, it returns false.
		secure - optionally, performs syntax check on json string. Defaults to false.

	Credits:
		Json test regexp is by Douglas Crockford <http://crockford.org>.

	Example:
		>var myObject = Json.evaluate('{"apple":"red","lemon":"yellow"}');
		>//myObject will become {apple: 'red', lemon: 'yellow'}
	*/

	evaluate: function(str, secure){
		return (($type(str) != 'string') || (secure && !str.test(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/))) ? null : eval('(' + str + ')');
	}

};