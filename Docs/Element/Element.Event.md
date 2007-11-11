[$]: /Element/#dollar
[Function]: /Native/Function

Element.Event
-------------

Contains Element methods to deal with Element events, and custom Events.

Class: Event {#Element.Event}
=============================

Cross browser Class to manage Events.

### Syntax:

	new Event([event[, win]]);

### Arguments:

1. event - (event) An HTMLEvent Object.
2. win   - (window, optional: defaults to window) The context of the event.

#### Properties:

* shift         - (boolean) True if the user pressed the shift
* control       - (boolean) True if the user pressed the control
* alt           - (boolean) True if the user pressed the alt
* meta          - (boolean) True if the user pressed the meta key
* wheel         - (number) The amount of third button scrolling
* code          - (number) The keycode of the key pressed
* page.x        - (number) The x position of the mouse, relative to the full window
* page.y        - (number) The y position of the mouse, relative to the full window
* client.x      - (number) The x position of the mouse, relative to the viewport
* client.y      - (number) The y position of the mouse, relative to the viewport
* key           - (string) The key pressed as a lowercase string. key also returns 'enter', 'up', 'down', 'left', 'right', 'space', 'backspace', 'delete', 'esc'.
* target        - (element) The event target, not extended with <$> for performance reasons.
* relatedTarget - (element) The event related target, NOT 'extended' with <$>.

### Example:

	$('myLink').addEvent('keydown', function(event){
	 	// event is already the Event class, if you use el.onkeydown you have to write e = new Event(e);
		alert(event.key); //returns the lowercase letter pressed
		alert(event.shift); //returns true if the key pressed is shift
		if (event.key == 's' && event.control) alert('document saved');
	});

### Note:

- Accessing event.page / event.client requires an XHTML doctype.

#### Hash: Event.Keys

You can add additional Event keys codes by adding properties to the Event.Keys Hash:

#### Example:

	Event.Keys.whatever = 80;
	$('myInput').addEvent('keydown', function(event){
		if (event.key == 'whatever') alert('whatever key clicked');
	});

Event Method: stop {#Element.Event:stop}
----------------------------------------

Stop an Event from propagating and also executes preventDefault.

###	Syntax:

	myEvent.stop();

### Returns:

* (object) This Event instance.

###	Example:

##### HTML:

	<a id="myAnchor" href="http://google.com/">Visit Google.com</a>

##### Javascript

	$('myAnchor').addEvent('click', function(event){
		event.stop(); // prevent the user from leaving the site.
		this.setText("Where do you think you're going?"); //'this' is Element that fire's the Event.
			(function(){
			this.setText("Instead visit the Blog.").set('href', 'http://blog.mootools.net');
		}).delay(500, this);
	});

###	Note:

- Returning false within the function can also stop the propagation of the Event.

### See Also:

- [Element.addEvent](#Element:addEvent), [Element.stopPropagation](#Event:stopPropagation), [Event.preventDefault](#Event:preventDefault), [Function.delay](#Function:delay)

Event Method: stopPropagation {#Element.Event:stopPropagation}
--------------------------------------------------------------

Cross browser method to stop the propagation of an event (will not allow the event to bubble up through the DOM).

###	Syntax:

	myEvent.stopPropagation();

###	Returns:

* (object) This Event object.

###	Example:

##### HTML:

	<!-- #myChild does not cover the same area as myElement. Therefore, the 'click' differs from parent and child depending on the click location. -->
	<div id="myElement">
		<div id="myChild"></div>
	</div>

##### Javascript

	$('myElement').addEvent('click', function(){
		alert('click');
		return false; // equivalent to stopPropagation.
	});
		$('myChild').addEvent('click', function(event){
		event.stopPropagation(); // this will prevent the event to bubble up, and fire the parent's click event.
	});

###	See Also:

- [Element.addEvent](#Element:addEvent), <http://developer.mozilla.org/en/docs/DOM:event.stopPropagation>

Event Method: preventDefault {#Element.Event:preventDefault}
------------------------------------------------------------

Cross browser method to prevent the default action of the event.

###	Syntax:

	myEvent.preventDefault();

### Returns:

* (object) This Event object.

###	Example:

##### HTML:

	<!-- credits: mozilla.org/en/docs/DOM:event.preventDefault -->
	<form>
		<input id="myCheckbox" type="checkbox" />
	</form>

##### Javascript

	$('myCheckbox').addEvent('click', function(event){
		event.preventDefault(); // will not allow the checkbox to be "checked"
	});

### See Also:

- [Element.addEvent](#Element:addEvent), <http://developer.mozilla.org/en/docs/DOM:event.preventDefault>

Native: Element {#Element}
==========================

- Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
- These methods are also available on window and document.

Element Method: addEvent {#Element:addEvent}
--------------------------------------------

Attaches an event listener to a DOM element.

###	Syntax:

	myElement.addEvent(type, fn[, nativeType]);

###	Arguments:

1. type - (string) The event name to monitor ('click', 'load', etc) without the prefix 'on'.
2. fn   - (funtion) The function to execute.

###	Returns:

* (element) This Element.

### Example:

##### HTML:

	<div id="myElement">Click me.</div>

##### Javascript

	$('myElement').addEvent('click', function(){ alert('clicked!'); });

### Notes:

- You can stop the Event by returning false in the listener or calling [Event.stop](#Event:stop).
- This method is also attached to Document and Window.

###	See Also:

- <http://www.w3schools.com/html/html_eventattributes.asp>

Element Method: removeEvent {#Element:removeEvent}
--------------------------------------------------

Works as Element.addEvent, but instead removes the previously added event listener.

###	Syntax:

	myElement.removeEvent(type, fn);

###	Arguments:

1. type - (string) The event name.
2. fn   - (funtion) The function to remove.

###	Returns:

* (element) This Element.

###	Examples:

#### Standard usage:

	var destroy = function(){ alert('Boom: ' + this.id); } // this is the Element
	$('myElement').addEvent('click', destroy);
	// later in the code
	$('myElement').removeEvent('click', destroy);


#### Example with bind:

	var destroy = function(){ alert('Boom: ' + this.id); } // this is the Element
	var destroy2 = destroy.bind($('anotherElement'));
	$('myElement').addEvent('click', destroy2); // this is now another Element

	// later in the code
	$('myElement').removeEvent('click', destroy); // DOES NOT WORK
	$('myElement').removeEvent('click', destroy.bind($('anotherElement')); // DOES ALSO NOT WORK
	$('myElement').removeEvent('click', destroy2); // Finally, this works

###	Notes:

- When the function was added using [Function.bind] (#Function:bind) or [Function.pass] (#Function:pass) a new reference was created and you can not use removeEvent with the original function.
- This method is also attached to Document and Window.

Element Method: addEvents {#Element:addEvents}
----------------------------------------------

As [Element.addEvent](#Element:addEvent), but accepts an object and add multiple events at once.

###	Syntax:

	myElement.addEvents(events);

###	Arguments:

1. events - (object) An object with key/value representing: key the event name, and value the function that is called when the Event occurs.

###	Returns:

*(element) This Element.

###	Example:

	$('myElement').addEvents({
		'mouseover': function(){
			alert('mouse over');
		},
		'click': function(){
			alert('clicked');
		}
	});

###	Note:

- This method is also attached to Document and Window.

###	See Also:

- [Element.addEvent](#Element:addEvent)

Element Method: removeEvents {#Element:removeEvents}
----------------------------------------------------

Removes all events of a certain type from an Element. If no argument is passed in, removes all events.

###	Syntax:

	myElements.removeEvents([type]);

###	Arguments:

1. type - (string, optional) The event name (e.g. 'click'). If null, removes all events.

###	Returns:

* (element) This Element.

###	Example:

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

###	Note:

- This method is also attached to Document and Window.

###	See Also:

- [Element.removeEvent](#Element:removeEvent)

Element Method: fireEvent {#Element:fireEvent}
----------------------------------------------

Executes all events of the specified type present in the Element.

###	Syntax:

	myElement.fireEvent(type[, args[, delay]]);

###	Arguments:

1. type  - (string) The event name (e.g. 'click')
2. args  - (mixed, optional) Array or single object, arguments to pass to the function. If more than one argument, must be an array.
3. delay - (number, optional) Delay (in ms) to wait to execute the event.

###	Returns:

* (element) This Element.

###	Example:

	$('myElement').fireEvent('click', $('anElement'), 1000);  // Fires all the added 'click' events and passes the element 'anElement' after 1 sec.

###	Notes:

- This will not fire the DOM Event (this concerns all inline events ie. onmousedown="..").
- This method is also attached to Document and Window.

Element Method: cloneEvents {#Element:cloneEvents}
--------------------------------------------------

Clones all events from an Element to this Element.

###	Syntax:

	myElement.cloneEvents(from[, type]);

###	Arguments:

1. from - (element) Copy all events from this Element.
2. type - (string, optional) Copies only events of this type. If null, copies all events.

###	Returns:

* (element) This Element.

###	Example:

	var myElement = $('myElement');
	var myClone = myElement.clone().cloneEvents(myElement); //clones the element and its events

###	Note:

This method is also attached to Document and Window.

### Hash: Element.Events

You can add additional custom events by adding properties (objects) to the Element.Events Hash

#### Arguments:
The Element.Events.yourproperty (object) can have:

1. base - (string, optional) the base event the custom event will listen to. Its not optional if condition is set.
2. condition - (function, optional) the condition from which we determine if the custom event can be fired. Is bound to the element you add the event to. The Event is passed in.
3. onAdd - (function, optional) the function that will get fired when the custom event is added. Is bound to the element you add the event to.
4. onRemove - (function, optional) the function that will get fired when the custom event is removed. Is bound to the element you add the event to.

#### Example:

	Element.Events.shiftclick = {
		base: 'click', //we set a base type
		condition: function(event){ //and a function to perform additional checks.
			return (event.shift == true); //this means the event is free to fire
		}
	}

	$('myInput').addEvent('shiftclick', function(event){
		log('the user clicked the left mouse button while holding the shift key');
	});

#### Note:

- There are different types of custom Events you can create:

- Custom Events with only base: they will just be a redirect to the base event.
- Custom Events with base and condition: they will be redirect to the base event, but only fired if the condition is met.
- Custom Events with onAdd and/or onRemove and any other of the above: they will also perform additional functions when the event is added/removed.

#### Warning:

If you use the condition option you NEED to specify a base type, unless you plan to overwrite a native event
(highly unrecommended: use only when you know exactly what you're doing).

### Custom Events

#### Event: mouseenter

This event fires when the mouse enters the area of the dom Element and will not be fired again if the mouse crosses over children of the Element (unlike the broken mouseover).

#### Example:

	$('myElement').addEvent('mouseenter', myFunction);

#### See Also:

- [Element.addEvent](#Element:addEvent)

#### Event: mousewheel

This event fires when the mouse wheel is rotated;

#### Example:

	$('myElement').addEvent('mousewheel', myFunction);

#### Note:

This custom event just redirects DOMMouseScroll (mozilla) to mousewheel (opera, internet explorer), making it crossbrowser.

#### See Also:

- [Element.addEvent](#Element:addEvent)


#### Event: domready

Executes a function when the dom tree is loaded, without waiting for images. Only works when called from window.

### Arguments:

* fn - (function) The function to execute when the DOM is ready.

### Example:

	window.addEvent('domready', function(){
		alert('the dom is ready');
	});

### Credits:

- (c) Dean Edwards/Matthias Miller/John Resig, remastered for MooTools.