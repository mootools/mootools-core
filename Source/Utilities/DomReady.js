/*
Script: Domready.js
	Contains the domready custom event.

License:
	MIT-style license.
*/

Element.Events.domready = {

	onAdd: function(fn){
		
		if (Browser.loaded) return fn.call(this);
		
		var self = this, win = this.getWindow(), doc = this.getDocument();
		
		var domready = function(){
			if (!arguments.callee.done){
				arguments.callee.done = true;
				fn.call(self);
			};
			return true;
		};
		
		var states = (Browser.Engine.webkit) ? ['loaded', 'complete'] : 'complete';
		
		var check = function(context){
			if (states.contains(context.readyState)) return domready();
			return false;
		};
		
		if (doc.readyState && Browser.Engine.webkit){
			
			(function(){
				if (!check(doc)) arguments.callee.delay(50);
			})();
			
		} else if (doc.readyState && Browser.Engine.trident){
			
			var script = $('ie_domready');
			if (!script){
				var src = (win.location.protocol == 'https:') ? '//:' : 'javascript:void(0)';
				doc.write('<script id="ie_domready" defer src="' + src + '"></script>');
				script = $('ie_domready');
			}
			if (!check(script)) script.addEvent('readystatechange', check.pass(script));
			
		} else {
			
			win.addEvent('load', domready);
			doc.addEvent('DOMContentLoaded', domready);
			
		}
		
		return null;
	}

};

window.addEvent('domready', function(){
	Browser.loaded = true;
});