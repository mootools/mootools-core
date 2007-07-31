/*
Script: Drag.js
	Contains <Drag>, <Element.makeResizable>

License:
	MIT-style license.
*/

/*
Class: Drag
	Enables the modification of two CSS properties of an Element based on the position of the mouse while the mouse button is held down.

Note:
	Drag requires an XHTML doctype.

Arguments:
	el - (Element) The Element to apply the transformations to.
	options - (object) [optional] The options object.

Options:
	handle    - (Element) [this.element] The Element to act as the handle for the draggable element.  Defaults to the Element itself.
	modifiers - (object)  [object]   See Modifiers Below.
	limit     - (object)  [false]    See Limit below.
	grid      - (integer) [optional] Distance in px for snap-to-grid dragging
	snap      - (integer) [false]    The distance to drag before the Element starts to respond to the drag.

	Modifiers:
		x - (string) [left] The style to modify when the mouse moves in an horizontal direction.
		y - (string) [top]  The style to modify when the mouse moves in a vertical direction.

	Limit:
		x - (array) [false] Start and end limit relative to the 'x' setting of Modifiers.
		y - (array) [false] Start and end limit relative to the 'y' setting of Modifiers.

Events:
	onStart    - (function) Executed when the user starts to drag (on mousedown).
	onComplete - (function) Executed when the user completes the drag.
	onDrag     - (function) Executed at every step of the drag.
*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {
		/*onStart: $empty,
		onBeforeStart: $empty,
		onComplete: $empty,
		onSnap: $empty,
		onDrag: $empty,*/
		handle: false,
		unit: 'px',
		limit: false,
		modifiers: {x: 'left', y: 'top'},
		grid: false,
		snap: 6
	},

	initialize: function(){
		var params = $A(arguments).associate({'options': 'object', 'element': ['element', 'string']});
		this.element = $(params.element);
		this.setOptions(params.options);
		this.handle = $(this.options.handle) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};
		this.bound = {
			'start': this.start.bind(this),
			'check': this.check.bind(this),
			'drag': this.drag.bind(this),
			'stop': this.stop.bind(this)
		};
		this.attach();
	},

	/*
	Property: attach
		Attaches the mouse listener to the handle; automatically called during initialize.

	Returns:
		The current Drag instance (this).
	*/

	attach: function(){
		this.handle.addEvent('mousedown', this.bound.start);
		return this;
	},

	/*
	Property: attach
		Detaches the mouse listener from the handle.

	Returns:
		The current Drag instance (this). 
	*/

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
				for (var i = 2; i--;){
					if ($chk(limit[z][i])) this.limit[z][i] = ($type(limit[z][i]) == 'function') ? limit[z][i]() : limit[z][i];
				}
			}
		}
		if ($type(this.options.grid) == 'number') this.options.grid = {'x': this.options.grid, 'y': this.options.grid};
		document.addEvents({
			'mousemove': this.bound.check,
			'mouseup': this.bound.stop
		});
		this.fireEvent('onStart', this.element);
		event.stop();
	},

	check: function(event){
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			document.removeEvent('mousemove', this.bound.check);
			document.addEvent('mousemove', this.bound.drag);
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
		document.removeEvent('mousemove', this.bound.check);
		document.removeEvent('mousemove', this.bound.drag);
		document.removeEvent('mouseup', this.bound.stop);
		this.fireEvent('onComplete', this.element);
	}

});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: makeResizable
		Adds drag-to-resize behaviour to an Element using supplied options.

	Arguments:
		options - (object) See <Drag> for acceptable options.

	Returns:
		The created Drag instance.
	*/

	makeResizable: function(options){
		return new Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
	}

});
