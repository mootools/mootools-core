/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

MooTools Copyright:
	Copyright (c) 2006-2007 Valerio Proietti, <http://mad4milk.net/>

MooTools Code & Documentation:
	The MooTools team <http://mootools.net/developers/>.

MooTools Credits:
	- Class implementation inspired by Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
	- Some functionality inspired by that found in Prototype.js <http://prototypejs.org> (c) 2005-2007 Sam Stephenson, MIT License <http://opensource.org/licenses/mit-license.php>
*/

var MooTools = {
	'version': '1.2dev',
	'build': '%build%'
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
	timer - (number) The identifier of the setInterval (periodical) or setTimeout (delay) to clear.

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
Function: $extend
	Copies all the properties from the second object passed in to the first object passed in.
	In myWhatever.extend = $extend, the first parameter will become myWhatever, and the extend function will only need one parameter.

Syntax:
	>$extend(original[, extended]);

Arguments:
	original - (object) The object to be extended.
	extended - (object, optional) The object whose properties will be copied to src.

Returns:
	(object) The extended object.

Examples:
	Normal Extension:
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
		//firstObj is now: { 'name': 'John', 'lastName': 'Dorian', 'age': '20', 'sex': 'male' };
	[/javascript]

	Without the Second Parameter:
	[javascript]
		var myFunction = function(){ ... };
		myFunction.extend = $extend;
		myFunction.extend(secondObj);
		//myFunction now has the properties: 'age', 'sex', and 'lastName', each with its respected values.
	[/javascript]
*/

function $extend(original, extended){
	if (!extended){
		extended = original;
		original = this;
	}
	for (var property in extended) original[property] = extended[property];
	return original;
};

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
	min - (number) The minimum value (inclusive).
	max - (number) The maximum value (inclusive).

Returns:
	(number) A random number between min and max.

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
		$splat('hello'); //returns ['hello']
		$splat(['a', 'b', 'c']); //returns ['a', 'b', 'c']
	[/javascript]
*/

function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

/*
Function: $time
	Returns the current time as a timestamp.

Syntax:
	>var time = $time();

Returns:
	(number) - Current timestamp.
*/

var $time = Date.now || function(){
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
		return fn.apply(bind, $splat(args));
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
	'element'    - (string) If object is a DOM element node.
	'textnode'   - (string) If object is a DOM text node.
	'whitespace' - (string) If object is a DOM whitespace node.
	'arguments'  - (string) If object is an arguments object.
	'array'      - (string) If object is an array.
	'object'     - (string) If object is an object.
	'string'     - (string) If object is a string.
	'number'     - (string) If object is a number.
	'boolean'    - (string) If object is a boolean.
	'function'   - (string) If object is a function.
	'regexp'     - (string) If object is a regular expression.
	'class'      - (string) If object is a Class (created with new Class, or the extend of another class).
	'collection' - (string) If object is a native htmlelements collection, such as childNodes, getElementsByTagName, etc.
	'window'     - (string) If object is the window object.
	'document'   - (string) If object is the document object.
	false        - (boolean) If object is undefined, null, NaN or none of the above.

Example:
	[javascript]
		var myString = 'hello';
		$type(myString); //returns "string"
	[/javascript]
*/

function $type(obj){
	if (obj == undefined) return false;
	if (obj.htmlElement) return 'element';
	if (obj.$family) return (obj.$family == 'number' && !isFinite(obj)) ? false : obj.$family;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		return (obj.callee) ? 'arguments' : 'collection';
	}
	return typeof obj;
};

(function(types){

	for (var i = 0, l = types.length; i < l; i++) $type[types[i]] = (function(type){
		return function(item){
			return ($type(item) === type);
		};
	})(types[i]);

})(['element', 'textnode', 'whitespace', 'collection', 'boolean', 'native', 'object']);

var Native = function(options){
	options = $extend({name: false, generics: true, browser: false, initialize: $empty, afterImplement: $empty}, options || {});
	var initialize = options.initialize;
	
	initialize.prototype.constructor = initialize;
	
	if (options.name){
		var family = options.name.toLowerCase();
		initialize.prototype.$family = family;
		if (!$type[family]) $type[family] = function(item){
			return $type(item) === family;
		};
	}
	
	initialize.$family = 'native';
	initialize.constructor = Native;
	
	initialize.implement = function(properties){
		for (var property in properties){
			if (!options.browser || !this.prototype[property]) this.prototype[property] = properties[property];
			if (options.generics && !this[property] && typeof this.prototype[property] == 'function') this[property] = Native.generic(this, property);
			options.afterImplement.call(this, property, properties[property]);
		}
		return this;
	};

	return $extend(initialize, this);
};

Native.prototype.alias = function(existing, property){
	this.prototype[property] = this.prototype[existing];
	this[property] = this[existing];
};

Native.generic = function(object, property){
	return function(){
		var args = Array.prototype.slice.call(arguments);
		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.implement = function(objects, properties){
	objects = $splat(objects);
	for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

/*
Object: Client
	Some browser properties are attached to the Client Object for browser and platform detection.

Features:
	Client.Features.xpath - (boolean) True if the browser supports dom queries using xpath.
	Client.Features.xhr   - (boolean) True if the browser supports native XMLHTTP object.

Engine:
	Client.Engine.ie        - (boolean) True if the current browser is Internet Explorer (any).
	Client.Engine.ie6       - (boolean) True if the current browser is Internet Explorer 6.
	Client.Engine.ie7       - (boolean) True if the current browser is Internet Explorer 7.
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
	Platform: {'name': (navigator.platform.match(/(mac)|(win)|(linux)|(nix)/i) || ['Other'])[0].toLowerCase()},
	Features: {'xhr': !!(window.XMLHttpRequest), 'xpath': !!(document.evaluate)}
};

if (window.opera) Client.Engine.name = 'opera';
else if (window.ActiveXObject) Client.Engine = {'name': 'ie', 'version': (Client.Features.xhr) ? 7 : 6};
else if (!navigator.taintEnabled) Client.Engine = {'name': 'webkit', 'version': (Client.Features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Client.Engine.name = 'gecko';
Client.Engine[Client.Engine.name] = Client.Engine[Client.Engine.name + Client.Engine.version] = true;

Client.Platform[Client.Platform.name] = true;

/* Native: Document */

var Document = new Native({
	
	name: 'Document',
	
	initialize: function(doc){
		if ($type(doc) == 'document') return doc;
		Document.instances.push(doc);
		doc.head = doc.getElementsByTagName('head')[0];
		doc.window = doc.defaultView || doc.parentWindow;
		
		if (Client.Engine.ie6) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		
		return $extend(doc, this);
	},
	
	afterImplement: function(key, value){
		for (var i = 0, l = Document.instances.length; i < l; i++) Document.instances[i][key] = value;
	}

});

Document.instances = [];

new Document(document);

/* Native: Window */

var Window = new Native({
	
	name: 'Window',
	
	initialize: function(win){
		if ($type(win) == 'window') return win;
		Window.instances.push(win);
		
		if (typeof win.HTMLElement == 'undefined'){
			win.HTMLElement = $empty;
			if (Client.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.HTMLElement.prototype = (Client.Engine.webkit) ? win["[[DOMElement.prototype]]"] : {};
		}
		
		win.HTMLElement.prototype.htmlElement = $empty;

		return $extend(win, this);
	},
	
	afterImplement: function(key, value){
		for (var i = 0, l = Window.instances.length; i < l; i++) Window.instances[i][key] = value;
	}
	
});

Window.instances = [];

new Window(window);

(function(){
	
	function natives(){
		for (var i = 0, l = arguments.length; i < l; i++){
			new Native({
				name: arguments[i],
				initialize: window[arguments[i]],
				browser: true
			});
		}
	};
	
	natives('String', 'Function', 'Number', 'Array', 'RegExp');
	
	function generic(object, methods){
		for (var i = 0, l = methods.length; i < l; i++){
			if (!object[methods[i]]) object[methods[i]] = Native.generic(object, methods[i]);
		}
	};
	
	generic(Array, ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'toString', 'valueOf', 'indexOf', 'lastIndexOf']);
	generic(String, ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']);

})();