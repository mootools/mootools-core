/*
Script: Swiff.js
	Wrapper for embedding SWF movies. Supports (and fixes) External Interface Communication.

License:
	MIT-style license.

Credits:
	Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.
*/

var Swiff = function(path, options){
	if (!Swiff.fixed) Swiff.fix();
	var instance = 'Swiff_' + Native.UID++;
	options = $merge({
		id: instance,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'transparent',
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
	if (Browser.Engine.trident){
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
	return ($(options.container) || new Element('div')).set('html', build).firstChild;
};

Swiff.extend({

	Events: {},

	remote: function(obj, fn){
		var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
		return eval(rs);
	},

	getVersion: function(){
		if (!$defined(Swiff.pluginVersion)){
			var version;
			if (navigator.plugins && navigator.mimeTypes.length){
				version = navigator.plugins["Shockwave Flash"];
				if (version && version.description) version = version.description;
			} else if (Browser.Engine.trident){
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
		if (!Browser.Engine.trident) return;
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
