Native: Event {#Event}
======================

MooTools Event Methods.


Event Method: constructor {#Event:constructor}
----------------------------------------------

### Syntax:

	new Event([event[, win]]);

### Arguments:

1. event - (*event*) An HTMLEvent Object.
2. win   - (*window*, optional: defaults to window) The context of the event.

#### Properties:

* shift         - (*boolean*) True if the user pressed the shift key.
* control       - (*boolean*) True if the user pressed the control key.
* alt           - (*boolean*) True if the user pressed the alt key.
* meta          - (*boolean*) True if the user pressed the meta key.
* wheel         - (*number*) The amount of third button scrolling.
* code          - (*number*) The keycode of the key pressed.
* page.x        - (*number*) The x position of the mouse, relative to the full window.
* page.y        - (*number*) The y position of the mouse, relative to the full window.
* client.x      - (*number*) The x position of the mouse, relative to the viewport.
* client.y      - (*number*) The y position of the mouse, relative to the viewport.
* key           - (*string*) The key pressed as a lowercase string. key can be 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', and 'esc'.
* target        - (*element*) The event target, not extended with [$][] for performance reasons.
* relatedTarget - (*element*) The event related target, NOT `extended` with [$][].

### Examples:

	$('myLink').addEvent('keydown', function(event){
	 	//The passed event parameter is already an instance of the Event class.
		alert(event.key);   //Returns the lowercase letter pressed.
		alert(event.shift); //Returns true if the key pressed is shift.
		if (event.key == 's' && event.control) alert('Document saved.'); //Executes if the user hits Ctr+S.
	});

### Notes:

- Accessing event.page / event.client requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).
- Every event added with addEvent gets the mootools method automatically, without the need to manually instance it.


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
		this.set('text', "Where do you think you're going?"); //'this' is Element that fires the Event.
		(function(){
			this.set('text', "Instead visit the Blog.").set('href', 'http://blog.mootools.net');
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
		return false; // equivalent to stopPropagation.
	});
		$('myChild').addEvent('click', function(event){
		event.stopPropagation(); // this will prevent the event to bubble up, and fire the parent's click event.
	});

### See Also:

- [Element:addEvent](#Element:addEvent)
- [MDC event.stopPropagation](http://developer.mozilla.org/en/docs/DOM:event.stopPropagation)



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
		event.preventDefault(); //Will prevent the checkbox from being "checked".
	});

### See Also:

- [Element:addEvent](#Element:addEvent)
- [MDC event.preventDefault](http://developer.mozilla.org/en/docs/DOM:event.preventDefault)


Hash: Event.Keys {#Event-Keys}
==============================

Additional Event key codes can be added by adding properties to the Event.Keys Hash.

#### Example:

    Event.Keys.shift = 16;
    $('myInput').addEvent('keydown', function(event){
	    if (event.key == "shift") alert("You pressed shift.");
    });



[$]: /Element/#dollar
[Function]: /Native/Function
[Function:bind]: /Native/Function/#Function:bind
[Function:pass]: /Native/Function/#Function:pass
[Function:delay]: /Native/Function/#Function:delay