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
	Creates an interface for <Drag> and drop, resorting of a list.

Arguments:
	elements - requires, the collection of elements that will become sortables.
	options - an Object, see options below.

Options:
	handles - a collection of elements to be used for drag handles. defaults to the elements.
	onStart - function executed when the item starts dragging
	onComplete - function executed when the item ends dragging
*/

var Sortables = new Class({

	getOptions: function() {
		return {
			handles: false,
			onStart: Class.empty,
			onComplete: Class.empty
		};
	},

	initialize: function(list, options){
		this.setOptions(this.getOptions(), options);
		this.list = $(list);
		this.elements = this.list.getChildren();
		this.handles = $$(this.options.handles) || this.elements;
		this.bound = {'start': []};
		this.elements.each(function(el, i){
			this.bound.start[i] = this.start.bindWithEvent(this, el);
			this.handles[i].addEvent('mousedown', this.start.bindWithEvent(this, el));
		}, this);
	},

	start: function(event, el){
		this.bound.move = this.move.bindWithEvent(this, el);
		this.bound.end = this.end.bind(this, el);
		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.end);
		this.fireEvent('onStart', el);
		event.stop();
	},

	move: function(event, el){
		var prev = el.getPrevious();
		var next = el.getNext();
		if (prev){
			var prevPos = prev.getPosition();
			if (event.page.y < prevPos.bottom) el.injectBefore(prev);
		}
		if (next){
			var nextPos = next.getPosition();
			if (event.page.y > nextPos.top) el.injectAfter(next);
		}
		event.stop();
	},
	
	detach: function(){
		this.elements.each(function(el, i){
			this.handles[i].removeEvent('mousedown', this.bound.start[i]);
		}, this);
	},
	
	serialize: function(){
		var serial = [];
		this.list.getChildren().each(function(el, i){
			serial[i] = this.elements.indexOf(el);
		}, this);
		return serial;
	},

	end: function(el){
		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.end);
		this.fireEvent('onComplete', el);
	}

});

Sortables.implement(new Events);
Sortables.implement(new Options);