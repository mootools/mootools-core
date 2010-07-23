/*
---

name: DomReady

description: Contains the custom event domready.

license: MIT-style license.

requires: Element.Event

provides: DomReady

...
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

var repeat;
if (Browser.ie){
	Element.Events.load = {
		base: 'load',
		onAdd: function(fn){
			if (Browser.loaded) fn.call(this);
		},
		condition: function(){
			domready();
			return true;
		}
	};
	var temp = document.createElement('div');
	repeat = function(){
		(Function.attempt(function(){
			temp.doScroll(); // Technique by Diego Perini
			return document.id(temp).inject(document.body).set('html', 'temp').dispose();
		})) ? domready() : repeat.delay(50);
	};
	repeat();
} else if (Browser.safari && Browser.version < 4){
	repeat = function(){
		(['loaded', 'complete'].contains(document.readyState)) ? domready() : repeat.delay(50);
	};
	repeat();
} else {
	document.addEvent('DOMContentLoaded', domready);
}

})();
