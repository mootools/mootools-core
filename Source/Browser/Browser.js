/*
Script: Browser.js
	The Browser Core. Contains Browser initialization, Window and Document, and the Browser Object.

License:
	MIT-style license.
*/

var Browser = (function(){}).extend({

	Engine: {name: 'unknown', version: 0},

	Platform: {name: (window.orientation != null) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},

	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector),
		json: (typeof JSON != 'undefined')
	},

	Plugins: {}

});

Browser.Platform[Browser.Platform.name] = true;

(function(){

	var engines = {

		presto: function(){
			return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
		},

		trident: function(){
			return (!window.ActiveXObject) ? false : ((Browser.Features.json) ? 6 : ((window.XMLHttpRequest) ? 5 : 4));
		},

		webkit: function(){
			return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
		},

		gecko: function(){
			return (document.getBoxObjectFor == null) ? false : ((document.getElementsByClassName) ? ((Browser.Features.json) ? 19.1 : 19) : 18);
		}

	};

	for (var engine in engines){
		var version = engines[engine]();
		if (version){
			Browser.Engine = {name: engine, version: version};
			Browser.Engine[engine] = Browser.Engine[engine + version] = true;
			break;
		}
	}

})();

// Request

Browser.Request = function(){
	return Function.stab(function(){
		return new XMLHttpRequest();
	}, function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	});
};

Browser.Features.xhr = !!(Browser.Request());

// Flash detection

Browser.Plugins.Flash = (function(){
	var version = (Function.stab(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);
	return {version: Number(version[0] || 0 + '.' + version[1]) || 0, build: Number(version[2]) || 0};
})();

// String scripts

Browser.exec = function(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script[(Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerText' : 'text'] = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;	
};

String.implement('stripScripts', function(exec){
	
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
		scripts += arguments[1] + '\n';
		return '';
	});
	if (exec === true) Browser.exec(scripts);
	else if (typeOf(exec) == 'function') exec(scripts, text);
	return text;

});

// Window, Document

(function(){
	
	Browser.extend({
		Document: this.Document,
		Window: this.Window,
		Element: this.Element,
		Event: this.Event
	});

	if (!Browser.Element){
		Browser.Element = function(){};
		if (Browser.Engine.webkit) doc.createElement("iframe"); //fixes safari 2
		Browser.Element.prototype = (Browser.Engine.webkit) ? this["[[DOMElement.prototype]]"] : {};
	}
	
	this.Window = new Native('Window', function(){});
	
	this.constructor = this.Window;
	this[':type'] = Function.from('window').hide();
	
	this.Window.mirror(function(name, method){
		if (window[name] == null && (method == null || !method[':hidden'])) window[name] = method;
	}).implement(new Storage);
	
	var doc = this.document;
	doc.window = this;

	doc.head = doc.getElementsByTagName('head')[0];
	doc.html = doc.getElementsByTagName('html')[0];
	if (Browser.Engine.trident){
		if (Browser.Engine.version <= 4) Function.stab(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		this.attachEvent('onunload', function(){
			this.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
	}
	
	this.Document = new Native('Document', function(){});

	doc.constructor = this.Document;
	doc[':type'] = Function.from('document').hide();
	
	this.Document.mirror(function(name, method){
		if (doc[name] == null && (method == null || !method[':hidden'])) doc[name] = method;
	}).implement(new Storage);
	
})();
