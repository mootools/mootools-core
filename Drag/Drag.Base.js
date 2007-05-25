/*
Script: Drag.Base.js
	Contains <Drag.Base>, <Element.makeResizable>

License:
	MIT-style license.
*/

var Drag = {};

/*
Class: Drag.Base
	Modify two css properties of an element based on the position of the mouse.
	
Note:
	Drag.Base requires an XHTML doctype.

Arguments:
	el - the $(element) to apply the transformations to.
	options - optional. The options object.

Options:
	handle - the $(element) to act as the handle for the draggable element. defaults to the $(element) itself.
	modifiers - an object. see Modifiers Below.
	limit - an object, see Limit below.
	grid - optional, distance in px for snap-to-grid dragging
	snap - optional, the distance you have to drag before the element starts to respond to the drag. defaults to false

	modifiers:
		x - string, the style you want to modify when the mouse moves in an horizontal direction. defaults to 'left'
		y - string, the style you want to modify when the mouse moves in a vertical direction. defaults to 'top'

	limit:
		x - array with start and end limit relative to modifiers.x
		y - array with start and end limit relative to modifiers.y
		
Events:
	onStart - optional, function to execute when the user starts to drag (on mousedown);
	onComplete - optional, function to execute when the user completes the drag.
	onDrag - optional, function to execute at every step of the drag
*/

Drag.Base = new Class({

	options: {
		handle: false,
		unit: 'px',
		onStart: Class.empty,
		onBeforeStart: Class.empty,
		onComplete: Class.empty,
		onSnap: Class.empty,
		onDrag: Class.empty,
		limit: false,
		modifiers: {x: 'left', y: 'top'},
		grid: false,
		snap: 6
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.element = $(el);
		this.handle = $(this.options.handle) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};
		this.bound = {
			'start': this.start.bindWithEvent(this),
			'check': this.check.bindWithEvent(this),
			'drag': this.drag.bindWithEvent(this),
			'stop': this.stop.bind(this)
		};
		this.attach();
		if (this.options.initialize) this.options.initialize.call(this);
	},

	attach: function(){
		this.handle.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handle.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		this.fireEvent('onBeforeStart', this.element);
		this.mouse.start = event.page;
		var limit = this.options.limit;
		this.limit = {'x': [], 'y': []};
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			this.value.now[z] = this.element.getStyle(this.options.modifiers[z]).toInt();
			this.mouse.pos[z] = event.page[z] - this.value.now[z];
			if (limit && limit[z]){
				for (var i = 0; i < 2; i++){
					if ($chk(limit[z][i])) this.limit[z][i] = ($type(limit[z][i]) == 'function') ? limit[z][i]() : limit[z][i];
				}
			}
		}
		if ($type(this.options.grid) == 'number') this.options.grid = {'x': this.options.grid, 'y': this.options.grid};
		document.addListener('mousemove', this.bound.check);
		document.addListener('mouseup', this.bound.stop);
		this.fireEvent('onStart', this.element);
		event.stop();
	},

	check: function(event){
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			document.removeListener('mousemove', this.bound.check);
			document.addListener('mousemove', this.bound.drag);
			this.drag(event);
			this.fireEvent('onSnap', this.element);
		}
		event.stop();
	},

	drag: function(event){
		this.out = false;
		this.mouse.now = event.page;
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];
			if (this.limit[z]){
				if ($chk(this.limit[z][1]) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
					this.out = true;
				} else if ($chk(this.limit[z][0]) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
					this.out = true;
				}
			}
			if (this.options.grid[z]) this.value.now[z] -= (this.value.now[z] % this.options.grid[z]);
			this.element.setStyle(this.options.modifiers[z], this.value.now[z] + this.options.unit);
		}
		this.fireEvent('onDrag', this.element);
		event.stop();
	},

	stop: function(){
		document.removeListener('mousemove', this.bound.check);
		document.removeListener('mousemove', this.bound.drag);
		document.removeListener('mouseup', this.bound.stop);
		this.fireEvent('onComplete', this.element);
	}

});

Drag.Base.implement(new Events, new Options);

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: makeResizable
		Makes an element resizable (by dragging) with the supplied options.

	Arguments:
		options - see <Drag.Base> for acceptable options.
	*/

	makeResizable: function(options){
		return new Drag.Base(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
	}

});