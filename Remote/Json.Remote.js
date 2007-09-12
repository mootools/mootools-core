/*
Script: Json.Remote.js
	Contains <Json.Remote>.

License:
	MIT-style license.
*/

/*
Class: Json.Remote
	Wrapped XHR with automated sending and receiving of Javascript Objects in JSON Format.

Extends:
	<XHR>

Syntax:
	>var myJsonRemote = new Json.Remote(url[, options]);

Arguments:
	url     - (string) The URL to send the object to.
	options - (object, optional) See below.

	options (continued):
		varName - (string: defaults to 'json') The name for the variable that holds the Json data. Set it to null to send raw data.
		secure  - (boolean: defaults to true) If set to true, a syntax check will be done on the result JSON (see <Json.decode>).

Events:
	onComplete - (function) Executes when the Json returns successfully.
		Signature:
			>onComplete(responseJson)

		Arguments:
			responseJson - (string) The JSON response object from the remote request.

Returns:
	(class) A new Json.Remote class instance.

Example:
	[javascript]
		//This code will send user information based on name/last name:
		var jsonRequest = new Json.Remote("http://site.com/tellMeAge.php", {onComplete: function(person){
			alert(person.age); //is 25 years
			alert(person.height); //is 170 cm
			alert(person.weight); //is 120 kg
		}}).send({'name': 'John', 'lastName': 'Doe'});
	[/javascript]
*/

Json.Remote = new Class({

	Extends: XHR,

	options: {
		varName: 'json',
		secure: true
	},

	initialize: function(url, options){
		this.parent(url, options);
		this.addEvent('onSuccess', this.onComplete, true);
		this.setHeader('Accept', 'application/json');
		this.setHeader('X-Request', 'JSON');
	},

	/*
	Method: send
		Sends the JSON-encoded object to the request URL.

	Syntax:
		>myJsonRemote.send(obj);

	Arguments:
		obj - (object) The JavaScript object to be encoded and sent.

	Returns:
		(class) This Json.Remote instance.

	Example:
		[javascript]
			jsonRequest.send({'name': 'John', 'age': 25});
		[/javascript]
	*/

	send: function(obj){
		return this.parent(this.url, $defined(obj) ? ((this.options.varName) ? this.options.varName + '=' : '') + encodeURIComponent(Json.encode(obj)) : null);
	},

	onComplete: function(text){
		this.response.json = Json.decode(text, this.options.secure);
		this.fireEvent('onComplete', [this.response.json]);
	}

});
