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
	options - see <XHR> options

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

Json.Remote = XHR.extend({

	initialize: function(url, options){
		this.url = url;
		this.addEvent('onSuccess', this.onComplete);
		this.parent(options);
		this.setHeader('X-Request', 'JSON');
	},

	send: function(obj){
		return this.parent(this.url, 'json=' + Json.toString(obj));
	},

	onComplete: function(){
		this.fireEvent('onComplete', [Json.evaluate(this.response.text, this.options.secure)]);
	}

});