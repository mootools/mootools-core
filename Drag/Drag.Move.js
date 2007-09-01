/*
Script: Drag.Move.js
	Contains <Drag.Move>, <Element.makeDraggable>

License:
	MIT-style license.

Note:
	Drag.Move requires an XHTML doctype.
*/

/*
Class: Drag.Move
	An extension to the base Drag class with additional functionality for dragging an Element.  Supports snapping and droppables.
	Inherits methods, properties, options and events from <Drag>.

Syntax:
	>var myMove = new Drag.Move(myElement[, options]);

Arguments:
	el - (element) The Element to apply the drag to.
	options - (object, optional) The options object. See below.

	options (continued):
		All the base <Drag> options, in addition to:
		container - (element) If an Element is passed, drag will be limited to the passed Element's size and position.
		droppables - (array) The Elements that the draggable can drop into.
		overflown - (array) Array of nested scrolling containers. See <Element.getPosition>.

		droppables (continued):
			Interaction with droppable work with events fired on the doppable element or, for 'emptydrop', on the dragged element.
			The Events 'over', 'leave' and 'drop' get fired on the droppable element with the dragged element as first argument
			when the dragged element hovers, leaves or get dropped on the droppable.

Example:
	[javascript]
		var droppables = $$('li.placements').addEvents({
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
		var myMove = new Drag.Move('product-placement', {
			'droppables': droppables
		});
	[/javascript]

Note:
	Drag.move supports either position absolute or relative. If no position is found, absolute will be set.

See Also:
	<Drag>, <$$>, <Element.addEvents>

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

	/*
	Method: stop
		Checks if the Element is above a droppable and fires the drop event. Else, fires the 'emptydrop' event that is attached to this Element. Lastly, calls <Drag.stop> method.

	Syntax:
		>myMove.stop();

	Returns:
		(class) This Drag.Move instance.

	Example:
		[javascript]
			var myElement = $('myElement').addEvent('emptydrop', function(){
				alert('no drop occurred');
			});

			var myMove = new Drag.Move(myElement, {
				onSnap: function(){ // due to MooTool's inheritance, all <Drag>'s Events are also available.
					this.moved = this.moved || 0;
					this.moved++;
					if(this.moved > 1000){
						alert("You've gone far enough.");
						this.stop();
					}
				}
			});
		[/javascript]

	See Also:
		<Drag.stop>
	*/
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
	Method: makeDraggable
		Makes an element draggable with the supplied options.

	Syntax:
		>var myDrag = myElement.makeDraggable([options]);

	Arguments:
		options - (object) See <Drag.Move> and <Drag> for acceptable options.

	Returns:
		(class) A new Drag.Move instance.

	Example:
		[javascript]
			var myDrag = $('myElement').makeDraggable({
				snap: 0,
				onStart: function(){
					this.moved = 0;
				},
				onSnap: function(){
					this.moved++;
				},
				onComplete: function()[
					alert("You'ved moved: " + this.moved + " times");
				}
			});
		[/javascript]

	See Also:
		<Drag.Move>, <Drag>, <Options.setOptions>
	*/

	makeDraggable: function(options){
		return new Drag.Move(this, options);
	}

});
