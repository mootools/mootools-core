/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){

	var fired;
	window.addEvent('domready', function(){
		fired = true;
	});

	describe('Window.DomReady', {
	
		'DomReady should have fired': function(){
			value_of(fired).should_be(true);
		}
	
	});

})();