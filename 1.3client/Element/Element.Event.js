/*
Script: Element.Event.js
	Behavior Spec for new Element.Event

License:
	MIT-style license.
*/

describe('Element.Event', function(){
	
	it('Should trigger the click event', function(){
		
		var callback = jasmine.createSpy();

		var el = new Element('a', {
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
	
	it('Should watch for a key-down event', function(){
		
		var pressed = jasmine.createSpy(),
			called = false,
		
		callback = function(event){
			called = true;
			if (event.key == 'esc') pressed();
		},
		
		body = document.body;
		
		body.addEvent('keydown', callback);
		
		Syn.key('escape', body);
		
		waitsFor(2, function(){
			return called;
		});
		
		runs(function(){
			expect(pressed).toHaveBeenCalled();
			body.removeEvent('keydown', callback);
		});	
		
	});

});