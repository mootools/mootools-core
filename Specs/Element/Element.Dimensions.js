/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){
	var div;
	window.addEvent('domready', function(){
		div = new Element('div', {
			id: 'ElementDimensionsTest',
			styles: {
				width: 100,
				height: 100,
				margin: 2,
				padding: 3,
				border: '1px solid black',
				visibility: 'hidden',
				display: 'block',
				position: 'fixed',
				top: 10,
				left: 10
			}
		}).inject(document.body);
	});

	describe('Element.Dimensions', {

	});

})();
