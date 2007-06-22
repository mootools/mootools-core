/*
Script: Window.DomReady.js
	Contains the custom event domready, for window.

License:
	MIT-style license.
*/

/* Section: Custom Events */

/*
Event: domready
	executes a function when the dom tree is loaded, without waiting for images. Only works when called from window.

Credits:
	(c) Dean Edwards/Matthias Miller/John Resig, remastered for MooTools.

Arguments:
	fn - the function to execute when the DOM is ready

Example:
	> window.addEvent('domready', function(){
	>	alert('the dom is ready');
	> });
*/

Element.Events.domready = {

	add: function(fn){
		if (Client.loaded) return fn.call(this);
		var self = this;
		var domReady = function(){
			if (!arguments.callee.done){
				arguments.callee.done = true;
				fn.call(self);
			};
			return true;
		};
		var check = function(context){
			if (['loaded', 'complete'].contains(context.readyState)) return domReady();
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
			if (!check(script)) script.addEvent('readystatechange', check);
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