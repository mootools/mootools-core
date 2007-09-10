/*
Script: Window.DomReady.js
	Contains the custom event domready, for window.

License:
	MIT-style license.
*/

/*
Event: domready
	Executes a function when the dom tree is loaded, without waiting for images. Only works when called from window.

Arguments:
	fn - (function) The function to execute when the DOM is ready.

Example:
	[javascript]
		window.addEvent('domready', function(){
			alert('the dom is ready');
		});
	[/javascript]

Credits:
	(c) Dean Edwards/Matthias Miller/John Resig, remastered for MooTools.
*/

Element.Events.domready = {

	add: function(fn){
		if (Client.loaded){
			fn.call(this);
			return this;
		}
		var self = this;
		var domReady = function(){
			if (!arguments.callee.done){
				arguments.callee.done = true;
				fn.call(self);
			};
			return true;
		};
		var check = function(context){
			if ((Client.Engine.webkit ? ['loaded', 'complete'] : 'complete').contains(context.readyState)) return domReady();
			return false;
		};
		if (document.readyState && Client.Engine.webkit){
			(function(){
				if (!check(document)) arguments.callee.delay(50);
			})();
		} else if (document.readyState && Client.Engine.ie){
			var script = $('ie_domready');
			if (!script){
				var src = (window.location.protocol == 'https:') ? '//:' : 'javascript:void(0)';
				document.write('<script id="ie_domready" defer src="' + src + '"><\/script>');
				script = $('ie_domready');
			}
			if (!check(script)) script.addEvent('readystatechange', check.pass(script));
		} else {
			window.addEvent('load', domReady);
			document.addEvent('DOMContentLoaded', domReady);
		}
		return this;
	}

};

window.addEvent('domready', function(){
	Client.loaded = true;
});