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

		case 'trident':
			var temp = document.createElement('div');
			(function(){
				($try(function(){
					temp.doScroll('left');
					return $(temp).inject(document.body).set('html', 'temp').dispose();
				})) ? domready() : arguments.callee.delay(50);
			})();
		break;
		
		default:
			window.addEvent('load', domready);
			document.addEvent('DOMContentLoaded', domready);

	}
	
})();