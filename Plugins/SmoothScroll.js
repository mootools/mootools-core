/*
Script: SmoothScroll.js
	Contains <SmoothScroll>

License:
	MIT-style license.

Note:
	SmoothScroll requires an XHTML doctype.
*/

/*
Class: SmoothScroll
	Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.

Extends:
	<Fx.Scroll>

Syntax:
	>var mySmoothScroll = new SmoothScroll([options]);

Arguments:
	options - (object, optional) In addition to all the <Fx.Scroll> options, SmoothScroll has links option incase you had a predefined links collection.

	options (continued):
		links - (mixed) A collection of Elements or a string <Selector> of Elements that the SmoothScroll can use.

Returns:
	(class) A new SmoothScroll instance.

Example:
	[javascript]
		var mySmoothScroll = new SmoothScroll({
			links: '.smoothAnchors',
			wheelStops: false
		});
	[/javascript]

See Also:
	<Fx.Scroll>
*/

var SmoothScroll = new Class({

	Extends: Fx.Scroll,

	initialize: function(options){
		this.parent(window, options);
		this.links = (this.options.links) ? $$(this.options.links) : $$(document.links);
		var location = window.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor && $(anchor)) this.useLink(link, anchor);
		}, this);
		if (!Client.Engine.webkit419) this.addEvent('onComplete', function(){
			window.location.hash = this.anchor;
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