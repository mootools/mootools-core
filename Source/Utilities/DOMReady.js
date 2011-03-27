/*
---

name: DOMReady

description: Contains the custom event domready.

license: MIT-style license.

requires: [Browser, Element, Element.Event]

provides: [DOMReady, DomReady]

...
*/

(function(window, document){

var ready,
	loaded,
	checks = [],
	shouldPoll,
	timer;

var domready = function(){
	clearTimeout(timer);
	if (ready) return;
	Browser.loaded = ready = true;
	document.removeListener('DOMContentLoaded', domready).removeListener('readystatechange', check);
	
	document.fireEvent('domready');
	window.fireEvent('domready');
};

var check = function(){
	for (var i = checks.length; i--;) if (checks[i]()){
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

/*<ltIE8>*/
var testElement = document.createElement('div'),
	hasOperationAborted = (
		testElement.innerHTML = '<!--[if lt IE 8]>1<![endif]-->',
		!!+testElement.innerText
	);

if (hasOperationAborted){
	var isFramed = true;
	// isFramed technique by Rich Dougherty http://www.richdougherty.com/
	// Accessing top or parent may take many seconds
	//   only in browsers that also experience the dreaded Operation Aborted
	//   other browsers may throw an uncatchable security error
	try {
		isFramed = window.frameElement != null;
	} catch(e){}
	
	// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
	// doScroll() throws when the DOM is not ready
	//   only in browsers that also experience the dreaded Operation Aborted
	//   only in the top window
	if (testElement.doScroll && !isFramed){
		checks.push(function(){
			try {
				testElement.doScroll();
				return true;
			} catch (e){}
			return false;
		});
		shouldPoll = true;
	}
}
/*</ltIE8>*/

if (document.readyState) checks.push(function(){
	var state = document.readyState;
	return (state == 'loaded' || state == 'complete');
});

if ('onreadystatechange' in document) document.addListener('readystatechange', check);
else shouldPoll = true;

if (shouldPoll) poll();

Element.Events.domready = {
	onAdd: function(fn){
		if (ready) fn.call(this);
	}
};

// Make sure that domready fires before load
Element.Events.load = {
	base: 'load',
	onAdd: function(fn){
		if (loaded && this == window) fn.call(this);
	},
	condition: function(){
		if (this == window){
			domready();
			delete Element.Events.load;
		}
		return true;
	}
};

// This is based on the custom load event
window.addEvent('load', function(){
	loaded = true;
});

})(window, document);
