/*
Script: JSON.Remote.js
	Contains <JSON.Remote>.

License:
	MIT-style license.
*/

/*
Class: JSON.Remote
	Wrapped XHR with automated sending and receiving of Javascript Objects in JSON Format.

Extends:
	<XHR>

Syntax:
	>var myJSONRemote = new JSON.Remote(url[, options]);

Arguments:
	url     - (string) The URL to send the object to.
	options - (object, optional) See below.

	options (continued):
		varName - (string: defaults to 'json') The name for the variable that holds the JSON data. Set it to null to send raw data.
		secure  - (boolean: defaults to true) If set to true, a syntax check will be done on the result JSON (see <JSON.decode>).

Events:
	onComplete - (function) Executes when the JSON returns successfully.
		Signature:
			>onComplete(responseJSON)

		Arguments:
			responseJSON - (mixed) The JSON response object from the remote request.

Returns:
	(object) A new JSON.Remote class instance.

Example:
	[javascript]
		//This code will send user information based on name/last name:
		var jsonRequest = new JSON.Remote("http://site.com/tellMeAge.php", {onComplete: function(person){
			alert(person.age); //is 25 years
			alert(person.height); //is 170 cm
			alert(person.weight); //is 120 kg
		}}).send({'name': 'John', 'lastName': 'Doe'});
	[/javascript]
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		arguments.callee.parent(options);
		this.headers.extend({'Accept': 'application/json', 'X-Request': 'JSON'});
	},

	onSuccess: function(text){
		this.response.json = JSON.decode(text, this.options.secure);
		arguments.callee.parent(this.response.json, false);
	}

});