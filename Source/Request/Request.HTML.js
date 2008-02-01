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
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i), root;
		text = (match) ? match[1] : text;

		if (Browser.Engine.trident){
			root = new ActiveXObject('Microsoft.XMLDOM');
			root.async = false;
			root.loadXML(text);
		} else {
			root = new DOMParser().parseFromString(text, 'text/xml');
		}
		
		var children = [];
		
		for (var i = 0, k = root.childNodes.length; i < k; i++){
			var child = Element.clone(root.childNodes[i], true, true);
			if (child) children.push(child);
		}
		
		return children;
	},

	success: function(text){
		var opts = this.options, response = this.response;
		
		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});
		
		response.tree = this.processHTML(response.html);
		
		response.elements = $$();
		response.tree.each(function(element){
			response.elements.push(element);
			response.elements.extend(element.getElements('*'));
		});
		
		if (opts.filter) response.tree = response.elements.filterBy(opts.filter);
		if (opts.update) $(opts.update).empty().adopt(response.tree);
		if (opts.evalScripts) $exec(response.javascript);
		
		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
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
