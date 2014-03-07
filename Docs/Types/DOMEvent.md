Type: DOMEvent {#Event}
====================

MooTools DOMEvent Methods.

DOMEvent Method: constructor {#DOMEvent:constructor}
----------------------------------------------------

### Syntax:

	new DOMEvent([event[, win]]);

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
* key           - (*string*) The key pressed as a lowercase string. key can be 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'tab', 'delete', and 'esc'.
* shift         - (*boolean*) True if the user pressed the shift key.
* control       - (*boolean*) True if the user pressed the control key.
* alt           - (*boolean*) True if the user pressed the alt key.
* meta          - (*boolean*) True if the user pressed the meta key.

### Examples:

	$('myLink').addEvent('keydown', function(event){
	 	// the passed event parameter is already an instance of the Event type.
		alert(event.key);   // returns the lowercase letter pressed.
		alert(event.shift); // returns true if the key pressed is shift.
		if (event.key == 's' && event.control) alert('Document saved.'); //executes if the user presses Ctr+S.
	});

### Notes:

- Accessing event.page / event.client requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).
- Every event added with addEvent gets the MooTools method automatically, without the need to manually instance it.
- `event.key` is only reliable with `keydown` or `keyup` events. See [PPK](http://www.quirksmode.org/js/keys.html).

DOMEvent Method: stop {#DOMEvent:stop}
--------------------------------------

Stop an event from propagating and also executes preventDefault.

### Syntax:

	myEvent.stop();

### Returns:

* (*object*) This DOMEvent instance.

### Examples:

##### HTML:

	<a id="myAnchor" href="http://google.com/">Visit Google.com</a>

##### JavaScript

	$('myAnchor').addEvent('click', function(event){
		event.stop(); //Prevents the browser from following the link.
		this.set('text', 'Where do you think you\'re going?'); //'this' is Element that fires the Event.
		(function(){
			this.set('text', 'Instead visit the Blog.').set('href', 'http://blog.mootools.net');
		}).delay(500, this);
	});

### Notes:

- Returning false within the function can also stop the propagation of the Event.

### See Also:

- [Element.addEvent](#Element:addEvent), [DOMEvent.stopPropagation](#DOMEvent:stopPropagation), [DOMEvent.preventDefault](#DOMEvent:preventDefault), [Function:delay][]


DOMEvent Method: stopPropagation {#DOMEvent:stopPropagation}
------------------------------------------------------------

Cross browser method to stop the propagation of an event (this stops the event from bubbling up through the DOM).

### Syntax:

	myEvent.stopPropagation();

### Returns:

* (*object*) This DOMEvent object.

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
- [MDN event.stopPropagation][]


DOMEvent Method: preventDefault {#DOMEvent:preventDefault}
--------------------------------------------

Cross browser method to prevent the default action of the event.

### Syntax:

	myEvent.preventDefault();

### Returns:

* (*object*) This DOMEvent object.

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
- [MDN event.preventDefault][]


Function: DOMEvent.defineKey {#DOMEvent:DOMEvent-defineKey}
-----------------------------------------------------------

This function allows to add an additional event key code.

#### Example:

	DOMEvent.defineKey(16, 'shift');
    $('myInput').addEvent('keydown', function(event){
	    if (event.key == 'shift') alert('You pressed shift.');
    });

#### Predefined keys:

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


Function: DOMEvent.defineKeys {#DOMEvent:DOMEvent-defineKey}
-----------------------------------------------------------

This function allows to add additional event key codes.

#### Example:

	DOMEvent.defineKeys({
		'16': 'shift',
		'17': 'control'
	});
    $('myInput').addEvent('keydown', function(event){
	    if (event.key == 'control') alert('You pressed control.');
    });


[Element:addEvent]: /core/Element/Element.Event#Element:addEvent
[Function]: /core/Types/Function
[Function:bind]: /core/Types/Function/#Function:bind
[Function:pass]: /core/Types/Function/#Function:pass
[Function:delay]: /core/Types/Function/#Function:delay
[MooTools More Keyboard]: /more/Interface/Keyboard

[MDN event.stopPropagation]: https://developer.mozilla.org/en/DOM/event.stopPropagation
[MDN event.preventDefault]: https://developer.mozilla.org/en/DOM/event.preventDefault
