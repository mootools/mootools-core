Native: Element {#Element}
==========================

- Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].
- These methods are also available on window and document.

### Notes:
- Internet Explorer fires element events in random order if they are not fired by [Element:fireEvent](#Element:fireEvent).


Element Method: addEvent {#Element:addEvent}
--------------------------------------------

Attaches an event listener to a DOM element.

### Syntax:

	myElement.addEvent(type, fn);

### Arguments:

1. type - (*string*) The event name to monitor ('click', 'load', etc) without the prefix 'on'.
2. fn   - (*function*) The function to execute.

### Returns:

* (*element*) This Element.

### Examples:

##### HTML:

	<div id="myElement">Click me.</div>

##### JavaScript

	$('myElement').addEvent('click', function(){
		alert('clicked!');
	});

### Notes:

- You can stop the Event by returning false in the listener or calling [Event:stop](#Event:stop).
- This method is also attached to Document and Window.

### See Also:

- [w3schools Event Attributes](http://www.w3schools.com/html/html_eventattributes.asp)



Element Method: removeEvent {#Element:removeEvent}
--------------------------------------------------

Works as Element.addEvent, but instead removes the specified event listener.

### Syntax:

	myElement.removeEvent(type, fn);

### Arguments:

1. type - (*string*) The event name.
2. fn   - (*function*) The function to remove.

### Returns:

* (*element*) This Element.

### Examples:

#### Standard usage:

	var destroy = function(){ alert('Boom: ' + this.id); } // this refers to the Element.
	$('myElement').addEvent('click', destroy);

	// later
	$('myElement').removeEvent('click', destroy);


#### Examples with bind:

	var destroy = function(){ alert('Boom: ' + this.id); }
	var boundDestroy = destroy.bind($('anotherElement'));
	$('myElement').addEvent('click', boundDestroy);

	// later
	$('myElement').removeEvent('click', destroy); // this won't remove the event.
	$('myElement').removeEvent('click', destroy.bind($('anotherElement')); // this won't remove the event either.
	$('myElement').removeEvent('click', boundDestroy); // this is the correct way to remove the event.

### Notes:

- When the function is added using [Function:bind][] or [Function:pass][], etc, a new reference is created.  For removeEvent to work, you must pass a reference to the exact function to be removed.
- This method is also attached to Document and Window.



Element Method: addEvents {#Element:addEvents}
----------------------------------------------

The same as [Element:addEvent](#Element:addEvent), but accepts an object to add multiple events at once.

### Syntax:

	myElement.addEvents(events);

### Arguments:

1. events - (*object*) An object with key/value representing: key the event name, and value the function that is called when the Event occurs.

### Returns:

* (*element*) This Element.

### Examples:

	$('myElement').addEvents({
		'mouseover': function(){
			alert('mouseover');
		},
		'click': function(){
			alert('click');
		}
	});

### Notes:

- This method is also attached to Document and Window.

### See Also:

- [Element:addEvent](#Element:addEvent)



Element Method: removeEvents {#Element:removeEvents}
----------------------------------------------------

Removes all events of a certain type from an Element. If no argument is passed, removes all events of all types.

### Syntax:

	myElements.removeEvents([events]);

### Arguments:

1. events - (optional) if not passed removes all events from the element.
	- (*string*) The event name (e.g. 'click'). Removes all events of that type.
	- (*object*) An object of type function pairs. Like the one passed to [Element:addEvent](#Element:addEvent).

### Returns:

* (*element*) This Element.

### Examples:

	var myElement = $('myElement');
	myElement.addEvents({
		'mouseover': function(){
			alert('mouseover');
		},
		'click': function(){
			alert('click');
		}
	});

	myElement.addEvent('click', function(){ alert('clicked again'); });
	myElement.addEvent('click', function(){ alert('clicked and again :('); });
	//addEvent will keep appending each function.
	//Unfortunately for the visitor, that'll be three alerts they'll have to click on.
	myElement.removeEvents('click'); // This saves the visitor's finger by removing every click event.

### Notes:

- This method is also attached to Document and Window.

### See Also:

- [Element:removeEvent](#Element:removeEvent)

Element Method: fireEvent {#Element:fireEvent}
----------------------------------------------

Executes all events of the specified type present in the Element.

### Syntax:

	myElement.fireEvent(type[, args[, delay]]);

### Arguments:

1. type  - (*string*) The event name (e.g. 'click')
2. args  - (*mixed*, optional) Array or single object, arguments to pass to the function. If more than one argument, must be an array.
3. delay - (*number*, optional) Delay (in ms) to wait to execute the event.

### Returns:

* (*element*) This Element.

### Examples:
	// Fires all the added 'click' events and passes the Element 'anElement' after one second.
	$('myElement').fireEvent('click', $('anElement'), 1000);

### Notes:

- This will not fire the DOM Event (this concerns all inline events ie. onmousedown="..").
- This method is also attached to Document and Window.

Element Method: cloneEvents {#Element:cloneEvents}
--------------------------------------------------

Clones all events from an Element to this Element.

### Syntax:

	myElement.cloneEvents(from[, type]);

### Arguments:

1. from - (*element*) Copy all events from this Element.
2. type - (*string*, optional) Copies only events of this type. If null, copies all events.

### Returns:

* (*element*) This Element.

### Examples:

	var myElement = $('myElement');
	var myClone = myElement.clone().cloneEvents(myElement); //clones the element and its events

### Notes:

- This method is also attached to Document and Window.

### Hash: Element.Events

You can add additional custom events by adding properties (objects) to the Element.Events Hash

#### Arguments:

The Element.Events.yourproperty (object) can have:

1. base - (*string*, optional) the base event the custom event will listen to. Its not optional if condition is set.
2. condition - (*function*, optional) the condition from which we determine if the custom event can be fired. Is bound to the element you add the event to. The Event is passed in.
3. onAdd - (*function*, optional) the function that will get fired when the custom event is added. Is bound to the element you add the event to.
4. onRemove - (*function*, optional) the function that will get fired when the custom event is removed. Is bound to the element you add the event to.

#### Examples:

	Element.Events.shiftclick = {
		base: 'click', //we set a base type
		condition: function(event){ //and a function to perform additional checks.
			return (event.shift == true); //this means the event is free to fire
		}
	};

	$('myInput').addEvent('shiftclick', function(event){
		log('the user clicked the left mouse button while holding the shift key');
	});

#### Notes:

- There are different types of custom Events you can create:

 1. Custom Events with only base: they will just be a redirect to the base event.
 2. Custom Events with base and condition: they will be redirect to the base event, but only fired if the condition is met.
 3. Custom Events with onAdd and/or onRemove and any other of the above: they will also perform additional functions when the event is added/removed.

#### Warning:

If you use the condition option you NEED to specify a base type, unless you plan to overwrite a native event.
(highly unrecommended: use only when you know exactly what you're doing).

Custom Events
-------------

### Event: mouseenter

This event fires when the mouse enters the area of the DOM Element and will not be fired again if the mouse crosses over children of the Element (unlike mouseover).

#### Examples:

	$('myElement').addEvent('mouseenter', myFunction);

#### See Also:

- [Element:addEvent](#Element:addEvent)

### Event: mouseleave

This event fires when the mouse leaves the area of the DOM Element and will not be fired if the mouse crosses over children of the Element (unlike mouseout).

#### Examples:

	$('myElement').addEvent('mouseleave', myFunction);

#### See Also:

- [Element:addEvent](#Element:addEvent)

### Event: mousewheel

This event fires when the mouse wheel is rotated;

#### Examples:

	$('myElement').addEvent('mousewheel', myFunction);

#### Notes:

- This custom event just redirects DOMMouseScroll (Mozilla) to mousewheel (Opera, Internet Explorer), making it work across browsers.

#### See Also:

- [Element:addEvent](#Element:addEvent)



[$]: /Element/#dollar
[Function]: /Native/Function
[Function:bind]: /Native/Function/#Function:bind
[Function:pass]: /Native/Function/#Function:pass
[Function:delay]: /Native/Function/#Function:delay