/*
Script: JSON.js
	JSON encoder and decoder.

License:
	MIT-style license.

See Also:
	<http://www.json.org/>
*/

if (!Browser.Features.json){
	var JSON = {

		stringify: function(obj){
			switch (typeOf(obj)){
				case 'string':
					return '"' + obj.replace(/[\x00-\x1f\\"]/g, function(chr){
						var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};
						return special[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
					}) + '"';
				case 'array':
					return '[' + String(obj.map(JSON.encode).filter(nil)) + ']';
				case 'object':
					var string = [];
					for (var key in obj){
						var json = JSON.encode(obj[key]);
						if (json) string.push(JSON.encode(key) + ':' + json);
					}
					return '{' + string + '}';
				case 'number': case 'boolean': return String(obj);
				case false: return 'null';
			}
			return null;
		},

		parse: function(string, secure){
			if (typeOf(string) != 'string' || !string.length) return null;
			if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
			return eval('(' + string + ')');
		}

	};
}

JSON.encode = JSON.stringify;
JSON.decode = JSON.parse;