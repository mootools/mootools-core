/*
Script: Fx.Scroll.js
	Contains <Fx.Scroll>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Fx.Scroll
	Scroll any element with an overflow, including the window element.

Arguments:
	element - the element to scroll
	options - same as <Fx.Base> options.
*/

Fx.Scroll = Fx.Base.extend({

	initialize: function(element, options){
		this.now = [];
		this.element = $(element);
		this.addEvent('onStart', function(){
			this.element.addEvent('mousewheel', this.stop.bind(this, false));
		}.bind(this));
		this.removeEvent('onComplete', function(){
			this.element.removeEvent('mousewheel', this.stop.bind(this, false));
		}.bind(this));
		this.parent(options);
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
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? Math.max(Math.min(values[z], max), 0) : max;
			else values[z] = el.scroll[z];
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
		Scrolls the specified element to the position the passed in element is found. Only usable if the chosen element is == window.

	Arguments:
		el - the $(element) to scroll the window to
	*/

	toElement: function(el){
		return this.scrollTo($(el).getLeft(), $(el).getTop());
	},

	increase: function(){
		this.element.scrollTo(this.now[0], this.now[1]);
	}

});