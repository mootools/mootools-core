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

		droppables (continued):
			Interaction with droppable work with events fired on the doppable element or, for 'emptydrop', on the dragged element.
			The Events 'over', 'leave' and 'drop' get fired on the droppable element with the dragged element as first argument
			when the dragged element hovers, leaves or get dropped on the droppable.

Properties:
	All the properties in <Drag> in addition to:
	droppables - (element) The Elements that the draggable can drop into.

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
		container: false
	},

	initialize: function(element, options){
		arguments.callee.parent(element, options);
		this.droppables = $$(this.options.droppables);
		this.container = $(this.options.container);
		var position = this.element.getStyle('position');
		if (position == 'static') position = 'absolute';
		this.element.setPosition(this.element.getPosition(true), true).setStyle('position', position);
	},

	start: function(event){
		if (this.overed){
			this.overed.fireEvent('leave', [this.element, this]);
			this.overed = null;
		}
		if (this.container){
			var el = this.element, cont = this.container, cps = {}, ems = {};
			var ccoo = cont.getCoordinates((cont.getStyle('position') != 'static') ? cont : false);
			
			['top', 'right', 'bottom', 'left'].each(function(pad){
				cps[pad] = cont.getStyle('padding-' + pad).toInt();
				ems[pad] = el.getStyle('margin-' + pad).toInt();
			}, this);
			
			var width = el.offsetWidth + ems.left + ems.right, height = el.offsetHeight + ems.top + ems.bottom;
			var x = [ccoo.left + cps.left, ccoo.right - cps.right - width];
			var y = [ccoo.top + cps.top, ccoo.bottom - cps.bottom - height];

			this.options.limit = {x: x, y: y};
		}
		arguments.callee.parent(event);
	},

	drag: function(event){
		arguments.callee.parent(event);
		if (this.droppables.length) this.checkDroppables();
	},

	checkDroppables: function(){
		var overed = this.droppables.filter(this.checkAgainst, this).getLast();
		if (this.overed != overed){
			if (this.overed) this.overed.fireEvent('leave', [this.element, this]);
			this.overed = overed ? overed.fireEvent('over', [this.element, this]) : null;
		}
	},

	checkAgainst: function(el){
		el = el.getCoordinates();
		var now = this.mouse.now;
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},

	/*
	Method: stop
		Checks if the Element is above a droppable and fires the drop event. Else, fires the 'emptydrop' event that is attached to this Element.
		Lastly, calls <Drag.stop> method.

	Syntax:
		>myMove.stop();

	Returns:
		(object) This Drag.Move instance.

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

	stop: function(event){
		this.checkDroppables();
		if (this.overed) this.overed.fireEvent('drop', [this.element, this]);
		else this.element.fireEvent('emptydrop', this);
		return arguments.callee.parent(event);
	}

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

/*
Method: makeDraggable
	Makes an element draggable with the supplied options.

Syntax:
	>var myDrag = myElement.makeDraggable([options]);

Arguments:
	options - (object) See <Drag.Move> and <Drag> for acceptable options.

Returns:
	(object) A new Drag.Move instance.

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

Element.implement('makeDraggable', function(options){
	return new Drag.Move(this, options);
});
