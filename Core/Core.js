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
	'version': '1.2dev',
	'build': '%build%'
};

/* Section: Core Functions */

/*
Function: $extend
	Copies all the properties from the second object passed in to the first object passed in.
	In myWhatever.extend = $extend, the first parameter will become myWhatever, and the extend function will only need one parameter.

Syntax:
	>$extend(obj1, obj2);

Arguments:
	obj1 - The object to be extended.
	obj2 - The object whose properties will be copied to obj1.

Returns:
	The first object, extended.

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
	//firstOb is { 'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male' };
	(end)
*/

function $extend(src, add){
	if (!add){
		add = src;
		src = this;
	}
	for (var prop in add) src[prop] = add[prop];
	return src;
};

/*
Function: Native
	This will add a .extend method to the objects passed as a parameter,
	but the property passed in will be copied to the object's prototype only if not previously existent.
	The purpose of Native is also to create generics methods (Class Methods) from the prototypes passed in.
	Used in MooTools to automatically implement Array/Function/Number/String/RegExp methods to browsers that don't natively support them.

Arguments:
	Any number of Classes/native JavaScript objects.
*/

var Native = function(){
	for (var i = arguments.length; i--;){
		arguments[i].extend = function(props){
			for (var prop in props){
				if (!this.prototype[prop]) this.prototype[prop] = props[prop];
				if (!this[prop]) this[prop] = Native.generic(prop);
			}
		};
	}
};

Native.generic = function(prop){
	return function(bind){
		return this.prototype[prop].apply(bind, Array.prototype.slice.call(arguments, 1));
	};
};

Native.setFamily = function(natives){
	for (var type in natives) natives[type].prototype.$family = type;
};

Native(Array, Function, String, RegExp, Number);
Native.setFamily({'array': Array, 'function': Function, 'string': String, 'regexp': RegExp});

/* Section: Utility Functions */

/*
Function: $A()
	Useful for applying the Array prototypes to iterable objects such as a DOM Element collection or the arguments object.

Syntax:
	>var copiedArray = $A(array);

Arguments:
	array - (array) The array to copy.

Returns:
	(array) The new copied array.

Example:
	(start code)
	function myFunction(){
		$A(arguments).each(function(argument, index){
			alert(argument);
		});
	}; //will alert all the arguments passed to the function myFunction.
	(end)
*/

function $A(iterable, start, length){
	start = start || 0;
	if (start < 0) start = iterable.length + start;
	length = length || (iterable.length - start);
	var newArray = [];
	for (var i = 0; i < length; i++) newArray[i] = iterable[start++];
	return newArray;
};

/*
Function: $chk
	Checks to see if a value exists or is 0. Useful for allowing 0.

Syntax:
	>$chk(obj);

Arguments:
	obj - (mixed) The object to inspect.

Returns:
	(boolean) If the object passed in exists or is 0, returns true. Otherwise, returns false.

Example:
	(start code)
	function myFunction(arg){
		if($chk(arg)) alert('The object exists or is 0.');
		else alert('The object is either null, undefined, false, or ""');
	}
	(end)
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*
Function: $clear
	Clears a timeout or an Interval.

Syntax:
	>$clear(timer)

Arguments:
	timer - (integer) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

Returns:
	null

Example:
	(start code)
	var myTimer = myFunction.delay(5000); //Wait 5 seconds and execute myFunction.
	myTimer = $clear(myTimer); //Nevermind.
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
	Checks to see if a value is defined.

Syntax:
	>$defined(obj);

Arguments:
	obj - (mixed) The object to inspect.

Returns:
	(boolean) If the object passed is not null or undefined, returns true. Otherwise, returns false.

Example:
	(start code)
	function myFunction(arg){
		if($defined(arg)) alert('The object is defined.');
		else alert('The object is null or undefined.');
	}
	(end)
*/

function $defined(obj){
	return (obj != undefined);
};

/*
Function: $empty
	An empty function, that's it.
*/

function $empty(){};

/*
Function: $merge
	Merges any number of objects recursively without referencing them or their sub-objects.

Syntax:
	>var merged = $merge(obj1, obj2[, obj3[, ...]]);

Arguments:
	(objects) Any number of objects.

Returns:
	(object) The object that is created as a result of merging all the objects passed in.

Example:
	(start code)
	$merge(obj1, obj2, obj3); //returns the merged object (obj1, obj2, and obj3 are unaltered)
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
	Returns the first defined argument passed in, or null.

Syntax:
	>var picked = $pick(var1, var2[, var3[, ...]]);

Arguments:
	(mixed) Any number of variables.

Returns:
	(mixed) The first variable that is defined. If all variables passed in are null or undefined, returns null.

Example:
	(start code)
	function say(infoMessage, errorMessage){
		alert($pick(errorMessage, infoMessage, 'There was no message supplied.'));
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

Syntax:
	>var random = $random(min, max);

Arguments:
	min - (integer) The minimum value (inclusive).
	max - (integer) The maximum value (inclusive).

Returns:
	(integer) A random integer between min and max.

Example:
	(start code)
	alert($random(5, 20)); //alerts a random number between 5 and 20
	(end)
*/

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
Function: $splat
	Array-ifies the argument passed in if it is defined and not already an array.

Syntax:
	>var splatted = $splat(obj);

Arguments:
	obj - (mixed) Any type of variable.

Returns:
	(array) If the variable passed in is an array, returns the array. Otherwise, returns an array with the only element being the variable passed in.

