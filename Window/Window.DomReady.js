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
		if (window.loaded){
			fn.call(this);
			return;
		}
		var domReady = function(){
			if (window.loaded) return;
			window.loaded = true;
			window.timer = $clear(window.timer);
			this.fireEvent('domready');
		}.bind(this);
		if (document.readyState && Client.Engine.webkit){
			window.timer = function(){
				if (['loaded', 'complete'].contains(document.readyState)) domReady();
			}.periodical(50);
		} else if (document.readyState && Client.Engine.ie){
			if (!$('ie_ready')){
				var src = (window.location.protocol == 'https:') ? '//0' : 'javascript:void(0)';
				document.write('<script id="ie_ready" defer src="' + src + '"><\/script>');
				$('ie_ready').onreadystatechange = function(){
					if (this.readyState == 'complete') domReady();
				};
			}
		} else {
			window.addEvent("load", domReady);
			document.addEvent("DOMContentLoaded", domReady);
		}
	}

};