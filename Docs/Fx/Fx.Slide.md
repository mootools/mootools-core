Fx.Slide.js
-----------

Contains [Fx.Slide][]

### License:

MIT-style license.

### Note:

- Fx.Slide requires an XHTML doctype.



Class: Fx.Slide {#Fx-Slide}
===========================

The slide effect; slides an element in horizontally or vertically, the contents will fold inside.

### Extends:

- [Fx][]

### Syntax:

	var myFx = new Fx.Slide(element[, options]);

### Arguments:

1. elements - (*element*) The element to slide.
2. options  - (*object*, optional) All of <Fx> options in addition to mode and wrapper.

#### Options

1. mode    - (*string*: defaults to 'vertical') String to indicate what type of sliding. Can be set to 'vertical' or 'horizontal'.
2. wrapper - (*element*: defaults to this.element) Allows to set another Element as wrapper.

#### Properties:

1. wrapper - (*element*) The Element wrapping the element being slid.
2. open    - (*boolean*) Indicates whether the slide element is visible.

### Examples:

	//hides, toggles (which acts like slideOut), and chains an alert.
	var mySlide = new Fx.Slide('container').hide().toggle().chain(function(){
		alert(mySlide.open); //true
	});

### Notes:

- To create the slide effect an additional Element ('div' by default) is wrapped around the given Element. This wrapper adapts the margin from the Element.



Fx.Slide Method: slideIn {#Fx-Slide:slideIn}
--------------------------------------------

Slides the Element in view horizontally or vertically.

### Syntax:

	myFx.slideIn([mode]);

### Arguments:

1. mode - (*string*, optional) Override the passed in Fx-Slide option with 'horizontal' or 'vertical'.

### Returns:

* (*object*) This Fx-Slide instance.

### Examples:

	var myFx = new Fx.Slide('myElement').slideOut().chain(function(){
		this.show().slideOut('horizontal');
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
		onComplete: function(){ // due to inheritance we have all the <Fx> Options.
			alert('poof!');
		}
	}).slideOut();



Fx.Slide Method: toggle {#Fx-Slide:toggle}
------------------------------------------

Slides in or Out the element depending on its state.

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

	myFx.toggle().chain(myFx.toggle); // toggle the between slideIn and Out twice.



Fx.Slide Method: hide {#Fx-Slide:hide}
--------------------------------------

Hides the element without a transition.

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

	myFx.hide().slideIn(); //automatically hide and show myElement.



Fx.Slide Method: show {#Fx-Slide:show}
--------------------------------------

Shows the element without a transition.

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

	myFx.slideOut().chain(function(){
		this.show.delay(1000, this); //after 1sec show the slid Element.
	});



Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function [$][].



Element Property: slide {#Element:property-slide}
-------------------------------------------------

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



Element Method: slide {#Element:slide}
--------------------------------------

Slides this Element in view.

### Syntax:

	myElement.slide([how, options]);

### Arguments:

1. how     - (*string*, optional) Can be 'in', 'out', 'toggle', 'show' and 'hide'. Defaults to 'toggle'.
2. options - (*object*, optional) The [Fx.Slide][] options parameter.

### Returns:

* (*element*) this Element.

### Examples:

	$('myElement').slide('hide').slide('in');

### See Also:

- [Fx.Slide][]



[Fx.Slide]: #Fx-Slide
[Fx]: /Fx/Fx
[$]: /Element/#dollar