/*
---
name: Element Specs
description: n/a
requires: [Core/Element.Style]
provides: [Element.Style.Specs]
...
*/
describe('Element.Style', function(){

	describe('opacity', function(){

		beforeEach(function(){
			var className = String.uniqueID();
			var style = this.style = $(document.createElement('style'));
			style.type = 'text/css';
			var definition = [
				'.' + className + '{',
					'opacity: 0.5;',
					'filter: alpha(opacity=50);',
					'color: #ff0000;',
				'}'
			].join('');

			// fix this, see https://github.com/mootools/mootools-core/issues/2265
			if (style.styleSheet) style.styleSheet.cssText = definition;
			else style.set('text', definition);

			document.head.appendChild(style);

			this.element = new Element('div', {
				'class': className,
				text: 'yo'
			}).inject(document.body);
		});

		afterEach(function(){
			this.style.destroy();
			this.element.destroy();
		});

		it('should get the opacity defined by the CSS', function(){
			expect(this.element.getStyle('opacity')).toEqual(0.5);
		});

		it('should set/overwrite the opacity', function(){
			// this test is disabled in IE, because of the ugly aliasing with
			// opacity we have to remove the filter in oldIE
			if (document.html.style.filter == null || window.opera || Syn.browser.gecko){
				this.element.setStyle('opacity', 1);
				expect(this.element.getStyle('opacity')).toEqual(1);
				this.element.setStyle('opacity', null);
				expect(this.element.getStyle('opacity')).toEqual(0.5);
			}
		});

		it('should remove the style by setting it to `null`', function(){
			this.element.setStyle('color', '#FF9900');
			expect(this.element.getStyle('color')).toEqual('#ff9900');
			this.element.setStyle('color', null);
			expect(this.element.getStyle('color')).toEqual('#ff0000');
		});

	});

	describe('getStyle height / width / margin with CSS', function(){

		var style, element;

		it('[beforeAll]', function(){
			var className = String.uniqueID();
			style = $(document.createElement('style'));
			style.type = 'text/css';
			var definition = [
				'.' + className + '{',
					'height: 200px;',
					'width: 50%;',
					'margin-left: 20%;',
				'}'
			].join('');

			// fix this, see https://github.com/mootools/mootools-core/issues/2265
			if (style.styleSheet) style.styleSheet.cssText = definition;
			else style.set('text', definition);

			document.head.appendChild(style);

			element = new Element('div', {
				'class': className,
				text: 'yo'
			}).inject(document.body);

		});

		it('should get the height from the CSS', function(){
			expect(element.getStyle('height')).toEqual('200px');
		});

		it('should get the width from the CSS', function(){
			expect(element.getStyle('width')).toMatch(/\d+px/);
		});

		it('should get the left margin from the CSS', function(){
			// FireFox returns px (and maybe even as floats)
			var re = /^(20\%|(\d+|\d+\.\d+)px)$/;
			expect(re.test('20%')).toBe(true);
			expect(re.test('20px')).toBe(true);
			expect(re.test('20.43px')).toBe(true);
			expect(re.test('20')).toBe(false);
			expect(re.test('auto')).toBe(false);
			expect(element.getStyle('margin-left')).toMatch(re);
		});

		it('[afterAll]', function(){
			style.destroy();
			element.destroy();
		});

	});

});
