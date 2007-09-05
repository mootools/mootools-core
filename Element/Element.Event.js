/*
Script: Element.Event.js
	Contains the Event Class, Element methods to deal with Element events, custom Events.

License:
	MIT-style license.
*/

/*
Class: Event
	Cross browser Class to manage Events.

Syntax:
	>var myEvent = new Event([event]);

Arguments:
	event - (event, optional) An Event that needs to be extended.

Properties:
	shift         - (boolean) True if the user pressed the shift
	control       - (boolean) True if the user pressed the control
	alt           - (boolean) True if the user pressed the alt
	meta          - (boolean) True if the user pressed the meta key
	wheel         - (number) The amount of third button scrolling
	code          - (number) The keycode of the key pressed
	page.x        - (number) The x position of the mouse, relative to the full window
	page.y        - (number) The y position of the mouse, relative to the full window
	client.x      - (number) The x position of the mouse, relative to the viewport
	client.y      - (number) The y position of the mouse, relative to the viewport
	key           - (string) The key pressed as a lowercase string. key also returns 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', 'esc'.
	target        - (element) The event target, not extended with <$> for performance reasons.
	relatedTarget - (element) The event related target, not extended with <$> for performance reasons.

Example:
	[javascript]
		$('myLink').addEvent('keydown', function(event){
		 	// event is already the Event class, if you use el.onkeydown you have to write e = new Event(e);
			alert(event.key); //returns the lowercase letter pressed
			alert(event.shift); //returns true if the key pressed is shift
			if (event.key == 's' && event.control) alert('document saved');
		});
	[/javascript]

Note:
	Accessing event.page / event.client requires an XHTML doctype.
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
	Method: stop
		Stop an Event from propagating and also executes preventDefault.

	Syntax:
		>myEvent.stop();

	Returns:
		(class) This Event instance.

	Example:
		HTML:
		[html]
			<a id="myAnchor" href="http://google.com/">Visit Google.com</a>
		[/html]

		[javascript]
			$('myAnchor').addEvent('click', function(event){
				event.stop(); // prevent the user from leaving the site.
				this.setText("Where do you think you're going?"); //'this' is Element that fire's the Event.

				(function(){
					this.setText("Instead visit the Blog.").setProperty('href', 'http://blog.mootools.net');
				}).delay(500, this);
			});
		[/javascript]

	Note:
		Returning false within the function can also stop the propagation of the Event.

	See Also:
		<Element.addEvent>, <Event.stopPropagation>, <Event.preventDefault>, <Function.delay>
	*/

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	/*
	Method: stopPropagation
		Cross browser method to stop the propagation of an event (will not allow the event to bubble up through the DOM).

	Syntax:
		>myEvent.stopPropagation();

	Returns:
		(class) This Event object.

	Example:
		HTML:
		[html]
			<!-- #myChild does not cover the same area as myElement. Therefore, the 'click' differs from parent and child depending on the click location. -->
			<div id="myElement">
				<div id="myChild"></div>
			</div>
		[/html]

		[javascript]
			$('myElement').addEvent('click', function(){
				alert('click');
				return false; // equivalent to stopPropagation.
			});

			$('myChild').addEvent('click', function(event){
				event.stopPropagation(); // this will prevent the event to bubble up, and fire the parent's click event.
			});
		[/javascript]

	See Also:
		<Element.addEvent>, <http://developer.mozilla.org/en/docs/DOM:event.stopPropagation>
	*/

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	/*
	Method: preventDefault
		Cross browser method to prevent the default action of the event.

	Syntax:
		>myEvent.preventDefault();

	Returns:
		(class) This Event object.

	Example:
		HTML:
		[html]
			<!-- credits: mozilla.org/en/docs/DOM:event.preventDefault -->
			<form>
				<input id="myCheckbox" type="checkbox" />
			</form>
		[/html]

		[javascript]
			$('myCheckbox').addEvent('click', function(event){
				event.preventDefault(); // will not allow the checkbox to be "checked"
			});
		[/javascript]

	See Also:
		<Element.addEvent>, <http://developer.mozilla.org/en/docs/DOM:event.preventDefault>
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
Property: Keys
	You can add additional Event keys codes this way:

Example:
	[javascript]
		Event.Keys.whatever = 80;
		$('myInput').addEvent('keydown', function(event){
			if (event.key == 'whatever') alert('whatever key clicked').
		});
	[/javascript]
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
	Method: addEvent
		Attaches an event listener to a DOM element.

	Syntax:
		>myElement.addEvent(type, fn[, nativeType]);

	Arguments:
		type       - (string) The event name to monitor ('click', 'load', etc) without the prefix 'on'.
		fn         - (funtion) The function to execute.
		nativeType - (number, optional) Overrides automated native Event check, not needed in most situations.

		nativeType (continued):
			number - (number) Can be:
				0: Event is added without native event listener, can be fired only with <Element.fireEvent>
				1: Event function is attached with <Element.addListener> to the Element as native event.
				2: Like 1, but listener also receives the Event instance and can be stopped with return false;

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement">Click me.</div>
		[/html]

		[javascript]
			$('myElement').addEvent('click', function(){ alert('clicked!'); });
		[/javascript]

	Note:
		You can stop the Event by returning false in the listener or calling <Event.stop>.

	See Also:
		<http://www.w3schools.com/html/html_eventattributes.asp>
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
	Method: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.

	Syntax:
		>myElement.removeEvent(type, fn);

	Arguments:
		type - (string) The event name.
		fn   - (funtion) The function to remove.

	Returns:
		(element) This Element.

	Examples:
		Standard usage:
		[javascript]
			var destroy = function(){ alert('Boom: ' + this.id); } // this is the Element
			$('myElement').addEvent('click', destroy);
			// later in the code
			$('myElement').removeEvent('click', destroy);
		[/javascript]

		Example with bind:
		[javascript]
			var destroy = function(){ alert('Boom: ' + this.id); } // this is the Element
			var destroy2 = destroy.bind($('anotherElement'));
			$('myElement').addEvent('click', destroy2); // this is now another Element
			// later in the code
			$('myElement').removeEvent('click', destroy); // DOES NOT WORK
			$('myElement').removeEvent('click', destroy.bind($('anotherElement')); // DOES ALSO NOT WORK
			$('myElement').removeEvent('click', destroy2); // Finally, this works
		[/javascript]

	Note:
		When the function was added using <Function.bind> or <Function.pass> a new reference
		was created and you can not use removeEvent with the original function.
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
	Method: addEvents
		As <addEvent>, but accepts an object and add multiple events at once.

	Syntax:
		>myElement.addEvents(events);

	Arguments:
		events - (object) An object with key/value representing: key the event name, and value the function that is called when the Event occurs.

	Returns:
		(element) This Element.

	Example:
		[javascript]
			$('myElement').addEvents({
				'mouseover': function(){
					alert('mouse over');
				},
				'click': function(){
					alert('clicked');
				}
			});
		[/javascript]

	See Also:
		<Element.addEvent>
	*/

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	/*
	Method: removeEvents
		Removes all events of a certain type from an Element. If no argument is passed in, removes all events.

	Syntax:
		>myElements.removeEvents([type]);

	Arguments:
		type - (string, optional) The event name (e.g. 'click'). If null, removes all events.

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var myElement = $('myElement');
			myElement.addEvents({
				'mouseover': function(){
					alert('mouse over');
				},
				'click': function(){
					alert('clicked');
				}
			});

			myElement.addEvent('click': function(){ alert('clicked again'); });
			myElement.addEvent('click': function(){ alert('clicked and again :('); });
			// addEvent will keep appending each function. Unfortunately for the visitors, that'll be three alerts they'll receive.

			myElement.removeEvents('click'); //ahhh saved the visitor's finger.
		[/javascript]

	See Also:
		<Element.removeEvent>
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
	Method: fireEvent
		Executes all events of the specified type present in the Element.

	Syntax:
		>myElement.fireEvent(type[, args[, delay]]);

	Arguments:
		type  - (string) The event name (e.g. 'click')
		args  - (mixed, optional) Array or single object, arguments to pass to the function. If more than one argument, must be an array.
		delay - (number, optional) Delay (in ms) to wait to execute the event.

	Returns:
		(element) This Element.

	Example:
		[javascript]
			$('myElement').fireEvent('click', $('anElement'), 1000);  // Fires all the added 'click' events and passes the element 'anElement' after 1 sec.
		[/javascript]

	Note:
		This will not fire the DOM Event (this concerns all inline events ie. onmousedown="..").
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
	Method: cloneEvents
		Clones all events from an Element to this Element.

	Syntax:
		>myElement.cloneEvents(from[, type]);

	Arguments:
		from - (element) Copy all events from this Element.
		type - (string, optional) Copies only events of this type. If null, copies all events.

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var myElement = $('myElement');
			var myClone = myElement.clone().cloneEvents(myElement); //clones the element and its events
		[/javascript]
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
		In addition to the standard javascript events (load, mouseover, mouseout, click, etc.) <Event.js> contains two custom events this event fires when the mouse enters the area of the dom Element and will not be fired again if the mouse crosses over children of the Element (unlike mouseover).

	Example:
		[javascript]
			$('myElement').addEvent('mouseenter', myFunction);
		[/javascript]

	See Also:
		<Element.addEvent>
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
		This event fires when the mouse exits the area of the dom Element; will not be fired again if the mouse crosses over children of the Element (unlike mouseout).

	Example:
		[javascript]
			$('myElement').addEvent('mouseleave', myFunction);
		[/javascript]

	See Also:
		<Element.addEvent>
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
