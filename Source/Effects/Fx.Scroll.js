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
	options - (object, optional) All <Fx> Options in addition to offset, overflown, and wheelStops.

	options (continued):
		offset     - (object: defaults to {'x': 0, 'y': 0}) An object with x/y properties for the distance to scrollTo the Element.
		overflown  - (array: defaults to []) An array of nested scrolling containers, see <Element.getPosition> for an explanation.
		wheelStops - (boolean: defaults to true) If false, the mouse wheel will not stop the transition from happening.

Returns:
	(class) A new Fx.Scroll instance.

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
		overflown: [],
		offset: {'x': 0, 'y': 0},
		wheelStops: true
	},

	initialize: function(element, options){
		arguments.callee.parent(null, options);
		this.setElement(element);
		this.now = [];
		this.bound = {'stop': this.stop.bind(this, false)};
	},
	
	setElement: function(element){
		this.element = $(element);
		if (!this.element) return;
		switch($type(this.element)){
			case 'window': this.document = this.element.document; break;
			case 'document': this.document = this.element; break;
			case 'element': this.document = this.element.ownerDocument;
		}
		if (this.options.wheelStops){
			this.addEvent('onStart', function(){
				this.document.addEvent('mousewheel', this.bound.stop);
			}.bind(this), true);
			this.addEvent('onComplete', function(){
				this.document.removeEvent('mousewheel', this.bound.stop);
			}.bind(this), true);
		}
	},

	setNow: function(){
		for (var i = 2; i--; i) this.now[i] = this.compute(this.from[i], this.to[i]);
	},

	/*
	Method: scrollTo
		Scrolls the specified Element to the x/y coordinates.

	Syntax:
		>myFx.scrollTo(x, y);

	Arguments:
		x - (integer) The x coordinate to scroll the Element to.
		y - (integer) The y coordinate to scroll the Element to.

	Returns:
		(class) This Fx.Scroll instance.

	Example:
		[javascript]
			var myElement = $(document.body);
			var myFx = new Fx.Scroll(myElement).scrollTo(0, 0.5 * document.body.offsetHeight);
		[/javascript]

	Note:
		Scrolling to (-x, -y) is impossible. :)
	*/

	scrollTo: function(x, y){
		if (this.timer && this.options.wait) return this;
		var el = this.element.getSize();
		var values = {'x': x, 'y': y};
		for (var z in el.clientSize){
			var max = el.scrollSize[z] - el.clientSize[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z].limit(0, max) : max;
			else values[z] = el.scroll[z];
			values[z] += this.options.offset[z];
		}
		return this.start([el.scroll.x, el.scroll.y], [values.x, values.y]);
	},

	/*
	Method: toTop
		Scrolls the specified Element to its maximum top.

	Syntax:
		>myFx.toTop();

	Returns:
		(class) This Fx.Scroll instance.

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
		return this.scrollTo(false, 0);
	},

	/*
	Method: toBottom
		Scrolls the specified Element to its maximum bottom.

	Syntax:
		>myFx.toBottom();

	Returns:
		(class) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement to the bottom and after 1 sec scroll to the top
			var myFx = new Fx.Scroll(window).toBottom().chain(function(){
				this.toTop.delay(1000, this);
			});
		[/javascript]
	*/

	toBottom: function(){
		return this.scrollTo(false, 'full');
	},

	/*
	Method: toLeft
		Scrolls the specified Element to its maximum left.

	Syntax:
		>myFx.toLeft();

	Returns:
		(class) This Fx.Scroll instance.

	Example:
		[javascript]
			// scroll myElement 200 pixels to the right and go back.
			var myFx = new Fx.Scroll('myElement').scrollTo(200, 0).chain(function(){
				this.toLeft();
			});
		[/javascript]
	*/


	toLeft: function(){
		return this.scrollTo(0, false);
	},

	/*
	Method: toRight
		Scrolls the specified Element to its maximum right.

	Syntax:
		>myFx.toRight();

	Returns:
		(class) This Fx.Scroll instance.

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
		return this.scrollTo('full', false);
	},

	/*
	Method: toElement
		Scrolls the specified Element to the position the passed in Element is found.

	Syntax:
		>myFx.toElement(el);

	Arguments:
		el - (mixed) A string ID of the Element or an Element reference to scroll to.

	Returns:
		(class) This Fx.Scroll instance.

	Example:
		[javascript]
			var myFx = new Fx.Scroll(window).toElement('myElement'); //places the element at the top left corner of the window.
		[/javascript]

	Note:
		See <Element.getPosition> for position difficulties.
	*/

	toElement: function(el){
		var parent = this.element.getPosition(this.options.overflown);
		var target = $(el).getPosition(this.options.overflown);
		return this.scrollTo(target.x - parent.x, target.y - parent.y);
	},

	increase: function(){
		this.element.scrollTo(this.now[0], this.now[1]);
	}

});