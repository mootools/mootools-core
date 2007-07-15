/*
Script: Swiff.Base.js
	Contains <Swiff>, <Swiff.getVersion>, <Swiff.remote>

Credits:
	Flash detection 'borrowed' from SWFObject.

License:
	MIT-style license.
*/

/*
Function: Swiff
	creates a flash object with supplied parameters.

Arguments:
	moview - string; The path to the swf movie.
	options - an object with options names as keys. See options below.

Options:
	width - (number) the width of the flash object. defaults to 1.
	height - number) the height of the flash object. defaults to 1.
	id - (string) the id of the flash object. defaults to 'SwiffX' (X is the Swiff UID).
	inject - (element) the target container for the swf object
	params - (object) object params (wmode, bgcolor, allowScriptAccess, loop, etc.), default: allowScriptAccess to sameDomain.
	properties - (object) additional attributes for the object element.
	vars - (object) given to the swf as querystring in flashVars.
	callBacks - (object) Functions you want to pass to your flash movie.

Returns:
	The object element
	Important: the $ function on the OBJECT element wont extend it, will just target the movie by its id/reference.
	So its not possible to use the <Element> methods on it.

Example:
	(start code)
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
	(end)
*/

var Swiff = new Abstract(function(movie, options){
	if (!Swiff.fixed) Swiff.fix();
	options = $merge(Swiff.options, options || {});

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
	if ($type(vars) == 'object') vars = Object.toQueryString(vars);
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
});

Swiff.extend({

	options: {
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
	},

	UID: 0,

	callBacks: {},

	nextInstance: function(){
		return 'Swiff' + (++Swiff.UID);
	},

	//from swfObject, fixes bugs in ie+fp9
	fix: function(){
		Swiff.fixed = true;
		window.addEvent('beforeunload', function(){
			__flash_unloadHandler = __flash_savedUnloadHandler = Class.empty;
		});
		if (!Client.Engine.ie) return;
		window.addEvent('unload', function(){
			Array.each(document.getElementsByTagName('object'), function(swf){
				swf.style.display = 'none';
				for (var p in swf){
					if (typeof swf[p] == 'function') swf[p] = Class.empty;
				}
			});
		});
	},

	/*
	Function: Swiff.getVersion
		Gets the major version of the flash player installed.

	Returns:
		A number representing the (major) flash version installed, or 0 if no player is installed.
	*/

	getVersion: function(){
		if (!$defined(Swiff.pluginVersion)){
			var x;
			if (navigator.plugins && navigator.mimeTypes.length){
				x = navigator.plugins["Shockwave Flash"];
				if(x && x.description) x = x.description;
			} else if (Client.Engine.ie){
				try {
					x = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
					x = x.GetVariable("$version");
				} catch(e){}
			}
			Swiff.pluginVersion = ($type(x) == 'string') ? parseInt(x.match(/\d+/)[0]) : 0;
		}
		return Swiff.pluginVersion;
	},

	/*
	Function: Swiff.remote
		Calls an ActionScript function from javascript. Requires ExternalInterface.

	Returns:
		Whatever the ActionScript Returns
	*/

	remote: function(obj, fn){
		var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
		return eval(rs);
	}

});