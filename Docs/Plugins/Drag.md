Class: Drag {#Drag}
===================

Enables the modification of two CSS properties of an Element based on the position of the mouse while the mouse button is down.

### Implements:

[Events][], [Chain](/Class/Class.Extras#Options)


Drag Method: constructor {#Drag:constructor}
--------------------------------------------

### Syntax:

	var myDragInstance = new Drag(el[, options]);

### Arguments:

1. el      - (*element*) The Element to apply the transformations to.
2. options - (*object*, optional) The options object.

### Options:

* grid      - (*integer*: defaults to false) Distance in pixels for snap-to-grid dragging.
* handle    - (*element*: defaults to the element passed in) The Element to act as the handle for the draggable element.
* invert    - (*boolean*: defaults to false) Whether or not to invert the values reported on start and drag.
* limit     - (*object*: defaults to false) An object with x and y properties used to limit the movement of the Element.
* modifiers - (*object*: defaults to {'x': 'left', 'y': 'top'}) An object with x and y properties used to indicate the CSS modifiers (i.e. 'left').
* snap      - (*integer*: defaults to 6) The distance to drag before the Element starts to respond to the drag.
* style     - (*boolean*: defaults to true) Whether or not to set the modifier as a style property of the element.
* unit      - (*string*: defaults to 'px') A string indicating the CSS unit to append to all integer values.

### Events:

* beforeStart - Executed before the Drag instance attaches the events. Receives the dragged element as an argument.
* start       - Executed when the user starts to drag (on mousedown). Receives the dragged element as an argument.
* snap        - Executed when the user has dragged past the snap option. Receives the dragged element as an argument.
* drag        - Executed on every step of the drag. Receives the dragged element as an argument.
* complete    - Executed when the user completes the drag. Receives the dragged element as an argument.

### Examples:

	var myDrag = new Drag('myDraggable', {
		snap: 0,
		onSnap: function(el){
			el.addClass('dragging');
		},
		onComplete: function(el){
			el.removeClass('dragging');
		}
	});

	//create an Adobe reader style drag to scroll container
	var myDragScroller = new Drag('myContainer', {
		style: false,
		invert: true,
		modifiers: {x: 'scrollLeft', y: 'scrollTop'}
	});

### Notes:

- Drag requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### See Also:

- [W3Schools: CSS Units][]



Drag Method: attach {#Drag:attach}
----------------------------------

Attaches the mouse listener to the handle, causing the Element to be draggable.

### Syntax:

	myDrag.attach();

### Returns:

* (*object*) This Drag instance.

### Examples:

	var myDrag = new Drag('myElement').detach(); //The Element can't be dragged.
	$('myActivator').addEvent('click', function(){
		alert('Ok, now you can drag.');
		myDrag.attach();
	});

### See Also:

- [$][], [Element:makeDraggable][], [Drag:detach](#Drag:detach), [Element:addEvent][]



Drag Method: detach {#Drag:detach}
----------------------------------

Detaches the mouse listener from the handle, preventing the Element from being dragged.

### Syntax:

	myDrag.detach();

### Returns:

* (*object*) This Drag instance.

### Examples:

	var myDrag = new Drag('myElement');
	$('myDeactivator').addEvent('click', function(){
		alert('No more dragging for you, Mister.');
		myDrag.detach();
	});

### See Also:

- [$][], [Element:makeDraggable][], [Element:addEvent][]



Drag Method: stop {#Drag:stop}
------------------------------

Stops (removes) all attached events from the Drag instance and executes the 'complete' Event.

### Syntax:

	myDrag.stop();

### Examples:

	var myDrag = new Drag('myElement', {
		onSnap: function(){
			this.moved = this.moved || 0;
			this.moved++;
			if(this.moved > 100) {
				this.stop();
				alert("Stop! You'll make the Element angry.");
			}
		}
	});



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: makeResizable {#Element:makeResizable}
------------------------------------------------------

Adds drag-to-resize behavior to an Element using supplied options.

### Syntax:

	var myResize = myElement.makeResizable([options]);

### Arguments:

1. options - (*object*, optional) See [Drag][] for acceptable options.

### Returns:

* (*object*) The Drag instance that was created.

### Examples:

	var myResize = $('myElement').makeResizable({
		onComplete: function(){
			alert('Done resizing.');
		}
	});

### See Also:

- [Drag](#Drag)



[$]: /Element/Element/#dollar
[Element:addEvent]: /Element/Element.Event/#Element:addEvent
[Element:makeDraggable]: /Drag/Drag.Move/#Element:makeDraggable
[Events]: /Class/Class.Extras#Events
[Chain]: /Class/Class.Extras#Options
[W3Schools: CSS Units]: http://www.w3schools.com/css/css_units.asp