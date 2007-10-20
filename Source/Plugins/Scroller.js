/*
Script: Scroller.js
	Contains the <Scroller>.

License:
	MIT-style license.

Note:
	The Scroller.js requires an XHTML doctype.
*/

/*
Class: Scroller
	The Scroller is a class to scroll any element with an overflow (including the window) when the mouse cursor reaches certain buondaries of that element.
	You must call its start method to start listening to mouse movements.

Syntax:
	>var myScroller = new Scroller(element[, options]);

Implements:
	<Events>, <Options>

Arguments:
	element - (element) The element to scroll.
	options - (object, optional) An object for the Scroller instance's options.

	options (continue):
		area - (number: defaults to 20) The necessary boundaries to make the element scroll.
		velocity - (number: defaults to 1) The modifier for the window scrolling speed.

Events:
	onChange - (function) When the mouse reaches some boundaries, you can choose to alter some other values, instead of the scrolling offsets.
		Signature:
			>onChange(x, y);

		Arguments:
			x - (number) Current x-mouse position.
			y - (number) Current y-mouse position.

Example:
	[javascript]
		var myScroller = new Scroller(window, {
			area: Math.round(window.getWidth() / 5)
		});

		(function(){
			this.stop();
			this.start();
		}).periodical(1000, myScroller);
	[/javascript]
*/

var Scroller = new Class({

	Implements: [Events, Options],

	options: {
		area: 20,
		velocity: 1,
		onChange: function(x, y){
			this.element.scrollTo(x, y);
		}
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = $(element);
		switch($type(this.element)){
			case 'window': this.listener = $(this.element.document.body); break;
			case 'document': this.listener = $(this.element.body); break;
			case 'element': this.listener = this.element;
		}
		this.timer = null;
	},

	/*
	Method: start
		The scroller starts listening to mouse movements.

	Syntax:
		>myScroller.start();

	Example:
		[javascript]
			var myScroller = new Scroller('myElement');
			myScroller.start();
		[/javascript]
	*/

	start: function(){
		this.coord = this.getCoords.bind(this);
		this.listener.addEvent('mousemove', this.coord);
	},

	/*
	Method: stop
		The scroller stops listening to mouse movements.

	Syntax:
		>myScroller.start();

	Example:
		[javascript]
			var myElement = $('myElement');
			var myScroller = new Scroller(myElement);
			myScroller.start();

			myElement.addEvent('click', myScroller.stop.bind(myScroller)); //stop scrolling when the user clicks.
		[/javascript]
	*/

	stop: function(){
		this.listener.removeEvent('mousemove', this.coord);
		this.timer = $clear(this.timer);
	},

	getCoords: function(event){
		this.page = (this.element == window) ? event.client : event.page;
		if (!this.timer) this.timer = this.scroll.periodical(50, this);
	},

	scroll: function(){
		var size = this.element.getSize();
		var scroll = this.element.getScroll();
		var pos = this.element.getPosition();

		var change = {'x': 0, 'y': 0};
		for (var z in this.page){
			if (this.page[z] < (this.options.area + pos[z]) && scroll[z] != 0)
				change[z] = (this.page[z] - this.options.area - pos[z]) * this.options.velocity;
			else if (this.page[z] + this.options.area > (el.offset[z] + pos[z]) && el.offset[z] + el.offset[z] != el.scroll[z])
				change[z] = (this.page[z] - el.offset[z] + this.options.area - pos[z]) * this.options.velocity;
		}
		if (change.y || change.x) this.fireEvent('onChange', [scroll.x + change.x, scroll.y + change.y]);
	}

});
