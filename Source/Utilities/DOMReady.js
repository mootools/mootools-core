/*=
name: DomReady
description: The custom domready event. Fires as soon as the page loads (does not wait for images).
requires: Element.Event
=*/


(function(){

Event.defineModifier('domready', {add: function(fn){
	if (Browser.loaded) fn.delay(1, this);
}});

var domready = function(){
	if (Browser.loaded) return;
	Browser.loaded = true;
	[document, window].invoke('fireEvent', 'domready');
};

window.addEvent('load:flash', domready);

if (Browser.ie){
	var temp = document.newElement('div');
	(function(){
		(Function.attempt(function(){
			return temp.inject(document.body).set('html', 'temp').eject();
		})) ? domready() : arguments.callee.delay(50);
	})();
} else if (Browser.safari && Browser.version < 3.1){
	(function(){
		(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
	})();
} else {
	document.addEvent('DOMContentLoaded:flash', domready);
}

})();
