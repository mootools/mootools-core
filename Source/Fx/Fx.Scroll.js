/*
Script: Fx.Scroll.js
	Contains <Fx.Scroll>

License:
	MIT-style license.

Note:
	Fx.Scroll requires an XHTML doctype.
*/

/*
Class: Fx.Scroll
	Scroll any element with an overflow, including the window element.

Extends:
	<Fx>

Syntax:
	>var myFx = new Fx.Scroll(element[, options]);

Arguments:
	element - (mixed) A string ID of the Element or an Element reference to scroll.

	options (continued):
		offset     - (object: defaults to {'x': 0, 'y': 0}) An object with x/y properties for the distance to scrollTo the Element.
		wheelStops - (boolean: defaults to true) If false, the mouse wheel will not stop the transition from happening.

Returns:
	(object) A new Fx.Scroll instance.

Example:
	[javascript]
		var myFx = new Fx.Scroll('myElement', {
			offset: {
				'x': 0,
				'y': 100
			}
		}).toTop();
	[/javascript]

Note:
	 - Fx.Scroll transition will stop on mousewheel movement if the optional wheelStops is not set to false. This is so that the user has control over their web experience.
	 - Fx.Scroll is useless for Elements that do not have scrollbars.
*/

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {'x': 0, 'y': 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = $(element);
		arguments.callee.parent(options);
		var cancel = this.cancel.bind(this, false);
		
		switch($type(this.element)){
			case 'window': this.element = this.element.document; break;
			case 'element': if (this.element.get('tag') == 'body') this.element = this.element.ownerDocument;
		}
		
		var stopper = this.element;

		if (this.options.wheelStops){
			this.addEvent('onStart', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('onComplete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	compute: function(from, to, delta){
		var now = [];
		(2).times(function(i){
			now.push(Fx.compute(from[i], to[i], delta));
		});
		return now;
	},

	/*
	Method: set
		Scrolls the specified Element to the x/y coordinates immediately.

	Syntax:
		>myFx.set(x, y);

	Arguments:
		x - (integer) The x coordinate to scroll the Element to.
		y - (integer) The y coordinate to scroll the Element to.

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			var myElement = $(document.body);
			var myFx = new Fx.Scroll(myElement).set(0, 0.5 * document.body.offsetHeight);
		[/javascript]
	*/

	set: function(){
		var now = Array.flatten(arguments);
		this.element.scrollTo(now[0], now[1]);
	},

	/*
	Method: start
		Scrolls the specified Element to the x/y coordinates.

	Syntax:
		>myFx.start(x, y);

	Arguments:
		x - (integer) The x coordinate to scroll the Element to.
		y - (integer) The y coordinate to scroll the Element to.

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			var myElement = $(document.body);
			var myFx = new Fx.Scroll(myElement).start(0, 0.5 * document.body.offsetHeight);
		[/javascript]

	Note:
		Scrolling to (-x, -y) is impossible. :)
	*/

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var offsetSize = this.element.getOffsetSize(), scrollSize = this.element.getScrollSize(), scroll = this.element.getScroll();
		var values = {'x': x, 'y': y};
		for (var z in values){
			var max = scrollSize[z] - offsetSize[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z].limit(0, max) : max;
			else values[z] = scroll[z];
			values[z] += this.options.offset[z];
		}
		return arguments.callee.parent([scroll.x, scroll.y], [values.x, values.y]);
	},

	/*
	Method: toTop
		Scrolls the specified Element to its maximum top.

	Syntax:
		>myFx.toTop();

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement 200 pixels down (from the top) and automatically after 1.5 sec scroll to the top
			var myFx = new Fx.Scroll('myElement', {
				onComplete: function(){
					this.toTop.delay(1500, this);
				}
			}).scrollTo(0, 200).chain(function(){
				this.scrollTo(200, 0);
			});
		[/javascript]
	*/

	toTop: function(){
		return this.start(false, 0);
	},

	/*
	Method: toBottom
		Scrolls the specified Element to its maximum bottom.

	Syntax:
		>myFx.toBottom();

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement to the bottom and after 1 sec scroll to the top
			var myFx = new Fx.Scroll(window).toBottom().chain(function(){
				this.toTop.delay(1000, this);
			});
		[/javascript]
	*/

	toBottom: function(){
		return this.start(false, 'bottom');
	},

	/*
	Method: toLeft
		Scrolls the specified Element to its maximum left.

	Syntax:
		>myFx.toLeft();

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement 200 pixels to the right and go back.
			var myFx = new Fx.Scroll('myElement').scrollTo(200, 0).chain(function(){
				this.toLeft();
			});
		[/javascript]
	*/


	toLeft: function(){
		return this.start(0, false);
	},

	/*
	Method: toRight
		Scrolls the specified Element to its maximum right.

	Syntax:
		>myFx.toRight();

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement to the right scroll to the top
			var myFx = new Fx.Scroll('myElement', {
				duration: 5000,
				wait: false
			}).toRight();

			myFx.toBottom.delay(2000, myFx);
		[/javascript]
	*/

	toRight: function(){
		return this.start('right', false);
	},

	/*
	Method: toElement
		Scrolls the specified Element to the position the passed in Element is found.

	Syntax:
		>myFx.toElement(el);

	Arguments:
		el - (mixed) A string ID of the Element or an Element reference to scroll to.

	Returns:
		(object) This Fx.Scroll instance.

	Example:
		[javascript]
			var myFx = new Fx.Scroll(window).toElement('myElement'); //places the element at the top left corner of the window.
		[/javascript]

	Note:
		See <Element.getPosition> for position difficulties.
	*/

	toElement: function(el){
		var position = Element.getAbsolutePosition($(el, true), this.element);
		var scroll = this.element.getScroll();
		return this.start(position.x + scroll.x, position.y + scroll.y);
	}

});
