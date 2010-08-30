/*
Script: Element.Event.js
	Behavior Spec for new Element.Event

License:
	MIT-style license.
*/

describe('Element.Event', function(){
	
	it('Should trigger the click event', function(){

		var callback = jasmine.createSpy(), called = false;

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


		Syn.click({}, el, function(){
			called = true;
		});

		waitsFor(2, function(){
			return called;
		});
		
		runs(function(){
			expect(callback).toHaveBeenCalled();
			el.destroy();
		});	

	});
	
	it('Should watch for a key-down event', function(){
		
		var callback = jasmine.createSpy(), called = false;

		var listener = function(event){
			called = true;
			if (event.key == 'esc') callback();
		};
		
		var body = document.body;
		
		body.addEvent('keydown', listener);
		
		Syn.key('escape', body, function(){
			called = true;
		});
		
		waitsFor(2, function(){
			return called;
		});

		runs(function(){
			expect(callback).toHaveBeenCalled();
			body.removeEvent('keydown', listener);
		});

	});

});