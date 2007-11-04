/*
Script: Browser.js
	Contains Browser Initialization, including Window and Document.

License:
	MIT-style license.
*/

/*
Hash: Browser
	Some browser properties are attached to the Browser Object for browser and platform detection.

Features:
	Browser.Features.xpath - (boolean) True if the browser supports dom queries using xpath.
	Browser.Features.xhr   - (boolean) True if the browser supports native XMLHTTP object.

Engine:
	Browser.Engine.trident   - (boolean) True if the current browser is Internet Explorer (any).
	Browser.Engine.trident4  - (boolean) True if the current browser is Internet Explorer 6.
	Browser.Engine.trident5  - (boolean) True if the current browser is Internet Explorer 7.
	Browser.Engine.gecko     - (boolean) True if the current browser is Mozilla/Gecko.
	Browser.Engine.webkit    - (boolean) True if the current browser is Safari/Konqueror.
	Browser.Engine.webkit419 - (boolean) True if the current browser is Safari2 / webkit till version 419.
	Browser.Engine.webkit420 - (boolean) True if the current browser is Safari3 (Webkit SVN Build) / webkit over version 419.
	Browser.Engine.presto    - (boolean) True if the current browser is opera.
	Browser.Engine.name      - (string) The name of the engine.

Platform:
	Browser.Platform.mac     - (boolean) True if the platform is mac.
	Browser.Platform.windows - (boolean) True if the platform is windows.
	Browser.Platform.linux   - (boolean) True if the platform is linux.
	Browser.Platform.other   - (boolean) True if the platform is neither mac, windows or linux.
	Browser.Platform.name    - (string) The name of the platform.

Note:
	Engine detection is entirely feature-based.
*/

var Browser = new Hash({
	Engine: {'name': 'unknown', 'version': ''},
	Platform: {'name': (navigator.platform.match(/mac|win|linux|nix/i) || ['other'])[0].toLowerCase()}, 
	Features: {'xhr': !!(window.XMLHttpRequest), 'xpath': !!(document.evaluate)}
});

if (window.opera) Browser.Engine.name = 'presto';
else if (window.ActiveXObject) Browser.Engine = {'name': 'trident', 'version': (Browser.Features.xhr) ? 5 : 4};
else if (!navigator.taintEnabled) Browser.Engine = {'name': 'webkit', 'version': (Browser.Features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Browser.Engine.name = 'gecko';
Browser.Engine[Browser.Engine.name] = Browser.Engine[Browser.Engine.name + Browser.Engine.version] = true;
Browser.Platform[Browser.Platform.name] = true;

//global evaluation

function $exec(text){
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

Native.UID = 0;

var Window = new Native({

	name: 'Window',

	legacy: window.Window,

	initialize: function(win){
		if (!win.Element){
			win.Element = $empty;
			if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
		}
		win.uid = Native.UID++;
		return $extend(win, Window.Prototype);
	},

	afterImplement: function(property, value){
		window[property] = Window.Prototype[property] = value;
	}

});

Window.Prototype = {$family: {name: 'window'}};

new Window(window);

var Document = new Native({

	name: 'Document',

	legacy: window.Document,

	initialize: function(doc){
		doc.head = doc.getElementsByTagName('head')[0];
		doc.html = doc.getElementsByTagName('html')[0];
		doc.window = doc.defaultView || doc.parentWindow;
		if (Browser.Engine.trident4) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		doc.uid = Native.UID++;
		return $extend(doc, Document.Prototype);
	},

	afterImplement: function(property, value){
		document[property] = Document.Prototype[property] = value;
	}

});

Document.Prototype = {$family: {name: 'document'}};

new Document(document);
