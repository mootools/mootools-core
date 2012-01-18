/*
---
name: Element.Event Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

(function(){

// Restore native fireEvent in IE for Syn
var createElement = function(tag, props){
	var el = new Element(tag);
	if (el._fireEvent) el.fireEvent = el._fireEvent;
	return el.set(props);
};

describe('Element.Event + DOMEvent', function(){

	it('Should trigger the click event and prevent the default behavior', function(){

		var callback = jasmine.createSpy('Element.Event click with prevent');

		var el = createElement('a', {
			text: 'test',
			styles: {
				display: 'block',
				overflow: 'hidden',
				height: '1px'
			},
			events: {
				click: function(event){
					event.preventDefault();
					callback();
				}
			}
		}).inject(document.body);

		Syn.trigger('click', null, el);

		expect(callback).toHaveBeenCalled();
		el.destroy();

	});

});

describe('Element.Event', function(){
	// This is private API. Do not use.

	it('should pass the name of the custom event to the callbacks', function(){
		var callbacks = 0;
		var callback = jasmine.createSpy('Element.Event custom');

		var fn = function(anything, type){
			expect(type).toEqual('customEvent');
			callbacks++;
		}
		Element.Events.customEvent = {

			base: 'click',

			condition: function(event, type){
				fn(null, type);
				return true;
			},

			onAdd: fn,
			onRemove: fn

		};

		var div = createElement('div').addEvent('customEvent', callback).inject(document.body);

		Syn.trigger('click', null, div);

		expect(callback).toHaveBeenCalled();
		div.removeEvent('customEvent', callback).destroy();
		expect(callbacks).toEqual(3);
	});

});

describe('Element.Event.change', function(){

	it('should not fire "change" for any property', function(){
		var callback = jasmine.createSpy('Element.Event.change');

		var input = new Element('input', {
			'type': 'radio',
			'class': 'someClass',
			'checked': 'checked'
		}).addEvent('change', callback).inject(document.body);

		input.removeClass('someClass');
		expect(callback).not.toHaveBeenCalled();

		var text = new Element('input', {
			'type': 'text',
			'class': 'otherClass',
			'value': 'text value'
		}).addEvent('change', callback).inject(document.body);

		text.removeClass('otherClass');
		expect(callback).not.toHaveBeenCalled();

		[input, text].invoke('destroy');
	});

});

})();
