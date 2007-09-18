/*
Script: Swiff.js
	Contains <Swiff>, <Swiff.getVersion>, <Swiff.remote>

Credits:
	Flash detection 'borrowed' from SWFObject.

License:
	MIT-style license.
*/

/*
Function: Swiff
	Creates a Flash object with supplied parameters.

Syntax:
	>var mySwiff = Swiff(movie[, options]);

Arguments:
	movie   - (string) The path to the swf movie.
	options - (object) an object with options names as keys. See options below.

	options (continued):
		width      - (number: defaults to 1) The width of the flash object.
		height     - (number: defaults to 1) The height of the flash object.
		id         - (string: defaults to 'Swiff' + UID) The id of the flash object.
		inject     - (element) The target container for the SWF object.
		params     - (object) SWF object parameters (ie. wmode, bgcolor, allowScriptAccess, loop, etc.)
		properties - (object) Additional attributes for the object element.
		vars       - (object) Given to the SWF as querystring in flashVars.
		callBacks  - (object) Functions you want to pass to your Flash movie.

		params (continued):
			allowScriptAccess - (string: defaults to sameDomain) The domain that the SWF object allows access to.

Returns:
	(element) A new HTML object element.

Example:
	[javascript]
		var obj = Swiff('myMovie.swf', {
			inject: $('myElement')
			width: 500,
			height: 400,
			id: 'myBeautifulMovie'
			parameters: {
				wmode: 'opaque',
				bgcolor: '#ff3300',
			},
			vars: {
				myVariable: myJsVar,
				myVariableString: 'hello'
			}
			callBacks: {
				onLoad: myOnloadFunc
			}
		});
	[/javascript]

Note:
	The <$> function on the OBJECT element will not extend. The <$> will just target the movie by its id/reference. Therefore, its not possible to use the <Element> methods on the Element.
*/

var Swiff = function(movie, options){
	if (!Swiff.fixed) Swiff.fix();
	options = $merge({
		width: 1,
		height: 1,
		id: null,
		inject: null,
		params: {
			allowScriptAccess: 'sameDomain'
		},
		properties: {},
		callBacks: {},
		vars: {}
	}, options);

	var instance = Swiff.nextInstance();
	var properties = $merge(options.properties, {
		id: options.id || instance,
		width: options.width,
		height: options.height
	});
	var params = options.params;
	var vars = options.vars;
	Swiff.callBacks[instance] = {};
	for (var prop in options.callBacks){
		Swiff.callBacks[instance][prop] = options.callBacks[prop];
		vars[prop] = 'Swiff.callBacks.' + instance + '.' + prop;
	}
	if ($type(vars) == 'object') vars = Hash.toQueryString(vars);
	if (vars) params.FlashVars = (params.FlashVars) ? (params.FlashVars + '&' + vars) : vars;

	if (Client.Engine.ie){
		properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
		params.movie = movie;
	} else{
		properties.type = 'application/x-shockwave-flash';
		properties.data = movie;
	}

	var build = '<object ';
	for (var attr in properties) build += attr + '="' + properties[attr] + '" ';
	build += '>';
	for (var name in params) build += '<param name="' + name + '" value="' + params[name] + '" />';
	build += '</object>';
	var obj = new Element('div').setHTML(build).firstChild;
	if (options.inject) $(options.inject).appendChild(obj);
	return obj;
};

Swiff.extend({

	UID: 0,

	callBacks: {},

	nextInstance: function(){
		return 'Swiff' + (++Swiff.UID);
	},

	/*
	Function: Swiff.fix
		Fixes bugs in ie+fp9.

	Credits:
		From swfObject, <http://blog.deconcept.com/swfobject/>
	*/

	fix: function(){
		Swiff.fixed = true;
		window.addEvent('beforeunload', function(){
			__flash_unloadHandler = __flash_savedUnloadHandler = $empty;
		});
		if (!Client.Engine.ie) return;
		window.addEvent('unload', function(){
			Array.each(document.getElementsByTagName('object'), function(swf){
				swf.style.display = 'none';
				for (var p in swf){
					if (typeof swf[p] == 'function') swf[p] = $empty;
				}
			});
		});
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
			var obj = Swiff('myMovie.swf');
			alert(Swiff.remote(obj, 'myFlashFn'));
		[/javascript]

	Note:
		The SWF file should have been compiled with ExternalInterface component.
	*/

	remote: function(obj, fn){
		var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
		return eval(rs);
	}

});