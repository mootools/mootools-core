# Class: Swiff {#Swiff}

Creates and returns a Flash object using supplied parameters.

### Syntax:

	var mySwiff = new Swiff(path[, options]);

### Arguments:

1. path    - (*string*) The path to the SWF file.
2. options - (*object*, optional) See Options below.

### Options:

* id - (*string*: defaults to 'Swiff\_' + unique id) The id of the SWF object.
* width - (*number*: defaults to 1) The width of the SWF object.
* height - (*number*: defaults to 1) The height of the SWF object.
* container - (*element*) The container the SWF object gets injected in.
* params - (*object*) Parameters to be passed to the SWF object (wmode, bgcolor, allowScriptAccess, loop, etc.).
  * allowScriptAccess - (*string*: defaults to always) The domain that the SWF object allows access to.
  * quality - (*string*: defaults to 'high') The render quality of the movie.
  * swLiveConnect - (*boolean*: defaults to true) the swLiveConnect parameter to allow remote scripting.
  * wMode - (*string*: defaults to 'window') Changes the way the SWF is displayed in the browser.
* properties - (*object*) Additional attributes for the object element.
* vars - (*object*) Vars will be passed to the SWF as query string in flashVars.
* callBacks - (*object*) Functions to call from the SWF. These will be available globally in the movie, and bound to the object.

### Returns:

* (*element*) A new HTML object element.

### Example:

	var obj = new Swiff('myMovie.swf', {
		id: 'myBeautifulMovie',
		width: 500,
		height: 400,
		params: {
			wMode: 'opaque',
			bgcolor: '#ff3300'
		},
		vars: {
			myVariable: myJsVar,
			myVariableString: 'hello'
		},
		callBacks: {
			load: myOnloadFunc
		}
	});

### Note:

1. Although Swiff returns the object, this element will NOT have any [Element][] methods applied to it.
2. The $ function on an object/embed tag will only return its reference without further processing.

## Swiff Function: remote {#Swiff:remote}

Calls an ActionScript function from JavaScript.

### Syntax:

	var result = Swiff.remote(obj, fn[, arg, arg, arg ...]);

### Arguments:

1. obj - (*element*) A Swiff instance (a HTML object element).
2. fn  - (*string*) The function name to execute in the SWF.
3. arg - (*mixed*) Any number of arguments to pass to the named function.

### Returns:

* (*mixed*) The ActionScript function's result.

### Example:

	var obj = new Swiff('myMovie.swf');
	alert(Swiff.remote(obj, 'myFlashFn')); // alerts "This is from the .swf file!".

### Note:

The SWF file must be compiled with the ExternalInterface component.  See the Adobe documentation on [External Interface][] for more information.

### Credits:

- Flash detection and Internet Explorer/Flash Player 9 fix adapted from [SWFObject][].

[Element]: /core/Element/Element
[External Interface]: http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/flash/external/ExternalInterface.html
[SWFObject]: http://code.google.com/p/swfobject/
