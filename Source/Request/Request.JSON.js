/*=
name: Request.JSON
description: Extends the Request class with additional methods to interact with JSON responses.
requires: 
  - Request
  - JSON
=*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		this.getOption('headers')['Accept'] = 'application/json';
		this.getOption('headers')['X-Request'] = 'JSON';
	}.protect(),

	success: function(text){
		this.response.json = JSON.decode(text, this.getOption('secure'));
		this.onSuccess(this.response.json, text);
	}.protect()

});
