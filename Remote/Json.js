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
		Converts an object or an array to a string, to be passed in server-side scripts as a parameter.

	Arguments:
		obj - the object to convert to string

	Returns:
		A json string

	Example:
		(start code)
		Json.encode({apple: 'red', lemon: 'yellow'}); '{"apple":"red","lemon":"yellow"}'
		(end)
	*/

	encode: function(obj){
		switch($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, Json.$replaceChars) + '"';
			case 'array':
				return '[' + obj.map(Json.encode).filter($defined).join(',') + ']';
			case 'object':
				var string = [];
				for (var prop in obj){
					var val = Json.encode(obj[prop]);
					if ($defined(val)) string.push(Json.encode(prop), ':', val);
				}
				return '{' + string.join(',') + '}';
			case 'number':
				if (!isFinite(obj)) break;
			case 'boolean':
				return String(obj);
			case false:
				return 'null';
		}
		return null;
	},

	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return Json.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
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
		>var myObject = Json.decode('{"apple":"red","lemon":"yellow"}');
		>//myObject will become {apple: 'red', lemon: 'yellow'}
	*/

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

};