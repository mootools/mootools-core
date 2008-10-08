/*
Script: Browser.js
	The Browser Core. Contains Browser initialization, Window and Document, and the Browser Hash.

License:
	MIT-style license.
*/

var Browser = new Hash({
	name: 'unknown',
	version: 0,
	Engine: {name: 'unknown', version: 0},
	Platform: {name: (window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},
	Features: {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)},
	Plugins: {}
});

Browser.Platform[Browser.Platform.name] = true;

Browser.Engines = {
	
	presto: function(){
		return (window.opera && !document.getElementsByClassName) ? {browser: 'opera', version: 9, build: 925} : false;
	},
	
	kestrel: function(){
		return (window.opera && document.getElementsByClassName) ? {browser: 'opera', version: 9.5, build: 950} : false;
	},
	
	trident: function(){
		var seven = {version: 7, build: 5}, six = {version: 6, build: 4};
		var value = (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? seven : six);
		return $extend(value, {browser: 'explorer'});
	},
	
	webkit: function(){
		var two = {version: 2, build: 419}, three = {version: 3, build: 420}, threePointOne = {version: 3.1, build: 525};
		var value = (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? threePointOne : three) : two);
		return $extend(value, {browser: 'safari'});
	},
	
	gecko: function(){
		var eighteen = {version: 2, build: 18}, nineteen = {version: 3, build: 19};
		var value = (document.getBoxObjectFor == undefined) ? false : ((document.getElementsByClassName) ? nineteen : eighteen);
		return $extend(value, {browser: 'firefox'});
	}
	
};

Browser.detect = function(){
	for (var engine in Browser.Engines){
		var value = Browser.Engines[engine]();
		if (value){
			Browser.Engine = {name: engine, version: value.build};
			Browser.Engine[engine] = Browser.Engine[engine + value.build] = true;
			Browser.name = value.browser;
			Browser.version = value.version;
			Browser[value.browser] = Browser[value.browser + value.version] = true;
			break;
		}
	}
};

Browser.detect();

Browser.Request = function(){
	return $try(function(){
		return new XMLHttpRequest();
	}, function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	});
};

Browser.Features.xhr = !!(Browser.Request());

Browser.Plugins.Flash = (function(){
	var version = ($try(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);
	return {version: parseInt(version[0] || 0 + '.' + version[1] || 0), build: parseInt(version[2] || 0)};
})();

function $exec(text){
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

Native.UID = 1;

var $uid = (Browser.Engine.trident) ? function(item){
	return (item.uid || (item.uid = [Native.UID++]))[0];
} : function(item){
	return item.uid || (item.uid = Native.UID++);
};

var Window = new Native({

	name: 'Window',

	legacy: (Browser.Engine.trident) ? null: window.Window,

	initialize: function(win){
		$uid(win);
		if (!win.Element){
			win.Element = $empty;
			if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
		}
		win.document.window = win;
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

	legacy: (Browser.Engine.trident) ? null: window.Document,

	initialize: function(doc){
		$uid(doc);
		doc.head = doc.getElementsByTagName('head')[0];
		doc.html = doc.getElementsByTagName('html')[0];
		if (Browser.Engine.trident && Browser.Engine.version <= 4) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		if (Browser.Engine.trident) doc.window.attachEvent('onunload', function() {
			doc.window.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
		return $extend(doc, Document.Prototype);
	},

	afterImplement: function(property, value){
		document[property] = Document.Prototype[property] = value;
	}

});

Document.Prototype = {$family: {name: 'document'}};

new Document(document);