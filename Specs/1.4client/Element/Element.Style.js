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
			var style = this.style = document.createElement('style');
			style.type = 'text/css';
			var definition = '.' + className + '{ opacity: 0.5; filter: alpha(opacity=50); }';

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
			this.element.setStyle('opacity', 1);
			expect(this.element.getStyle('opacity')).toEqual(1);
			this.element.setStyle('opacity', null);
			expect(this.element.getStyle('opacity')).toEqual(0.5);
		});

	});

});
