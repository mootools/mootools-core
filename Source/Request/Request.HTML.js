/*
---
name: Request.HTML
description: Extends the basic Request Class with additional methods for interacting with HTML responses.
requires: Request
provides: Request.HTML
...
*/

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
			var update = DOM.$(options.update);
			if (options.append) update.append(response.tree);
			else update.set('html', response.html);
		}
		if (options.evalScripts) Browser.exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

DOM.Element.defineSetter('load', function(options){
	this.get('load').cancel().setOptions(options);
});

DOM.Element.defineGetter('load', function(){
	if (!this.retrieve('load')) this.store('load', new Request.HTML({link: 'cancel', update: this, method: 'get'}));
	return this.retrieve('load');
});

DOM.Element.implement('load', function(url, data){
	this.get('load').setOption('url', url).send(data);
	return this;
});
