/*
Script: Domready.js
	Contains the domready custom event.

License:
	MIT-style license.
*/

Element.Events.domready = {

	onAdd: function(fn){
		if (Browser.loaded) fn.call(this);
	}

};

(function(){
	
	var domready = function(){
		if (Browser.loaded) return;
		Browser.loaded = true;
		window.fireEvent('domready');
		document.fireEvent('domready');
	};
	
	switch (Browser.Engine.name){

		case 'webkit': (function(){
			(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
		})(); break;

		case 'trident': (function(){
			var temp = document.createElement('div');
			try {
				temp.doScroll('left');
			} catch(e){
				arguments.callee.delay(50);
				return;
			}
			domready();
		})(); break;
		
		default:
			window.addEvent('load', domready);
			document.addEvent('DOMContentLoaded', domready);

	}
	
})();