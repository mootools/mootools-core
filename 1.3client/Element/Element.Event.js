/*
---
name: Element.Event Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

describe('Element.Event', function(){

	var fragment = document.createDocumentFragment();
	// Restore native fireEvent in IE for Syn
	var createElement = function(tag, props){
		var el = new Element(tag);
		el.fireEvent = el._fireEvent;
		return el.set(props);
	};

	it('Should trigger the click event', function(){

		var callback = jasmine.createSpy('Element.Event click');

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

		Syn.trigger('click', null, el);

		expect(callback).toHaveBeenCalled();
		el.destroy();
	});

	// Only run this spec in browsers other than IE6-8 because they can't properly simulate key events
	it('Should watch for a key-down event', function(){

		var callback = jasmine.createSpy('keydown');

		var div = createElement('div').addEvent('keydown', function(event){
			callback(event.key);
		}).inject(document.body);

		Syn.key('escape', div);

		expect(callback).toHaveBeenCalledWith('esc');
		div.destroy();
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