Examples:
	(start code)
	var obj = 'hello';
	$splat(obj); //returns ['hello']
	var obj2 = ['a', 'b', 'c'];
	$splat(obj2); //returns ['a', 'b', 'c']
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

Syntax:
	>var time = $time();

Returns:
	(integer) - Timestamp.
*/

function $time(){
	return new Date().getTime();
};

/*
Function: $try
	Tries to execute a function. Returns false if it fails.

Syntax:
	>$try(fn, bind, args);

Arguments:
	fn   - (function) The function to execute.
	bind - (object) The object to use as 'this' in the function. For more information see <Function.bind>.
	args - (mixed) Single item or array of items as arguments to be passed to the function.

Returns:
	(mixed) Standard return of the called function, or false on failure.

Example:
	(start code)
	$try(eval, window, 'some invalid javascript'); //false
	(end)

Warning:
	If the function passed can return false, there will be no way to know if it has been successfully executed or not.
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

Syntax:
	>$type(obj);

Arguments:
	obj - (object) The object to inspect.

Returns:
	'element'    - (string) If passed object is a DOM element node.
	'textnode'   - (string) If passed object is a DOM text node.
	'whitespace' - (string) If passed object is a DOM whitespace node.
	'arguments'  - (string) If passed object is an arguments object.
	'array'      - (string) If passed object is an array.
	'object'     - (string) If passed object is an object.
	'string'     - (string) If passed object is a string.
	'number'     - (string) If passed object is a number.
	'boolean'    - (string) If passed object is a boolean.
	'function'   - (string) If passed object is a function.
	'regexp'     - (string) If passed object is a regular expression.
	'class'      - (string) If passed object is a Class (created with new Class, or the extend of another class).
	'collection' - (string) If object is a native htmlelements collection, such as childNodes, getElementsByTagName, etc.
	'window'     - (string) If object passed is the window object.
	'document'   - (string) If passed object is the document object.
	false        - (boolean) If passed object is undefined, null, NaN or none of the above.

Example:
	(start code)
	var myString = 'hello';
	$type(myString); //returns "string"
	(end)
*/

function $type(obj){
	if (obj == undefined) return false;
	if (obj.$family) return obj.$family;
	if (obj.htmlElement) return 'element';
	var type = typeof obj;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.item) return 'collection';
		if (obj.callee) return 'arguments';
	}
	if (type == 'number' && !isFinite(obj)) return false;
	return type;
};

//document, window
window.extend = document.extend = $extend;
window.$family = 'window';
document.$family = 'document';
document.head = document.getElementsByTagName('head')[0];

/*
Class: Client
	Some browser properties are attached to the Client object for browser and platform detection.

Features:
	Client.Features.xpath - (boolean) Browser supports dom queries using xpath.
	Client.Features.xhr   - (boolean) Browser supports native XMLHTTP object.

Engine:
	Client.Engine.ie        - (boolean) True if the current browser is internet explorer (any).
	Client.Engine.ie6       - (boolean) True if the current browser is internet explorer 6.
	Client.Engine.ie7       - (boolean) True if the current browser is internet explorer 7.
	Client.Engine.gecko     - (boolean) True if the current browser is Mozilla/Gecko.
	Client.Engine.webkit    - (boolean) True if the current browser is Safari/Konqueror.
	Client.Engine.webkit419 - (boolean) True if the current browser is Safari2 / webkit till version 419.
	Client.Engine.webkit420 - (boolean) True if the current browser is Safari3 (Webkit SVN Build) / webkit over version 419.
	Client.Engine.opera     - (boolean) True if the current browser is opera.
	Client.Engine.name      - (string) The name of the engine.

Platform:
	Client.Platform.mac     - (boolean) True if the platform is mac.
	Client.Platform.windows - (boolean) True if the platform is windows.
	Client.Platform.linux   - (boolean) True if the platform is linux.
	Client.Platform.other   - (boolean) True if the platform is neither mac, windows or linux.
	Client.Platform.name    - (string) The name of the platform.

Note:
	Engine detection is entirely object-based.
*/

var Client = {
	Engine: {'name': 'unknown', 'version': ''},
	Platform: {},
	Features: {}
};

//Client.Features
Client.Features.xhr = !!(window.XMLHttpRequest);
Client.Features.xpath = !!(document.evaluate);

//Client.Engine
if (window.opera) Client.Engine.name = 'opera';
else if (window.ActiveXObject) Client.Engine = {'name': 'ie', 'version': (Client.Features.xhr) ? 7 : 6};
else if (!navigator.taintEnabled) Client.Engine = {'name': 'webkit', 'version': (Client.Features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Client.Engine.name = 'gecko';
Client.Engine[Client.Engine.name] = Client.Engine[Client.Engine.name + Client.Engine.version] = true;

//Client.Platform
Client.Platform.name = navigator.platform.match(/(mac)|(win)|(linux)|(nix)/i) || ['Other'];
Client.Platform.name = Client.Platform.name[0].toLowerCase();
Client.Platform[Client.Platform.name] = true;

//htmlelement
if (typeof HTMLElement == 'undefined'){
	var HTMLElement = $empty;
	if (Client.Engine.webkit) document.createElement("iframe"); //fixes safari 2
	HTMLElement.prototype = (Client.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
}
HTMLElement.prototype.htmlElement = $empty;
HTMLElement.prototype.$family = 'element';

//enable background image cache for internet explorer 6
if (Client.Engine.ie6) $try(function(){
	document.execCommand("BackgroundImageCache", false, true);
});