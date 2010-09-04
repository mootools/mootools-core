/*
---

name: DomReady

description: Contains the custom event domready.

license: MIT-style license.

requires: [Browser, Element, Element.Event]

provides: DomReady

...
*/

(function(window, document){

var ready,
	checks = [],
	shouldPoll,
	timer;

var domready = function(){
	clearTimeout(timer);
	if (ready) return;
	Browser.loaded = ready = true;
	document.removeListener('DOMContentLoaded', domready).removeListener('readystatechange', check);
	
	document.triggerEvent('domready');
	window.triggerEvent('domready');
};

var check = function(){
	for (var i = checks.length; i--; ) if (checks[i]()){
		domready();
		return true;
	}
	
	return false;
};

var poll = function(){
	clearTimeout(timer);
	if (!check()) timer = setTimeout(poll, 10);
};

document.addListener('DOMContentLoaded', domready);

// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
var testElement = document.createElement('div');
if (testElement.doScroll && this.window == this.top){
	checks.push(function(){
		try {
			testElement.doScroll();
			return true;
		} catch (e){}

		return false;
	});
	shouldPoll = true;
}

if (document.readyState) checks.push(function(){
	var state = document.readyState;

	return (state == 'loaded' || state == 'complete');
});

if ('onreadystatechange' in document) document.addListener('readystatechange', check);
else shouldPoll = true;

if (shouldPoll) poll();

var onAdd = function(fn){
	if (ready) fn.call(this);
};

Element.Events.domready = {
	onAdd: onAdd
};

// Make sure that domready fires before load
Element.Events.load = {
	base: 'load',
	onAdd: onAdd,
	condition: function(){
		domready();
		return true;
	}
};

window.addEvent('load',function(){
	delete Element.Events.load;
});

})(window, document);
