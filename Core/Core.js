/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

MooTools Copyright:
	Copyright (c) 2007 Valerio Proietti, <http://mad4milk.net/>

MooTools Code & Documentation:
	The MooTools team <http://mootools.net/developers/>.

MooTools Credits:
	- Class is slightly based on Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
	- Some functions are inspired by those found in prototype.js <http://prototypejs.org/> (c) 2005 Sam Stephenson (sam [at] conio [dot] net), MIT-style license
*/

var MooTools = {
	'version': '1.2dev',
	'build': '%build%'
};

/*
Function: $extend
	Copies all the properties from the second object passed in to the first object passed in.
	In myWhatever.extend = $extend, the first parameter will become myWhatever, and the extend function will only need one parameter.

Syntax:
	>$extend(src[, add]);

Arguments:
	src - (object) The object to be extended.
	add - (object, optional) The object whose properties will be copied to src.

Returns:
	(object) The extended object.

Examples:
	Normal extension:
	[javascript]
		var firstObj = {
			'name': 'John',
			'lastName': 'Doe'
		};
		var secondObj = {
			'age': '20',
			'sex': 'male',
			'lastName': 'Dorian'
		};
		$extend(firstObj, secondObj);
		//firstObj is { 'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male' };
	[/javascript]

	Without the second parameter:
	[javascript]
		var myFunction = function(){ ... };
		myFunction.extend = $extend;
		myFunction.extend(secondObj);
		//myFunction now has the properties: 'age', 'sex', and 'lastName', each with its respected values.
	[/javascript]
*/

function $extend(src, add){
	if (!add){
		add = src;
		src = this;
	}
	for (var property in add) src[property] = add[property];
	return src;
};

/*
Function: Native
	This will add a .extend method to the objects passed as a parameter, but the property passed in will be copied to the object's prototype only if not previously existent.
	The purpose of Native is also to create generics methods (Class Methods) from the prototypes passed in. Used in MooTools to automatically implement Array/Function/Number/String/RegExp methods to browsers that don't natively support them.

Arguments:
	Any number of Classes/native JavaScript objects.
*/

var Native = function(){
	for (var i = arguments.length; i--;){
		arguments[i].extend = function(properties){
			for (var property in properties){
				if (!this.prototype[property]) this.prototype[property] = properties[property];
				if (!this[property]) this[property] = Native.generic(property);
			}
		};
	}
};

Native.generic = function(property){
	return function(bind){
		return this.prototype[property].apply(bind, Array.prototype.slice.call(arguments, 1));
	};
};

Native.setFamily = function(natives){
	for (var type in natives) natives[type].prototype.$family = type;
};

Native(Array, Function, String, RegExp, Number);
Native.setFamily({'array': Array, 'function': Function, 'string': String, 'regexp': RegExp});

/*
Function: $A
	Creates a copy of an Array, optionally from only a specific range. Useful for applying the Array prototypes to iterable objects such as a DOM Node collection or the arguments object.

Syntax:
	>var copiedArray = $A(iterable[, start[, length]]);

Arguments:
	iterable - (array) The iterable to copy.
	start    - (integer, optional) The starting index.
	length   - (integer, optional) The length of the resulting copied array. If not provided, the length of the returned array will be the length of the iterable minus the start value.

Returns:
	(array) The new copied array.

Examples:
	Apply Array to arguments:
	[javascript]
		function myFunction(){
			$A(arguments).each(function(argument, index){
				alert(argument);
			});
		}; //will alert all the arguments passed to the function myFunction.
	[/javascript]

	Copy an Array:
	[javascript]
		var anArray = [0, 1, 2, 3, 4];
		var copiedArray = $A(anArray); // Returns: [0, 1, 2, 3, 4]
		var slicedArray1 = $A(anArray, 2, 3); // Returns: [2, 3, 4]
		var slicedArray2 = $A(anArray, -1); // Returns: [4]
	[/javascript]
*/

function $A(iterable, start, length){
	start = start || 0;
	if (start < 0) start = iterable.length + start;
	length = length || (iterable.length - start);
	var array = [];
	for (var i = 0; i < length; i++) array[i] = iterable[start++];
	return array;
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
	[javascript]
		function myFunction(arg){
			if($chk(arg)) alert('The object exists or is 0.');
			else alert('The object is either null, undefined, false, or ""');
		}
	[/javascript]
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*
Function: $clear
	Clears a Timeout or an Interval.

Syntax:
	>$clear(timer);

Arguments:
	timer - (integer) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

Returns:
	null

Example:
	[javascript]
		var myTimer = myFunction.delay(5000); //Wait 5 seconds and execute myFunction.
		myTimer = $clear(myTimer); //Nevermind.
	[/javascript]

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
	[javascript]
		function myFunction(arg){
			if($defined(arg)) alert('The object is defined.');
			else alert('The object is null or undefined.');
		}
	[/javascript]
*/

function $defined(obj){
	return (obj != undefined);
};

/*
Function: $empty
	An empty function, that's it. Typically used for as a placeholder inside classes event methods.

Syntax:
	>var emptyFn = $empty;

Example:
	[javascript]
		var myFunc = $empty;
	[/javascript]
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
	[javascript]
		var obj1 = {a: 0, b: 1};
		var obj2 = {c: 2, d: 3};
		var obj3 = {a: 4, d: 5};
		var merged = $merge(obj1, obj2, obj3); //returns {a: 4, b: 1, c: 2, d: 5}, (obj1, obj2, and obj3 are unaltered)

		var nestedObj1 = {a: {b: 1, c: 1}};
		var nestedObj2 = {a: {b: 2}};
		var nested = $merge(nestedObj1, nestedObj2); //returns: {a: {b: 2, c: 1}}
	[/javascript]
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
	>var picked = $pick(var1[, var2[, var3[, ...]]]);

Arguments:
	(mixed) Any number of variables.

Returns:
	(mixed) The first variable that is defined. If all variables passed in are null or undefined, returns null.

Example:
	[javascript]
		function say(infoMessage, errorMessage){
			alert($pick(errorMessage, infoMessage, 'There was no message supplied.'));
		}
	[/javascript]
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
	[javascript]
		alert($random(5, 20)); //alerts a random number between 5 and 20
	[/javascript]
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
	[javascript]
		var obj = 'hello';
		$splat(obj); //returns ['hello']

		var obj2 = ['a', 'b', 'c'];
		$splat(obj2); //returns ['a', 'b', 'c']
	[/javascript]
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
	(integer) - Current timestamp.
*/

function $time(){
	return new Date().getTime();
};

/*
Function: $try
	Tries to execute a function. Returns false if it fails.

Syntax:
	>$try(fn[, bind[, args]]);

Arguments:
	fn   - (function) The function to execute.
	bind - (object, optional: defaults to the function passed in) The object to use as 'this' in the function. For more information see <Function.bind>.
	args - (mixed, optional) Single item or array of items as arguments to be passed to the function.

Returns:
	(mixed) Standard return of the called function, or false on failure.

Example:
	[javascript]
		var result = $try(eval, window, 'some invalid javascript'); //false
	[/javascript]

Note:
	Warning: if the function passed can return false, there will be no way to know if it has been successfully executed or not.
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
	[javascript]
		var myString = 'hello';
		$type(myString); //returns "string"
	[/javascript]
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
	Engine detection is entirely feature-based.
*/

var Client = {
	Engine: {'name': 'unknown', 'version': ''},
	Features: {},
	Platform: {}
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

//HTMLElement
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