/*
Script: SmoothScroll.js
	Class for creating a smooth scrolling effect to all internal links on the page.

License:
	MIT-style license.

Note:
	SmoothScroll requires an XHTML doctype.
*/

var SmoothScroll = new Class({

	Extends: Fx.Scroll,

	initialize: function(options, win){
		arguments.callee.parent(win || window, options);
		this.links = (this.options.links) ? $$(this.options.links) : $$(this.element.document.links);
		var location = this.element.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor && $(anchor)) this.useLink(link, anchor);
		}, this);
		if (!Browser.Engine.webkit419) this.addEvent('onComplete', function(){
			this.element.location.hash = this.anchor;
		}, true);
	},

	useLink: function(link, anchor){
		link.addEvent('click', function(event){
			this.anchor = anchor;
			this.toElement(anchor);
			event.stop();
		}.bind(this));
	}

});
