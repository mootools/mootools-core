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

	onAdd: function(fn){
		if ($type(this) == 'element') return this;
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
		if (this.document.readyState && Client.Engine.webkit){
			(function(){
				if (!check(self.document)) arguments.callee.delay(50);
			})();
		} else if (this.document.readyState && Client.Engine.trident){
			var script = $('ie_domready');
			if (!script){
				var src = (this.location.protocol == 'https:') ? '//:' : 'javascript:void(0)';
				this.document.write('<script id="ie_domready" defer src="' + src + '"><\/script>');
				script = $('ie_domready');
			}
			if (!check(script)) script.addEvent('readystatechange', check.pass(script));
		} else {
			this.addEvent('load', domReady);
			this.document.addEvent('DOMContentLoaded', domReady);
		}
		return this;
	}

};

window.addEvent('domready', function(){
	Client.loaded = true;
});