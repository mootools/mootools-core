/*
Script: Drag.js
	Contains Classes Drag.Base, Drag.Move and a couple of element methods to drag and resize your elements.
		
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>

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
	xModifier - required. The css property to modify, based to the position on the X axis of the mouse. defaults to none.
	yModifier - required. The css property to modify, based to the position on the Y axis of the mouse pointer. defaults to none.
	options - optional. The options object.

Options:
	handle - the $(element) to act as the handle for the draggable element. defaults to the $(element) itself.
	onStart - function to execute when the user starts to drag (on mousedown); optional.
	onComplete - optional, function to execute when the user completes the drag.
	onDrag - optional, function to execute at every step of the dragged $(element).
	xMax - optional, the maximum value for the x property of the dragged $(element).
	xMin - optional, the minium value for the x property of the dragged $(element).
	yMax - optional, the maximum value for the y property of the dragged $(element).
	yMin - optional, the minium value for the y property of the dragged $(element).
*/

Drag.Base = new Class({

	setOptions: function(options){
		this.options = Object.extend({
			handle: false,
			unit: 'px', 
			onStart: Class.empty, 
			onComplete: Class.empty, 
			onDrag: Class.empty,
			xMax: false,
			xMin: false,
			yMax: false,
			yMin: false
		}, options || {});
	},

	initialize: function(el, xModifier, yModifier, options){
		this.setOptions(options);
		this.element = $(el);
		this.handle = $(this.options.handle) || this.element;
		if (xModifier) this.xp = xModifier.camelCase();
		if (yModifier) this.yp = yModifier.camelCase();
		this.handle.onmousedown = this.start.bind(this);
	},

	start: function(evt){
		evt = evt || window.event;
		this.startX = evt.clientX;
		this.startY = evt.clientY;
		
		this.handleX = this.startX - this.handle.getLeft();
		this.handleY = this.startY - this.handle.getTop();
		
		this.set(evt);
		this.options.onStart.pass(this.element, this).delay(10);
		document.onmousemove = this.drag.bind(this);
		document.onmouseup = this.end.bind(this);
		return false;
	},

	addStyles: function(x, y){
		if (this.xp){
			var stylex = this.element.getStyle(this.xp).toInt();
		
			var movex = function(val){
				this.element.setStyle(this.xp, val+this.options.unit);
			}.bind(this);
		
			if (this.options.xMax && stylex >= this.options.xMax){
				if (this.clientX <= this.handleX+this.handle.getLeft()) movex(stylex+x);
				if (stylex > this.options.xMax) movex(this.options.xMax);
			} else if(this.options.xMin && stylex <= this.options.xMin){
				if (this.clientX >= this.handleX+this.handle.getLeft()) movex(stylex+x);
				if (stylex < this.options.xMin) movex(this.options.xMin);
			} else movex(stylex+x);
		}
		if (this.yp){
			var styley = this.element.getStyle(this.yp).toInt();

			var movey = function(val){
				this.element.setStyle(this.yp, val+this.options.unit);
			}.bind(this);

			if (this.options.yMax && styley >= this.options.yMax){
				if (this.clientY <= this.handleY+this.handle.getTop()) movey(styley+y);
				if (styley > this.options.yMax) movey(this.options.yMax);
			} else if(this.options.yMin && styley <= this.options.yMin){
				if (this.clientY >= this.handleY+this.handle.getTop()) movey(styley+y);
				if (styley < this.options.yMin) movey(this.options.yMin);
			} else movey(styley+y);
		}
	},

	drag: function(evt){
		evt = evt || window.event;
		this.clientX = evt.clientX;
		this.clientY = evt.clientY;
		this.options.onDrag.pass(this.element, this).delay(5);
		this.addStyles((this.clientX-this.lastMouseX), (this.clientY-this.lastMouseY));
		this.set(evt);
		return false;
	},

	set: function(evt){
		this.lastMouseX = evt.clientX;
		this.lastMouseY = evt.clientY;
		return false;
	},

	end: function(){
		document.onmousemove = null;
		document.onmouseup = null;
		this.options.onComplete.pass(this.element, this).delay(10);
	}

});

