/*
Script: Sortables.js
	Contains <Sortables> Class.

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
		this.bound = {
			'start': [],
			'moveGhost': this.moveGhost.bindWithEvent(this)
		};
		for (var i = 0, l = this.handles.length; i < l; i++){
			this.bound.start[i] = this.start.bindWithEvent(this, this.elements[i]);
		}
		this.attach();
		if (this.options.initialize) this.options.initialize.call(this);
		this.bound.move = this.move.bindWithEvent(this);
		this.bound.end = this.end.bind(this);
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
		this.active = el;
		this.coordinates = this.list.getCoordinates();
		if (this.options.ghost){
			var position = el.getPosition();
			this.offset = event.page.y - position.y;
			this.trash = new Element('div').inject(document.body);
			this.ghost = el.clone().inject(this.trash).setStyles({
				'position': 'absolute',
				'left': position.x,
				'top': event.page.y - this.offset
			});
			document.addListener('mousemove', this.bound.moveGhost);
			this.fireEvent('onDragStart', [el, this.ghost]);
		}
		document.addListener('mousemove', this.bound.move);
		document.addListener('mouseup', this.bound.end);
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

	move: function(event){
		this.active.active = true;
		this.previous = this.previous || event.page.y;
		this.now = event.page.y;
		var direction = ((this.previous - this.now) <= 0) ? 'down' : 'up';
		var prev = this.active.getPrevious();
		var next = this.active.getNext();
		if (prev && direction == 'up'){
			var prevPos = prev.getCoordinates();
			if (event.page.y < prevPos.bottom) this.active.injectBefore(prev);
		}
		if (next && direction == 'down'){
			var nextPos = next.getCoordinates();
			if (event.page.y > nextPos.top) this.active.injectAfter(next);
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

	end: function(){
		this.previous = null;
		document.removeListener('mousemove', this.bound.move);
		document.removeListener('mouseup', this.bound.end);
		if (this.options.ghost){
			document.removeListener('mousemove', this.bound.moveGhost);
			this.fireEvent('onDragComplete', [this.active, this.ghost]);
		}
		this.fireEvent('onComplete', this.active);
	}

});

Sortables.implement(new Events);
Sortables.implement(new Options);