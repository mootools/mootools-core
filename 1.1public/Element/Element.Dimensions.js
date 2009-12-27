/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){
	var div, relDiv, absDiv, scrollDiv, tallDiv, ready;
	var setup = function(){
		if (ready) return;
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
				left: 100,
				overflow: 'hidden',
				zIndex: 1
			}
		}).inject($(document.body));
		
		relDiv = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				margin: 5,
				padding: 5,
				border: '1px solid green',
				visibility: 'hidden',
				position: 'relative',
				overflow: 'hidden'
			},
			id: 'relDiv'
		}).inject(div);
		
		absDiv = new Element('div', {
			styles: {
				width: 10,
				height: 10,
				margin: 5,
				padding: 5,
				border: '1px solid red',
				visibility: 'hidden',
				position: 'absolute',
				top: 10,
				left: 10,
				overflow: 'hidden'
			},
			id: 'absDiv'
		}).inject(relDiv);
	
		scrollDiv = new Element('div', {
			styles: {
				width: 100,
				height: 100,
				overflow: 'scroll',
				visibility: 'hidden', 
				position: 'absolute',
				top: 0,
				left: 0
			},
			id: 'scrollDiv'
		}).inject($(document.body));
	
		tallDiv = new Element('div', {
			styles: {
				width: 200,
				height: 200,
				visibility: 'hidden'
			},
			id: 'tallDiv'
		}).inject(scrollDiv);
		ready = true;
	};
	window.addEvent('domready', setup);

	describe('Element.getSize', {
		
		'should measure the width and height of the element': function(){
			setup();
			value_of(div.getSize().scroll).should_be({"x":0, "y":0});
			value_of(div.getSize().size).should_be({"x":108, "y":108});
			value_of(div.getSize().scrollSize).should_be({"x":106, "y":106});
		}
		
	});
	
	describe('Element.getPosition', {
		
		'should measure the x and y position of the element': function(){
			setup();
			value_of(div.getPosition()).should_be({x: 102, y: 102});
		}
		
	});

	describe('Element.getTop', {
		
		'should get the top the element': function(){
			setup();
			value_of(div.getTop()).should_be(102);
		}
		
	});

	describe('Element.getLeft', {
		
		'should get the top the element': function(){
			setup();
			value_of(div.getLeft()).should_be(102);
		}
		
	});

	describe('Element.getCoordinates', {
		
		'should return the coordinates relative to the document body': function(){
			setup();
			value_of(absDiv.getCoordinates().width).should_be(22);
			value_of(absDiv.getCoordinates().height).should_be(22);
			value_of(absDiv.getCoordinates().left).should_be(124);
			value_of(absDiv.getCoordinates().top).should_be(124);
			value_of(absDiv.getCoordinates().right).should_be(146);
			value_of(absDiv.getCoordinates().bottom).should_be(146);
		}
		
	});
	
	describe('Element.scrollTo', {
		
		'should scroll the element': function(){
			setup();
			scrollDiv.scrollTo(20,20);
			value_of(scrollDiv.getSize().scroll).should_be({x:20, y:20});
		}
		
	});

})();
