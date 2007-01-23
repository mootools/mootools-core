/*
Script: Drag.Base.js
	Contains <Drag.Base>, <Element.makeResizable>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

var Drag = {};

/*
Class: Drag.Base
	Modify two css properties of an element based on the position of the mouse.

Arguments:
	el - the $(element) to apply the transformations to.
	options - optional. The options object.

Options:
	handle - the $(element) to act as the handle for the draggable element. defaults to the $(element) itself.
	modifiers - an object. see Modifiers Below.
	onStart - optional, function to execute when the user starts to drag (on mousedown);
	onComplete - optional, function to execute when the user completes the drag.
	onDrag - optional, function to execute at every step of the drag
	limit - an object, see Limit below.
	snap - optional, the distance you have to drag before the element starts to respond to the drag. defaults to false

	modifiers:
		x - string, the style you want to modify when the mouse moves in an horizontal direction. defaults to 'left'
		y - string, the style you want to modify when the mouse moves in a vertical direction. defaults to 'top'

	limit:
		x - array with start and end limit relative to modifiers.x
		y - array with start and end limit relative to modifiers.y
*/

Drag.Base = new Class({

	getOptions: function(){
		return {
			handle: false,
			unit: 'px',
			onStart: Class.empty,
			onBeforeStart: Class.empty,
			onComplete: Class.empty,
			onSnap: Class.empty,
			onDrag: Class.empty,
			limit: false,
			modifiers: {x: 'left', y: 'top'},
			snap: 6
		};
	},

	initialize: function(el, options){
		this.setOptions(this.getOptions(), options);
		this.element = $(el);
		this.handle = $(this.options.handle) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};
		this.bound = {'start': this.start.bindWithEvent(this)};
		this.attach();
		if (this.options.initialize) this.options.initialize.call(this);
	},
	
	attach: function(){
		this.handle.addEvent('mousedown', this.bound.start);
	},

	start: function(event){
		this.fireEvent('onBeforeStart', this.element);
		this.mouse.start = event.page;
		var limit = this.options.limit;
		this.limit = {'x': [], 'y': []};
		for (var z in this.options.modifiers){
			this.value.now[z] = this.element.getStyle(this.options.modifiers[z]).toInt();
			this.mouse.pos[z] = event.page[z] - this.value.now[z];
			if (limit && limit[z]){
				for (var i = 0; i < 2; i++){
					if ($chk(limit[z][i])) this.limit[z][i] = limit[z][i].apply ? limit[z][i].call(this) : limit[z][i];
				}
			}
		}
		this.bound.drag = this.drag.bindWithEvent(this);
		this.bound.stop = this.stop.bind(this);
		this.bound.move = this.options.snap ? this.checkAndDrag.bindWithEvent(this) : this.bound.drag;
		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.stop);
		this.fireEvent('onStart', this.element);
		event.stop();
	},

	checkAndDrag: function(event){
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			document.removeEvent('mousemove', this.bound.move);
			this.bound.move = this.bound.drag;
			document.addEvent('mousemove', this.bound.move);
			this.drag(event);
			this.fireEvent('onSnap', this.element);
		}
		event.stop();
	},

	drag: function(event){
		this.out = false;
		this.mouse.now = event.page;
		for (var z in this.options.modifiers){
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
			this.element.setStyle(this.options.modifiers[z], this.value.now[z] + this.options.unit);
		}
		this.fireEvent('onDrag', this.element);
		event.stop();
	},
	
	detach: function(){
		this.handle.removeEvent('mousedown', this.bound.start);
	},

	stop: function(){
		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.stop);
		this.fireEvent('onComplete', this.element);
	}

});

Drag.Base.implement(new Events);
Drag.Base.implement(new Options);

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
		return new Drag.Base(this, Object.extend(options || {}, {modifiers: {x: 'width', y: 'height'}}));
	}

});