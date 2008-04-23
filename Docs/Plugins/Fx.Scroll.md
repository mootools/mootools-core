Class: Fx.Scroll {#Fx-Scroll}
=============================

Scrolls any element with an overflow, including the window element.

### Note:

- Fx.Scroll requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Extends:

- [Fx][]



Fx.Scroll Method: constructor {#Fx-Scroll:constructor}
------------------------------------------------------

### Syntax:

	var myFx = new Fx.Scroll(element[, options]);

### Arguments:

1. element - (*mixed*) A string of the id for an Element or an Element reference to scroll.
2. options - (*object*, optional) All [Fx][] Options in addition to offset, overflown, and wheelStops.

Options:

1. offset     - (*object*: defaults to {'x': 0, 'y': 0}) An object with x and y properties of the distance to scroll to within the Element.
2. overflown  - (*array*: defaults to []) An array of nested scrolling containers, see [Element:getPosition][] for an explanation.
3. wheelStops - (*boolean*: defaults to true) If false, the mouse wheel will not stop the transition from happening.

### Returns:

* (*object*) A new Fx.Scroll instance.

### Examples:

	var myFx = new Fx.Scroll('myElement', {
		offset: {
			'x': 0,
			'y': 100
		}
	}).toTop();

### Notes:

- Fx.Scroll transition will stop on mousewheel movement if the wheelStops option is not set to false. This is to allow  users to control their web experience.
- Fx.Scroll is useless for Elements without scrollbars.


Fx.Scroll Method: set {#Fx-Scroll:set}
--------------------------------------
	
Scrolls the specified Element to the x/y coordinates immediately.

### Syntax:

	myFx.set(x, y);

### Arguments:

1. x - (*integer*) The x coordinate to scroll the Element to.
2. y - (*integer*) The y coordinate to scroll the Element to.

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	var myElement = $(document.body);
	var myFx = new Fx.Scroll(myElement).set(0, 0.5 * document.body.offsetHeight);



Fx.Scroll Method: start {#Fx-Scroll:start}
------------------------------------------

Scrolls the specified Element to the x/y coordinates provided.

### Syntax:

	myFx.start(x, y);

### Arguments:

1. x - (*integer*) The x coordinate to scroll the Element to.
2. y - (*integer*) The y coordinate to scroll the Element to.

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	var myElement = $(document.body);
	var myFx = new Fx.Scroll(myElement).start(0, 0.5 * document.body.offsetHeight);

### Notes:

- Scrolling to negative coordinates is impossible.



Fx.Scroll Method: toTop {#Fx-Scroll:toTop}
------------------------------------------

Scrolls the specified Element to its maximum top.

### Syntax:

	myFx.toTop();

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	//Scrolls "myElement" 200 pixels down from its top and, after 1.5 seconds,
	//back to the top.
	var myFx = new Fx.Scroll('myElement', {
		onComplete: function(){
			this.toTop.delay(1500, this);
		}
	}).scrollTo(0, 200).chain(function(){
		this.scrollTo(200, 0);
	});



Fx.Scroll Method: toBottom {#Fx-Scroll:toBottom}
------------------------------------------------

Scrolls the specified Element to its maximum bottom.

### Syntax:

	myFx.toBottom();

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	//Scrolls the window to the bottom and, after one second, to the top.
	var myFx = new Fx.Scroll(window).toBottom().chain(function(){
		this.toTop.delay(1000, this);
	});



Fx.Scroll Method: toLeft {#Fx-Scroll:toLeft}
--------------------------------------------

Scrolls the specified Element to its maximum left.

### Syntax:

	myFx.toLeft();

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	//Scrolls "myElement" 200 pixels to the right and then back.
	var myFx = new Fx.Scroll('myElement').scrollTo(200, 0).chain(function(){
		this.toLeft();
	});



Fx.Scroll Method: toRight {#Fx-Scroll:toRight}
--------------------------------------------

Scrolls the specified Element to its maximum right.

### Syntax:

	myFx.toRight();

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

	//Scrolls "myElement" to the right edge and then to the bottom.
	var myFx = new Fx.Scroll('myElement', {
		duration: 5000,
		wait: false
	}).toRight();

	myFx.toBottom.delay(2000, myFx);



Fx.Scroll Method: toElement {#Fx-Scroll:toElement}
--------------------------------------------------

Scrolls the specified Element to the position the passed in Element is found.

### Syntax:

	myFx.toElement(el);

### Arguments:

1. el - (*mixed*) A string of the Element's id or an Element reference to scroll to.

### Returns:

* (*object*) This Fx.Scroll instance.

### Examples:

    //Scrolls the "myElement" to the top left corner of the window.
	var myFx = new Fx.Scroll(window).toElement('myElement');

### Notes:

- See [Element:getPosition][] for position difficulties.



[Fx]: /Fx/Fx
[Fx.Scroll]: #Fx-Scroll
[Element:getPosition]: /Utilities/Dimensions#Element:getPosition