/*
Script: Core.js
	Mootools - My Object Oriented javascript.

License:
	MIT-style license.

MooTools Copyright:
	copyright (c) 2007 Valerio Proietti, <http://mad4milk.net>

MooTools Credits:
	- Class is slightly based on Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
	- Some functions are inspired by those found in prototype.js <http://prototypejs.org/> (c) 2005 Sam Stephenson (sam [at] conio [dot] net), MIT-style license
	- Documentation by Aaron Newton (aaron.newton [at] cnet [dot] com) and Valerio Proietti.
*/

var MooTools = {
	version: '1.2dev'
};

/* Section: Core Functions */

/*
Function: $extend
	Copies all the properties from the second object passed in to the first object passed in.
	If you do myWhatever.extend = $extend the first parameter will become myWhatever, and your extend function will only need one parameter.

Arguments:
	obj1 - the object to be extended
	obj2 - the object whose properties will be extended to obj1

Returns:
	the first object, extended

Example:
	(start code)
	var firstOb = {
		'name': 'John',
		'lastName': 'Doe'
	};
	var secondOb = {
		'age': '20',
		'sex': 'male',
		'lastName': 'Dorian'
	};
	$extend(firstOb, secondOb);
	//firstOb is now:
	{
		'name': 'John',
		'lastName': 'Dorian',
		'age': '20',
		'sex': 'male'
	};
	(end)
*/

var $extend = function(){
	var args = arguments;
	if (!args[1]) args = [this, args[0]];
	for (var property in args[1]) args[0][property] = args[1][property];
	return args[0];
};

/*
Function: $native
	Will add a .extend method to the objects passed as a parameter, but the property passed in will be copied to the object's prototype only if not previously existent.
	Its handy if you dont want the .extend method of an object to overwrite existing methods.
	Used automatically in MooTools to implement Array/Function/Number/String methods to browsers that dont natively support them whitout manual checking.

Arguments:
	any number of classes/native javascript objects
*/

var $native = function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		arguments[i].extend = function(props){
			for (var prop in props){
				if (!this.prototype[prop]) this.prototype[prop] = props[prop];
				if (!this[prop]) this[prop] = $native.generic(prop);
			}
		};
	}
};

$native.generic = function(prop){
	return function(bind){
		return this.prototype[prop].apply(bind, Array.prototype.slice.call(arguments, 1));
	};
};

$native(Array, Function, Number, String);

/* Section: Utility Functions */

/*
Function: $chk
	Returns true if the passed in value/object exists or is 0, otherwise returns false.
	Useful for accepting zeroes.

Arguments:
	obj - the object to inspect
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*
Function: $clear
	Clears a timeout or an Interval.

Arguments:
	timer - the setInterval or setTimeout to clear

Returns:
	null

Example:
	(start code)
	var myTimer = myFunction.delay(5000); //wait 5 seconds and execute my function.
	myTimer = $clear(myTimer); //nevermind
	(end)

See also:
	<Function.delay>, <Function.periodical>
*/

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

/*
Function: $defined
	Returns true if the passed in value/object is defined, meaning it is not null or undefined.

Arguments:
	obj - the object to inspect
*/

function $defined(obj){
	return (obj != undefined);
};

/*
Function: $merge
	Merges a number of objects recursively without referencing them or their sub-objects.

Arguments:
	any number of objects

Example:
	(start code)
	var mergedObj = $merge(obj1, obj2, obj3); //obj1, obj2, and obj3 are unaltered
	(end)
*/

function $merge(){
	var mix = {};
	for (var i = 0; i < arguments.length; i++){
		for (var property in arguments[i]){
			var ap = arguments[i][property];
			var mp = mix[property];
			if (mp && $type(ap) == 'object' && $type(mp) == 'object') mix[property] = $merge(mp, ap);
			else mix[property] = ap;
		}
	}
	return mix;
};

/*
Function: $pick
	Returns the first defined argument passed in, or the last argument if none are defined.

Arguments:
	any number of vars to pick from

Example:
	(start code)
		function say(msg){
			alert($pick(msg, 'no meessage supplied'));
		}
	(end)
*/

function $pick(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if ($defined(arguments[i])) return arguments[i];
	}
	return null;
};

/*
Function: $random
	Returns a random integer number between the two passed in values.

Arguments:
	min - integer, the minimum value (inclusive)
	max - integer, the maximum value (inclusive)

Returns:
	a random integer between min and max
*/

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
Function: $splat
	Returns the argument as an array if it is defined and not already an array. Otherwise returns null.

Arguments:
	obj - any var

Example:
	(start code)
	var obj = 'hello';
	$splat(obj); //['hello']
	var obj2 = ['a', 'b', 'c'];
	$splat(obj2); //['a', 'b', 'c']
	(end)
*/

function $splat(obj){
	var type = $type(obj);
	if (type && type != 'array') obj = [obj];
	return obj;
};

/*
Function: $time
	Returns the current time as a timestamp.

Returns:
	a timestamp integer
*/

function $time(){
	return new Date().getTime();
};

