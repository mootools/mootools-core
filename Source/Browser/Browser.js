/*
---

script: Browser.js

description: The Browser Core. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: [Array, Function, Number, String]

provides: [Browser, Window, Document]

...
*/

(function(){

var document = this.document;
var window = document.window = this;

var UA = navigator.userAgent.toLowerCase().match(/(opera|ie|firefox|chrome|version)[\s\/:](\d+\.\d+).*?(safari|$)/) || [null, 'unknown', 0];

var Browser = this.Browser = {
	
	name: (UA[1] == 'version') ? UA[3] : UA[1],
	version: parseFloat(UA[2]),

	Platform: {
		name: (this.orientation != null) ? 'ipod' : (navigator.platform.toLowerCase().match(/mac|win|linux/) || ['other'])[0]
	},

	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector),
		json: !!(window.JSON)
	},

	Plugins: {},
	
	extend: Hash.extend

};

Browser[Browser.name] = true;
Browser[Browser.name + parseInt(Browser.version, 10)] = true;
Browser.Platform[Browser.Platform.name] = true;

// Request

Browser.Request = (function(){

	var XMLHTTP = function(){
		return new XMLHttpRequest();
	};
 
	var MSXML2 = function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	};
 
	var MSXML = function(){
		return new ActiveXObject('Microsoft.XMLHTTP');
	};
 
	return Function.stab(function(){
		XMLHTTP();
		return XMLHTTP;
	}, function(){
		MSXML2();
		return MSXML2;
	}, function(){
		MSXML();
		return MSXML;
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

String.implement({stripScripts: function(exec){
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
		scripts += arguments[1] + '\n';
		return '';
	});
	if (exec === true) Browser.exec(scripts);
	else if (typeOf(exec) == 'function') exec(scripts, text);
	return text;
}});

// Window, Document
	
Browser.extend({
	Document: this.Document,
	Window: this.Window,
	Element: this.Element,
	Event: this.Event
});

this.Window = this.constructor = new Type('Window', function(){});

this.$family = Function.from('window').hide();

Window.mirror(function(name, method){
	window[name] = method;
});

this.Document = document.constructor = new Type('Document', function(){});

document.$family = Function.from('document').hide();

Document.mirror(function(name, method){
	document[name] = method;
});

document.html = document.documentElement;
document.head = document.getElementsByTagName('head')[0];

if (document.execCommand) try {
	document.execCommand("BackgroundImageCache", false, true);
} catch (e){}

if (this.attachEvent) this.attachEvent('onunload', function(){
	this.detachEvent('onunload', arguments.callee);
	document.head = document.html = document.window = null;
});

var arrayFrom = Array.from;

try {
	arrayFrom(document.html.childNodes);
} catch(e){
	Array.from = function(item){
		if (typeOf(item) == 'collection'){
			var i = item.length, array = new Array(i);
			while (i--) array[i] = item[i];
			return array;
		}
		return arrayFrom(item);
	};
}

})();

/*<block name="compatibility" version="1.2">*/

Browser.Engine = {};

if (Browser.ie){
	Browser.Engine.trident = true;
	
	switch(Browser.version){
		case 6:
			Browser.Engine.trident4 = true;
			Browser.Engine.version = 4;
		break;
		case 7:
			Browser.Engine.trident5 = true;
			Browser.Engine.version = 5;
		break;
		case 8:
			Browser.Engine.trident6 = true;
			Browser.Engine.version = 6;
	}
}

if (Browser.firefox){
	Browser.Engine.gecko = true;
	
	switch(Browser.version){
		case 2:
			Browser.Engine.gecko18 = true;
			Browser.Engine.version = 18;
		break;
		case 3:
			Browser.Engine.gecko19 = true;
			Browser.Engine.version = 19;
	}
}

if (Browser.safari || Browser.chrome){
	Browser.Engine.webkit = true;
	
	switch(Browser.version){
		case 2:
			Browser.Engine.webkit419 = true;
			Browser.Engine.version = 419;		
		break;
		case 3:
			Browser.Engine.webkit420 = true;
			Browser.Engine.version = 420;
		break;
		case 4:
			Browser.Engine.webkit525 = true;
			Browser.Engine.version = 525;
	}
}

// presto925 = opera
// presto950 = opera
// presto960 = opera

var $exec = function(text){
	return Browser.exec(text);
};

Native.UID = 1;
 
var $uid = (window.ActiveXObject) ? function(item){
	return (item.uid || (item.uid = [Native.UID++]))[0];
} : function(item){
	return item.uid || (item.uid = Native.UID++);
};

/*</block>*/
