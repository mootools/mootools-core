/*
Script: Element.Event.js
	Contains the Event Class, Element methods to deal with Element events, custom Events.

License:
	MIT-style license.
*/

/*
Class: Event
	Cross browser class to manage events.

Arguments:
	event - (event) The event

Properties:
	shift - (boolean) True if the user pressed the shift
	control - (boolean) True if the user pressed the control
	alt - (boolean) True if the user pressed the alt
	meta - (boolean) True if the user pressed the meta key
	wheel - (integer) The amount of third button scrolling
	code - (integer) The keycode of the key pressed
	page.x - (integer) The x position of the mouse, relative to the full window
	page.y - (integer) The y position of the mouse, relative to the full window
	client.x - (integer) The x position of the mouse, relative to the viewport
	client.y - (integer) The y position of the mouse, relative to the viewport
	key - (string) The key pressed as a lowercase string. key also returns 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', 'esc'.
		Handy for these special keys.
	target - (element) The event target, not extended with <$> for performance reasons.
	relatedTarget - (element) The event related target, not extended with <$> for performance reasons.

Note:
	Accessing event.page / event.client requires an XHTML doctype.

Example:
	(start code)
	$('myLink').addEvent('keydown', function(event){
	 	// event is already the Event class, if you use el.onkeydown you have to write e = new Event(e);
		alert(event.key); //returns the lowercase letter pressed
		alert(event.shift); //returns true if the key pressed is shift
		if (event.key == 's' && event.control) alert('document saved');
	});
	(end)
*/

var Event = new Class({

	initialize: function(event){
		if (event && event.$extended) return event;
		this.$extended = true;
		event = event || window.event;
		this.event = event;
		this.type = event.type;
		this.target = event.target || event.srcElement;
		if (this.target.nodeType == 3) this.target = this.target.parentNode;

		this.shift = event.shiftKey;
		this.control = event.ctrlKey;
		this.alt = event.altKey;
		this.meta = event.metaKey;

		if (['DOMMouseScroll', 'mousewheel'].contains(this.type)){
			this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		} else if (this.type.contains('key')){
			this.code = event.which || event.keyCode;
			for (var name in Event.Keys){
				if (Event.Keys[name] == this.code){
					this.key = name;
					break;
				}
			}
			if (this.type == 'keydown'){
				var fKey = this.code - 111;
				if (fKey > 0 && fKey < 13) this.key = 'f' + fKey;
			}
			this.key = this.key || String.fromCharCode(this.code).toLowerCase();
		} else if (this.type.test(/(click|mouse|menu)/)){
			this.page = {
				'x': event.pageX || event.clientX + document.documentElement.scrollLeft,
				'y': event.pageY || event.clientY + document.documentElement.scrollTop
			};
			this.client = {
				'x': event.pageX ? event.pageX - window.pageXOffset : event.clientX,
				'y': event.pageY ? event.pageY - window.pageYOffset : event.clientY
			};
			this.rightClick = (event.which == 3) || (event.button == 2);
			switch (this.type){
				case 'mouseover': this.relatedTarget = event.relatedTarget || event.fromElement; break;
				case 'mouseout': this.relatedTarget = event.relatedTarget || event.toElement;
			}
			if (this.fixRelatedTarget.create({'bind': this, 'attempt': Client.Engine.gecko})() === false) this.relatedTarget = this.target;
		}
		return this;
	},

	/*
	Property: stop
		Stop an Event from propagating and also executes preventDefault
	*/

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	/*
	Property: stopPropagation
		Cross browser method to stop the propagation of an event (will not allow the event to bubble up through the DOM)
	*/

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	/*
	Property: preventDefault
		Cross browser method to prevent the default action of the event
	*/

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	},

	fixRelatedTarget: function(){
		var rel = this.relatedTarget;
		if (rel && rel.nodeType == 3) this.relatedTarget = rel.parentNode;
	}

});

/*
Property: keys
	You can add additional Event keys codes this way:

Example:
	(start code)
	Event.Keys.whatever = 80;
	$('myInput').addEvent('keydown', function(event){
		if (event.key == 'whatever') alert('whatever key clicked').
	});
	(end)
*/

