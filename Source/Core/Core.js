/*
Script: Core.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

MooTools Copyright:
	Copyright (c) 2006-2007 Valerio Proietti, <http://mad4milk.net/>

MooTools Code & Documentation:
	The MooTools production team <http://mootools.net/developers/>.

MooTools Credits:
	- Class implementation inspired by Base.js <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
	- Some functionality inspired by that found in Prototype.js <http://prototypejs.org> (c) 2005-2007 Sam Stephenson, MIT License <http://opensource.org/licenses/mit-license.php>
*/

var MooTools = {
	'version': '1.2dev',
	'build': '%build%'
};

var Native = function(options){
	options = options || {};
	var afterImplement = options.afterImplement || function(){};
	var object = options.initialize || options.legacy;
	var generics = options.generics;
	generics = (generics === false) ? false : true;
	object.constructor = Native;
	object.$family = {name: 'native'};
	if (options.legacy && options.initialize) object.prototype = options.legacy.prototype;
	object.prototype.constructor = object;
	if (options.name){
		var family = options.name.toLowerCase();
		object.prototype.$family = {name: family};
		Native.typize(object, family);
	}

	object.implement = function(properties, force){
		for (var property in properties){
			if (!options.browser || force || !this.prototype[property]) this.prototype[property] = properties[property];
			if (generics) Native.genericize(this, property);
			afterImplement.call(this, property, properties[property]);
		}
	};

	object.alias = function(existing, property, force){
		if (!options.browser || force || !this.prototype[property]) this.prototype[property] = this.prototype[existing];
		if (generics && !this[property]) this[property] = this[existing];
		afterImplement.call(this, property, this[property]);
	};

	return object;

};

Native.implement = function(objects, properties){
	for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

Native.genericize = function(object, property){
	if (!object[property] && typeof object.prototype[property] == 'function') object[property] = function(){
		var args = Array.prototype.slice.call(arguments);
		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.typize = function(object, family){
	if (!object.type) object.type = function(item){
		return ($type(item) === family);
	};
};

(function(objects){
	for (var name in objects) Native.typize(objects[name], name.toLowerCase());
})({'Boolean': Boolean, 'Native': Native, 'Object': Object});

(function(objects){
	for (var name in objects) new Native({name: name, initialize: objects[name], browser: true});
})({'String': String, 'Function': Function, 'Number': Number, 'Array': Array, 'RegExp': RegExp, 'Date': Date});

(function(object, methods){
	for (var i = 0, l = methods.length; i < l; i++) Native.genericize(object, methods[i]);
	return arguments.callee;
})
(Array, ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice', 'toString', 'valueOf', 'indexOf', 'lastIndexOf'])
(String, ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']);

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

function $arguments(i){
	return function(){
		return arguments[i];
	};
};

function $lambda(value){
	return (typeof value == 'function') ? value : function(){
		return value;
	};
};

/*
Function: $extend
	Copies all the properties from the second object passed in to the first object passed in.

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
*/

function $extend(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
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
	for (var i = 0, l = arguments.length; i < l; i++){
		for (var key in arguments[i]){
			var ap = arguments[i][key];
			var mp = mix[key];
			if (mp && $type(ap) == 'object' && $type(mp) == 'object') mix[key] = $merge(mp, ap);
			else mix[key] = ap;
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
	if (obj.$family) return (obj.$family.name == 'number' && !isFinite(obj)) ? false : obj.$family.name;
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

/*
Native: Hash
	A Custom "Object" ({}) implementation which does not account for prototypes when setting, getting, iterating.
	Useful because in Javascript we cannot use Object.prototype. You can now use Hash.prototype!

Syntax:
	>var myHash = new Hash([object]);

Arguments:
	object - (mixed) A hash or object to implement.

Returns:
	(hash) A new Hash instance.

Example:
	[javascript]
		var myHash = new Hash({
			aProperty: true,
			aMethod: function(){
				return true;
			}
		});
		alert(myHash.has('aMethod')); //true
	[/javascript]
*/

var Hash = new Native({

	name: 'Hash',

	initialize: function(object){
		switch($type(object)){
			case 'hash': return $merge(object);
			case 'object': for (var key in object){
				if (!this.hasOwnProperty(key)) this[key] = object[key];
			}

		}
		return this;
	}

});

Hash.implement({

	/*
	Method: each
		Calls a function for each key-value pair in the object.

	Syntax:
		>myArray.forEach(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(value, key, hash)

			Arguments:
				value - (mixed) The current value in the hash.
				key   - (string) The current value's key in the hash.
				hash  - (hash) The actual hash.

	Example:
		[javascript]
			var hash = new Hash({first: "Sunday", second: "Monday", third: "Tuesday"});
			hash.each(function(value, key){
				alert("the " + key + " day of the week is " + value);
			}); //alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.
		[/javascript]
	*/

	forEach: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key)) fn.call(bind, this[key], key, this);
		}
	}

});

Hash.alias('forEach', 'each');

/*
Function: $H
	Shortcut for new Hash.

See Also:
	<Hash>
*/

function $H(object){
	return new Hash(object);
};

Array.implement({

	/*
	Method: each
		Calls a function for each element in the array.

	Syntax:
		>myArray.each(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each item in the array. This function is passed the item and its index in the array.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

		fn (continued):
			Signature:
				>fn(item, index, array)

			Arguments:
				item   - (mixed) The current item in the array.
				index  - (number) The current item's index in the array.
				array  - (array) The actual array.

	Example:
		[javascript]
			['apple', 'banana', 'lemon'].each(function(item, index){
				alert(index + " = " + item); //alerts "0 = apple" etc.
			}, bind); //optional second argument for binding, not used here
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach>

	Note:
		This method is only available for browsers without native <Array.forEach> support.
	*/

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	}

});

Array.alias('forEach', 'each');

/*
Function: $A
	Creates a copy of an Array. Useful for applying the Array prototypes to iterable objects such as a DOM Node collection or the arguments object.

Syntax:
	>var copiedArray = $A(iterable);

Arguments:
	iterable - (array) The iterable to copy.

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
		var copiedArray = $A(anArray); //returns [0, 1, 2, 3, 4]
	[/javascript]
*/

function $A(iterable){
	if ($type(iterable) == 'collection'){
		var array = [];
		for (var i = 0, l = iterable.length; i < l; i++) array[i] = iterable[i];
		return array;
	}
	return Array.prototype.slice.call(iterable);
};

/*
Function: $each
	Use to iterate through iterables that are not regular arrays, such as builtin getElementsByTagName calls, arguments of a function, or an object.

Syntax:
	>$each(iterable, fn[, bind]);

Arguments:
	iterable - (object or array) The object or array to iterate through.
	fn       - (function) The function to test for each element.
	bind     - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	fn (continued):
		Signature:
			>fn(item, index, object)

		Arguments:
			item   - (mixed) The current item in the array.
			index  - (number) The current item's index in the array. In the case of an object, it is passed the key of that item rather than the index.
			object - (mixed) The actual array/object.

Examples:
	Array Example:
	[javascript]
		$each(['Sun','Mon','Tue'], function(day, index){
			alert('name:' + day + ', index: ' + index);
		}); //alerts "name: Sun, index: 0", "name: Mon, index: 1", etc.
	[/javascript]

	Object Example:
	[javascript]
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			alert("the " + key + " day of the week is " + value);
		}); //alerts "the first day of the week is Sunday", "the second day of the week is Monday", etc.
	[/javascript]
*/

function $each(iterable, fn, bind){
	var type = $type(iterable);
	((type == 'arguments' || type == 'collection' || type == 'array') ? Array : Hash).each(iterable, fn, bind);
};
