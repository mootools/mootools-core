/*
---
name: Element.Event Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

describe('Custom Event Extensions', function(){
	// This is private API. Do not use.

	it('should allow base to be a function', function(){
		var called;
		var callback = jasmine.createSpy();

		Element.Events.myClick = {
			base: function(){
				return 'click';
			}
		};

		var div = new Element('div').addEvent('myClick', callback).inject(document.body);

		simulateEvent('click', [{}, div], function(){
			expect(callback).toHaveBeenCalled();
			div.destroy();
		});
	});

	it('should pass the name of the custom event to the callbacks', function(){
		var callbacks = 0;
		var callback = jasmine.createSpy();

		var fn = function(anything, type){
			expect(type).toEqual('customEvent');
			callbacks++;
		}
		Element.Events.customEvent = {

			base: function(type){
				expect(type).toEqual('customEvent');
				return 'click';
			},

			condition: function(event, type){
				fn(null, type);
				return true;
			},

			onAdd: fn,
			onRemove: fn

		};

		var div = new Element('div').addEvent('customEvent', callback).inject(document.body);

		simulateEvent('click', [{}, div], function(){
			expect(callback).toHaveBeenCalled();
			div.removeEvent('customEvent', callback).destroy();
			expect(callbacks).toEqual(3);
		});
	});

});
