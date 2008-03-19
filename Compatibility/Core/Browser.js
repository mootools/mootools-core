window.extend = document.extend = function(properties){
	for (var property in properties) this[property] = properties[property];
};

window[Browser.Engine.name] = window[Browser.Engine.name + Browser.Engine.version] = true;

window.ie = window.trident;
window.ie6 = window.trident4;
window.ie7 = window.trident5;