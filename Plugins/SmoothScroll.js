/*
Script: SmoothScroll.js
	Contains <SmoothScroll>

License:
	MIT-style license.
*/

/*
Class: SmoothScroll
	Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.

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
		this.addEvent('onCancel', this.clearChain);
		var location = window.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor && $(anchor)) this.useLink(link, anchor);
		}, this);
	},

	useLink: function(link, anchor){
		link.addEvent('click', function(event){
			if (!window.webkit419){
				this.clearChain();
				this.chain(function(){
					window.location.hash = anchor;
				});
			}
			this.toElement(anchor);
			event.stop();
		}.bindWithEvent(this));
	}

});