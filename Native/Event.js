/*
Script: Event.js
	Event class

License:
	MIT-style license.
*/

/*
Class: Event
	Cross browser methods to manage events.

Arguments:
	event - the event

Properties:
	shift - true if the user pressed the shift
	control - true if the user pressed the control 
	alt - true if the user pressed the alt
	meta - true if the user pressed the meta key
	wheel - the amount of third button scrolling
	code - the keycode of the key pressed
	page.x - the x position of the mouse, relative to the full window
	page.y - the y position of the mouse, relative to the full window
	client.x - the x position of the mouse, relative to the viewport
	client.y - the y position of the mouse, relative to the viewport
	key - the key pressed as a lowercase string. key also returns 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', 'esc'. Handy for these special keys.
	target - the event target
	relatedTarget - the event related target

Example:
	(start code)
	$('myLink').onkeydown = function(event){
		var event = new Event(event);
		//event is now the Event class.
		alert(event.key); //returns the lowercase letter pressed
		alert(event.shift); //returns true if the key pressed is shift
		if (event.key == 's' && event.control) alert('document saved');
	};
	(end)
*/

var Event = new Class({

	initialize: function(event){
		event = event || window.event;
		this.event = event;
		this.type = event.type;
		this.target = event.target || event.srcElement;
		if (this.target.nodeType == 3) this.target = this.target.parentNode;
		this.shift = event.shiftKey;
		this.control = event.ctrlKey;
		this.alt = event.altKey;
		this.meta = event.metaKey;
		if (['DOMMouseScroll', 'mousewheel'].test(this.type)){
			this.wheel = event.wheelDelta ? (event.wheelDelta / (window.opera ? -120 : 120)) : -(event.detail || 0) / 3;
		} else if (this.type.test(/key/)){
			this.code = $pick(event.which, event.keyCode);
			for (var name in Event.keys){
				if (Event.keys[name] == this.code){
					this.key = name;
					break;
				}
			}
			if (this.type == 'keydown'){
				var fKey = this.code - 111;
				if (fKey > 0 && fKey < 13) this.key = 'f' + fKey;
			}
			this.key = this.key || String.fromCharCode(this.code).toLowerCase();
		} else if (this.type.test(/mouse/) || (this.type == 'click')){
			this.page = {
				'x': event.pageX || event.clientX + document.documentElement.scrollLeft,
				'y': event.pageY || event.clientY + document.documentElement.scrollTop
			};
			this.client = {
				'x': event.pageX ? event.pageX - window.pageXOffset : event.clientX,
				'y': event.pageY ? event.pageY - window.pageYOffset : event.clientY
			};
			this.rightClick = (event.which == 3) || (event.button == 2);
			switch(this.type){
				case 'mouseover': this.relatedTarget = event.relatedTarget || event.fromElement; break;
				case 'mouseout': this.relatedTarget = event.relatedTarget || event.toElement;
			}
			if (this.relatedTarget && this.relatedTarget.nodeType == 3) this.relatedTarget = this.relatedTarget.parentNode;
		}
	},

	/*
	Property: stop
		cross browser method to stop an event
	*/

	stop: function() {
		return this.stopPropagation().preventDefault();
	},

	/*
	Property: stopPropagation
		cross browser method to stop the propagation of an event
	*/

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	/*
	Property: preventDefault
		cross browser method to prevent the default action of the event
	*/

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});

Event.keys = {
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
};

Event.keys.extend = $extend;

Element.Events.extend({
/*	Section: mouseenter/mouseleave
			In addition to the standard javascript events (load, mouseover, mouseout, click, etc.) <Event.js> contains two custom events.

			mouseenter - this event fires when the mouse enters the area of the dom element; will not be fired again if the mouse crosses over children of the element (unlike mouseover)
			mouseleave - this event fires when the mouse exits the area of the dom element; will not be fired again if the mouse crosses over children of the element (unlike mouseout)

		Example usage:
			>$(myElement).addEvent('mouseenter', myFunction);
	*/
	'mouseenter': {
		type: 'mouseover',
		map: function(event){
			event = new Event(event);
			if (event.relatedTarget == this || this.hasChild(event.relatedTarget)) return;
			this.fireEvent('mouseenter', event);
		}
	},
	
	'mouseleave': {
		type: 'mouseout',
		map: function(event){
			event = new Event(event);
			if (event.relatedTarget == this || this.hasChild(event.relatedTarget)) return;
			this.fireEvent('mouseleave', event);
		}
	}
	
});

Function.extend({

	/*
	Property: bindWithEvent
		automatically passes mootools Event Class.

	Arguments:
		bind - optional, the object that the "this" of the function will refer to.
		args - optional, an argument to pass to the function; if more than one argument, it must be an array of arguments.

	Returns:
		a function with the parameter bind as its "this" and as a pre-passed argument event or window.event, depending on the browser.

	Example:
		>function myFunction(event){
		>	alert(event.client.x) //returns the coordinates of the mouse..
		>};
		>myElement.onclick = myFunction.bindWithEvent(myElement);
	*/

	bindWithEvent: function(bind, args){
		return this.create({'bind': bind, 'arguments': args, 'event': Event});
	}

});
