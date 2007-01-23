/*
Script: Event.js
	Event class

Authors:
	- Valerio Proietti, <http://mad4milk.net>
	- Michael Jackson, <http://ajaxon.com/michael>

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
		this.event = event || window.event;
		this.type = this.event.type;
		this.target = this.event.target || this.event.srcElement;
		if (this.target.nodeType == 3) this.target = this.target.parentNode; // Safari
		this.shift = this.event.shiftKey;
		this.control = this.event.ctrlKey;
		this.alt = this.event.altKey;
		this.meta = this.event.metaKey;
		if (['DOMMouseScroll', 'mousewheel'].test(this.type)){
			this.wheel = this.event.wheelDelta ? (this.event.wheelDelta / (window.opera ? -120 : 120)) : -(this.event.detail || 0) / 3;
		} else if (this.type.test(/key/)){
			this.code = this.event.which || this.event.keyCode;
			for (var name in Event.keys){
				if (Event.keys[name] == this.code){
					this.key = name;
					break;
				}
			}
			this.key = this.key || String.fromCharCode(this.code).toLowerCase();

		} else if (this.type.test(/mouse/) || (this.type == 'click')){
			this.page = {
				'x': this.event.pageX || this.event.clientX + document.documentElement.scrollLeft,
				'y': this.event.pageY || this.event.clientY + document.documentElement.scrollTop
			};
			this.client = {
				'x': this.event.pageX ? this.event.pageX - window.pageXOffset : this.event.clientX,
				'y': this.event.pageY ? this.event.pageY - window.pageYOffset : this.event.clientY
			};
			this.rightClick = (this.event.which == 3) || (this.event.button == 2);
			switch (this.type){
				case 'mouseover': this.relatedTarget = this.event.relatedTarget || this.event.fromElement; break;
				case 'mouseout': this.relatedTarget = this.event.relatedTarget || this.event.toElement;
			}
		}
	},

	/*
	Property: stop
		cross browser method to stop an event
	*/

	stop: function() {
		this.stopPropagation();
		this.preventDefault();
		return this;
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
	'delete': 46
};

Function.extend({

	/*
	Property: bindWithEvent
		automatically passes mootools Event Class.

	Arguments:
		bind - optional, the object that the "this" of the function will refer to.

	Returns:
		a function with the parameter bind as its "this" and as a pre-passed argument event or window.event, depending on the browser.

	Example:
		>function myFunction(event){
		>	alert(event.clientx) //returns the coordinates of the mouse..
		>};
		>myElement.onclick = myFunction.bindWithEvent(myElement);
	*/

	bindWithEvent: function(bind, args){
		return this.create({'bind': bind, 'arguments': args, 'event': Event});
	}

});
