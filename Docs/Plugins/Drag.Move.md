Class: Drag.Move {#Drag-Move}
=============================

An extension to the base Drag class with additional functionality for dragging an Element.  Supports snapping and droppables.
Inherits methods, properties, options and events from [Drag][].

### Note:

Drag.Move requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).


Drag.Move Method: constructor {#Drag-Move:constructor}
-------------------------------------------------

### Syntax:

	var myMove = new Drag.Move(myElement[, options]);

### Arguments:

1. el      - (*element*) The Element to apply the drag to.
2. options - (*object*, optional) The options object. See below.

### Options:

All the base Drag options, plus:
	
* container  - (*element*) If an Element is passed, drag will be limited to the passed Element's size and position.
* droppables - (*array*) The Elements that the draggable can drop into. The class's drop, enter, and leave events will be fired in conjunction with interaction with one of these elements.

### Events:

* drop - Executed when the element drops. Passes as argument the element and the element dropped on. If dropped on nothing, the second argument is null.
* leave - Executed when the element leaves one of the droppables.
* enter - Executed when the element enters one of the droppables.

### Example:

	var myDrag = new Drag.Move('draggable', {
		
		droppables: '.droppable',
		
		onDrop: function(element, droppable){
			if (!droppable) console.log(element, ' dropped on nothing');
			else console.log(element, 'dropped on', droppable);
		},
		
		onEnter: function(element, droppable){
			console.log(element, 'entered', droppable);
		},
		
		onLeave: function(element, droppable){
			console.log(element, 'left', droppable);
		}
		
	});

### Notes:

- Drag.Move requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).
- Drag.Move supports either position absolute or relative. If no position is found, absolute will be set.

### Demos:

* Drag.Cart - <http://demos.mootools.net/Drag.Cart>
* Drag.Absolutely - <http://demos.mootools.net/Drag.Absolutely>
* DragDrop - <http://demos.mootools.net/DragDrop>

### See Also:

- [Drag][]



Drag.Move Method: stop {#Drag-Move:stop}
-------------------------------------------------

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

- [Drag:stop][]



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Method: makeDraggable {#Element:makeDraggable}
------------------------------------------------------

Adds drag-to-move behavior to an Element using supplied options.

### Syntax:

	var myDrag = myElement.makeDraggable([options]);

### Arguments:

1. options - (*object*, optional) See [Drag][] and [Drag.Move](#Drag-Move) for acceptable options.

### Returns:

* (*object*) The Drag.Move instance that was created.

### Example:

	var myDrag = $('myElement').makeDraggable({
		onComplete: function(){
			alert('done dragging');
		}
	});

### See Also:

- [Drag][], [Drag.Move](#Drag-Move)



[$]: /Element/Element/#dollar
[Drag]: /Drag/Drag/#Drag
[Drag:stop]: /Drag/Drag/#Drag:stop
[Element:getPosition]: /Utilities/Dimensions/#Element:getPosition