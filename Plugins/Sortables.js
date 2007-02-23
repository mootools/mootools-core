/*
Script: Sortables.js
	Contains <Sortables> Class.

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Sortables
	Creates an interface for <Drag.Base> and drop, resorting of a list.

Arguments:
	list - required, the list that will become sortable.
	options - an Object, see options below.

Options:
	handles - a collection of elements to be used for drag handles. defaults to the elements.
	onStart - function executed when the item starts dragging
	onComplete - function executed when the item ends dragging
*/

var Sortables = new Class({

	options: {
		handles: false,
		onStart: Class.empty,
		onComplete: Class.empty,
		ghost: true,
		snap: 3,
		onDragStart: function(element, ghost){
			ghost.setStyle('opacity', 0.7);
			element.setStyle('opacity', 0.7);
		},
		onDragComplete: function(element, ghost){
			element.setStyle('opacity', 1);
			ghost.remove();
			this.trash.remove();
		}
	},

	initialize: function(list, options){
		this.setOptions(options);
		this.list = $(list);
		this.elements = this.list.getChildren();
		this.handles = (this.options.handles) ? $$(this.options.handles) : this.elements;
		this.bound = {'start': [], 'moveGhost': this.moveGhost.bindWithEvent(this)};
		for (var i = 0, l = this.handles.length; i < l; i++){
			this.bound.start[i] = this.start.bindWithEvent(this, this.elements[i]);
		}
		this.attach();
		if (this.options.initialize) this.options.initialize.call(this);
	},
	
	attach: function(){
		this.handles.each(function(handle, i){
			handle.addEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	detach: function(){
		this.handles.each(function(handle, i){
			handle.removeEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	start: function(event, el){
		this.coordinates = this.list.getCoordinates();
		if (this.options.ghost){
			var position = el.getPosition();
			this.offset = event.page.y - position.y;
			this.trash = new Element('div').injectInside(document.body);
			this.ghost = el.clone().injectInside(this.trash).setStyles({
				'position': 'absolute',
				'left': position.x,
				'top': event.page.y - this.offset
			});
			document.addEvent('mousemove', this.bound.moveGhost);
			this.fireEvent('onDragStart', [el, this.ghost]);
		}
		this.bound.move = this.move.bindWithEvent(this, el);
		this.bound.end = this.end.bind(this, el);
		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.end);
		this.fireEvent('onStart', el);
		event.stop();
	},
	
	moveGhost: function(event){
		var value = event.page.y - this.offset;
		if (value < this.coordinates.top) value = this.coordinates.top;
		else if (value + this.ghost.offsetHeight > this.coordinates.bottom) value = this.coordinates.bottom - this.ghost.offsetHeight;
		this.ghost.setStyle('top', value);
		event.stop();
	},

	move: function(event, el){
		el.active = true;
		this.previous = this.previous || event.page.y;
		this.now = event.page.y;
		var direction = ((this.previous - this.now) <= 0) ? 'down' : 'up';
		var prev = el.getPrevious();
		var next = el.getNext();
		if (prev && direction == 'up'){
			var prevPos = prev.getCoordinates();
			if (event.page.y < prevPos.bottom) el.injectBefore(prev);
		}
		if (next && direction == 'down'){
			var nextPos = next.getCoordinates();
			if (event.page.y > nextPos.top) el.injectAfter(next);
		}
		this.previous = event.page.y;
	},

	serialize: function(){
		var serial = [];
		this.list.getChildren().each(function(el, i){
			serial[i] = this.elements.indexOf(el);
		}, this);
		return serial;
	},

	end: function(el){
		this.previous = null;
		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.end);
		if (this.options.ghost){
			document.removeEvent('mousemove', this.bound.moveGhost);
			this.fireEvent('onDragComplete', [el, this.ghost]);
		}
		this.fireEvent('onComplete', el);
	}

});

Sortables.implement(new Events);
Sortables.implement(new Options);