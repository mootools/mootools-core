/*
---
name: DOM.Element.Form
description: Contains classes for Form elements with extra methods
requires: [DOM.Element]
provides: [DOM.Element.Form, DOM.Element.Select]
...
*/

(function(){

DOM.Element.Form = new Class({

	Extends: DOM.Element,

	Matches: 'form',

	toObject: function(){
		var object = {};
		this.search('input, select, textarea').each(function(el){
			var type = el.get('type');

			if (!el.get('name') || el.get('disabled') || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

			var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
				return opt.get('value');
			}) : ((type == 'radio' || type == 'checkbox') && !el.get('checked')) ? null : el.get('value');

			Array.from(value).each(function(val){
				if (typeof val != 'undefined') object[el.get('name')] = val;
			});
		});
		return object;
	},

	toQueryString: function(){
		var queryString = [];
		Object.each(this.toObject(), function(name, value){
			queryString.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
		});
		return queryString.join('&');
	}

});

DOM.Element.Select = new Class({

	Extends: DOM.Element,

	Matches: 'select',

	getSelected: function(){
		this.node.selectedIndex; // Safari 3.2.1
		return new DOM.Elements(Array.from(this.node.options).filter(function(option){
			return option.selected;
		}));
	}

});

})();
