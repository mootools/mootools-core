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
	Platform: {'name': (navigator.platform.match(/(mac)|(win)|(linux)|(nix)/i) || ['Other'])[0].toLowerCase()},
	Features: {'xhr': !!(window.XMLHttpRequest), 'xpath': !!(document.evaluate)}
});

if (window.opera) Browser.Engine.name = 'presto';
else if (window.ActiveXObject) Browser.Engine = {'name': 'trident', 'version': (Browser.Features.xhr) ? 5 : 4};
else if (!navigator.taintEnabled) Browser.Engine = {'name': 'webkit', 'version': (Browser.Features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Browser.Engine.name = 'gecko';
Browser.Engine[Browser.Engine.name] = Browser.Engine[Browser.Engine.name + Browser.Engine.version] = true;
Browser.Platform[Browser.Platform.name] = true;

var Window = new Native({

	name: 'Window',

	initialize: function(win){
		Window.$instances.push(win);
		if (!win.Element){
			win.Element = $empty;
			if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.Element.prototype = (Browser.Engine.webkit) ? win["[[DOMElement.prototype]]"] : {};
		}
		return $extend(win, this);
	},

	afterImplement: function(property, value){
		for (var i = 0, l = this.$instances.length; i < l; i++) this.$instances[i][property] = value;
	}

});

Window.$instances = [];

new Window(window);

var Document = new Native({

	name: 'Document',

	initialize: function(doc){
		Document.$instances.push(doc);
		doc.head = doc.getElementsByTagName('head')[0];
		doc.window = doc.defaultView || doc.parentWindow;
		if (Browser.Engine.trident4) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		return $extend(doc, this);
	},

	afterImplement: function(property, value){
		for (var i = 0, l = this.$instances.length; i < l; i++) this.$instances[i][property] = value;
	}

});

Document.$instances = [];

new Document(document);