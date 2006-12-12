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

	initialize: function(elements, options){
		this.setOptions(this.getOptions(), options);
		var handles = this.options.handles || elements;
		$each(elements, function(el, i){
			handles[i].addEvent('mousedown', this.start.bindWithEvent(this, el));
		}, this);
	},

	start: function(event, el){
		document.addEvent('mousemove', this.move.bindWithEvent(this, el));
		document.addEvent('mouseup', this.end.bind(this, el));
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

	end: function(el){
		document.removeEvent('mousemove', this.move.bindWithEvent(this));
		this.fireEvent('onComplete', el);
	}

});

Sortables.implement(new Events);
Sortables.implement(new Options);