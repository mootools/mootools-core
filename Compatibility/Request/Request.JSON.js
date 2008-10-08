JSON.Remote = new Class({

	options: {
		key: 'json'
	},

	Extends: Request.JSON,

	initialize: function(url, options){
		this.parent(options);
		this.onComplete = $empty;
		this.url = url;
	},

	send: function(data){
		if (!this.check(arguments.callee, data)) return this;
		return this.parent({url: this.url, data: {json: Json.encode(data)}});
	},

	failure: function(){
		this.fireEvent('failure', this.xhr);
	}

});