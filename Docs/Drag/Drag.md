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

* handle    - (*element*: defaults to the element passed in) The Element to act as the handle for the draggable element.
* grid      - (*integer*: defaults to false) Distance in pixels for snap-to-grid dragging.
* unit      - (*string*: defaults to 'px') A string indicating the CSS unit to append to all integer values.
* snap      - (*integer*: defaults to 6) The distance to drag before the Element starts to respond to the drag.
* limit     - (*object*: defaults to false) An object with x and y properties used to limit the movement of the Element.
* modifiers - (*object*: defaults to {'x': 'left', 'y': 'top'}) An object with x and y properties used to indicate the CSS modifiers (i.e. 'left').

### Events:

* onBeforeStart - Executed before the Drag instance attaches the events. Receives the dragged element as an argument.
* onStart       - Executed when the user starts to drag (on mousedown). Receives the dragged element as an argument.
* onSnap        - Executed when the user has dragged past the snap option. Receives the dragged element as an argument.
* onDrag        - Executed on every step of the drag. Receives the dragged element as an argument.
* onComplete    - Executed when the user completes the drag. Receives the dragged element as an argument.

### Properties:

* element - (*element*) The Element being transformed.
* handle  - (*element*) The Element acting as the handle for the draggable element.

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

### Notes:

- Drag.Move requires an XHTML doctype.

### See Also:

- [W3Schools: CSS Units][]



Drag Method: attach {#Drag:attach}
----------------------------------

Attaches the mouse listener to the handle.

### Syntax:

	myDrag.attach();

### Returns:

* (*object*) This Drag instance.

### Examples:

	var myDrag = new Drag('myElement').detach(); //the element is inert
	$('myActivator').addEvent('click', function(){
		alert('ok now you can drag.');
		myDrag.attach();
	});

### See Also:

- [$][], [Element:makeDraggable][], [Drag:detach](#detach), [Element:addEvent][]



Drag Method: detach {#Drag:detach}
----------------------------------

Detaches the mouse listener from the handle.

### Syntax:

	myDrag.detach();

### Returns:

* (*object*) This Drag instance.

### Examples:

	var myDrag = new Drag('myElement');
	$('myDeactivator').addEvent('click', function(){
		alert('no more dragging for you mr.');
		myDrag.detach();
	});

### See Also:

- [$][], [Element:makeDraggable][], [Element:addEvent][]



Drag Method: stop {#Drag:stop}
------------------------------

Stops (removes) all attached events from the Drag instance and executes the onComplete Event.

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
			alert('done resizing');
		}
	});

### See Also:

- [Drag](#Drag)



[$]: /Element/#dollar
[Element:addEvent]: /Element/Element#addEvent
[Element:makeDraggable]: #Element:makeDraggable
[Events]: /Class/Class.Extras#Events
[Chain]: /Class/Class.Extras#Options
[W3Schools: CSS Units]: http://www.w3schools.com/css/css_units.asp