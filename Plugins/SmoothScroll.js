/*
Script: SmoothScroll.js
	Contains <SmoothScroll>

License:
	MIT-style license.
*/

/*
Class: SmoothScroll
	Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.
	Inherits methods, properties, options and events from <Fx.Scroll>.

Note:
	SmoothScroll requires an XHTML doctype.

Arguments:
	options - the Fx.Scroll options (see: <Fx.Scroll>) plus links, a collection of elements you want your smoothscroll on. Defaults to document.links.

Example:
	>new SmoothScroll();
*/

var SmoothScroll = Fx.Scroll.extend({

	initialize: function(options){
		this.parent(window, options);
		this.links = (this.options.links) ? $$(this.options.links) : $$(document.links);
		var location = window.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor && $(anchor)) this.useLink(link, anchor);
		}, this);
		if (!window.webkit419) this.addEvent('onComplete', function(){
			window.location.hash = this.anchor;
		});
	},

	useLink: function(link, anchor){
		link.addEvent('click', function(event){
			this.anchor = anchor;
			this.toElement(anchor);
			event.stop();
		}.bindWithEvent(this));
	}

});