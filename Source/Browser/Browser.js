/*
Script: Browser.js
	The Browser Core. Contains Browser initialization, Window and Document, and the Browser Object.

License:
	MIT-style license.
*/

var Browser = (function(){}).extend({

	Engine: {name: 'unknown', version: 0},

	Platform: {name: (window.orientation != null) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},

	Features: {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)},

	Plugins: {},

	Engines: {

		presto: function(){
			return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
		},

		trident: function(){
			return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? 5 : 4);
		},

		webkit: function(){
			return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
		},

		gecko: function(){
			return (document.getBoxObjectFor == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
		}

	}

});

Browser.Platform[Browser.Platform.name] = true;

(function(){

	for (var engine in Browser.Engines){
		var version = Browser.Engines[engine]();
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

String.implement('stripScripts', function(option){
	
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
		scripts += arguments[1] + '\n';
		return '';
	});
	if (option === true) Browser.exec(scripts);
	else if (typeOf(option) == 'function') option(scripts, text);
	return text;

});

// Window, Document

(function(win, doc){
	
	var emptyWindow = (function Window(){});
	
	if (!win.Window) win.Window = emptyWindow;
	Browser.Window = win.Window;
	
	win.Window = new Native(emptyWindow);
	
	var emptyElement = (function Element(){});

	if (!win.Element){
		win.Element = emptyElement;
		if (Browser.Engine.webkit) doc.createElement("iframe"); //fixes safari 2
		win.Element.prototype = (Browser.Engine.webkit) ? win["[[DOMElement.prototype]]"] : {};
	}

	Browser.Element = win.Element;
	
	var emptyEvent = (function Event(){});

	if (!win.Event) win.Event = emptyEvent;
	Browser.Event = win.Event;
	
	doc.window = win;
	
	win.constructor = win.Window;
	win[':type'] = Function.from('window').hide();
	
	win.Window.mirror(function(name, method){
		if (win[name] == null && (method == null || !method[':hidden'])) win[name] = method;
	}).implement(new Storage);
	
	var emptyDocument = (function Document(){});

	if (!win.Document) win.Document = emptyDocument;
	Browser.Document = win.Document;

	win.Document = new Native(emptyDocument);

	doc.head = doc.getElementsByTagName('head')[0];
	doc.html = doc.getElementsByTagName('html')[0];
	if (Browser.Engine.trident){
		if (Browser.Engine.version <= 4) Function.stab(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		win.attachEvent('onunload', function(){
			win.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
	}

	doc.constructor = win.Document;
	doc[':type'] = Function.from('document').hide();
	
	win.Document.mirror(function(name, method){
		if (doc[name] == null && (method == null || !method[':hidden'])) doc[name] = method;
	}).implement(new Storage);
	
})(window, document);
