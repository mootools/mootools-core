/*
---
name: Request.JSON
description: Extends the basic Request Class with additional methods for sending and receiving JSON data.
requires: [Request, JSON]
provides: Request.JSON
...
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		/*
		onError: function(){},
		*/
		secure: true
	},

	'protected initialize': function(options){
		this.parent(options);
		this.getOption('headers')['Accept'] = 'application/json';
		this.getOption('headers')['X-Request'] = 'JSON';
	},

	'protected success': function(text){
		try {
			this.response.json = JSON.decode(text, this.options.secure);
			this.onSuccess(this.response.json, text);
		} catch(error) {
			this.fire('error', [text, error]);
		}
	}

});
