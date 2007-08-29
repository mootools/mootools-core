/*
Script: Drag.js
	Contains <Drag>, <Element.makeResizable>

License:
	MIT-style license.

Note:
	This Script requires an XHTML doctype.
*/

/*
Class: Drag
	Enables the modification of two CSS properties of an Element based on the position of the mouse while the mouse button is down.

Syntax:
	>var myDragInstance = new Drag(el[, options]);

Arguments:
	el - (element) The Element to apply the transformations to.
	options - (object, optional) The options object.

Returns:
	(object) A new Drag class instance.

Options:
	handle - (element) The Element to act as the handle for the draggable element.  Defaults to the Element itself.
	unit - (string) A string indicating the CSS unit to append to all integer values. Defaults to 'px'.
	limit - (object) An object with x and y properties used to limit the movement of the Element. Defaults to false. See Limit below.
	modifiers - (object) An object with x and y properties used to indicate the CSS modifiers (i.e. 'left'). See Modifiers Below.
	grid - (integer) Distance in px for snap-to-grid dragging. Defaults to false.
	snap - (integer) The distance to drag before the Element starts to respond to the drag. Defaults to 6.

	Modifiers:
		x - (string) The style to modify when the mouse moves in an horizontal direction. Defaults to 'left'.
		y - (string) The style to modify when the mouse moves in a vertical direction. Defaults to 'top'.

	Limit:
		x - (array) Start and end limit relative to the 'x' setting of Modifiers.
		y - (array) Start and end limit relative to the 'y' setting of Modifiers.

Events:
	onStart - (function) Executed when the user starts to drag (on mousedown). Receives the dragged Element.
	onBeforeStart - (function) Executed before the Drag instance attaches the events. Receives the dragged Element.
	onComplete - (function) Executed when the user completes the drag. Receives the dragged Element.
	onSnap - (function) Executed when the user has dragged past the snap option. Receives the dragged Element.
	onDrag - (function) Executed at every step of the drag. Receives the dragged Element.

Example:
	(start code)
	var myInstance = new Drag('myDraggable', {
		onStart: function(el){
			this.moved = 0;
			el.addClass('dragging');
		},
		onComplete: function(el){
			el.removeClass('dragging');
			alert('you displaced ' + el.id + ' ' + this.moved + ' pixels');
		},
		onSnap: function(el){
			this.moved++;
		}
		snap: 0
	});
	(end)

See Also:
	<Options.setOptions>, <http://www.w3schools.com/css/css_units.asp>
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
		var params = Array.associate(arguments, {'options': 'object', 'element': ['element', 'string']});
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
		Attaches the mouse listener to the handle.

	Syntax:
		>myDrag.attach();

	Returns:
		(object) This Drag instance.

	Example:
		(start code)
		var myDrag = new Drag('myElement').detach(); // the element is inert

		$('myActivator').addEvent('click', function(){
			alert('ok now you can drag.');
			myDrag.attach();
		});
		(end)

	See Also:
		<$>, <Element.makeDraggable>, <Drag.detach>, <Element.addEvent>
	*/

	attach: function(){
		this.handle.addEvent('mousedown', this.bound.start);
		return this;
	},

	/*
	Property: detach
		Detaches the mouse listener from the handle.

	Syntax:
		>myDrag.detach();

	Returns:
		(object) This Drag instance.

	Example:
		(start code)
		var myDrag = new Drag('myElement');
		$('myDeactivator').addEvent('click', function(){
			alert('no more dragging for you mr.');
			myDrag.detach();
		});
		(end)

	See Also:
		<$>, <Element.makeDraggable>, <Element.addEvent>
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

	/*
	Property: stop
		Stops (removes) all attached events from the Drag instance and executes the onComplete Event.

	Syntax:
		>myDrag.stop();

	Example:
		(start code)
		var myDrag = new Drag('myElement', {
			onSnap: function(){
				this.moved = this.moved || 0;
				this.moved++;
				if(this.moved > 100) {
					this.stop();
					alert("Stop! You'll make the Element angry.");
				}
			}
		});
		(end)
	*/
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

	Syntax:
		>var myResize = myElement.makeResizable([options]);

	Arguments:
		options - (object, optional) See <Drag> for acceptable options.

	Returns:
		(object) The created Drag instance.

	Example:
		(start code)
		var myResize = $('myElement').makeResizable({
			onComplete: function(){
				alert('complete');
			}
		});
		(end)

	See Also:
		<Drag>
	*/

	makeResizable: function(options){
		return new Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
	}

});
