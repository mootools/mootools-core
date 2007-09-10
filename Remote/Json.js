/*
Script: Json.js
	Simple JSON encoder and decoder.

License:
	MIT-style license.
*/

/*
Class: Json
	Simple Json parser and encoder.

See Also:
	<http://www.json.org/>
*/

var Json = {

	/*
	Method: encode
		Converts an object or array to a JSON string.

	Syntax:
		>var myJson = Json.encode(obj);

	Arguments:
		obj - (object) The object to convert to string.

	Returns:
		(string) A JSON string.

	Example:
		[javascript]
			var fruitsJSON = Json.encode({apple: 'red', lemon: 'yellow'}); // returns: '{"apple":"red","lemon":"yellow"}'
		[/javascript]
	*/

	encode: function(obj){
		switch ($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, Json.$replaceChars) + '"';
			case 'array':
				return '[' + obj.map(Json.encode).filter($defined).join(',') + ']';
			case 'object':
				var string = [];
				for (var prop in obj){
					var val = Json.encode(obj[prop]);
					if ($defined(val)) string.push(Json.encode(prop) + ':' + val);
				}
				return '{' + string.join(',') + '}';
			case 'number':
			case 'boolean': return String(obj);
			case false: return 'null';
		}
		return null;
	},

	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return Json.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	/*
	Method: decode
		Converts a JSON string into an JavaScript object.

	Syntax:
		var object = Json.decode(string[, secure]);

	Arguments:
		string - (string) The string to evaluate.
		secure - (boolean, optional: defaults to false) If set to true, checks for any hazardous syntax and returns null if any found.

	Returns:
		(object) The object represented by the JSON string.

	Example:
		[javascript]
			var myObject = Json.decode('{"apple":"red","lemon":"yellow"}'); //returns: {apple: 'red', lemon: 'yellow'}
		[/javascript]

	Credits:
		JSON test regexp is by Douglas Crockford <http://crockford.org/>.
	*/

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

};
