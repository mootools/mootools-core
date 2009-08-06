/*=
name: Request.HTML
description: Extends the Request class with additional methods to interact with HTML responses.
requires: Request
=*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		append: false,
		evalScripts: true,
		filter: false
	},

	'protected success': function(text){
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		text = (match) ? match[1] : text;
		
		var options = this.getOptions(['filter', 'update', 'append', 'evalScripts']), response = this.response;

		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});

		var temp = document.newElement('div', {html: response.html});

		response.tree = temp.childNodes;
		response.elements = temp.search('*');

		if (options.filter) response.tree = response.elements.filter(options.filter);
		if (options.update){
			var update = document.id(options.update);
			if (options.append) update.append(response.tree);
			else update.set('html', response.html);
		}
		if (options.evalScripts) Browser.exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

Element.defineSetter('load', function(options){
	this.get('load').cancel().setOptions(options);
});

Element.defineGetter('load', function(){
	if (!this.retrieve('load')) this.store('load', new Request.HTML({link: 'cancel', update: this, method: 'get'}));
	return this.retrieve('load');
});

Element.implement('load', function(url, data){
	this.get('load').setOption('url', url).send(data);
	return this;
});
