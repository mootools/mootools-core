/*
Script: Json.js
	Simple Json parser and Stringyfier, See: <http://www.json.org/>
		
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

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
		Json.toString({apple: 'red', lemon: 'yellow'}); "{"apple":"red","lemon":"yellow"}" //don't get hung up on the quotes; it's just a string.
		(end)
	*/

	toString: function(el){
		var string = [];
		
		var isArray = function(array){
			var string = [];
			array.each(function(ar){
				string.push(Json.toString(ar));
			});
			return string.join(',');
		};
		
		var isObject = function(object){
			var string = [];
			for (var property in object) string.push('"'+property+'":'+Json.toString(object[property]));
			return string.join(',');
		};
		
		switch($type(obj)){
			case 'number': string.push(obj); break;
			case 'string': string.push('"'+obj+'"'); break;
			case 'function': string.push(obj); break;
			case 'object': string.push('{'+isObject(obj)+'}'); break;
			case 'array': string.push('['+isArray(obj)+']');
		}
		
		return string.join(',');
	},
	
	/*	
	Function: evaluate
		converts a json string to an object.
		
	Arguments:
		str - the string to evaluate.
		
	Example:
		>var myObject = Json.evaluate('{"apple":"red","lemon":"yellow"}');
		>//myObject will become {apple: 'red', lemon: 'yellow'}
	*/

	evaluate: function(str){
		return eval('(' + str + ')');
	}

};