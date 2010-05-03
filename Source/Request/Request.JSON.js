/*
---

name: Request.JSON

description: Extends the basic Request Class with additional methods for sending and receiving JSON data.

license: MIT-style license.

requires: [Request, JSON]

provides: Request.JSON

...
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		this.headers.extend({'Accept': 'application/json', 'X-Request': 'JSON'});
	},

	success: function(text){
		var json = this.response.json = Function.attempt(function(){
			return JSON.decode(text, this.options.secure);
		});
		if (json == null) this.onFailure();
		else this.onSuccess(json, text);
	}

});
