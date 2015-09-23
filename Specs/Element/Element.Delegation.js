/*
---
name: Element.Delegation
requires: ~
provides: ~
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

			var spy = sinon.spy();
			var a = new Element('a[text="Hello World"]');
			var div = new Element('div').inject(document.body).adopt(a).addEvent('click:relay(a)', spy).fireEvent('click');

			expect(spy.called).toBe(false);

			div.destroy();

		});

	});

	describe('removeEvent', function(){

		describe('submit', function(){

			it('should remove nicely', function(){
				var element = new Element('div', {
					html: '<div><form><input type="text"></form></div>'
				});

				var input = element.getElement('input');
				var listener = function(){};

				element.addEvent('submit:relay(form)', listener);

				// IE8, fireEvent on the observer element. This adds the
				// submit event to the <form> element.
				element.fireEvent('focusin', [{target: input}, input]);

				// remove element, which also removes the form
				element.getElement('div').destroy();

				// now removing the event, should remove the submit event from the
				// form, but it's not there anymore, so it may not throw an error.
				element.removeEvent('submit:relay(form)', listener);

			});

		});

	});

});
