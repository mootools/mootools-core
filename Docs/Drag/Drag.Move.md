Class: Drag.Move {#Drag-Move}
=============================

An extension to the base Drag class with additional functionality for dragging an Element.  Supports snapping and droppables.
Inherits methods, properties, options and events from [Drag][].

### Note:

Drag.Move requires an XHTML doctype.


Drag.Move Method: constructor {#Drag:constructor}
-------------------------------------------------

### Syntax:

	var myMove = new Drag.Move(myElement[, options]);

### Arguments:

1. el      - (*element*) The Element to apply the drag to.
2. options - (*object*, optional) The options object. See below.

### Options:

All the base Drag options, plus:
	
* container  - (*element*) If an Element is passed, drag will be limited to the passed Element's size and position.
* overflown  - (*array*) Array of nested scrolling containers. See [Element:getPosition](/Element/#getPosition).
* droppables - (*array*) The Elements that the draggable can drop into.
	
	Interaction with droppable work with events fired on the doppable element or, for 'emptydrop', on the dragged element.
	
	The Events 'over', 'leave' and 'drop' get fired on the droppable element with the dragged element as first argument when the dragged element hovers,leaves or get dropped on the droppable.

### Properties:

All the base Drag properties, plus:

* droppables - (*element*) The Elements that the draggable can drop into.

### Example:

	var droppables = $$('li.placements').addEvents({
		'over': function() {
			this.addClass('overed');
		},
		'leave': function() {
			this.removeClass('overed');
		},
		'drop': function(el) {
			alert(el.id + ' dropped');
		}
	});
	
	var myMove = new Drag.Move('product-placement', {
		'droppables': droppables
	});

### Notes:

- Drag.Move requires an XHTML doctype.
- Drag.move supports either position absolute or relative. If no position is found, absolute will be set.

### Demos:

* Drag.Cart - <http://demos.mootools.net/Drag.Cart>
* Drag.Absolutely - <http://demos.mootools.net/Drag.Absolutely>
* DragDrop - <http://demos.mootools.net/DragDrop>

### See Also:

- [Drag][]



Drag.Move Method: stop {#Drag.Move:stop}
----------------------------------------

Checks if the Element is above a droppable and fires the drop event. Else, fires the 'emptydrop' event that is attached to this Element. Lastly, calls the Drag Class stop method.

### Syntax:

	myMove.stop();

### Example:

	var myElement = $('myElement').addEvent('emptydrop', function(){
		alert('no drop occurred');
	});

	var myMove = new Drag.Move(myElement, {
		onSnap: function(){ // due to MooTool's inheritance, all [Drag][]'s Events are also available.
			this.moved = this.moved || 0;
			this.moved++;
			if(this.moved > 1000){
				alert("You've gone far enough.");
				this.stop();
			}
		}
	});

### See Also:

- [Drag:stop](/Drag/#stop)



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: makeDraggable {#Element:makeDraggable}
------------------------------------------------------

Adds drag-to-move behavior to an Element using supplied options.

### Syntax:

	var myDrag = myElement.makeDraggable([options]);

### Arguments:

1. options - (*object*, optional) See [Drag][] and [Drag.Move](#Drag.Move) for acceptable options.

### Returns:

* (*object*) The Drag.Move instance that was created.

### Example:

	var myDrag = $('myElement').makeDraggable({
		onComplete: function(){
			alert('done dragging');
		}
	});

### See Also:

- [Drag][], [Drag.Move](#Drag.Move)



[$]: /Element/#dollar
[Drag]: /Drag/#Drag
[Element:getPosition]: /Element/#getPosition