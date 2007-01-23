/*
Script: SmoothScroll.js
	Contains <SmoothScroll>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: SmoothScroll
	Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.

Arguments:
	options - the Fx.Base options (see: <Fx.Base>)

Example:
	>new SmoothScroll();
*/

var SmoothScroll = Fx.Scroll.extend({

	initialize: function(options){
		this.addEvent('onCancel', this.clearChain);
		var location = window.location.href.match(/^[^#]*/)[0] + '#';
		$each(document.links, function(lnk){
			if (lnk.href.indexOf(location) != 0) return;
			var anchor = lnk.href.substr(location.length);
			if (anchor && $(anchor)) this.useLink(lnk, anchor);
		}, this);
		this.parent(window, options);
	},

	useLink: function(lnk, anchor){
		lnk.addEvent('click', function(event){
			if(!window.khtml) this.chain(function(){
				window.location.href = '#'+anchor;
			});
			this.toElement(anchor);
			event.stop();
		}.bindWithEvent(this));
	}

});