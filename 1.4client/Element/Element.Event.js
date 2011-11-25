/*
---
name: Element.Event Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

describe('Element.Event + DOMEvent', function(){

	// Restore native fireEvent in IE for Syn
	var createElement = function(tag, props){
		var el = $(document.createElement(tag));
		el.fireEvent = el._fireEvent;
		return el.set(props);
	};

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

		Syn.click({}, el, function(){
			expect(callback).toHaveBeenCalled();
			el.destroy();
		});

	});

});

describe('Element.Event', function(){
	// This is private API. Do not use.

	// Restore native fireEvent in IE for Syn
	var createElement = function(tag, props){
		var el = document.createElement(tag),
			fireEvent = el.fireEvent;

		$(el);
		el.fireEvent = fireEvent;
		return el.set(props);
	};

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

		Syn.click({}, div, function(){
			expect(callback).toHaveBeenCalled();
			div.removeEvent('customEvent', callback).destroy();
			expect(callbacks).toEqual(3);
		});
	});

});
