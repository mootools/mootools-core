/*
Script: Json.Remote.js
	Contains <Json.Remote>.

License:
	MIT-style license.
*/

/*
Class: Json.Remote
	Wrapped XHR with automated sending and receiving of Javascript Objects in Json Format.
	Inherits methods, properties, options and events from <XHR>.

Arguments:
	url - the url you want to send your object to.
	options - optional, an object containing options.

Options:
	varName - string, default to 'json'; Name for the variable that holds the Json data. Set it null to send raw data.
	secure - boolean, optional, default true; secure argument for Json.decode.

Example:
	this code will send user information based on name/last name
	(start code)
	var jSonRequest = new Json.Remote("http://site.com/tellMeAge.php", {onComplete: function(person){
		alert(person.age); //is 25 years
		alert(person.height); //is 170 cm
		alert(person.weight); //is 120 kg
	}}).send({'name': 'John', 'lastName': 'Doe'});
	(end)
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

	send: function(obj){
		return this.parent(this.url, $defined(obj) ? ((this.options.varName) ? this.options.varName + '=' : '') + encodeURIComponent(Json.encode(obj)) : null);
	},

	onComplete: function(text){
		this.response.json = Json.decode(text, this.options.secure);
		this.fireEvent('onComplete', [this.response.json]);
	}

});