Event.Keys = new Abstract({
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
	These methods are also available on window and document.
*/

Element.Setters.events = function(events){
	this.addEvents(events);
};

Client.expand({

	/*
	Property: addEvent
		Attaches an event listener to a DOM element.
		The listener has the instance of the Event class as first argument.
		You can stop the Event by returning false in the listener or calling <Event.stop>.

	Arguments:
		type - (string) [required] The event name to monitor ('click', 'load', etc) without the prefix 'on'.
		fn - (funtion) [required] The function to execute.
		nativeType - (number) [optional] Overrides automated native Event check, not needed in most situations. Can be 0, 1 or 2:
			0: Event is added without native event listener, can be fired only with <Element.fireEvent>
			1: Event function is attached with <Element.addListener> to the Element as native event.
			2: Like 1, but listener also receives the Event instance and can be stopped with return false;

	Example:
		>$('myElement').addEvent('click', function(){ alert('clicked!'); });
	*/

	addEvent: function(type, fn, nativeType){
		this.$events = this.$events || {};
		if (!this.$events[type]) this.$events[type] = {'keys': [], 'values': []};
		if (this.$events[type].keys.contains(fn)) return this;
		this.$events[type].keys.push(fn);
		var realType = type;
		var custom = Element.Events[type];
		var map = fn;
		if (custom){
			if (custom.add) custom.add.call(this, fn);
			if (custom.map){
				map = function(event){
					if (custom.map.call(this, event)) return fn.call(this, event);
					return false;
				};
			}
			if (custom.type) realType = custom.type;
		}
		var defn = fn;
		if (!$defined(nativeType)) nativeType = Element.$events[realType] || 0;
		if (nativeType){
			if (nativeType == 2){
				var self = this;
				defn = function(event){
					event = new Event(event);
					if (map.call(self, event) === false) event.stop();
				};
			} else if (!this.addEventListener){
				defn = defn.bind(this);
			}
			this.addListener(realType, defn);
		}
		this.$events[type].values.push(defn);
		return this;
	},

	/*
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.

	Arguments:
		type - (string) [required] The event name.
		fn - (funtion) [required] The function to remove.

	Note:
		When the function was added using <Function.bind> or <Function.pass> a new reference
		was created and you can not use removeEvent with the original function.

	Example:
		Standard usage:
		(start code)
		var destroy = function(){ alert('Boom: ' + this.id); } // this is the element
		$('myElement').addEvent('click', destroy);
		// later in the code
		$('myElement').removeEvent('click', destroy);
		(end)

		Example with bind:
		(start code)
		var destroy = function(){ alert('Boom: ' + this.id); } // this is the element
		var destroy2 = destroy.bind($('anotherElement'));
		$('myElement').addEvent('click', destroy2); // this is now another element
		// later in the code
		$('myElement').removeEvent('click', destroy); // DOES NOT WORK
		$('myElement').removeEvent('click', destroy.bind($('anotherElement')); // DOES ALSO NOT WORK
		$('myElement').removeEvent('click', destroy2); // Finally, this works
		(end)
	*/

	removeEvent: function(type, fn){
		if (!this.$events || !this.$events[type]) return this;
		var pos = this.$events[type].keys.indexOf(fn);
		if (pos == -1) return this;
		var key = this.$events[type].keys.splice(pos, 1)[0];
		var value = this.$events[type].values.splice(pos, 1)[0];
		var custom = Element.Events[type];
		if (custom){
			if (custom.remove) custom.remove.call(this, fn);
			if (custom.type) type = custom.type;
		}
		return (Element.$events[type]) ? this.removeListener(type, value) : this;
	},

	/*
	Property: addEvents
		As <addEvent>, but accepts an object and add multiple events at once.
	*/

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	/*
	Property: removeEvents
		Removes all events of a certain type from an element. if no argument is passed in, removes all events.

	Arguments:
		type - (string) [required] The event name (e.g. 'click')
	*/

	removeEvents: function(type){
		if (!this.$events) return this;
		if (!type){
			for (var evType in this.$events) this.removeEvents(evType);
			this.$events = null;
		} else if (this.$events[type]){
			while (this.$events[type].keys[0]) this.removeEvent(type, this.$events[type].keys[0]);
			this.$events[type] = null;
		}
		return this;
	},

	/*
	Property: fireEvent
		Executes all events of the specified type present in the element.

	Arguments:
		type - (string) [required] The event name (e.g. 'click')
		args - (mixed) [optional] Array or single object, arguments to pass to the function; if more than one argument, must be an array.
		delay - (integer) [optional] Delay (in ms) to wait to execute the event.
	*/

	fireEvent: function(type, args, delay){
		if (this.$events && this.$events[type]){
			$A(this.$events[type].keys).each(function(fn){
				fn.create({'bind': this, 'delay': delay, 'arguments': args})();
			}, this);
		}
		return this;
	},

	/*
	Property: cloneEvents
		Clones all events from an element to this element.

	Arguments:
		from - (element) [required] Copy all events from this element.
		type - (string) [optional] Copies only events of this type.
	*/

	cloneEvents: function(from, type){
		if (!from.$events) return this;
		if (!type){
			for (var evType in from.$events) this.cloneEvents(from, evType);
		} else if (from.$events[type]){
			from.$events[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.$events = {
	'click': 2, 'dblclick': 2, 'mouseup': 2, 'mousedown': 2, //mouse buttons
	'mousewheel': 2, 'DOMMouseScroll': 2, //mouse wheel
	'mouseover': 2, 'mouseout': 2, 'mousemove': 2, //mouse movement
	'keydown': 2, 'keypress': 2, 'keyup': 2, //keys
	'contextmenu': 2, 'submit': 2, //misc
	'load': 1, 'unload': 1, 'beforeunload': 1, 'resize': 1, 'move': 1, 'DOMContentLoaded': 1, 'readystatechange': 1, //window
	'focus': 1, 'blur': 1, 'change': 1, 'reset': 1, 'select': 1, //forms elements
	'error': 1, 'abort': 1, 'scroll': 1 //misc
};

/* Section: Custom Events */

Element.Events = new Abstract({

	/*
	Event: mouseenter
		In addition to the standard javascript events (load, mouseover, mouseout, click, etc.) <Event.js> contains two custom events
		this event fires when the mouse enters the area of the dom element;
		will not be fired again if the mouse crosses over children of the element (unlike mouseover)

	Example:
		>$(myElement).addEvent('mouseenter', myFunction);
	*/

	'mouseenter': {
		type: 'mouseover',
		map: function(event){
			var related = event.relatedTarget;
			return (related && related != this && !this.hasChild(related));
		}
	},

	/*
	Event: mouseleave
		This event fires when the mouse exits the area of the dom element; will not be fired again if the mouse crosses over children of the element (unlike mouseout)

	Example:
		>$(myElement).addEvent('mouseleave', myFunction);
	*/

	'mouseleave': {
		type: 'mouseout',
		map: function(event){
			var related = event.relatedTarget;
			return (related && related != this && !this.hasChild(related));
		}
	},

	'mousewheel': {
		type: (Client.Engine.gecko) ? 'DOMMouseScroll' : 'mousewheel'
	}

});