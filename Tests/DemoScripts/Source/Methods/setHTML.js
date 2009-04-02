var	setHTML = function(el, html){
	//yeah, yeah, this will cause memory leaks - it's just a demo!
	return el.innerHTML = trim(html); //using trim here just so there's a dependency on StringMethods.js
};