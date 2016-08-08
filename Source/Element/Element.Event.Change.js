/*
---

name: Element.Event.Change

description: Contains Element methods for normalizing change events across browsers.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event.Change

...
*/

(function(){

if (!window.addEventListener) {
	var update = function(event){
		event.target.store('$change:last', {
			type: event.type,
			value: event.target.checked
		});
	};

	Element.Events._change = {
		base: 'change'
	};

	Element.Events.change = {
		base: 'click',
		condition: function(event){
			var target = event.target, type = target.get('type'), last = target.retrieve('$change:last', {});
			if (type == 'text' || 'textarea select'.test(target.get('tag'))) return event.type == 'change';
			if (type == 'radio' && last.type != 'mousedown' && target.retrieve('$change:key', '').match(/up|down|left|right/)) return true;	
			return target.checked != last.value;
		},
		onAdd: function(fn){
			var events = {
				keydown: update,
				mousedown: update,
				_change: function(event){
					if (!'radio checkbox'.test(event.target.type)) fn.call(this, event);
				},
				keyup: function(event) {
					event.target.store('$change:key', event.key);
					return event.code != 16 && event.key != 'tab';
				}
			};
			this.store('$change:events', events).addEvents(events);
		},
		onRemove: function(){
			this.removeEvents(this.retrieve('$change:events')).eliminate('$change:events');
		}
	}
}

})();
