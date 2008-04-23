Class: Fx.Slide {#Fx-Slide}
===========================

The slide effect slides an Element in horizontally or vertically.  The contents will fold inside.

### Note:

- Fx.Slide requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Extends:

- [Fx][]

### Syntax:

	var myFx = new Fx.Slide(element[, options]);

### Arguments:

1. elements - (*element*) The element to slide.
2. options  - (*object*, optional) All of [Fx][] options in addition to mode and wrapper.

#### Options

1. mode    - (*string*: defaults to 'vertical') String to indicate what type of sliding. Can be set to 'vertical' or 'horizontal'.
2. wrapper - (*element*: defaults to this.element) Allows to set another Element as wrapper.

#### Properties:

2. open    - (*boolean*) Indicates whether the slide element is visible.

### Examples:

	//Hides the Element, then brings it back in with toggle and finally alerts
	//when complete:
	var mySlide = new Fx.Slide('container').hide().toggle().chain(function(){
		alert(mySlide.open); //Alerts true.
	});

### Notes:

- To create the slide effect an additional Element (a "div" by default) is wrapped around the given Element. This wrapper adapts the margin from the Element.



Fx.Slide Method: slideIn {#Fx-Slide:slideIn}
--------------------------------------------

Slides the Element in view horizontally or vertically.

### Syntax:

	myFx.slideIn([mode]);

### Arguments:

1. mode - (*string*, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx.Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement').slideOut().chain(function(){
		this.show().slideIn('horizontal');
	});



Fx.Slide Method: slideOut {#Fx-Slide:slideOut}
----------------------------------------------

Slides the Element out of view horizontally or vertically.

### Syntax:

	myFx.slideOut([mode]);

### Arguments:

1. *mode* - (*string*, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx.Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement', {
		mode: 'horizontal',
		//Due to inheritance, all the [Fx][] options are available.
		onComplete: function(){
			alert('Poof!');
		}
	//The mode argument provided to slideOut overrides the option set.
	}).slideOut('vertical');



Fx.Slide Method: toggle {#Fx-Slide:toggle}
------------------------------------------

Slides the Element in or out, depending on its state.

### Syntax:

	myFx.toggle([mode]);

### Arguments:

1. mode - (*string*, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx.Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement', {
		duration: 1000,
		transition: Fx.Transitions.Pow.easeOut
	});

    //Toggles between slideIn and slideOut twice:
	myFx.toggle().chain(myFx.toggle);



Fx.Slide Method: hide {#Fx-Slide:hide}
--------------------------------------

Hides the Element without a transition.

### Syntax:

	myFx.hide([mode]);

### Arguments:

1. mode - (*string*, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx.Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement', {
		duration: 'long',
		transition: Fx.Transitions.Bounce.easeOut
	});

    //Automatically hides and then slies in "myElement":
	myFx.hide().slideIn();



Fx.Slide Method: show {#Fx-Slide:show}
--------------------------------------

Shows the Element without a transition.

### Syntax:

	myFx.show([mode]);

### Arguments:

1. mode - (*string*, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx.Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement', {
		duration: 1000,
		transition: Fx.Transitions.Bounce.easeOut
	});

    //Slides "myElement" out.
	myFx.slideOut().chain(function(){
	    //Waits one second, then the Element appears without transition.
		this.show.delay(1000, this);
	});


Hash: Element.Properties {#Element-Properties}
==============================================

See [Element.Properties][].

Element Property: slide {#Element-Properties:slide}
---------------------------------------------------

Sets a default Fx.Slide instance for an element.
Gets the previously setted Fx.Slide instance or a new one with default options.

### Syntax:

	el.set('slide'[, options]);

### Arguments:

1. options - (*object*) the Fx.Morph options.

### Returns:

* (*element*) this element

### Example:

	el.set('slide', {duration: 'long', transition: 'bounce:out'});
	el.slide('in');

### Syntax:

	el.get('slide');

### Arguments:

1. options - (*object*, optional) the Fx.Slide options. if passed in will generate a new instance.

### Returns:

* (*object*) the Fx.Slide instance

### Examples:

	el.set('slide', {duration: 'long', transition: 'bounce:out'});
	el.slide('in');

	el.get('slide'); //the Fx.Slide instance


Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].


Element Method: slide {#Element:slide}
--------------------------------------

Slides this Element in view.

### Syntax:

	myElement.slide(how);

### Arguments:

1. how     - (*string*, optional) Can be 'in', 'out', 'toggle', 'show' and 'hide'. Defaults to 'toggle'.

### Returns:

* (*element*) this Element.

### Examples:

	$('myElement').slide('hide').slide('in');


[Fx.Slide]: #Fx-Slide
[Fx]: /Fx/Fx
[$]: /Element/Element#dollar
[Element.Properties]: /Element/Element/#Element-Properties