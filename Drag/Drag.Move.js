/*
Script: Drag.Move.js
	Contains <Drag.Move>, <Element.makeDraggable>

License:
	MIT-style license.
*/

/*
Class: Drag.Move
	Extends <Drag.Base>, has additional functionality for dragging an element, support snapping and droppables.
	Drag.move supports either position absolute or relative. If no position is found, absolute will be set.

Note:
	Drag.Move requires an XHTML doctype.

Arguments:
	el - the $(element) to apply the drag to.
	options - optional. see Options below.

Options:
	all the drag.Base options, plus:
	container - an element, will fill automatically limiting options based on the $(element) size and position. defaults to false (no limiting)
	droppables - an array of elements you can drop your draggable to.
*/

Drag.Move = Drag.Base.extend({

	options: {
		droppables: [],
		container: false,
		overflown: []
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.element = $(el);
		this.position = this.element.getStyle('position');
		this.droppables = $$(this.options.droppables);
		this.container = $(this.options.container);
		if (!['absolute', 'relative'].contains(this.position)) this.position = 'absolute';
		var top = this.element.getStyle('top').toInt();
		var left = this.element.getStyle('left').toInt();
		if (this.position == 'absolute'){
			top = $chk(top) ? top : this.element.getTop();
			left = $chk(left) ? left : this.element.getLeft();
		} else {
			top = $chk(top) ? top : 0;
			left = $chk(left) ? left : 0;
		}
		this.element.setStyles({
			'top': top,
			'left': left,
			'position': this.position
		});
		this.parent(this.element, this.options);
	},

	start: function(event){
		this.overed = null;
		if (this.container){
			var cont = this.container.getCoordinates();
			var el = this.element.getCoordinates();
			if (this.position == 'absolute'){
				this.options.limit = {
					'x': [cont.left, cont.right - el.width],
					'y': [cont.top, cont.bottom - el.height]
				};
			} else {
				var diffx = el.left - this.element.getStyle('left').toInt();
				var diffy = el.top - this.element.getStyle('top').toInt();
				this.options.limit = {
					'y': [-(diffy) + cont.top, cont.bottom - diffy - el.height],
					'x': [-(diffx) + cont.left, cont.right - diffx - el.width]
				};
			}
		}
		this.parent(event);
	},

	drag: function(event){
		this.parent(event);
		if (this.out) return this;
		var overed = false;
		var overed = this.droppables.filter(this.checkAgainst, this).getLast();
		if (this.overed != overed){
			if (this.overed) this.overed.fireEvent('leave', [this.element, this]);
			this.overed = overed ? overed.fireEvent('over', [this.element, this]) : null;
		}
		return this;
	},

	checkAgainst: function(el){
		el = el.getCoordinates(this.options.overflown);
		var now = this.mouse.now;
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},

	stop: function(){
		if (!this.out){
			if (this.overed) this.overed.fireEvent('drop', [this.element, this]);
			else this.element.fireEvent('emptydrop', this);
		}
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
		options - see <Drag.Move> and <Drag.Base> for acceptable options.
	*/

	makeDraggable: function(options){
		return new Drag.Move(this, options);
	}

});