/*
Function: $try
	Tries to execute a function. Returns false if it fails.

Arguments:
	fn - the function to execute
	bind - the context of the function
	args - an array of arguments or one argument

Returns:
	whatever the function returns, or false if it fails

Example:
	(start code)
	$try(eval, window, 'some invalid javascript') //false;
	(end)

Warning:
	If the function you pass can return false, there will be no way to know if it has been executed or not.
*/

function $try(fn, bind, args){
	try {
		return fn.apply(bind || fn, $splat(args) || []);
	} catch(e){
		return false;
	}
};

/*
Function: $type
	Returns the type of object that matches the element passed in.

Arguments:
	obj - the object to inspect

Returns:
	'element' - if obj is a DOM element node
	'textnode' - if obj is a DOM text node
	'whitespace' - if obj is a DOM whitespace node
	'arguments' - if obj is an arguments object
	'array' - if obj is an array
	'object' - if obj is an object
	'string' - if obj is a string
	'number' - if obj is a number
	'boolean' - if obj is a boolean
	'function' - if obj is a function
	'regexp' - if obj is a regular expression
	'class' - if obj is a Class (created with new Class, or the extend of another class)
	'collection' - if obj is a native htmlelements collection, such as childNodes, getElementsByTagName .. etc
	false - (boolean) if the object is undefined or none of the above

Example:
	(start code)
	var myString = 'hello';
	$type(myString); //returns "string"
	(end)
*/

function $type(obj){
	if (!$defined(obj)) return false;
	if (obj.htmlElement) return 'element';
	var type = typeof obj;
	if (type == 'object' && obj.nodeName){
		switch(obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	}
	if (type == 'object' || type == 'function'){
		switch(obj.constructor){
			case Array: return 'array';
			case RegExp: return 'regexp';
			case Class: return 'class';
		}
		if (typeof obj.length == 'number'){
			if (obj.item) return 'collection';
			if (obj.callee) return 'arguments';
		}
	}
	return type;
};

/*
Function: Function.empty
	An empty function, that's it.
*/

Function.empty = function(){};

/*
Class: Abstract
	Abstract class, to be used as singleton. Will add .extend to any object.

Arguments:
	an object to be abstracted

Returns:
	the object with an .extend property, equivalent to <$extend>
*/

var Abstract = function(obj){
	obj = obj || {};
	obj.extend = $extend;
	return obj;
};

//window, document
var Window = new Abstract(window);
var Document = new Abstract(document);
document.head = document.getElementsByTagName('head')[0];

/*
Class: Client
	Some browser properties are attached to the Client object for browser detection.

Client.engine:
	Client.engine.ie - is set to true if the current browser is internet explorer (any)
	Client.engine.ie6 - is set to true if the current browser is internet explorer 6
	Client.engine.ie7 - is set to true if the current browser is internet explorer 7
	Client.engine.gecko - is set to true if the current browser is Mozilla/Gecko
	Client.engine.webkit - is set to true if the current browser is Safari/Konqueror
	Client.engine.webkit419 - is set to true if the current browser is Safari2 / webkit till version 419
	Client.engine.webkit420 - is set to true if the current browser is Safari3 (Webkit SVN Build) / webkit over version 419
	Client.engine.opera - is set to true if the current browser is opera
	Client.engine.name - is set to the name of the engine

Platform:
	Client.platform.mac - is set to true if the platform is mac
	Client.platform.windows - is set to true if the platform is windows
	Client.platform.linux - is set to true if the platform is linux
	Client.platform.other - is set to true if the platform is neither mac, windows or linux
	Client.platform.name - is set to the name of the platform

Note:
	Engine detection is entirely object-based.
*/

var Client = {'engine': {'name': 'unknown', 'version': ''}, 'platform': {}, 'features': {}};

//features
Client.features.xhr = !!(window.XMLHttpRequest);
Client.features.xpath = !!(document.evaluate);

//engine
if (window.opera) Client.engine.name = 'opera';
else if (window.ActiveXObject) Client.engine = {'name': 'ie', 'version': (Client.features.xhr) ? 7 : 6};
else if (!navigator.taintEnabled) Client.engine = {'name': 'webkit', 'version': (Client.features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Client.engine.name = 'gecko';
Client.engine[Client.engine.name] = Client.engine[Client.engine.name + Client.engine.version] = true;

//platform
Client.platform.name = navigator.platform.match(/(mac)|(win)|(linux)|(nix)/i) || ['Other'];
Client.platform.name = Client.platform.name[0].toLowerCase();
Client.platform[Client.platform.name] = true;

//htmlelement
if (typeof HTMLElement == 'undefined'){
	var HTMLElement = Function.empty;
	if (Client.engine.webkit) document.createElement("iframe"); //fixes safari
	HTMLElement.prototype = (Client.engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
}
HTMLElement.prototype.htmlElement = Function.empty;

//enable background image cache for internet explorer 6
if (Client.engine.ie6) $try(function(){
	document.execCommand("BackgroundImageCache", false, true);
});