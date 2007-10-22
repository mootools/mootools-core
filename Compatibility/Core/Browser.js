window.extend = document.extend = function(properties){
	for (var property in properties) this[property] = properties[property];
};
window.extend(Browser.Engine);

window.ie = window.trident;
window.ie6 = window.trident4;
window.ie7 = window.trident5;