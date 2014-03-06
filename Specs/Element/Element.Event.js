/*
---
name: Element.Event
requires: ~
provides: ~
...
*/

(function(){

var Local = Local || {};

var fire = 'fireEvent', create = function(){
	return new Element('div');
};

describe('Events API: Element', function(){

	beforeEach(function(){
		Local.called = 0;
		Local.fn = function(){
			return Local.called++;
		};
	});

	it('should add an Event to the Class', function(){
		var object = create();

		object.addEvent('event', Local.fn)[fire]('event');

		expect(Local.called).toEqual(1);
	});

	it('should add multiple Events to the Class', function(){
		create().addEvents({
			event1: Local.fn,
			event2: Local.fn
		})[fire]('event1')[fire]('event2');

		expect(Local.called).toEqual(2);
	});

	it('should remove a specific method for an event', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn)[fire]('event');

		expect(x).toEqual(1);
		expect(Local.called).toEqual(0);
	});

	it('should remove an event and its methods', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event', Local.fn).addEvent('event', fn).removeEvents('event')[fire]('event');

		expect(x).toEqual(0);
		expect(Local.called).toEqual(0);
	});

	it('should remove all events', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event1', Local.fn).addEvent('event2', fn).removeEvents();
		object[fire]('event1')[fire]('event2');

		// Should not fail
		object.removeEvents()[fire]('event1')[fire]('event2');

		expect(x).toEqual(0);
		expect(Local.called).toEqual(0);
	});

	it('should remove events with an object', function(){
		var object = create();
		var events = {
			event1: Local.fn,
			event2: Local.fn
		};

		object.addEvent('event1', function(){ Local.fn(); }).addEvents(events)[fire]('event1');
		expect(Local.called).toEqual(2);

		object.removeEvents(events);
		object[fire]('event1');
		expect(Local.called).toEqual(3);

		object[fire]('event2');
		expect(Local.called).toEqual(3);
	});

	it('should remove an event immediately', function(){
		var object = create();

		var methods = [];

		var three = function(){
			methods.push(3);
		};

		object.addEvent('event', function(){
			methods.push(1);
			this.removeEvent('event', three);
		}).addEvent('event', function(){
			methods.push(2);
		}).addEvent('event', three);

		object[fire]('event');
		expect(methods).toEqual([1, 2]);

		object[fire]('event');
		expect(methods).toEqual([1, 2, 1, 2]);
	});

	it('should be able to remove itself', function(){
		var object = create();

		var methods = [];

		var one = function(){
			object.removeEvent('event', one);
			methods.push(1);
		};
		var two = function(){
			object.removeEvent('event', two);
			methods.push(2);
		};
		var three = function(){
			methods.push(3);
		};

		object.addEvent('event', one).addEvent('event', two).addEvent('event', three);

		object[fire]('event');
		expect(methods).toEqual([1, 2, 3]);

		object[fire]('event');
		expect(methods).toEqual([1, 2, 3, 3]);
	});

});

var fragment = document.createDocumentFragment();

// Restore native fireEvent in IE for Syn
var createElement = function(tag, props){
	var el = new Element(tag);
	if (el._fireEvent) el.fireEvent = el._fireEvent;
	return el.set(props);
};

describe('Element.Event', function(){

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

	// Only run this spec in browsers other than IE6-8 because they can't properly simulate key events
	it('Should watch for a key-down event', function(){

		var callback = jasmine.createSpy('keydown');

		var div = createElement('div').addEvent('keydown', function(event){
			callback(event.key);
		}).inject(document.body);

		Syn.key('a', div);

		expect(callback).toHaveBeenCalledWith('a');
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

describe('Element.removeEvent', function(){

	it('should remove the onunload method', function(){
		var text;
		var handler = function(){ text = 'nope'; };
		window.addEvent('unload', handler);
		window.removeEvent('unload', handler);
		window.fireEvent('unload');
		expect(text).toBe(undefined);
	});


});

})();
