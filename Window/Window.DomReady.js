/*
Script: Window.DomReady.js
	Contains the custom event domready, for window.

License:
	MIT-style license.
*/

/*
Event: domready.
	executes a function when the dom tree is loaded, without waiting for images. Only works when called from window. 

Credits:
	(c) Dean Edwards/Matthias Miller/John Resig, remastered for mootools.

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
		if (document.readyState && window.khtml){
			window.timer = function(){
				if (['loaded','complete'].test(document.readyState)) domReady();
			}.periodical(50);
		} else if (document.readyState && window.ie){
			if (!$('ie_ready')){
				var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
				document.write('<script id="ie_ready" defer src="' + src + '"><\/script>');
				$('ie_ready').onreadystatechange = function(){
					if (this.readyState == 'complete') domReady();
				};
			}
		} else {
			window.addListener("load", domReady);
			document.addListener("DOMContentLoaded", domReady);
		}
	}

};

/*
Function: window.onDomReady
	DEPRECATED: Executes the passed in function when the DOM is ready (when the document tree has loaded, not waiting for images).
	Same as <window.addEvent> ('domready', init).
*/

window.onDomReady = function(fn){
	return this.addEvent('domready', fn);
};