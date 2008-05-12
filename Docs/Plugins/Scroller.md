Class: Scroller {#Scroller}
===========================

**The Scroller is a Class to scroll any element with an overflow (including the window) when the mouse cursor reaches certain boundaries of that element.**

**You must call its start method to start listening to mouse movements.**

### Note:

- Scroller requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Syntax:

	new Scroller(element[, options]);

### Implements:

[Events][], [Options][]

### Arguments:

1. element - (*element*) The element to scroll.
2. options - (*object*, optional) An object for the Scroller instance's options.

#### Options :

* area     - (*number*: defaults to 20) The necessary boundaries to make the element scroll.
* velocity - (*number*: defaults to 1) The modifier for the window scrolling speed.

### Events:

* change - (*function*) When the mouse reaches some boundaries, you can choose to alter some other values, instead of the scrolling offsets.

#### Signature:

	onChange(x, y);

#### Arguments:

1. x - (*number*) Current x-mouse position.
2. y - (*number*) Current y-mouse position.

#### Examples:

	var myScroller = new Scroller(window, {
		area: Math.round(window.getWidth() / 5)
	});

	(function(){
		this.stop();
		this.start();
	}).periodical(1000, myScroller);



Scroller Method: start {#Scroller:start}
----------------------------------------

**The scroller starts listening to mouse movements.**

###	Syntax:

	myScroller.start();

###	Examples:

	var myScroller = new Scroller('myElement');
	myScroller.start();



Scroller Method: stop {#Scroller:stop}
--------------------------------------

**The scroller stops listening to mouse movements.**

###	Syntax:

	myScroller.start();

###	Examples:

	var myElement = $('myElement');
	var myScroller = new Scroller(myElement);
	myScroller.start();

	myElement.addEvent('click', myScroller.stop.bind(myScroller)); //stop scrolling when the user clicks.



[Events]: /Class/Class.Extras#Events
[Options]: /Class/Class.Extras#Options