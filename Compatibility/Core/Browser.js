window.extend = document.extend = function(properties){
	for (var property in properties) this[property] = properties[property];
};

window.ie = Browser.Engine.trident ? true : false;
window.ie6 = Browser.Engine.trident4 ? true : false;
window.ie7 = Browser.Engine.trident5 ? true : false;
window.gecko = Browser.Engine.gecko ? true : false;
window.webkit = Browser.Engine.webkit ? true : false;
window.webkit419 = Browser.Engine.webkit419 ? true : false;
window.webkit420 = Browser.Engine.webkit420 ? true : false;
window.opera = Browser.Engine.presto ? true : false;