/*
Class: Drag.Move
	Extends <Drag.Base>, has additional functionality for dragging an element (modifying its left and top values).

Arguments:
	el - the $(element) to apply the transformations to.
	options - optional. The options object.
	
Options:
	all the drag.Base options, plus:
	snap - if true the element will start dragging after a certain distance has been reached from the mousedown. defaults to true.
	snapDistance - integer representing the snapping distance. Default is 8.
	onSnap - function to execute when the element has been dragged the snapDistance.
	xModifier - the modifier to handle left and right dragging; defaults to left.
	yModifier - the modifier to handle up and down dragging; defaults to top.
	container - if set to an element will fill automatically xMin/xMax/yMin/yMax based on the $(element) size and position. defaults to false.
*/

Drag.Move = Drag.Base.extend({

	extendOptions: function(options){
		this.options = Object.extend(this.options || {}, Object.extend({
			onSnap: Class.empty,
			droppables: [],
			snapDistance: 8,
			snap: true,
			xModifier: 'left',
			yModifier: 'top',
			container: false
		}, options || {}));
	},

	initialize: function(el, options){
		this.extendOptions(options);
		this.container = $(this.options.container);
		this.parent(el, this.options.xModifier, this.options.yModifier, this.options);
	},

	start: function(evt){
		if (this.options.container) {
			var cont = $(this.options.container).getPosition();
			Object.extend(this.options, {
				xMax: cont.right-this.element.offsetWidth,
				xMin: cont.left,
				yMax: cont.bottom-this.element.offsetHeight,
				yMin: cont.top
			});
		}
		this.parent(evt);
		if (this.options.snap) document.onmousemove = this.checkAndDrag.bind(this);
		return false;
	},

	drag: function(evt){
		this.parent(evt);
		this.options.droppables.each(function(drop){
			if (this.checkAgainst(drop)){
				if (drop.onOver && !drop.dropping) drop.onOver.pass([this.element, this], drop).delay(10);
				drop.dropping = true;
			} else {
				if (drop.onLeave && drop.dropping) drop.onLeave.pass([this.element, this], drop).delay(10);
				drop.dropping = false;
			}
		}, this);
		return false;
	},

	checkAndDrag: function(evt){
		evt = evt || window.event;
		var distance = Math.round(Math.sqrt(Math.pow(evt.clientX - this.startX, 2)+Math.pow(evt.clientY - this.startY, 2)));
		if (distance > this.options.snapDistance){
			this.set(evt);
			this.options.onSnap.pass(this.element, this).delay(10);
			document.onmousemove = this.drag.bind(this);
			this.addStyles(-(this.startX-evt.clientX), -(this.startY-evt.clientY));
		}
		return false;
	},

	checkAgainst: function(el){
		x = this.clientX+Window.getScrollLeft();
		y = this.clientY+Window.getScrollTop();
		var el = $(el).getPosition();
		return (x > el.left && x < el.right && y < el.bottom && y > el.top);
	},

	end: function(){
		this.parent();
		this.options.droppables.each(function(drop){
			if (drop.onDrop && this.checkAgainst(drop)) drop.onDrop.pass([this.element, this], drop).delay(10);
		}, this);
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
	},
	
	/*
	Property: makeResizable
		Makes an element resizable (by dragging) with the supplied options.

	Arguments:
		options - see <Drag.Base> for acceptable options.
	*/
	
	makeResizable: function(options){
		return new Drag.Base(this, 'width', 'height', options);
	},
	
	/*	
	Property: getPosition
		Returns an object with width, height, left, right, top, and bottom, representing the values of the Element
		
	Example:
		>var myValues = $('myElement').getPosition();
		>//myValues will be..
	 	>{
		>	width: 200,
		>	height: 300,
		>	left: 100,
		>	top: 50,
		>	right: 300,
		>	bottom: 350
		>}
	*/

	getPosition: function(){
		var obj = {};
		obj.width = this.offsetWidth;
		obj.height = this.offsetHeight;
		obj.left = this.getLeft();
		obj.top = this.getTop();
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}

});