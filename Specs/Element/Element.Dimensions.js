/*
---
name: Element.Dimensions
requires: ~
provides: ~
...
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
			expect(div.getSize().x).to.equal(108);
			expect(div.getSize().y).to.equal(108);
		});

	});

	describe('SVG dimensions', function(){

		if (!document.addEventListener) return; // IE8- has no support for svg anyway, so this spec does not apply.
		var svgElements = [{
			el: 'svg',
			prop: {
				'xmlns': 'http://www.w3.org/2000/svg',
				height: '200px',
				width: '142px',
				viewBox: '0 0 512 512'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#E44D26',
				points: '107.644,470.877 74.633,100.62 437.367,100.62 404.321,470.819 255.778,512'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#F16529',
				points: '256,480.523 376.03,447.246 404.27,130.894 256,130.894'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#E44D26',
				points: '107.644,470.877 74.633,100.62 437.367,100.62 404.321,470.819 255.778,512'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#EBEBEB',
				points: '256,268.217 195.91,268.217 191.76,221.716 256,221.716 256,176.305 255.843,176.305 142.132,176.305 143.219,188.488 154.38,313.627 256,313.627'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#EBEBEB',
				points: '256,386.153 255.801,386.206 205.227,372.55 201.994,336.333 177.419,336.333 156.409,336.333 162.771,407.634 255.791,433.457 256,433.399'
			}
		}, {
			el: 'path',
			prop: {
				d: 'M108.382,0h23.077v22.8h21.11V0h23.078v69.044H152.57v-23.12h-21.11v23.12h-23.077V0z'
			}
		}, {
			el: 'path',
			prop: {
				d: 'M205.994,22.896h-20.316V0h63.72v22.896h-20.325v46.148h-23.078V22.896z'
			}
		}, {
			el: 'path',
			prop: {
				d: 'M259.511,0h24.063l14.802,24.26L313.163,0h24.072v69.044h-22.982V34.822l-15.877,24.549h-0.397l-15.888-24.549v34.222h-22.58V0z'
			}
		}, {
			el: 'path',
			prop: {
				d: 'M348.72,0h23.084v46.222h32.453v22.822H348.72V0z'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#FFFFFF',
				points: '255.843,268.217 255.843,313.627 311.761,313.627 306.49,372.521 255.843,386.191 255.843,433.435 348.937,407.634 349.62,399.962 360.291,280.411 361.399,268.217 349.162,268.217'
			}
		}, {
			el: 'polygon',
			prop: {
				fill: '#FFFFFF',
				points: '255.843,176.305 255.843,204.509 255.843,221.605 255.843,221.716 365.385,221.716 365.385,221.716 365.531,221.716 366.442,211.509 368.511,188.488 369.597,176.305'
			}
		}];

		var svgContainer;
		svgElements.each(function(e, i){
			var thisElement = document.createElementNS('http://www.w3.org/2000/svg', e.el);
			thisElement.setProperties(e.prop);
			if (i == 0){
				svgContainer = thisElement;
				$(document.body).adopt(thisElement);
				return;
			};
			svgContainer.adopt(thisElement);
		});
		var svgElement = document.getElement('svg');

		it('should get the correct height and width of a svg element', function(){
			expect(svgElement.getSize().y).to.equal(200);
			expect(svgElement.getSize().x).to.equal(142);
			svgElement.destroy();
		});

	});

	describe('Element.getPosition', function(){

		it('should measure the x and y position of the element', function(){
			expect(div.getPosition()).to.eql({x: 102, y: 102});
		});

		it('should measure the x and y position of the element relative to another', function(){
			expect(relDiv.getPosition(div)).to.eql({x: 8, y: 8});
		});

		it('should match subpixels if needed', function(){
			var oddSizedDiv = new Element('div', {
				styles: {
					width: 51,
					height: 51,
					margin: 5,
					visibility: 'hidden',
					position: 'relative',
					overflow: 'hidden',
					'float': 'left'
				}
			}).inject($(document.body));

			var insideOddSizedDiv = new Element('div', {
				styles: {
					width: 10,
					height: 10,
					margin: 5.5,
					visibility: 'hidden',
					overflow: 'hidden'
				}
			}).inject(oddSizedDiv);

			expect(insideOddSizedDiv.getPosition(oddSizedDiv).x)
				.to.equal(insideOddSizedDiv.getBoundingClientRect().left - oddSizedDiv.getBoundingClientRect().left);
		});

	});

	describe('Element.getCoordinates', function(){

		it('should return the coordinates relative to parent', function(){
			expect(absDiv.getCoordinates(relDiv)).to.eql({left:15, top:15, width:22, height:22, right:37, bottom:37});
		});

	});

	describe('Element.getScrollSize', function(){

		it('should return the scrollSize', function(){
			expect(scrollDiv.getScrollSize()).to.eql({x:200, y:200});
		});

	});

	describe('Element.scrollTo', function(){

		it('should scroll the element', function(){
			expect(scrollDiv.scrollTo(20, 20).getScroll()).to.eql({x:20, y:20});
		});

	});

	afterEach(function(){
		[div, relDiv, absDiv, scrollDiv, tallDiv].each(function(el){
			$(el).destroy();
		});
	});

});

describe('Element.getOffsetParent', function(){

	var container, offsetParent, wrapper, child, table, td;

	beforeEach(function(){
		container = new Element('div');

		offsetParent = new Element('div', {
			styles: {position: 'relative'}
		}).inject(container);

		wrapper = new Element('div', {
			styles: {height: 0}
		}).inject(offsetParent);

		child = new Element('div').inject(wrapper);

		table = new Element('table').inject(offsetParent);

		td = new Element('td').inject(new Element('tr').inject(table));

		container.inject(document.body);
	});

	it('Should return the right offsetParent', function(){
		expect(child.getOffsetParent()).to.equal(offsetParent);
	});

	it('Should return body for elements with body as offsetParent', function(){
		expect(offsetParent.getOffsetParent()).to.equal(document.body);
	});

	it('Should return a table element for td-elements', function(){
		expect(td.getOffsetParent()).to.equal(table);
	});

	it('Should return a td element for elements with position:static inside a td', function(){
		child.inject(td);
		expect(child.getOffsetParent()).to.equal(td);
	});

	it('Should not return a td element for elements with a position other than static inside a td', function(){
		child.setStyle('position', 'absolute');
		expect(child.getOffsetParent()).to.equal(offsetParent);
	});

	it('Should return null for elements with position:fixed', function(){
		table.setStyle('position', 'fixed');
		expect(table.getOffsetParent()).to.equal(null);
	});

	it('Should return null for the body element', function(){
		expect($(document.body).getOffsetParent()).to.equal(null);
	});

	afterEach(function(){
		container.destroy();
	});

});
