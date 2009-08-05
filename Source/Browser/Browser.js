/*=
name: Browser
description: Required if you plan to run MooTools in a browser environment.
requires:
  - Accessor
=*/

(function(){

var Browser = this.Browser = (function(){}).extend({

	Engine: {name: 'unknown', version: 0},

	Platform: {name: (window.orientation != null) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},

	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector)
	},

	Plugins: {}

});

Browser.Platform[Browser.Platform.name] = true;

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
		return (document.getBoxObjectFor == null) ? false : ((document.getElementsByClassName) ? ((Browser.Features.query) ? 19.1 : 19) : 18);
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

// Request

Browser.Request = (function(){
	
	var XMLHTTP = function(){
		return new XMLHttpRequest();
	};

	var ActiveX = function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	};
	
	return Function.stab(function(){
		XMLHTTP();
		return XMLHTTP;
	}, function(){
		ActiveX();
		return ActiveX;
	});

})();

Browser.Features.xhr = !!(Browser.Request);

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
		script.text = text;
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
	
Browser.extend({
	Document: this.Document,
	Window: this.Window,
	Element: this.Element,
	Event: this.Event
});

if (!Browser.Element){
	Browser.Element = function(){};
	Browser.Element.parent = Object;
}

this.Window = new Type('Window', function(){});

this.constructor = this.Window;
this.$typeOf = Function.from('window').hide();

Window.mirror(function(name, method){
	window[name] = method;
});

Object.append(window, new Storage);

var doc = this.document;
doc.window = this;

doc.head = doc.getElementsByTagName('head')[0];
doc.html = doc.getElementsByTagName('html')[0];


if (doc.execCommand) Function.stab(function(){
	doc.execCommand("BackgroundImageCache", false, true);
});

if (this.attachEvent) this.attachEvent('onunload', function(){
	this.detachEvent('onunload', arguments.callee);
	doc.head = doc.html = doc.window = null;
});

this.Document = new Type('Document', function(){});

doc.constructor = this.Document;
doc.$typeOf = Function.from('document').hide();

Document.mirror(function(name, method){
	doc[name] = method;
});

Object.append(document, new Storage);
	
})();
