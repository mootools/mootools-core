Script: Fx.Slide.js
	Contains <Fx.Slide>

License:
	MIT-style license.

Note:
	Fx.Slide requires an XHTML doctype.



Class: Fx.Slide
	The slide effect; slides an element in horizontally or vertically, the contents will fold inside.

Extends:
	<Fx>

Syntax:
	>var myFx = new Fx.Slide(element[, options]);

Arguments:
	elements - (element) The element to slide.
	options  - (object, optional) All of <Fx> options in addition to mode and wrapper.

	options (continued):
		mode    - (string: defaults to 'vertical') String to indicate what type of sliding. Can be set to 'vertical' or 'horizontal'.
		wrapper - (element: defaults to this.element) Allows to set another Element as wrapper.

Properties:
	wrapper - (element) The Element wrapping the element being slid.
	open    - (boolean) Indicates whether the slide element is visible.

Example:
	[javascript]
	//hides, toggles (which acts like slideOut), and chains an alert.
	var mySlide = new Fx.Slide('container').hide().toggle().chain(function(){
		alert(mySlide.open); //true
	});
	[/javascript]

Note:
	To create the slide effect an additional Element ('div' by default) is wrapped around the given Element. This wrapper adapts the margin from the Element.


	
Method: slideIn
	Slides the Element in view horizontally or vertically.

Syntax:
	>myFx.slideIn([mode]);

Arguments:
	mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

Returns:
	(object) This Fx.Slide instance.

Example:
	[javascript]
		var myFx = new Fx.Slide('myElement').slideOut().chain(function(){
			this.show().slideOut('horizontal');
		});
	[/javascript]



Method: slideOut
	Slides the Element out of view horizontally or vertically.

Syntax:
	>myFx.slideOut([mode]);

Arguments:
	mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

Returns:
	(object) This Fx.Slide instance.

Example:
	[javascript]
		var myFx = new Fx.Slide('myElement', {
			mode: 'horizontal',
			onComplete: function(){ // due to inheritance we have all the <Fx> Options.
				alert('poof!');
			}
		}).slideOut();
	[/javascript]



Method: toggle
	Slides in or Out the element depending on its state.

Syntax:
	>myFx.toggle([mode]);

Arguments:
	mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

Returns:
	(object) This Fx.Slide instance.

Example:
	[javascript]
		var myFx = new Fx.Slide('myElement', {
			duration: 1000,
			transition: Fx.Transitions.Pow.easeOut
		});

		myFx.toggle().chain(myFx.toggle); // toggle the between slideIn and Out twice.
	[/javascript]



Method: hide
	Hides the element without a transition.

Syntax:
	>myFx.hide([mode]);

Arguments:
	mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

Returns:
	(object) This Fx.Slide instance.

Example:
	[javascript]
		var myFx = new Fx.Slide('myElement', {
			duration: 'long',
			transition: Fx.Transitions.Bounce.easeOut
		});

		myFx.hide().slideIn(); //automatically hide and show myElement.
	[/javascript]



Method: show
	Shows the element without a transition.

Syntax:
	>myFx.show([mode]);

Arguments:
	mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

Returns:
	(object) This Fx.Slide instance.

Example:
	[javascript]
		var myFx = new Fx.Slide('myElement', {
			duration: 1000,
			transition: Fx.Transitions.Bounce.easeOut
		});

		myFx.slideOut().chain(function(){
			this.show.delay(1000, this); //after 1sec show the slid Element.
		});
	[/javascript]



Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.



Element Property: slide
	sets a default Fx.Slide instance for an element
	gets the previously setted Fx.Slide instance or a new one with default options

Syntax:
	>el.set('slide'[, options]);

Arguments:
	options - (object) the Fx.Morph options.

Returns:
	(element) this element

Example:
	[javascript]
		el.set('slide', {duration: 'long', transition: 'bounce:out'});
		el.slide('in');
	[/javascript]

Syntax:
	>el.get('slide');

Arguments:
	options - (object, optional) the Fx.Slide options. if passed in will generate a new instance.

Returns:
	(object) the Fx.Slide instance

Example:
	[javascript]
		el.set('slide', {duration: 'long', transition: 'bounce:out'});
		el.slide('in');

		el.get('slide'); //the Fx.Slide instance
	[/javascript]


	
Method: slide
	Slides this Element in view.

Syntax:
	>myElement.slide([how, options]);

Arguments:
	how - (string, optional) Can be 'in', 'out', 'toggle', 'show' and 'hide'. Defaults to 'toggle'.
	options - (object, optional) The <Fx.Slide> options parameter.

Returns:
	(element) this Element.

Example:
	[javascript]
		$('myElement').slide('hide').slide('in');
	[/javascript]

See Also:
	<Fx.Slide>

