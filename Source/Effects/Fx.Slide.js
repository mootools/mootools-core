/*
Script: Fx.Slide.js
	Contains <Fx.Slide>

License:
	MIT-style license.

Note:
	Fx.Slide requires an XHTML doctype.
*/

/*
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
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical'
	},

	initialize: function(element, options){
		this.addEvent('onComplete', function(){
			this.open = (this.now[0] === 0);
			if (this.open){
				this.wrapper.setStyle(this.layout, '');
				if (Client.Engine.webkit419) this.element.remove().inject(this.wrapper);
			}
		}, true);
		arguments.callee.parent($(element), options);
		this.wrapper = this.element.$attributes.$wrapper;
		this.wrapper = this.wrapper || new Element('div', {
			'styles': $extend(this.element.getStyles('margin', 'position'), {'overflow': 'hidden'})
		}).injectAfter(this.element).adopt(this.element);
		this.element.$attributes.$wrapper = this.wrapper;
		this.element.setStyle('margin', 0);
		this.now = [];
		this.open = true;
	},

	setNow: function(){
		for (var i = 2; i--; i) this.now[i] = this.compute(this.from[i], this.to[i]);
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	/*
	Method: slideIn
		Slides the Element in view horizontally or vertically.

	Syntax:
		>myFx.slideIn([mode]);

	Arguments:
		mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

	Returns:
		(class) This Fx.Slide instance.

	Example:
		[javascript]
			var myFx = new Fx.Slide('myElement').slideOut().chain(function(){
				this.show().slideOut('horizontal');
			});
		[/javascript]
	*/

	slideIn: function(mode){
		this[mode || this.options.mode]();
		return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [0, this.offset]);
	},

	/*
	Method: slideOut
		Slides the Element out of view horizontally or vertically.

	Syntax:
		>myFx.slideOut([mode]);

	Arguments:
		mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

	Returns:
		(class) This Fx.Slide instance.

	Example:
		[javascript]
			var myFx = new Fx.Slide('myElement', {
				mode: 'horizontal',
				onComplete: function(){ // due to inheritance we have all the <Fx> Options.
					alert('poof!');
				}
			}).slideOut();
		[/javascript]
	*/

	slideOut: function(mode){
		this[mode || this.options.mode]();
		return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [-this.offset, 0]);
	},

	/*
	Method: hide
		Hides the element without a transition.

	Syntax:
		>myFx.hide([mode]);

	Arguments:
		mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

	Returns:
		(class) This Fx.Slide instance.

	Example:
		[javascript]
			var myFx = new Fx.Slide('myElement', {
				duration: 'long',
				transition: Fx.Transitions.Bounce.easeOut
			});

			myFx.hide().slideIn(); //automatically hide and show myElement.
		[/javascript]
	*/

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	/*
	Method: show
		Shows the element without a transition.

	Syntax:
		>myFx.show([mode]);

	Arguments:
		mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

	Returns:
		(class) This Fx.Slide instance.

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
	*/

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	/*
	Method: toggle
		Slides in or Out the element depending on its state.

	Syntax:
		>myFx.toggle([mode]);

	Arguments:
		mode - (string, optional) Override the passed in Fx.Slide option with 'horizontal' or 'vertical'.

	Returns:
		(class) This Fx.Slide instance.

	Example:
		[javascript]
			var myFx = new Fx.Slide('myElement', {
				duration: 1000,
				transition: Fx.Transitions.Pow.easeOut
			});

			myFx.toggle().chain(myFx.toggle); // toggle the between slideIn and Out twice.
		[/javascript]
	*/

	toggle: function(mode){
		if (this.wrapper.offsetHeight == 0 || this.wrapper.offsetWidth == 0) return this.slideIn(mode);
		return this.slideOut(mode);
	},

	increase: function(){
		this.element.setStyle(this.margin, this.now[0] + this.options.unit);
		this.wrapper.setStyle(this.layout, this.now[1] + this.options.unit);
	}

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

/*
Element Setter: slide
	sets a default Fx.Slide instance for an element
	
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
*/

Element.Set.slide = function(options){
	if (this.$attributes.$slide) this.$attributes.$slide.stop();
	this.$attributes.$slide = new Fx.Slide(this, $merge({link: 'chain'}, options));
	return this;
};

/*
Element Getter: slide
	gets the previously setted Fx.Slide instance or a new one with default options
	
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
*/

Element.Get.slide = function(options){
	if (!this.$attributes.$slide || options) this.set('slide', options);
	return this.$attributes.$slide;
};

Element.implement({
	
	/*
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
	*/

	slide: function(how, options){
		how = how || 'toggle';
		this.get('slide', options)[(how == 'in' || how == 'out') ? 'slide' + how.capitalize() : how]();
		return this;
	}

});