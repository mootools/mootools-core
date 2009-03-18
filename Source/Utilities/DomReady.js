/*
Script: Domready.js
	Contains the domready custom event.

License:
	MIT-style license.
*/

[Document, Window].call('defineEventModifier', 'domready', function(fn, remove){
	if (!remove && Browser.loaded) fn.call(this);
});

(function(){

	var domready = function(){
		if (Browser.loaded) return;
		Browser.loaded = true;
		[document, window].call('fireEvent', 'domready');
	};

	if (Browser.Engine.trident){
		var temp = document.newElement('div');
		(function(){
			(Function.stab(function(){
				temp.doScroll('left');
				return temp.inject(document.body).set('html', 'temp').dispose();
			})) ? domready() : arguments.callee.delay(50);
		})();
	} else if (Browser.Engine.webkit && Browser.Engine.version < 525){
		(function(){
			(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
		})();
	} else {
		window.addEvent('load:flash', domready);
		document.addEvent('DOMContentLoaded:flash', domready);
	}

})();
