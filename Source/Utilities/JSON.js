/*
---
name: JSON
description: JSON encoder and decoder
requires: [typeOf, Array, String]
provides: JSON
...
*/

if (!this.JSON) this.JSON = {};

(function(){

var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};

var escape = function(chr){
	return special[chr] || '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
};

JSON.validate = function(string){
	string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
					replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	
	return (/^[\],:{}\s]*$/).test(string);
};

JSON.encode = JSON.stringify || function(obj){
	if (obj && obj.toJSON) obj = obj.toJSON();
	
	switch (typeOf(obj)){
		case 'string':
			return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
		case 'array':
			return '[' + obj.map(JSON.encode).clean() + ']';
		case 'object':
			var string = [];
			for (var key in obj){
				var json = JSON.encode(obj[key]);
				if (json) string.push(JSON.encode(key) + ':' + json);
			}
			return '{' + string + '}';
		case 'number': case 'boolean': return '' + obj;
		case 'null': return 'null';
	}
	
	return null;
};

JSON.decode = function(string, secure){
	if (!string || typeOf(string) != 'string') return null;
	
	if (secure || JSON.secure){
		if (JSON.parse) return JSON.parse(string);
		if (!JSON.validate(string)) throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');
	}
	
	return eval('(' + string + ')');
};

})();
