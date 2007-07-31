/*
Script: Drag.Move.js
	Contains <Drag.Move>, <Element.makeDraggable>

License:
	MIT-style license.
*/

/*
Class: Drag.Move
	An extension to the base Drag class with additional functionality for dragging an Element.  Support snapping and droppables.
	Drag.move supports either position absolute or relative. If no position is found, absolute will be set.
	Inherits methods, properties, options and events from <Drag>.

Note:
	Drag.Move requires an XHTML doctype.

Arguments:
	el - (Element) The Element to apply the drag to.
	options - (object) [optional] The options object.

Options:
	All the base <Drag> options, in addition to:
	container - (Element) [false] If an Element is passed, drag will be limited to the passed Element's size and position.
	droppables - (Elements) The Elements to be droppable into the draggable.
	overflown - (array) Array of nested scrolling containers, see <Element.getPosition>.

Droppables:
	Interaction with droppable work with events fired on the doppable element or, for 'emptydrop', on the dragged element.
	The Events 'over', 'leave' and 'drop' get fired on the droppable element with the dragged element as first argument
	when the dragged element hovers, leaves or get dropped on the droppable.

Example:
	(start code)
	var droppables = $$('li.placements');
	droppables.addEvents({
		'over': function() {
			this.addClass('overed');
		},
		'leave': function() {
			this.removeClass('overed');
		},
		'drop': function(el) {
			alert(el.id + ' dropped');
		}
	});
	new Drag.Move($('product-placement'), {
		'droppables': droppables
	});
	(end)

Demos:
	Drag.Cart - <http://demos.mootools.net/Drag.Cart>
	Drag.Absolutely - <http://demos.mootools.net/Drag.Absolutely>
	DragDrop - <http://demos.mootools.net/DragDrop>

*/

Drag.Move = new Class({

	Extends: Drag,

	options: {
		droppables: [],
		container: false,
		overflown: []
	},

	initialize: function(element, options){
		this.parent(element, options);
		this.droppables = $$(this.options.droppables);
		this.container = $(this.options.container);
		this.positions = ['relative', 'absolute', 'fixed'];
		this.position = {'element': this.element.getStyle('position'), 'container': false};
		if (this.container) this.position.container = this.container.getStyle('position');
		if (!this.positions.contains(this.position.element)) this.position.element = 'absolute';
		var top = this.element.getStyle('top').toInt();
		var left = this.element.getStyle('left').toInt();
		if (this.position.element == 'absolute' && !this.positions.contains(this.position.container)){
			top = $chk(top) ? top : this.element.getTop(this.options.overflown);
			left = $chk(left) ? left : this.element.getLeft(this.options.overflown);
		} else {
			top = $chk(top) ? top : 0;
			left = $chk(left) ? left : 0;
		}
		this.element.setStyles({'top': top, 'left': left, 'position': this.position.element});
	},

	start: function(event){
		if (this.overed){
			this.overed.fireEvent('leave', [this.element, this]);
			this.overed = null;
		}
		if (this.container){
			var cont = this.container.getCoordinates();
			var el = this.element.getCoordinates();
			if (this.position.element == 'absolute' && !this.positions.contains(this.position.container)){
				this.options.limit = {'x': [cont.left, cont.right - el.width], 'y': [cont.top, cont.bottom - el.height]};
			} else {
				this.options.limit = {'y': [0, cont.height - el.height], 'x': [0, cont.width - el.width]};
			}
		}
		this.parent(event);
	},

	drag: function(event){
		this.parent(event);
		if (this.droppables.length) this.checkDroppables();
	},

	checkDroppables: function(){
		var overed = this.out ? false : this.droppables.filter(this.checkAgainst, this).getLast();
		if (this.overed != overed){
			if (this.overed) this.overed.fireEvent('leave', [this.element, this]);
			this.overed = overed ? overed.fireEvent('over', [this.element, this]) : null;
		}
	},

	checkAgainst: function(el){
		el = el.getCoordinates(this.options.overflown);
		var now = this.mouse.now;
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},

	stop: function(){
		this.checkDroppables();
		if (this.overed && !this.out) this.overed.fireEvent('drop', [this.element, this]);
		else this.element.fireEvent('emptydrop', this);
		this.parent();
		return this;
	}

});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: makeDraggable
		Makes an element draggable with the supplied options.

	Arguments:
		options - (object) See <Drag.Move> and <Drag> for acceptable options.
	*/

	makeDraggable: function(options){
		return new Drag.Move(this, options);
	}

});
