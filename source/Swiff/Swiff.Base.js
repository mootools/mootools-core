/*
Script: Swiff.Base.js
	Contains <Swiff>, <Swiff.getVersion>, <Swiff.remote>

Author:
	Valerio Proietti, <http://mad4milk.net>

Credits:
	Flash detection 'borrowed' from SWFObject.

License:
	MIT-style license.
*/

/*
Function: Swiff
	creates a flash object with supplied parameters.

Arguments:
	source - the swf path.
	properties - an object with key/value pairs. all options are optional. see below.
	where - the $(element) to inject the flash object.

Properties:
	width - int, the width of the flash object. defaults to 0.
	height - int, the height of the flash object. defaults to 0.
	id - string, the id of the flash object. defaults to 'Swiff-Object-num_of_object_inserted'.
	wmode - string, transparent or opaque.
	bgcolor - string, hex value for the movie background color.
	vars - an object of variables (functions, anything) you want to pass to your flash movie

Returns:
	the object element, to be injected somewhere.
	Important: the $ function on the OBJECT element wont extend it, will just target the movie by its id/reference. So its not possible to use the <Element> methods on it.
	This is why it has to be injected using $('myFlashContainer').adopt(myObj) instead of $(myObj).injectInside('myFlashContainer');

Example:
	(start code)
	var obj = new Swiff('myMovie.swf', {
		width: 500,
		height: 400,
		id: 'myBeautifulMovie',
		wmode: 'opaque',
		bgcolor: '#ff3300',
		vars: {
			onLoad: myOnloadFunc,
			myVariable: myJsVar,
			myVariableString: 'hello'
		}
	});
	$('myElement').adopt(obj);
	(end)
*/

var Swiff = function(source, props){
	if (!Swiff.fixed) Swiff.fix();
	var instance = 'Swiff' + Swiff.count++;
	Swiff.vars[instance] = {};
	props = Object.extend({
		width: 0, height: 0, id: instance, wmode: 'transparent', bgcolor: '#ffffff', vars: {'onLoad': Class.empty}
	}, props || {});
	var append = [];
	var count = -1;
	for (var p in props.vars){
		count++;
		Swiff.vars[instance][p] = props.vars[p];
		append[count] = p+'=Swiff.vars.'+instance+'.'+p;
	}
	var swf = source + '?' + append.join('&');
	var html =
		'<object width="'+props.width+'" height="'+props.height+'" id="'+props.id+'" type="application/x-shockwave-flash" data="'+swf+'">'+
			'<param name="allowScriptAccess" value="sameDomain" />'+'<param name="movie" value="'+swf+'" />'+
			'<param name="bgcolor" value="'+props.bgcolor+'" />'+'<param name="scale" value="noscale" />'+
			'<param name="salign" value="lt" />'+'<param name="wmode" value="'+props.wmode+'" />'+
		'</object>';
	return new Element('div').setHTML(html).getFirst();
};

Swiff.extend = Object.extend;

Swiff.extend({

	count: 0,

	callBacks: {},

	vars: {},

	//from swfObject, fixes bugs in ie+fp9
	fix: function(){
		Swiff.fixed = true;
		window.addEvent('beforeunload', function(){
			__flash_unloadHandler = __flash_savedUnloadHandler = Class.empty;
		});
		if (!window.ie) return;
		window.addEvent('unload', function(){
			$each(document.getElementsByTagName("object"), function(swf){
				swf.style.display = 'none';
				for (var p in swf){
					if (typeof swf[p] == 'function') swf[p] = Class.empty;
				}
			});
		});
	},

	/*
	Function: Swiff.getVersion
		gets the major version of the flash player installed.

	Returns:
		a number representing the flash version installed, or 0 if no player is installed.
	*/

	getVersion: function(){
		var version, x;
		if(navigator.plugins && navigator.mimeTypes.length){
			x = navigator.plugins["Shockwave Flash"];
			if(x && x.description) version = x.description;
		} else if (window.ie){
			try {
				x = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				version = x.GetVariable("$version");
			} catch(e){}
		}
		return version ? parseInt(version.match(/\d+/)[0]) : 0;
	},

	/*
	Function: Swiff.remote
		Calls an ActionScript function from javascript. Requires ExternalInterface.

	Returns: 
		Whatever the ActionScript Returns
	*/

	remote: function(object, name){
		var value = object.CallFunction("<invoke name=\"" + name + "\" returntype=\"javascript\">" + __flash__argumentsToXML(arguments, 2) + "</invoke>");
		return eval(value);
	}

});