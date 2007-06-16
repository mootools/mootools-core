/*
Script: Sortables.js
	Contains <Sortables> Class.

License:
	MIT-style license.
*/

/*
Class: Sortables
	Creates an interface for drag and drop sorting of a list or lists.
	Requires version 1.2dev of MooTools

Arguments:
	list - required, the list or lists that will become sortable.
		This argument can be a string id, an element, or an object or array of either strings or elements. When a single
		list (or id) is passed, that list will be sortable only with itself. To enable sorting between lists, one or more
		lists or id's must be passed using an array or an object. See Examples below.
	options - an Object, see options and events below.

Options:
	clone - whether or not to display a copy of the actual element while dragging. defaults to true.
	cloneOpacity - opacity of the place holding element
	elementOpacity - opacity of the element being dragged for sorting
	revert - whether or not to use an effect to slide the element into its final location after sorting. defaults to false.
	revertOptions - an object specifying extra options to be passed to the revert effect, if used.
	handle - a selector which be used to select the element inside each item to be used as a handle for sorting that item.  if no match is found, the element is used as its own handle.
	constrain - whether or not to constrain the element being dragged to its parent element. defaults to false.

Events:
	onStart - function executed when the item starts dragging
	onComplete - function executed when the item ends dragging

Example:
	(start code)
	var mySortables = new Sortables('list-1', {
		revert: true,
		revertOptions: {duration: 500, transition: Fx.Transitions.Elastic.easeOut}
	});
	//creates a new Sortable instance over the list with id 'list-1' with some extra options for the revert effect
	
	var mySortables = new Sortables(['list-1', 'list-2', 'list-3']);
	//creates a new Sortable instance allowing sorting between the elements with id's 'list-1', 'list-2, and 'list-3'
	(end)

*/

