/*
Script: Window.js
	Window methods, as those to get the size or a better onload.
		
Dependencies:
	<Moo.js>, <Function.js>, <String.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Window
	Cross browser methods to get the window size, onDomReady method.
*/

var Window = {
	
	/*	
	Property: disableImageCache
		Disables background image chache for internex explorer, to prevent flickering. 
		To be called if you have effects with background images, and they flicker.
		
	Example:
		Window.disableImageCache();
	*/
	
	disableImageCache: function(){
		if (window.ActiveXObject) document.execCommand("BackgroundImageCache", false, true);
	},

	extend: Object.extend,
	
	/*	
	Property: getWidth
		Returns an integer representing the width of the browser.
	*/

	getWidth: function(){
		return window.innerWidth || document.documentElement.clientWidth || 0;
	},
	
	/*
	Property: getHeight
		Returns an integer representing the height of the browser.
	*/

	getHeight: function(){
		return window.innerHeight || document.documentElement.clientHeight || 0;
	},

	/*
	Property: getScrollHeight
		Returns an integer representing the scrollHeight of the window.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScrollHeight: function(){
		return document.documentElement.scrollHeight;
	},

	/*
	Property: getScrollWidth
		Returns an integer representing the scrollWidth of the window.
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/

	getScrollWidth: function(){
		return document.documentElement.scrollWidth;
	},

	/*	
	Property: getScrollTop
		Returns an integer representing the scrollTop of the window (the number of pixels the window has scrolled from the top).
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	getScrollTop: function(){
		return document.documentElement.scrollTop || window.pageYOffset || 0;
	},

	/*
	Property: getScrollLeft
		Returns an integer representing the scrollLeft of the window (the number of pixels the window has scrolled from the left).
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/
	
	getScrollLeft: function(){
		return document.documentElement.scrollLeft || window.pageXOffset || 0;
	},
	
	/*
	Property: onDomReady
		Executes the passed in function when the DOM is ready (when the document tree has loaded, not waiting for images).
		
	Credits:
		(c) Dean Edwards/Matthias Miller/John Resig, remastered for mootools. Later touched up by Christophe Beyls <http://digitalia.be>.
		
	Arguments:
		init - the function to execute when the DOM is ready
		
	Example:
		> Window.onDomReady(function(){alert('the dom is ready');});
	*/
	
	onDomReady: function(init){
		var state = document.readyState;
		if (state && document.childNodes && !document.all && !navigator.taintEnabled){ //khtml
			if (state.test(/loaded|complete/)) return init();
			else return Window.onDomReady.pass(init).delay(100);
		} else if (state && window.ActiveXObject){ //ie
			var script = $('_ie_ready_');
			if (!script) document.write("<script id='_ie_ready_' defer='true' src='://'></script>");
			$('_ie_ready_').addEvent('readystatechange', function(){
				if (this.readyState == 'complete') init();
			});
			return;
		} else { //others
			var myInit = function() {
				if (arguments.callee.done) return;
				arguments.callee.done = true;
				init();
			};
			window.addEvent("load", myInit);
			document.addEvent("DOMContentLoaded", myInit);
		}
	}

};