/*
---
name: Element.Event
requires: ~
provides: ~
...
*/

(function(){

var Local = Local || {};

var fire = 'fireEvent',
	create = function(){
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

		expect(Local.called).to.equal(1);
	});

	it('should add multiple Events to the Class', function(){
		create().addEvents({
			event1: Local.fn,
			event2: Local.fn
		})[fire]('event1')[fire]('event2');

		expect(Local.called).to.equal(2);
	});

	it('should remove a specific method for an event', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn)[fire]('event');

		expect(x).to.equal(1);
		expect(Local.called).to.equal(0);
	});

	it('should remove an event and its methods', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event', Local.fn).addEvent('event', fn).removeEvents('event')[fire]('event');

		expect(x).to.equal(0);
		expect(Local.called).to.equal(0);
	});

	it('should remove all events', function(){
		var object = create();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event1', Local.fn).addEvent('event2', fn).removeEvents();
		object[fire]('event1')[fire]('event2');

		// Should not fail.
		object.removeEvents()[fire]('event1')[fire]('event2');

		expect(x).to.equal(0);
		expect(Local.called).to.equal(0);
	});

	it('should remove events with an object', function(){
		var object = create();
		var events = {
			event1: Local.fn,
			event2: Local.fn
		};

		object.addEvent('event1', function(){ Local.fn(); }).addEvents(events)[fire]('event1');
		expect(Local.called).to.equal(2);

		object.removeEvents(events);
		object[fire]('event1');
		expect(Local.called).to.equal(3);

		object[fire]('event2');
		expect(Local.called).to.equal(3);
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
		expect(methods).to.eql([1, 2]);

		object[fire]('event');
		expect(methods).to.eql([1, 2, 1, 2]);
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
		expect(methods).to.eql([1, 2, 3]);

		object[fire]('event');
		expect(methods).to.eql([1, 2, 3, 3]);
	});

});

// Restore native fireEvent in IE for Syn.
var createElement = function(tag, props){
	var el = new Element(tag);
	if (el._fireEvent) el.fireEvent = el._fireEvent;
	return el.set(props);
};

describe('Element.Event', function(){

	it('Should trigger the click event', function(){
		var callback = sinon.spy();

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

		syn.trigger(el, 'click');

		expect(callback.called).to.equal(true);
		el.destroy();
	});

	it('Should trigger the click event and prevent the default behavior', function(){
		var callback = sinon.spy();

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

		syn.trigger(el, 'click');

		expect(callback.called).to.equal(true);
		el.destroy();
	});

	var ddescribe = (window.postMessage && !navigator.userAgent.match(/phantomjs/i)) ? describe : xdescribe;
	ddescribe('(async)', function(){

		beforeEach(function(done){
			this.message = null;
			this.spy = sinon.spy();
			var self = this;
			window.addEvent('message', function(e){
				self.message = e.event.data;
				self.spy();
			});
			window.postMessage('I am a message from outer space...', '*');
			setTimeout(done, 150);
		});

		it('Should trigger a message event', function(){
			expect(this.spy.called).to.equal(true);
			expect(this.message).to.equal('I am a message from outer space...');
		});

	});

	it('Should watch for a key-down event', function(){
		var callback = sinon.spy();

		var div = createElement('div').addEvent('keydown', function(event){
			callback(event.key);
		}).inject(document.body);

		syn.key(div, 'a');

		expect(callback.calledWith('a')).to.equal(true);
		div.destroy();
	});

	it('should clone events of an element', function(){
		var calls = 0;

		var element = new Element('div').addEvent('click', function(){ calls++; });
		element.fireEvent('click');

		expect(calls).to.equal(1);

		var clone = new Element('div').cloneEvents(element, 'click');
		clone.fireEvent('click');

		expect(calls).to.equal(2);

		element.addEvent('custom', function(){ calls += 2; }).fireEvent('custom');

		expect(calls).to.equal(4);

		clone.cloneEvents(element);
		clone.fireEvent('click');

		expect(calls).to.equal(5);

		clone.fireEvent('custom');

		expect(calls).to.equal(7);
	});

});

