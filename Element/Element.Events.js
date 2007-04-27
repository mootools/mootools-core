/*
Script: Element.Events.js
	Contains Element prototypes to deal with Element events.

License:
	MIT-style license.
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.eventMethods = {

	/*
	Property: addEvent
		Attaches an event listener to a DOM element.

	Arguments:
		type - the event to monitor ('click', 'load', etc) without the prefix 'on'.
		fn - the function to execute

	Example:
		>$('myElement').addEvent('click', function(){alert('clicked!')});
	*/

	addEvent: function(type, fn){
		this.$events = this.$events || {};
		this.$events[type] = this.$events[type] || {'keys': [], 'values': []};
		if (this.$events[type].keys.contains(fn)) return this;
		this.$events[type].keys.push(fn);
		var realType = type;
		var bound = false;
		if (Element.Events[type]){
			if (Element.Events[type].add) Element.Events[type].add.call(this, fn);
			if (Element.Events[type].map) bound = Element.Events[type].map.bindAsEventListener(this);
			realType = Element.Events[type].type || type;
		}
		if (!this.addEventListener) bound = bound || fn.bindAsEventListener(this);
		else bound = bound || fn;
		this.$events[type].values.push(bound);
		return this.addListener(realType, bound);
	},

	/*
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.
	*/

	removeEvent: function(type, fn){
		if (!this.$events || !this.$events[type]) return this;
		var pos = this.$events[type].keys.indexOf(fn);
		if (pos == -1) return this;
		var key = this.$events[type].keys.splice(pos,1)[0];
		var value = this.$events[type].values.splice(pos,1)[0];
		if (Element.Events[type]){
			if (Element.Events[type].remove) Element.Events[type].remove.call(this, fn);
			type = Element.Events[type].type || type;
		}
		return this.removeListener(type, value);
	},

	/*
	Property: addEvents
		As <addEvent>, but accepts an object and add multiple events at once.
	*/

	addEvents: function(source){
		return Element.setMany(this, 'addEvent', source);
	},

	/*
	Property: removeEvents
		removes all events of a certain type from an element. if no argument is passed in, removes all events.

	Arguments:
		type - string; the event name (e.g. 'click')
	*/

	removeEvents: function(type){
		if (!this.$events) return this;
		if (!type){
			for (var evType in this.$events) this.removeEvents(evType);
			this.$events = null;
		} else if (this.$events[type]){
			this.$events[type].keys.each(function(fn){
				this.removeEvent(type, fn);
			}, this);
			this.$events[type] = null;
		}
		return this;
	},

	/*
	Property: fireEvent
		executes all events of the specified type present in the element.

	Arguments:
		type - string; the event name (e.g. 'click')
		args - array or single object; arguments to pass to the function; if more than one argument, must be an array
		delay - (integer) delay (in ms) to wait to execute the event
	*/

	fireEvent: function(type, args, delay){
		if (this.$events && this.$events[type]){
			this.$events[type].keys.each(function(fn){
				fn.create({'bind': this, 'delay': delay, 'arguments': args})();
			}, this);
		}
		return this;
	}

};

Element.Events.extend({

	'mousewheel': {
		type: (window.gecko) ? 'DOMMouseScroll' : 'mousewheel'
	},

	'unload': {
		add: function(fn){
			window.removeListener('unload', Garbage.empty).addListener.delay(1, window, ['unload', Garbage.empty]);
		}
	}

});

window.extend(Element.eventMethods);
document.extend(Element.eventMethods);
Element.extend(Element.eventMethods);