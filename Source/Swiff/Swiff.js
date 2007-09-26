/*
Script: Swiff.js
	Contains <Swiff>, <Swiff.getVersion>

Credits:
	Flash detection & Explorer + flash player 9 fix 'borrowed' from SWFObject.

License:
	MIT-style license.
*/

/*
Function: Swiff
	Creates a Flash object with supplied parameters.

Syntax:
	>var mySwiff = new Swiff(path[, options]);

Arguments:
	path    - (string) The path to the swf movie.
	options - (object) an object with options names as keys. See options below.

	options (continued):
		id - (string: defaults to 'Swiff_' + UID) The id of the flash object.
		width - (number: defaults to 1) The width of the flash object.
		height - (number: defaults to 1) The height of the flash object.
		params - (object) SWF object parameters (ie. wmode, bgcolor, allowScriptAccess, loop, etc.)
		properties - (object) Additional attributes for the object element.
		vars - (object) Given to the SWF as querystring in flashVars.
		events - (object) Functions you need to call from the flash movie. Those will be available globally in the movie, and bound to the object.

		params (continued):
			allowScriptAccess - (string: defaults to always) The domain that the SWF object allows access to.
			swLiveConnect - (boolean: defaults to true) the swLiveConnect param to allow remote scripting.
			quality - (string: defaults to high) the render quality of the movie.


Returns:
	(element) A new HTML object element.

Example:
	[javascript]
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
	[/javascript]

Note:
	Swiff returns the Object tag, but its not extensible by the $ function.
	The $ function on an object/embed tag will only return its reference without further processing.
*/

var Swiff = function(path, options){
	if (!Swiff.fixed) Swiff.fix();
	var instance = 'Swiff_' + Swiff.UID++;
	options = $merge({
		id: instance,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			swLiveConnect: true
		},
		events: {},
		vars: {}
	}, options);
	var params = options.params, vars = options.vars, id = options.id;
	var properties = $extend({height: options.height, width: options.width}, options.properties);
	Swiff.Events[instance] = {};
	for (var event in options.events){
		Swiff.Events[instance][event] = function(){
			options.events[event].call($(options.id));
		};
		vars[event] = 'Swiff.Events.' + instance + '.' + event;
	}
	params.flashVars = Hash.toQueryString(vars);
	if (Client.Engine.ie){
		properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
		params.movie = path;
	} else {
		properties.type = 'application/x-shockwave-flash';
		properties.data = path;
	}
	var build = '<object id="' + options.id + '"';
	for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
	build += '>';
	for (var param in params) build += '<param name="' + param + '" value="' + params[param] + '" />';
	build += '</object>';
	return ($(options.container) || new Element('div')).setHTML(build).firstChild;
};

Element.Builders.swf = function(path, props){
	return new Swiff(path, props);
};

Swiff.extend({

	UID: 0,

	Events: {},

	/*
	Function: Swiff.remote
		Calls an ActionScript function from javascript.

	Syntax:
		>var result = Swiff.remote(obj, fn);

	Arguments:
		obj - (element) A Swiff instance (an HTML object Element).
		fn  - (string) The name of the function to execute in the Flash movie.

	Returns:
		(mixed) The ActionScrip function's result.

	Example:
		[javascript]
			var obj = new Swiff('myMovie.swf');
			alert(Swiff.remote(obj, 'myFlashFn'));
		[/javascript]

	Note:
		The SWF file must be compiled with ExternalInterface component.
	*/

	remote: function(obj, fn){
		var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 1) + '</invoke>');
		return eval(rs);
	},

	/*
	Function: Swiff.getVersion
		Gets the major version of the flash player installed.

	Syntax:
		>var version = Swiff.getVersion();

	Returns:
		(number) A number representing the (major) flash version installed, or 0 if no player is installed.

	Example:
		[javascript]
			alert(Swiff.getVersion());
		[/javascript]
	*/

	getVersion: function(){
		if (!$defined(Swiff.pluginVersion)){
			var version;
			if (navigator.plugins && navigator.mimeTypes.length){
				version = navigator.plugins["Shockwave Flash"];
				if (version && version.description) version = version.description;
			} else if (Client.Engine.ie){
				version = $try(function(){
					return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
				});
			}
			Swiff.pluginVersion = ($type(version) == 'string') ? parseInt(version.match(/\d+/)[0]) : 0;
		}
		return Swiff.pluginVersion;
	},

	fix: function(){
		Swiff.fixed = true;
		window.addEvent('beforeunload', function(){
			__flash_unloadHandler = __flash_savedUnloadHandler = $empty;
		});
		if (!Client.Engine.ie) return;
		window.addEvent('unload', function(){
			Array.each(document.getElementsByTagName('object'), function(obj){
				obj.style.display = 'none';
				for (var p in obj){
					if (typeof obj[p] == 'function') obj[p] = $empty;
				}
			});
		});
	}

});