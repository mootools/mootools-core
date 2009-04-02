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
				position: 'absolute',
				top: 100,
				left: 100
			}
		}).inject(document.body);
	});

	describe('Element.getSize', {
		
		'should measure the width and height of the element': function(){
			value_of(div.getSize()).should_be({x: 108, y: 108});
		}
		
	});
	
	describe('Element.getPosition', {
		
		'should measure the x and y position of the element': function(){
			value_of(div.getPosition()).should_be({x: 102, y: 102});
		}
		
	});

})();
