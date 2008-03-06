/*
Script: Swiff.js
	Wrapper for embedding SWF movies. Supports (and fixes) External Interface Communication.

License:
	MIT-style license.

Credits:
	Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.
*/

var Swiff = new Class({
	
	Implements: [Options],
	
	options: {
		id: null,
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
	},
	
	toElement: function(){
		return this.object;
	},
	
	initialize: function(path, options){
		this.instance = 'Swiff_' + $time();
		
		this.setOptions(options);
		options = this.options;
		var id = this.id = options.id || this.instance;
		var container = $(options.container);

		Swiff.Events[this.instance] = {};
		
		var params = options.params, vars = options.vars, events = options.events;
		var properties = $extend({height: options.height, width: options.width}, options.properties);
		
		for (var option in options){
			if ((/^on[A-Z]/).test(option)) events[option] = options[option];
		}
		
		var self = this;
		
		for (var event in events){
			Swiff.Events[this.instance][event] = (function(option){
				return function(){
					option.apply(self.object, arguments);
				};
			})(events[event]);
			vars[event] = 'Swiff.Events.' + this.instance + '.' + event;
		}
		
		params.flashVars = Hash.toQueryString(vars);
		if (Browser.Engine.trident){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
			properties.data = path;
		}
		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params) build += '<param name="' + param + '" value="' + params[param] + '" />';
		build += '</object>';
		this.object = (container || new Element('div')).set('html', build).firstChild;
	},
	
	replaces: function(element){
		element = $(element, true);
		element.parentNode.replaceChild(this.getElement(), element);
		return this;
	},
	
	inject: function(element){
		$(element, true).appendChild(this.getElement());
		return this;
	},
	
	remote: function(fn){
		return Swiff.remote(this.getElement(), fn);
	}
	
});

Swiff.Events = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};