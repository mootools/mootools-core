/*
Script: Fx.Scroll.js
	Contains <Fx.Scroll>

License:
	MIT-style license.
*/

/*
Class: Fx.Scroll
	Scroll any element with an overflow, including the window element.
	Inherits methods, properties, options and events from <Fx.Base>.

Note:
	Fx.Scroll requires an XHTML doctype.

Arguments:
	element - the element to scroll
	options - optional, see Options below.

Options:
	all the Fx.Base options and events, plus:
	offset - the distance for the scrollTo point/element. an Object with x/y properties.
	overflown - an array of nested scrolling containers, see <Element.getPosition>
*/

Fx.Scroll = Fx.Base.extend({

	options: {
		overflown: [],
		offset: {'x': 0, 'y': 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.now = [];
		this.element = $(element);
		this.bound = {'stop': this.stop.bind(this, false)};
		this.parent(options);
		if (this.options.wheelStops){
			this.addEvent('onStart', function(){
				document.addEvent('mousewheel', this.bound.stop);
			}.bind(this));
			this.addEvent('onComplete', function(){
				document.removeEvent('mousewheel', this.bound.stop);
			}.bind(this));
		}
	},

	setNow: function(){
		for (var i = 0; i < 2; i++) this.now[i] = this.compute(this.from[i], this.to[i]);
	},

	/*
	Property: scrollTo
		Scrolls the chosen element to the x/y coordinates.

	Arguments:
		x - the x coordinate to scroll the element to
		y - the y coordinate to scroll the element to
	*/

	scrollTo: function(x, y){
		if (this.timer && this.options.wait) return this;
		var el = this.element.getSize();
		var values = {'x': x, 'y': y};
		for (var z in el.size){
			var max = el.scrollSize[z] - el.size[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z].limit(0, max) : max;
			else values[z] = el.scroll[z];
			values[z] += this.options.offset[z];
		}
		return this.start([el.scroll.x, el.scroll.y], [values.x, values.y]);
	},

	/*
	Property: toTop
		Scrolls the chosen element to its maximum top.
	*/

	toTop: function(){
		return this.scrollTo(false, 0);
	},

	/*
	Property: toBottom
		Scrolls the chosen element to its maximum bottom.
	*/

	toBottom: function(){
		return this.scrollTo(false, 'full');
	},

	/*
	Property: toLeft
		Scrolls the chosen element to its maximum left.
	*/

	toLeft: function(){
		return this.scrollTo(0, false);
	},

	/*
	Property: toRight
		Scrolls the chosen element to its maximum right.
	*/

	toRight: function(){
		return this.scrollTo('full', false);
	},

	/*
	Property: toElement
		Scrolls the specified element to the position the passed in element is found.

	Arguments:
		el - the $(element) to scroll the window to
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