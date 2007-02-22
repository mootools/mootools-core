/*
Script: Utility.js
	Contains Utility functions

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

//window, document

window.extend = document.extend = $extend;
var Window = window;

/*
Function: $chk
	Returns true if the passed in value/object exists or is 0, otherwise returns false.
	Useful to accept zeroes.
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*
Function: $pick
	Returns the first object if defined, otherwise returns the second.
*/

function $pick(obj, picked){
	return (obj !== null && obj !== undefined) ? obj : picked;
};

/*
Function: $random
	Returns a random integer number between the two passed in values.

Arguments:
	min - integer, the minimum value (inclusive).
	max - integer, the maximum value (inclusive).

Returns:
	a random integer between min and max.
*/

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
Function: $time
	Returns the current timestamp

Returns:
	a timestamp integer.
*/

function $time(){
	return new Date().getTime();
};

/*
Function: $duration
	Returns a time interval in seconds from the given time units

Arguments:
	data - Object with values for years, months, days, hours, seconds, milliseconds. For non-objects it returns the parsed argument as integer.
	ms - Boolean, if true return ms, otherwise seconds

Returns:
	an integer for the duration in seconds or ms if second parameter is true.
*/

function $duration(data, ms){
	if ($type(data) != 'object') return parseInt(data);
	this.units = this.units || {years: 31556926, months: 2629743.83, days: 86400, hours: 3600, minutes: 60, seconds: 1, milliseconds: 0.001};
	var sum = 0;
	for (var unit in data) sum += $pick(data[unit], 0) * this.units[unit];
	return parseInt(sum * (ms ? 1000 : 1));
}

/*
Function: $clear
	clears a timeout or an Interval.

Returns:
	null

Arguments:
	timer - the setInterval or setTimeout to clear.

Example:
	>var myTimer = myFunction.delay(5000); //wait 5 seconds and execute my function.
	>myTimer = $clear(myTimer); //nevermind

See also:
	<Function.delay>, <Function.periodical>
*/

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

/*
Class: window
	Some properties are attached to the window object by the browser detection.

Properties:
	window.ie - will be set to true if the current browser is internet explorer (any).
	window.ie6 - will be set to true if the current browser is internet explorer 6.
	window.ie7 - will be set to true if the current browser is internet explorer 7.
	window.khtml - will be set to true if the current browser is Safari/Konqueror.
	window.gecko - will be set to true if the current browser is Mozilla/Gecko.
*/

if (window.ActiveXObject) window.ie = window[window.XMLHttpRequest ? 'ie7' : 'ie6'] = true;
else if (document.childNodes && !document.all && !navigator.taintEnabled) window.khtml = true;
else if (document.getBoxObjectFor != null) window.gecko = true;

//htmlelement

if (typeof HTMLElement == 'undefined'){
	var HTMLElement = Class.empty;
	if (window.khtml) document.createElement("iframe"); //fixes safari
	HTMLElement.prototype = (window.khtml) ? window["[[DOMElement.prototype]]"] : {};
}
HTMLElement.prototype.htmlElement = true;

//enables background image cache for internet explorer 6

if (window.ie6) try {document.execCommand("BackgroundImageCache", false, true);} catch(e){};