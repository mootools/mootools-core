/*
Script: Window.Base.js
	Contains Window.onDomReady
	
Authors:
	- Christophe Beyls, <http://www.digitalia.be>
	- Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Window
	Cross browser methods to get the window size, onDomReady method.
*/

window.extend({
	
	/*
	Property: window.addEvent
		same as <Element.addEvent> but allows the event 'domready', which is the same as <window.onDomReady>

	Credits:
		(c) Dean Edwards/Matthias Miller/John Resig, remastered for mootools.

	Arguments:
		init - the function to execute when the DOM is ready

	Example:
		> window.addEvent('domready', function(){alert('the dom is ready')});
	*/

	addEvent: function(type, fn){
		if (type == 'domready'){
			if (this.loaded) fn();
			else if (!this.events || !this.events.domready){
				var domReady = function(){
					if (this.loaded) return;
					this.loaded = true;
					if (this.timer) this.timer = $clear(this.timer);
					Element.prototype.fireEvent.call(this, 'domready');
					this.events.domready = null;
				}.bind(this);
				if (document.readyState && this.khtml){ //safari and konqueror
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
		Element.prototype.addEvent.call(this, type, fn);
		return this;
	},

	/*
	Property: window.onDomReady
		Executes the passed in function when the DOM is ready (when the document tree has loaded, not waiting for images).
		Same as <window.addEvent> ('domready', init).

	Arguments:
		init - the function to execute when the DOM is ready

	Example:
		> window.addEvent('domready', function(){alert('the dom is ready')});
	*/

	onDomReady: function(init){
		return this.addEvent('domready', init);
	}

});