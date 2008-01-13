Class: Swiff {#Swiff}
=====================

Creates and returns a Flash object using supplied parameters.

### Credits:

Flash detection and Internet Explorer/Flash Player 9 fix adapted from [SWFObject][].

### Syntax:

	var mySwiff = new Swiff(path[, options]);

### Arguments:

1. path    - (*string*) The path to the SWF file.
2. options - (*object*, optional) See Options below.

###	Options:

* id - (*string*: defaults to 'Swiff_' + unique id) The id of the Flash object.
* width - (*number*: defaults to 1) The width of the Flash object.
* height - (*number*: defaults to 1) The height of the Flash object.
* params - (*object*) Parameters to be passed to the SWF object (wmode, bgcolor, allowScriptAccess, loop, etc.).
  * allowScriptAccess - (*string*: defaults to always) The domain that the SWF object allows access to.
  * swLiveConnect - (*boolean*: defaults to true) the swLiveConnect parameter to allow remote scripting.
  * quality - (*string*: defaults to 'high') The render quality of the movie.
  
* properties - (*object*) Additional attributes for the object element.
* vars - (*object*) Vars will be passed to the SWF as querystring in flashVars.
* events - (*object*) Functions to call from the Flash movie. These will be available globally in the movie, and bound to the object.

### Returns:

* (*element*) A new HTML object Element.

### Example:

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

### Note:

1. Although Swiff returns the object tag, this element will NOT have Element methods applied to it.
2. The $ function on an object/embed tag will only return its reference without further processing.

Swiff Function: remote {#Swiff:remote}
--------------------------------------

Calls an ActionScript function from JavaScript. 

###	Syntax:

	var result = Swiff.remote(obj, fn);

###	Arguments:

1. obj - (*element*) A Swiff instance (an HTML object Element).
2. fn  - (*string*) The name of the function to execute in the Flash movie.

###	Returns:

* (*mixed*) The ActionScript function's result.

###	Example:

	var obj = new Swiff('myMovie.swf');
	//Alerts "This is from the .swf file!".
	alert(Swiff.remote(obj, 'myFlashFn'));

###	Note:

The SWF file must be compiled with the ExternalInterface component.  See the Adobe documentation on [External Interface](http://livedocs.adobe.com/flash/9.0/main/wwhelp/wwhimpl/common/html/wwhelp.htm?context=LiveDocs_Parts&file=00001652.html) for more information.


Swiff Function: getVersion {#Swiff:getVersion}
----------------------------------------------

Returns the major version of the Flash player installed.

###	Syntax:

	var version = Swiff.getVersion();

###	Returns:

* (*number*) A number representing the (major) Flash version installed, or 0 if no player is installed.

###	Example:

	alert(Swiff.getVersion());

[SWFObject]: http://blog.deconcept.com/swfobject/