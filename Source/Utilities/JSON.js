/*
Script: JSON.js
	JSON encoder and decoder.

License:
	MIT-style license.
*/

/*
Class: JSON
	JSON parser and encoder.

See Also:
	<http://www.json.org/>
*/

var JSON = new Hash({

	/*
	Method: encode
		Converts an object or array to a JSON string.

	Syntax:
		>var myJSON = JSON.encode(obj);

	Arguments:
		obj - (object) The object to convert to string.

	Returns:
		(string) A JSON string.

	Example:
		[javascript]
			var fruitsJSON = JSON.encode({apple: 'red', lemon: 'yellow'}); // returns: '{"apple":"red","lemon":"yellow"}'
		[/javascript]
	*/

	encode: function(obj){
		switch ($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.$replaceChars) + '"';
			case 'array':
				return '[' + String(obj.map(JSON.encode).filter($defined)) + ']';
			case 'object': case 'hash':
				var string = [];
				Hash.each(obj, function(value, key){
					var json = JSON.encode(value);
					if (json) string.push(JSON.encode(key) + ':' + json);
				});
				return '{' + String(string) + '}';
			case 'number': case 'boolean': return String(obj);
			case false: return 'null';
		}
		return null;
	},

	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return JSON.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	/*
	Method: decode
		Converts a JSON string into an JavaScript object.

	Syntax:
		var object = JSON.decode(string[, secure]);

	Arguments:
		string - (string) The string to evaluate.
		secure - (boolean, optional: defaults to false) If set to true, checks for any hazardous syntax and returns null if any found.

	Returns:
		(object) The object represented by the JSON string.

	Example:
		[javascript]
			var myObject = JSON.decode('{"apple":"red","lemon":"yellow"}'); //returns: {apple: 'red', lemon: 'yellow'}
		[/javascript]

	Credits:
		JSON test regexp is by Douglas Crockford <http://crockford.org/>.
	*/

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

});

Native.implement([Hash, Array, String, Number], {

	toJSON: function(){
		return JSON.encode(this);
	}

});
