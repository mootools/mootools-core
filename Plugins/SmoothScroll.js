/*
Script: SmoothScroll.js
	Contains <SmoothScroll>

License:
	MIT-style license.
*/

/*
Class: SmoothScroll
	Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.

Arguments:
	options - the Fx.Base options (see: <Fx.Base>) plus links, a collection of elements you want your smoothscroll on. Defaults to document.links.

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
			if (!window.khtml){
				this.clearChain();
				this.chain(function(){
					window.location.href = '#' + anchor;
				});
			}
			this.toElement(anchor);
			event.stop();
		}.bindWithEvent(this));
	}

});