var Sortables = new Class({
	
	options: {
		clone: true,
		cloneOpacity: 0.7,
		elementOpacity: 0.7,
		revert: false,
		revertOptions: { duration: 250 },
		handle: false,
		constrain : false,
		onStart: $empty,
		onComplete: $empty
	},

	initialize: function(lists, options){
		this.setOptions(options);
		this.idle = true;
		this.lists = [];
		this.hovering = false;
		this.newInsert = false;
		this.bound = {
			'start': [],
			'end': this.end.bind(this),
			'move': this.move.bind(this)
		};
		
		switch ($type(lists)) {
			case 'array'  : for (var i = 0, l = lists.length; i < l; i++) this.lists[i] = $(lists[i]); break;
			case 'object' : for (var e in lists) this.lists.push($(lists[e])); break;
			case 'string' :	case 'element' : this.lists.push($(lists)); break;
			default : return;
		}
		
		this.reinitialize();
		if (this.options.initialize) this.options.initialize.call(this);
	},
	
	/*
	Property: reinitialize
		Allows the sortables instance to be reinitialized after making modifications to the DOM such as adding or removing elements from any of the lists.
	*/
	
	reinitialize: function(){
		if(this.handles) this.detach();
		
		this.elements = [];
		this.handles = [];
		
		this.lists.each(function(e,i){
			this.elements.extend(e.getChildren());
		}, this);
		
		this.handles = !this.options.handle ? this.elements : this.elements.map(function(element){
			return element.getElement(this.options.handle) || element;
		}.bind(this));
		
		this.handles.each(function(handle, i) {
			this.bound.start[i] = this.start.bind(this, this.elements[i], true);
		}, this);

		this.attach();
	},
	
	/*
	Property: attach
		Attaches the mousedown event to all the handles, enabling sorting.
	*/
	
	attach: function(){
		this.handles.each(function(handle, i){
			handle.addEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	/*
	Property: detach
		Detaches the mousedown event from the handles, disabling sorting.
	*/
	
	detach: function(){
		this.handles.each(function(handle, i){
			handle.removeEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	check: function(element, list){
		element = element.getCoordinates();
		var coords = list ? element : {
			left: element.left - this.list.scrollLeft,
			right: element.right - this.list.scrollLeft,
			top: element.top - this.list.scrollTop,
			bottom: element.bottom - this.list.scrollTop
		};
		return (this.curr.x > coords.left && this.curr.x < coords.right && this.curr.y > coords.top && this.curr.y < coords.bottom);
	},
	
	where: function(element){
		if (this.newInsert) { this.newInsert = false; return 'before'; }
		var dif = { x : this.curr.x - this.prev.x, y : this.curr.y - this.prev.y };
		return dif[['y', 'x'][(Math.abs(dif.x) >= Math.abs(dif.y)) + 0]] <= 0 ? 'before' : 'after';
	},
	
	reposition: function(){
		if (this.list.positioned) {
			this.position.y -= this.offset.list.y - this.list.scrollTop;
			this.position.x -= this.offset.list.x - this.list.scrollLeft;
		}
		else if (Client.engine.opera) {
			this.position.y += this.list.scrollTop;
			this.position.x += this.list.scrollLeft;
		}
	},
	
	start: function(event, element){
		if (!this.idle) return;

		this.idle = false;
		this.prev = {x : event.page.x, y : event.page.y};
		
		this.styles = element.getStyles('margin-top', 'margin-left', 'padding-top', 'padding-left', 'border-top-width', 'border-left-width', 'opacity');
		this.margin = {
			'top': this.styles['margin-top'].toInt() + this.styles['border-top-width'].toInt(),
			'left': this.styles['margin-left'].toInt() + this.styles['border-left-width'].toInt()
		};

		this.element = element;
		this.list = this.element.getParent();
		this.list.hovering = this.hovering = true;
		this.list.positioned = this.list.getStyle('position').test('relative|absolute|fixed');
		
		var coords, children = this.list.getChildren();
		this.bounds = children[0].getCoordinates();
		children.shift();
		children.each(function(e){
			coords = e.getCoordinates();
			this.bounds.left = Math.min(coords.left, this.bounds.left);
			this.bounds.right = Math.max(coords.right, this.bounds.right);
			this.bounds.top = Math.min(coords.top, this.bounds.top);
			this.bounds.bottom = Math.max(coords.bottom, this.bounds.bottom);
		}, this);
		
		this.position = this.element.getPosition([this.list]);
		this.offset = {
			'list': this.list.getPosition(),
			'element': {'x': event.page.x - this.position.x, 'y': event.page.y - this.position.y}
		};
		this.reposition();
		
		if (this.options.clone) this.clone = this.element.clone().setOpacity(this.options.cloneOpacity);
		else this.clone = new Element(this.element.getTag()).setStyles({'visibility' : 'hidden'}).setHTML('&nbsp;');
		this.clone.injectBefore(this.element.setStyles({
			'position' : 'absolute',
			'top' : this.position.y - this.margin.top,
			'left' : this.position.x - this.margin.left,
			'opacity': this.options.elementOpacity
		}));

		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.end);
		this.fireEvent('onStart', this.element);
		event.stop();
	},
	
	move: function(event){
		this.curr = {'x': event.page.x, 'y': event.page.y};
		this.position = {'x': this.curr.x - this.offset.element.x, 'y': this.curr.y - this.offset.element.y};
		
		if (this.options.constrain) {
			this.position.y = this.position.y.limit(this.bounds.top, this.bounds.bottom - this.element.offsetHeight);
			this.position.x = this.position.x.limit(this.bounds.left, this.bounds.right - this.element.offsetWidth);
		}
		this.reposition();
		this.element.setStyles({
			'top' : this.position.y - this.margin.top,
			'left' : this.position.x - this.margin.left
		});

		if (!this.options.constrain) {
			var oldSize, newSize;
			this.lists.each(function(list) {
				if (!this.check(list, true)) list.hovering = false;
				else if (!list.hovering) {
					this.list = list;
					this.list.hovering = this.newInsert = true;
					this.list.positioned = this.list.getStyle('position').test('relative|absolute|fixed');
					oldSize = this.clone.getSize().size;
					this.list.adopt(this.clone, this.element);
					newSize = this.clone.getSize().size;
					this.offset = {
						'list': this.list.getPosition(),
						'element': {
							'x': Math.round(newSize.x * (this.offset.element.x / oldSize.x)),
							'y': Math.round(newSize.y * (this.offset.element.y / oldSize.y))
						}
					};
				}
			}, this);
		}
		
		if (this.list.hovering){
			this.list.getChildren().each(function(element) {
				if (!this.check(element)) element.hovering = false;
				else if (!element.hovering && element != this.clone) {
					element.hovering = true;
					this.clone.inject(element, this.where(element));
				}
			}, this);
		}
		
		this.prev = this.curr;
		event.stop();
	},

	end: function(){
		this.prev = null;
		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.end);
		
		this.position = this.clone.getPosition([this.list]);
		this.reposition();

		if (!this.options.revert) this.reset();
		else {
			if (!this.effect) this.effect = this.element.effects($merge(this.options.revertOptions, {wait: false, onComplete: this.reset.bind(this)}));
			else this.effect.element = this.element;
			this.effect.start({
				'top' : this.position.y - this.margin.top,
				'left' : this.position.x - this.margin.left,
				'opacity' : this.styles.opacity
			});
		}
	},

	reset: function(){
		this.element.setStyles({
			'position': 'static',
			'opacity': this.styles.opacity
		}).injectBefore(this.clone);
		this.clone.empty().remove();
		
		this.fireEvent('onComplete', this.element);
		this.idle = true;
	},
	
	/*
	Property: serialize
		Function to get the order of the elements in the lists of this sortables instance.
		For each list, an array containing the order of the elements will be returned.
		If more than one list is being used, all lists will be serialized and returned in an array.

	Arguments:
		index - int or false; index of the list to serialize. Omit or pass false to serialize all lists.
		modifier - function to override the default output of the sortables.  See Examples below
		
	Examples:
	(start code)
	mySortables.serialize(1);
	//returns the second list serialized (remember, arrays are 0 based...);
	//['item_1-1', 'item_1-2', 'item_1-3']
	
	mySortables.serialize();
	//returns a nested array of all lists serialized, or if only one list exists, that lists order
	//[['item_1-1', 'item_1-2', 'item_1-3'], ['item_2-1', 'item_2-2', 'item_2-3'], ['item_3-1', 'item_3-2', 'item_3-3']]
	
	mySortables.serialize(2, function(element, index){
		return element.getProperty('id').replace('item_','') + '=' + index;
	}).join('&');
	//joins the array with a '&' to return a string of the formatted ids of all the elmements in list 3 with their position
	//'3-0=0&3-1=1&3-2=2'
	(end)
	*/
	
	serialize: function(index, modifier){
		var map = modifier || function(element, index){
			return element.getProperty('id');
		}.bind(this);
		
		var serial = this.lists.map(function(list){
			return list.getChildren().map(map, this);
		}, this);
		
		if(this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});

Sortables.implement(new Events, new Options);