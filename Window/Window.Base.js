/*
Script: Window.Base.js
	Contains Window.onDomReady and Window.disableImageCache

License:
	MIT-style license.
*/

/*
Class: Window
	Cross browser methods to get the window size, onDomReady method.
*/

window.extend = Object.extend;

window.extend({

	/*
	Function: Window.disableImageCache
		Disables background image chache for internex explorer, to prevent flickering. 
		To be called if you have effects with background images, and they flicker.

	Example:
		Window.disableImageCache();
	*/

	disableImageCache: function(){
		if (this.ie6) try {document.execCommand("BackgroundImageCache", false, true);} catch (e){};
	},

	/*
	Function: Window.onDomReady
		Executes the passed in function when the DOM is ready (when the document tree has loaded, not waiting for images).
		Same as window.addEvent('domready', init);

	Credits:
		(c) Dean Edwards/Matthias Miller/John Resig, remastered for mootools. Later touched up by Christophe Beyls <http://digitalia.be>.

	Arguments:
		init - the function to execute when the DOM is ready

	Example:
		> window.addEvent('domready', function(){alert('the dom is ready')});
	*/

	addEvent: function(type, fn){
		Element.prototype.addEvent.call(this, type, fn);
		if (type == 'domready'){
			if (this.loaded) fn();
			else if (!this.events.ready){
				this.events.ready = Class.empty;
				var domReady = function(){
					if (arguments.callee.done) return;
					arguments.callee.done = true;
					window.loaded = true;
					if (window.timer) window.timer = $clear(window.timer);
					for (var init in window.events.domready) window.events.domready[init]();
					window.events.domready = null;
					window.events.ready = null;
				};
				if (document.readyState && this.khtml){
					this.timer = function(){
						if (['loaded','complete'].test(document.readyState)) domReady();
					}.periodical(50);
				}
				else if (document.readyState && this.ie){ //ie
					document.write("<script id=ie_ready defer src=javascript:void(0)><\/script>");
					$('ie_ready').onreadystatechange = function(){
						if (this.readyState == 'complete') domReady();
					};
				} else { //others
					this.addEvent("load", domReady);
					document.addEvent("DOMContentLoaded", domReady);
				}
			}
		}
		return this;
	},

	onDomReady: function(init){
		return this.addEvent('domready', init);
	}

});