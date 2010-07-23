/*
---

name: DomReady

description: Contains the custom event domready.

license: MIT-style license.

requires: Element.Event

provides: DomReady

...
*/

(function(){

var onAdd = function(fn){
	if (Browser.loaded) fn.call(this);
};

var domready = function(){
	if (Browser.loaded) return;
	Browser.loaded = true;
	window.fireEvent('domready');
	document.fireEvent('domready');
};

Element.Events.domready = {
	onAdd: onAdd
};

var repeat;
if (Browser.ie){
	Element.Events.load = {
		base: 'load',
		onAdd: onAdd,
		condition: function(){
			domready();
			return true;
		}
	};

	var temp = document.createElement('div');
	var check = function(){
		temp.doScroll(); // Technique by Diego Perini
		return document.id(temp).inject(document.body).set('html', 'temp').dispose();
	};
	repeat = function(){
		if (Function.attempt(check)) domready();
		else repeat.delay(50);
	};
	repeat();
	return;
}

if (Browser.safari && Browser.version < 4){
	repeat = function(){
		if (['loaded', 'complete'].contains(document.readyState)) domready();
		else repeat.delay(50);
	};
	repeat();
	return;
}

document.addEvent('DOMContentLoaded', domready);

})();
