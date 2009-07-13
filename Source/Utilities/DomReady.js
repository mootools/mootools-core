/*=
name: DomReady
description: The custom domready event. Fires as soon as the page loads (does not wait for images).
requires: Element.Event
=*/

(function(){

Event.defineModifier('domready', {add: function(fn){
	if (Browser.loaded) fn.call(this);
}});

var domready = function(){
	if (Browser.loaded) return;
	Browser.loaded = true;
	[document, window].call('fireEvent', 'domready');
};

if (Browser.Engine.trident){
	var temp = document.newElement('div');
	(function(){
		(Function.stab(function(){
			return temp.inject(document.body).set('html', 'temp').dispose();
		})) ? domready() : arguments.callee.delay(50);
	})();
} else if (Browser.Engine.webkit && Browser.Engine.version < 525){
	(function(){
		(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
	})();
} else {
	window.addEvent('load:flash', domready);
	document.addEvent('DOMContentLoaded:flash', domready);
}

})();
