/*
---
name: Element.Delegation Specs
description: n/a
requires: [Core/Element.Delegation]
provides: [Element.Delegation.Specs]
...
*/

describe('Element.Delegation', function(){

	describe('fireEvent', function(){

		it('should fire the added `click:relay(a)` function with fireEvent', function(){

			var a = new Element('a[text=Hello World]'), result, self;
			var div = new Element('div').inject(document.body).adopt(a).addEvent('click:relay(a)', function(){
				result = arguments[1];
				self = this;
			}).fireEvent('click:relay(a)', [null, a]);

			expect(result).toEqual(a);
			expect(self).toEqual(div);

			div.destroy();

		});

		it('Should fire click events through fireEvent and delegate when a target is passed as argument', function(){

			var a = new Element('a[text="Hello World"]'), result, self;
			var div = new Element('div').inject(document.body).adopt(a).addEvent('click:relay(a)', function(){
				result = arguments[1];
				self = this;
			}).fireEvent('click', [null, a]);

			expect(result).toEqual(a);
			expect(self).toEqual(a);

			div.destroy();

		});

		it('Should not fire click events through fireEvent when added as delegated events without an target', function(){

			var spy = jasmine.createSpy('click');
			var a = new Element('a[text="Hello World"]');
			var div = new Element('div').inject(document.body).adopt(a).addEvent('click:relay(a)', spy).fireEvent('click');

			expect(spy).not.toHaveBeenCalled();

			div.destroy();

		});

	});

});
