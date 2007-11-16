/*
Script: Request.HTML.js
	Extends the basic Request Class with additional methods for interacting with HTML responses.

License:
	MIT-style license.
*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		evalScripts: true,
		filter: false
	},

	processHTML: function(text){
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		return (match) ? match[1] : text;
	},

	onSuccess: function(text){
		var opts = this.options, res = this.response;
		res.html = this.processHTML(text).stripScripts(function(script){
			res.javascript = script;
		});
		var node = new Element('div', {html: res.html});
		res.elements = node.getElements('*');
		res.tree = (opts.filter) ? res.elements.filterBy(opts.filter) : $A(node.childNodes).filter(function(el){
			return ($type(el) != 'whitespace');
		});
		if (opts.update) $(opts.update).empty().adopt(res.tree);
		if (opts.evalScripts) $exec(res.javascript);
		arguments.callee.parent([res.tree, res.elements, res.html, res.javascript], false);
	}

});

Element.Properties.load = {

	get: function(options){
		if (options || !this.retrieve('load')) this.set('load', options);
		return this.retrieve('load');
	},

	set: function(options){
		var load = this.retrieve('load');
		if (load) load.cancel();
		return this.store('load', new Request.HTML($extend({link: 'cancel', update: this, method: 'get'}, options)));
	}

};

Element.implement({
	
	load: function(){
		this.get('load').send(Array.link(arguments, {data: Object.type, url: String.type}));
		return this;
	}

});
