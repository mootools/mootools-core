Script: Swiff.js
----------------

Contains the Swiff class

### License:

MIT-style license.



Class: Swiff {#Swiff}
=====================

**Creates a Flash object with supplied parameters.**

### Credits:

- Flash detection & Explorer + flash player 9 fix 'borrowed' from SWFObject.

### Syntax:

	var mySwiff = new Swiff(path[, options]);

### Arguments:

1. **path**    - (*string*) The path to the swf movie.
2. **options** - (*object*) an object with options names as keys. See options below.

#### Options:

* **id**     - (*string*: defaults to 'Swiff_' + unique id) The id of the flash object.
* **width**  - (*number*: defaults to 1) The width of the flash object.
* **height** - (*number*: defaults to 1) The height of the flash object.
* **params** - (*object*) SWF object parameters (ie. wmode, bgcolor, allowScriptAccess, loop, etc.)
  * **allowScriptAccess** - (*string*: defaults to always) The domain that the SWF object allows access to.
  * **swLiveConnect**     - (*boolean*: defaults to true) the swLiveConnect param to allow remote scripting.
  * **quality**           - (*string*: defaults to high) the render quality of the movie.
  
* **properties** - (*object*) Additional attributes for the object element.
* **vars**       - (*object*) Given to the SWF as querystring in flashVars.
* **events**     - (*object*) Functions you need to call from the flash movie. Those will be available globally in the movie, and bound to the object.

### Returns:

* (*element*) A new HTML object element.

### Examples:

	var obj = new Swiff('myMovie.swf', {
		id: 'myBeautifulMovie'
		width: 500,
		height: 400,
		params: {
			wmode: 'opaque',
			bgcolor: '#ff3300'
		},
		vars: {
			myVariable: myJsVar,
			myVariableString: 'hello'
		},
		events: {
			onLoad: myOnloadFunc
		}
	});

### Notes:

- Swiff returns the Object tag, but its not extensible by the $ function.
- The $ function on an object/embed tag will only return its reference without further processing.



Swiff Function: remote {#Swiff:remote}
--------------------------------------

**Calls an ActionScript function from javascript.**

###	Syntax:

	var result = Swiff.remote(obj, fn);

###	Arguments:

1. **obj** - (*element*) A Swiff instance (an HTML object Element).
2. **fn**  - (*string*) The name of the function to execute in the Flash movie.

###	Returns:

* (*mixed*) The ActionScrip function's result.

###	Examples:

	var obj = new Swiff('myMovie.swf');
	alert(Swiff.remote(obj, 'myFlashFn'));

###	Notes:

- The SWF file must be compiled with ExternalInterface component.



Swiff Function: getVersion {#Swiff:getVersion}
----------------------------------------------

**Gets the major version of the flash player installed.**

###	Syntax:

	var version = Swiff.getVersion();

###	Returns:

* (*number*) A number representing the (major) flash version installed, or 0 if no player is installed.

###	Examples:

	alert(Swiff.getVersion());