Type: Event {#Event}
====================

MooTools Event Methods.

Event Method: constructor {#Event:constructor}
----------------------------------------------

### Syntax:

	new Event([event[, win]]);

### Arguments:

1. event - (*event*, required) An HTMLEvent Object.
2. win   - (*window*, optional: defaults to window) The context of the event.

#### Properties:

* page.x        - (*number*) The x position of the mouse, relative to the full window.
* page.y        - (*number*) The y position of the mouse, relative to the full window.
* client.x      - (*number*) The x position of the mouse, relative to the viewport.
* client.y      - (*number*) The y position of the mouse, relative to the viewport.
* rightClick	- (*boolean*) True if the user clicked the right mousebutton
* wheel         - (*number*) The amount of third button scrolling.
* relatedTarget - (*element*) The event related target.
* target        - (*element*) The event target.
* code          - (*number*) The keycode of the key pressed.
* key           - (*string*) The key pressed as a lowercase string. key can be 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', and 'esc'.
* shift         - (*boolean*) True if the user pressed the shift key.
* control       - (*boolean*) True if the user pressed the control key.
* alt           - (*boolean*) True if the user pressed the alt key.
* meta          - (*boolean*) True if the user pressed the meta key.

### Examples:

	$('myLink').addEvent('keydown', function(event){
	 	// the passed event parameter is already an instance of the Event class.
		alert(event.key);   // returns the lowercase letter pressed.
		alert(event.shift); // returns true if the key pressed is shift.
		if (event.key == 's' && event.control) alert('Document saved.'); //executes if the user presses Ctr+S.
	});

### Notes:

- Accessing event.page / event.client requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).
- Every event added with addEvent gets the MooTools method automatically, without the need to manually instance it.


Event Method: stop {#Event:stop}
--------------------------------

Stop an Event from propagating and also executes preventDefault.

### Syntax:

	myEvent.stop();

### Returns:

* (*object*) This Event instance.

### Examples:

##### HTML:

	<a id="myAnchor" href="http://google.com/">Visit Google.com</a>

##### JavaScript

	$('myAnchor').addEvent('click', function(event){
		event.stop(); //Prevents the browser from following the link.
		this.set('text', 'Where do you think you\'re going?'); //'this' is Element that fires the Event.
		(function(){
			this.set('text','Instead visit the Blog.').set('href', 'http://blog.mootools.net');
		}).delay(500, this);
	});

### Notes:

- Returning false within the function can also stop the propagation of the Event.

### See Also:

- [Element.addEvent](#Element:addEvent), [Element.stopPropagation](#Event:stopPropagation), [Event.preventDefault](#Event:preventDefault), [Function:delay][]



Event Method: stopPropagation {#Event:stopPropagation}
------------------------------------------------------

Cross browser method to stop the propagation of an event (this stops the event from bubbling up through the DOM).

### Syntax:

	myEvent.stopPropagation();

### Returns:

* (*object*) This Event object.

### Examples:

"#myChild" does not cover the same area as myElement. Therefore, the 'click' differs from parent and child depending on the click location:

##### HTML:

	<div id="myElement">
		<div id="myChild"></div>
	</div>

##### JavaScript

	$('myElement').addEvent('click', function(){
		alert('click');
		return false; //equivalent to stopPropagation.
	});
	$('myChild').addEvent('click', function(event){
		event.stopPropagation(); //prevents the event from bubbling up, and fires the parent's click event.
	});

### See Also:

- [Element:addEvent][]
- [MDC event.stopPropagation][]



Event Method: preventDefault {#Event:preventDefault}
----------------------------------------------------

Cross browser method to prevent the default action of the event.

### Syntax:

	myEvent.preventDefault();

### Returns:

* (*object*) This Event object.

### Examples:

##### HTML:

	<form>
		<input id="myCheckbox" type="checkbox" />
	</form>

##### JavaScript

	$('myCheckbox').addEvent('click', function(event){
		event.preventDefault(); //prevents the checkbox from being "checked".
	});

### See Also:

- [Element:addEvent][]
- [MDC event.preventDefault][]


Object: Event.Keys {#Event-Keys}
==============================

Additional Event key codes can be added by adding properties to the Event.Keys Object.

#### Example:

    Event.Keys.shift = 16;
    $('myInput').addEvent('keydown', function(event){
	    if (event.key == 'shift') alert('You pressed shift.');
    });

#### Possible Keys:

- enter
- up
- down
- left
- right
- esc
- space
- backspace
- tab
- delete

### See Also:

- [MooTools More Keyboard][]

### Note:

Since MooTools 1.3 this is a native JavaScript Object and not an instance of the deprecated Hash


[Element:addEvent]: /core/Element/Element.Event#Element:addEvent
[Function]: /core/Types/Function
[Function:bind]: /core/Types/Function/#Function:bind
[Function:pass]: /core/Types/Function/#Function:pass
[Function:delay]: /core/Types/Function/#Function:delay
[MooTools More Keyboard]: /more/Interface/Keyboard

[MDC event.stopPropagation]: https://developer.mozilla.org/en/DOM/event.stopPropagation
[MDC event.preventDefault]: https://developer.mozilla.org/en/DOM/event.preventDefault
