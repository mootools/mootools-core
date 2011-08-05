/*
---

name: Browser.Styles

description: Includes and populates the Browser.Styles with vendor style extensions (-moz, -ms, -webkit, -o).

license: MIT-style license.

requires: [Browser]

provides: [Browser.Styles]

...
*/

(function(){
	
Browser.Styles = { js: {}, css: {} };
var hasPrefix = /(moz-|ms-|webkit-|o-)([\w-]+)/;

Object.each(document.body.currentStyle || window.getComputedStyle(document.body), function(value, key){
	var dashed = isNaN(key) ? key.hyphenate() : value,
		prefix = hasPrefix.exec(dashed) || [],
		name = prefix[2] || dashed;
	Browser.Styles.css[name] = [prefix[0] ? '-' + prefix[0] : dashed];
	Browser.Styles.js[name.camelCase()] = [prefix[1] == 'ms-' ? key : dashed.camelCase()];
});

})();