describe('Element.Event', function(){
	// This is private API. Do not use.

	it('should pass the name of the custom event to the callbacks', function(){
		var callbacks = 0;
		var callback = sinon.spy();

		var fn = function(anything, type){
			expect(type).to.equal('customEvent');
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

		syn.trigger(div, 'click');

		expect(callback.called).to.equal(true);
		div.removeEvent('customEvent', callback).destroy();
		expect(callbacks).to.equal(3);
	});

});

describe('Element.Event.change', function(){

	it('should not fire "change" for any property', function(){
		var callback = sinon.spy();

		var radio = new Element('input', {
			'type': 'radio',
			'class': 'someClass',
			'checked': 'checked'
		}).addEvent('change', callback).inject(document.body);

		radio.removeClass('someClass');
		expect(callback.called).to.equal(false);

		var checkbox = new Element('input', {
			'type': 'checkbox',
			'class': 'someClass',
			'checked': 'checked'
		}).addEvent('change', callback).inject(document.body);

		checkbox.removeClass('someClass');
		expect(callback.called).to.equal(false);

		var text = new Element('input', {
			'type': 'text',
			'class': 'otherClass',
			'value': 'text value'
		}).addEvent('change', callback).inject(document.body);

		text.removeClass('otherClass');
		expect(callback.called).to.equal(false);

		[radio, checkbox, text].invoke('destroy');
	});

});

describe('Element.Event keyup with f<key>', function(){

	it('should pass event.key == f2 when pressing f2 on keyup and keydown', function(){
		var keydown = sinon.spy();
		var keyup = sinon.spy();

		var div = createElement('div')
			.addEvent('keydown', function(event){
				keydown(event.key);
			})
			.addEvent('keyup', function(event){
				keyup(event.key);
			})
			.inject(document.body);

		syn.trigger(div, 'keydown', 'f2');
		syn.trigger(div, 'keyup', 'f2');

		expect(keydown.calledWith('f2')).to.equal(true);
		expect(keyup.calledWith('f2')).to.equal(true);

		div.destroy();
	});

});

describe('Keypress key code', function(){

//<ltIE8>
	// Return early for IE8- because Syn.js does not fire events.
	if (!document.addEventListener) return;
//</ltIE8>

	var _input, _key, _shift;
	DOMEvent.defineKey(33, 'pageup');

	function keyHandler(e){
		_key = e.key;
		_shift = !!e.event.shiftKey;
	}

	function typeWriter(action, cb){
		_input = new Element('input', {
			'type': 'text',
			'id': 'keyTester'
		}).addEvent('keypress', keyHandler).inject(document.body);

		setTimeout(function(){
			syn.type('keyTester', action);
			setTimeout(function(){
				cb(_key, _shift);
			}, 50);
		}, 1);
	}

	afterEach(function(){
		_input.removeEvent('keypress', keyHandler).destroy();
	});

	it('should return "enter" in event.key', function(done){
		typeWriter('[enter]', function(key, shift){
			expect(key).to.equal('enter');
			expect(shift).to.equal(false);
			done();
		});
	});

	it('should return "1" in event.key', function(done){
		typeWriter('1', function(key, shift){
			expect(key).to.equal('1');
			expect(shift).to.equal(false);
			done();
		});
	});

	it('should return "!" when pressing SHIFT + 1', function(done){
		typeWriter('[shift]![shift-up]', function(key, shift){
			expect(key).to.equal('!');
			expect(shift).to.equal(true);
			done();
		});
	});

	it('should map code 33 correctly with keypress event', function(){
		var mock = {type: 'keypress', which: 33, shiftKey: true};
		var e = new DOMEvent(mock);
		expect(e.key).to.equal('!');
	});

});

describe('Element.removeEvent', function(){

	it('should remove the onunload method', function(){
		var text;
		var handler = function(){ text = 'nope'; };
		window.addEvent('unload', handler);
		window.removeEvent('unload', handler);
		window.fireEvent('unload');
		expect(text).to.equal(undefined);
	});

});

describe('relatedTarget', function(){

	var outer = new Element('div');
	new Element('div').inject(outer);
	['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].each(function(event, i){
		it('should listen to a ' + event + ' event and set the correct relatedTarget', function(){
			var mockEvent = {type: event};
			mockEvent[(i % 2 == 0 ? 'from' : 'to') + 'Element'] = outer; // Simulate FF that does not set relatedTarget.

			var e = new DOMEvent(mockEvent);
			expect(e.type).to.equal(event);
			expect(e.relatedTarget).to.equal(outer);
		});
	});

});

describe('Mouse wheel', function(){

	function attachProperties(e, direction){
		e.detail = 1 * direction;
		e.wheelDelta = 1 * direction;
		e.deltaY = -1 * direction;
	}

	function dispatchFakeWheel(type, wheelDirection){

		var event;
		try {
			// Firefox
			event = document.createEvent('MouseEvents');
			event.initMouseEvent(type, true, true, window, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
			attachProperties(event, wheelDirection);
			window.dispatchEvent(event);
		} catch (e){}

		try {
			// Chrome, PhantomJS, Safari
			event = document.createEvent('WheelEvent');
			event.initMouseEvent(type, 0, 100, window, 0, 0, 0, 0, null, null, null, null);
			attachProperties(event, wheelDirection);
			window.dispatchEvent(event);
		} catch (e){}

		try {
			// IE9
			event = document.createEvent('HTMLEvents');
			event.initEvent(type, true, false);
			attachProperties(event, wheelDirection);
			window.dispatchEvent(event);
		} catch (e){}

		try {
			// IE10+, Safari
			event = document.createEvent('MouseEvents');
			event.initEvent(type, true, true);
			attachProperties(event, wheelDirection);
			window.dispatchEvent(event);
		} catch (e){}

		try {
			// IE8
			event = document.createEventObject();
			document.documentElement.fireEvent(type, event);
		} catch (e){}
	}

	var triggered = false;
	var wheel = false;
	var testWheel = !!window.addEventListener;
	var callback = function(e){
		if (e.wheel) wheel = e.wheel > 0 ? 'wheel moved up' : 'wheel moved down';
		triggered = true;
	};

	beforeEach(function(){
		wheel = triggered = false;
		window.addEvent('mousewheel', callback);
		document.documentElement.addEvent('mousewheel', callback);
	});

	afterEach(function(){
		window.removeEvent('mousewheel', callback);
		document.documentElement.removeEvent('mousewheel', callback);
	});

	it('should trigger/listen to mousewheel event', function(){
		// http://jsfiddle.net/W6QrS/3

		['mousewheel', 'wheel', 'DOMMouseScroll' ].each(dispatchFakeWheel);
		expect(triggered).to.equal(true);
	});

	it('should listen to mouse wheel direction', function(){
		// http://jsfiddle.net/58yCr/

		if (!testWheel) return;

		// Fire event with wheel going up.
		['mousewheel', 'wheel', 'DOMMouseScroll' ].each(function(type){
			dispatchFakeWheel(type, 120);
		});
		expect(wheel).to.equal('wheel moved up');
		wheel = false;

		// Fire event with wheel going down.
		['mousewheel', 'wheel', 'DOMMouseScroll' ].each(function(type){
			dispatchFakeWheel(type, -120);
		});
		expect(wheel).to.equal('wheel moved down');
	});

});

})();
