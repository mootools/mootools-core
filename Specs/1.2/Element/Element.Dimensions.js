/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

describe('Element.Dimensions', function(){

	var div, relDiv, absDiv, scrollDiv, tallDiv;

	beforeEach(function(){
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
				overflow: 'hidden',
				'float': 'left',
				'display': 'inline'
			}
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
			}
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
			}
		}).inject($(document.body));

		tallDiv = new Element('div', {
			styles: {
				width: 200,
				height: 200,
				visibility: 'hidden'
			}
		}).inject(scrollDiv);
	});

	describe('Element.getSize', function(){

		it('should measure the width and height of the element', function(){
			expect(div.getSize().x).toEqual(108);
			expect(div.getSize().y).toEqual(108);
		});

	});

	describe('Element.getPosition', function(){

		it('should measure the x and y position of the element', function(){
			expect(div.getPosition()).toEqual({x: 102, y: 102});
		});

		it('should measure the x and y position of the element relative to another', function(){
			expect(relDiv.getPosition(div)).toEqual({x: 8, y: 8});
		});

	});

	describe('Element.getCoordinates', function(){

		it('should return the coordinates relative to parent', function(){
			expect(absDiv.getCoordinates(relDiv)).toEqual({left:15, top:15, width:22, height:22, right:37, bottom:37});
		});

	});

	describe('Element.getScrollSize', function(){

		it('should return the scrollSize', function(){
			expect(scrollDiv.getScrollSize()).toEqual({x:200, y:200});
		});

	});

	describe('Element.scrollTo', function(){

		it('should scroll the element', function(){
			expect(scrollDiv.scrollTo(20, 20).getScroll()).toEqual({x:20, y:20});
		});

	});

	afterEach(function(){
		[div, relDiv, absDiv, scrollDiv, tallDiv].each(function(el){
			$(el).destroy();
		});
	});

});
