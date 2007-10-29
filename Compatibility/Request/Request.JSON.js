JSON.Remote = new Class({

	options: {
		key: 'json'
	},

	Extends: Request.JSON,

	initialize: function(url, options){
		arguments.callee.parent(options);
		this.onComplete = $empty;
		this.url = url;
	},

	send: function(data){
		return arguments.callee.parent({url: this.url, data: {json: Json.encode(data)}});
	},

	onSuccess: function(text){
		arguments.callee.parent(text);
		this.fireEvent('onComplete', this.response.json);
	}

});