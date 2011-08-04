/*
---
name: Element.Event Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/
describe('Element.Event', function(){
	
	// Restore native fireEvent in IE for Syn
	var createElement = function(tag, props){
		var el = document.createElement(tag),
			fireEvent = el.fireEvent;
		
		$(el);
		el.fireEvent = fireEvent;
		return el.set(props);
	};

	it('Should trigger the click event', function(){
		
		var callback = jasmine.createSpy();

		var el = createElement('a', {
			text: 'test',
			styles: {
				display: 'block',
				overflow: 'hidden',
				height: '1px'
			},
			events: {
				click: callback
			}
		}).inject(document.body);

		simulateEvent('click', [{}, el], function(){
			expect(callback).toHaveBeenCalled();
			el.destroy();
		});

	});

	// Only run this spec in browsers other than IE6-8 because they can't properly simulate key events
	it('Should watch for a key-down event', function(){
		
		var callback = jasmine.createSpy('keydown');

		var div = createElement('div').addEvent('keydown', function(event){
			callback(event.key);
		}).inject(document.body);

		simulateEvent('key', ['escape', div], function(){
			expect(callback).toHaveBeenCalledWith('esc');
			div.destroy();
		});

	});

	it('should clone events of an element', function(){

		var calls = 0;

		var element = new Element('div').addEvent('click', function(){ calls++; });
		element.fireEvent('click');

		expect(calls).toBe(1);

		var clone = new Element('div').cloneEvents(element, 'click');
		clone.fireEvent('click');

		expect(calls).toBe(2);

		element.addEvent('custom', function(){ calls += 2; }).fireEvent('custom');

		expect(calls).toBe(4);

		clone.cloneEvents(element);
		clone.fireEvent('click');

		expect(calls).toBe(5);

		clone.fireEvent('custom');

		expect(calls).toBe(7);
	});

});
