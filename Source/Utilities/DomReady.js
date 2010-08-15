/*
---

name: DomReady

description: Contains the custom event domready.

license: MIT-style license.

requires: [Browser, Element, Element.Events]

provides: DomReady

...
*/

(function(window, document){

var	ready
,	checks = []
,	shouldPoll
,	timer;

function domready(){
	clearTimeout(timer);
	if (ready) return;
	Browser.loaded = ready = true;
	document.removeListener('DOMContentLoaded', domready);
	document.removeListener('readystatechange', check);
	
	document.fireEvent('domready');
	window.fireEvent('domready');
};

document.addListener('DOMContentLoaded', domready);


function check(){
	var i = checks.length;
	while (i--) if (checks[i]()){
		domready();
		return true;
	}
	return false;
}

function poll(){
	clearTimeout(timer);
	if (!check()) timer = setTimeout(poll, 10);
}


// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
var testElement = document.createElement('div');
if (testElement.doScroll && this.window == this.top){
	checks.push(function(){
		try {
			testElement.doScroll();
			return true;
		}
		catch (e){
			return false;
		}
	});
	shouldPoll = true;
}


var stateReady = { loaded:1, complete:1 };
if (document.readyState) checks.push(function(){
	return stateReady[document.readyState];
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
	onAdd: Element.Events.domready.onAdd,
	condition: function(){
		domready();
		return true;
	}
};
window.addEvent('load',function(){
	delete Element.Events.load;
});

})(window, document);
