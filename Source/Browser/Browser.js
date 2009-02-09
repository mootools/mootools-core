/*
Script: Browser.js
	The Browser Core. Contains Browser initialization, Window and Document, and the Browser Object.

License:
	MIT-style license.
*/

var Browser = function(){};

Browser.extend({

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

Browser.detect = function(){

	for (var engine in this.Engines){
		var version = this.Engines[engine]();
		if (version){
			this.Engine = {name: engine, version: version};
			this.Engine[engine] = this.Engine[engine + version] = true;
			break;
		}
	}

	return {name: engine, version: version};

};

Browser.detect();

Browser.Request = function(){
	return Function.stab(function(){
		return new XMLHttpRequest();
	}, function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	});
};

Browser.Features.xhr = !!(Browser.Request());

Browser.Plugins.Flash = (function(){
	var version = (Function.stab(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);
	return {version: Number.from(version[0] || 0 + '.' + version[1]) || 0, build: Number.from(version[2]) || 0};
})();

Native.UID = 1;

Native.uid = (Browser.Engine.trident) ? function(item){
	return (item.uid || (item.uid = [Native.UID++]))[0];
} : function(item){
	return item.uid || (item.uid = Native.UID++);
};

String.extend({
	
	exec: function(text){
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
	}
	
});

String.implement({
	
	stripScripts: function(option){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (option === true) String.exec(scripts);
		else if (typeOf(option) == 'function') option(scripts, text);
		return text;
	}

});

(function(){

var legacyWindow = window.Window;

window.Window = new Native('Window', function(win){
	if (!win.Element){
		win.Element = function(){};
		if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
		win.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
	}
	win.document.window = win;
	if (!legacyWindow){
		win.constructor = Window;
		win._type = Function.from('window');
	}
}, legacyWindow);

if (!legacyWindow) Window._beforeImplement = function(name, method){
	return (window[name] = method);
};

var legacyDocument = window.Document;

window.Document = new Native('Document', function(doc){
	doc.head = doc.getElementsByTagName('head')[0];
	doc.html = doc.getElementsByTagName('html')[0];
	if (Browser.Engine.trident){
		if (Browser.Engine.version <= 4) Function.stab(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		doc.window.attachEvent('onunload', function(){
			doc.window.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
	}
	if (!legacyDocument){
		doc.constructor = Document;
		doc._type = Function.from('document');
	}
}, legacyDocument);

if (!legacyDocument) Document._beforeImplement = function(name, method){
	return (document[name] = method);
};

})();

new Window(window);
new Document(document);