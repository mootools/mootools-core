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

	options (continued):
		handle - (element: defaults to the element passed in) The Element to act as the handle for the draggable element.
		unit - (string: defaults to 'px') A string indicating the CSS unit to append to all integer values.
		limit - (object: defaults to false) An object with x and y properties used to limit the movement of the Element.
		modifiers - (object) An object with x and y properties used to indicate the CSS modifiers (i.e. 'left').
		grid - (integer: defaults to: false) Distance in px for snap-to-grid dragging.
		snap - (integer: defaults to 6) The distance to drag before the Element starts to respond to the drag.

		limit (continued):
			x - (array) Start and end limit relative to the 'x' setting of Modifiers.
			y - (array) Start and end limit relative to the 'y' setting of Modifiers.

		modifiers (continued):
			x - (string: defaults to 'left') The style to modify when the mouse moves in an horizontal direction.
			y - (string: defaults to 'top') The style to modify when the mouse moves in a vertical direction.

Events:
	onStart - (function) Executed when the user starts to drag (on mousedown).
		Signature:
			>onStart(element);

		Arguments:
			element - (element) The dragged Element.

	onBeforeStart - (function) Executed before the Drag instance attaches the events.
		Signature:
			>onBeforeStart(element);

		Arguments:
			element - (element) The dragged Element.

	onComplete - (function) Executed when the user completes the drag. Receives the dragged Element.
		Signature:
			>onComplete(element);

		Arguments:
			element - (element) The dragged Element.

	onSnap - (function) Executed when the user has dragged past the snap option.
		Signature:
			>onSnap(element)

		Arguments:
			element - (element) The dragged Element.

	onDrag - (function) Executed at every step of the drag. Receives the dragged Element.
		Signature:
			>onDrag(element)

		Arguments:
			element - (element) The dragged Element.

Returns:
	(class) A new Drag class instance.

Example:
	[javascript]
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
	[/javascript]

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
	Method: attach
		Attaches the mouse listener to the handle.

	Syntax:
		>myDrag.attach();

	Returns:
		(class) This Drag instance.

	Example:
		[javascript]
			var myDrag = new Drag('myElement').detach(); // the element is inert

			$('myActivator').addEvent('click', function(){
				alert('ok now you can drag.');
				myDrag.attach();
			});
		[/javascript]

	See Also:
		<$>, <Element.makeDraggable>, <Drag.detach>, <Element.addEvent>
	*/

	attach: function(){
		this.handle.addEvent('mousedown', this.bound.start);
		return this;
	},

	/*
	Method: detach
		Detaches the mouse listener from the handle.

	Syntax:
		>myDrag.detach();

	Returns:
		(class) This Drag instance.

	Example:
		[javascript]
			var myDrag = new Drag('myElement');
			$('myDeactivator').addEvent('click', function(){
				alert('no more dragging for you mr.');
				myDrag.detach();
			});
		[/javascript]

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
	Method: stop
		Stops (removes) all attached events from the Drag instance and executes the onComplete Event.

	Syntax:
		>myDrag.stop();

	Example:
		[javascript]
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
		[/javascript]
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
	Method: makeResizable
		Adds drag-to-resize behaviour to an Element using supplied options.

	Syntax:
		>var myResize = myElement.makeResizable([options]);

	Arguments:
		options - (object, optional) See <Drag> for acceptable options.

	Returns:
		(class) The created Drag instance.

	Example:
		[javascript]
			var myResize = $('myElement').makeResizable({
				onComplete: function(){
					alert('complete');
				}
			});
		[/javascript]

	See Also:
		<Drag>
	*/

	makeResizable: function(options){
		return new Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
	}

});
