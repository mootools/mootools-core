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
		};
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

		var radio = new Element('input', {
			'type': 'radio',
			'class': 'someClass',
			'checked': 'checked'
		}).addEvent('change', callback).inject(document.body);

		radio.removeClass('someClass');
		expect(callback).not.toHaveBeenCalled();

		var checkbox = new Element('input', {
			'type': 'checkbox',
			'class': 'someClass',
			'checked': 'checked'
		}).addEvent('change', callback).inject(document.body);

		checkbox.removeClass('someClass');
		expect(callback).not.toHaveBeenCalled();

		var text = new Element('input', {
			'type': 'text',
			'class': 'otherClass',
			'value': 'text value'
		}).addEvent('change', callback).inject(document.body);

		text.removeClass('otherClass');
		expect(callback).not.toHaveBeenCalled();

		[radio, checkbox, text].invoke('destroy');
	});

});

describe('Element.Event keyup with f<key>', function(){

	it('should pass event.key == f2 when pressing f2 on keyup and keydown', function(){

		var keydown = jasmine.createSpy('keydown');
		var keyup = jasmine.createSpy('keyup');

		var div = createElement('div')
			.addEvent('keydown', function(event){
				keydown(event.key);
			})
			.addEvent('keyup', function(event){
				keyup(event.key);
			})
			.inject(document.body);

		Syn.trigger('keydown', 'f2', div);
		Syn.trigger('keyup', 'f2', div);

		expect(keydown).toHaveBeenCalledWith('f2');
		expect(keyup).toHaveBeenCalledWith('f2');

		div.destroy();

	});

});

})();
