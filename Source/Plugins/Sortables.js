/*
Script: Sortables.js
	Contains <Sortables> Class.

License:
	MIT-style license.
*/

/*
Class: Sortables
	Creates an interface for drag and drop sorting of a list or lists.

Implements:
	<Events>, <Options>

Syntax:
	>var mySortables = new Sortables(list[, options]);

Arguments:
	list    - (mixed) The list or lists that will be sortable.
	options - (object) An object to customize this Sortable's instance.

	list (continued):
		This argument can be an Element, or an array of Elements. When a single list (or ID) is passed, that list will be sortable only with itself.
		To enable sorting between lists, one or more lists or id's must be passed using an array or an object. See Example below.

	options (continued):
		constrain - (boolean: defaults to false) Whether or not to constrain the element being dragged to its parent element.
		clone     - (boolean: defaults to true) Whether or not to display a copy of the actual element while dragging.
		opacity   - (number: defaults to 0.7) Opacity of the element being dragged for sorting.
		handle    - (mixed: defaults to false) A Selector which can be used to select the element inside each item. The matched element will be used as a handle for sorting that item. If no match is found, the element is used as its own handle.
		revert    - (mixed: defaults to false) Whether or not to use an effect to slide the element into its final location after sorting. If you pass an object it will be used as additional options for the revert effect.

Events:
	onStart - (function) Fires when the item starts dragging.
		Signature:
			>onStart(element)

		Arguments:
			element - (element) The current Element being dragged.

	onComplete - (function) Fires when the item ends dragging.
		Signature:
			>onComplete(element)

		Arguments:
			element - (element) The Element that had been dragged.

Properties:
	idle - (boolean) The state of the interaction; true if the user is sorting.

Examples:
	A Simple Sortables:
	[javascript]
		var mySortables = new Sortables('list-1', {
			revert: { duration: 500, transition: Fx.Transitions.Elastic.easeOut }
		});
	[/javascript]

	Sorting Between Lists:
	[javascript]
		//creates a new Sortable instance allowing sorting between the lists with id's 'list-1', 'list-2, and 'list-3'
		var mySortables = new Sortables(['list-1', 'list-2', 'list-3']);
	[/javascript]

	A Sortables with Options:
	[javascript]
		//creates a new Sortable instance over the list with id 'list-1' with some extra options for the revert effect
		var mySortables = new Sortables(['list-1', 'list-2'], {
			constrain: true,
			clone: false,
			revert: true
		});
		//creates a new Sortable instance allowing the sorting of the lists with id's 'list-1' and 'list-2' with extra options
		//since constrain was set to false, the items will not be able to be dragged from one list to the other
	[/javascript]
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onStart: $empty,
		onComplete: $empty,*/
		clone: true,
		opacity: 0.7,
		handle: false,
		revert: false,
		constrain: false
	},

	initialize: function(lists, options){
		this.setOptions(options);
		this.idle = true;
		this.hovering = false;
		this.newInsert = false;
		this.bound = {
			start: [],
			end: this.end.bind(this),
			move: this.move.bind(this),
			reset: this.reset.bind(this)
		};
		if (this.options.revert){
			var revertOptions = $merge({duration: 250, wait: false}, this.options.revert);
			this.effect = new Fx.Morph(null, revertOptions).addEvent('onComplete', this.bound.reset, true);
		}
		this.cloneContents = !!(this.options.clone);

		this.lists = $$($(lists) || lists);

		this.reinitialize();
		if (this.options.initialize) this.options.initialize.call(this);
	},

	/*
	Method: reinitialize
		Allows the sortables instance to be reinitialized after making modifications to the DOM. Such as adding or removing elements from any of the lists.

	Syntax:
		>mySortables.reinitialize();

	Example:
		[javascript]
			var myList = $$('#myList li');
			var mySortables = new Sortables(myList);
			myList.getLast().dispose(); // poof gone from the DOM .. this will cause trouble.

			mySortables.reinitialize();
		[/javascript]
	*/

	reinitialize: function(){
		if (this.handles) this.detach();

		this.handles = [];
		var elements = [];

		this.lists.each(function(list){
			elements.extend(list.getChildren());
		});

		this.handles = !this.options.handle ? elements : elements.map(function(element){
			return element.getElement(this.options.handle) || element;
		}.bind(this));

		this.handles.each(function(handle, i){
			this.bound.start[i] = this.start.bindWithEvent(this, elements[i]);
		}, this);

		this.attach();
	},

	/*
	Method: attach
		Enables sorting by attaching the mousedown event to all the handles.

	Syntax:
		>mySortables.attach();

	Example:
		[javascript]
			var mySortables = new Sortables('.mySortables').detach();

			$('activator').addEvent('click', function(){
				alert('Sorting activated');
				mySortables.attach();
			});
		[/javascript]
	*/

	attach: function(){
		this.handles.each(function(handle, i){
			handle.addEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	/*
	Method: detach
		Detaches the mousedown event from the handles, disabling sorting.

	Syntax:
		>mySortables.detach();

	Example:
		[javascript]
			var mySortables = new Sortables('.mySortables').detach();
		[/javascript]
	*/

	detach: function(){
		this.handles.each(function(handle, i){
			handle.removeEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	check: function(element, list){
		element = element.get('coordinates');
		var coords = list ? element : {
			left: element.left - this.list.scrollLeft,
			right: element.right - this.list.scrollLeft,
			top: element.top - this.list.scrollTop,
			bottom: element.bottom - this.list.scrollTop
		};
		return (this.curr.x > coords.left && this.curr.x < coords.right && this.curr.y > coords.top && this.curr.y < coords.bottom);
	},

	where: function(element){
		if (this.newInsert){
			this.newInsert = false;
			return 'before';
		}
		var dif = {'x': this.curr.x - this.prev.x, 'y': this.curr.y - this.prev.y};
		return dif[['y', 'x'][(Math.abs(dif.x) >= Math.abs(dif.y)) + 0]] <= 0 ? 'before' : 'after';
	},

	reposition: function(){
		if (this.list.positioned){
			this.position.y -= this.offset.list.y - this.list.scrollTop;
			this.position.x -= this.offset.list.x - this.list.scrollLeft;
		} else if (Browser.Engine.presto){
			this.position.y += this.list.scrollTop;
			this.position.x += this.list.scrollLeft;
		}
	},

	start: function(event, element){
		if (!this.idle) return;

		this.idle = false;
		this.prev = {'x': event.page.x, 'y': event.page.y};

		this.styles = element.getStyles('margin-top', 'margin-left', 'padding-top', 'padding-left', 'border-top-width', 'border-left-width', 'opacity');
		this.margin = {
			'top': this.styles['margin-top'].toInt() + this.styles['border-top-width'].toInt(),
			'left': this.styles['margin-left'].toInt() + this.styles['border-left-width'].toInt()
		};

		this.element = element;
		this.list = this.element.getParent();
		this.list.hovering = this.hovering = true;
		this.list.positioned = this.list.getStyle('position').test(/relative|absolute|fixed/);

		var children = this.list.getChildren();
		var bounds = children.shift().get('coordinates');
		children.each(function(element){
			var coords = element.get('coordinates');
			bounds.left = Math.min(coords.left, bounds.left);
			bounds.right = Math.max(coords.right, bounds.right);
			bounds.top = Math.min(coords.top, bounds.top);
			bounds.bottom = Math.max(coords.bottom, bounds.bottom);
		});
		this.bounds = bounds;

		this.position = this.element.get('position', [this.list]);

		this.offset = {
			'list': this.list.get('position'),
			'element': {'x': event.page.x - this.position.x, 'y': event.page.y - this.position.y}
		};
		this.reposition();

		var clone = this.options.clone;
		switch ($type(clone)){
			case 'function': this.clone = clone.call(this, this.element); break;
			case 'boolean': clone = (clone) ? {'opacity': 0.7} : {'visibility': 'hidden'};
			case 'object': this.clone = this.element.clone(this.cloneContents).setStyles(clone);
		}

		this.clone.inject(this.element.setStyles({
			'position': 'absolute',
			'top': this.position.y - this.margin.top,
			'left': this.position.x - this.margin.left,
			'opacity': this.options.opacity
		}), 'before');

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

		if (!this.options.constrain){
			var oldSize, newSize;
			this.lists.each(function(list){
				if (!this.check(list, true)){
					list.hovering = false;
				} else if (!list.hovering){
					this.list = list;
					this.list.hovering = this.newInsert = true;
					this.list.positioned = this.list.getStyle('position').test(/relative|absolute|fixed/);
					oldSize = {x: this.clone.offsetWidth, y: this.clone.offsetHeight};
					this.list.adopt(this.clone, this.element);
					newSize = {x: this.clone.offsetWidth, y: this.clone.offsetHeight};
					this.offset = {
						'list': this.list.get('position'),
						'element': {
							'x': Math.round(newSize.x * (this.offset.element.x / oldSize.x)),
							'y': Math.round(newSize.y * (this.offset.element.y / oldSize.y))
						}
					};
				}
			}, this);
		}

		if (this.list.hovering){
			this.list.getChildren().each(function(element){
				if (!this.check(element)){
					element.hovering = false;
				} else if (!element.hovering && element != this.clone){
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

		this.position = this.clone.get('position', [this.list]);
		this.reposition();

		if (!this.effect){
			this.reset();
		} else {
			this.effect.element = this.element;
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
		}).inject(this.clone, 'before');
		this.clone.empty().dispose();

		this.fireEvent('onComplete', this.element);
		this.idle = true;
	},

	/*
	Method: serialize
		Function to get the order of the elements in the lists of this sortables instance.
		If more than one list is being used, all lists will be serialized and returned in an array.

	Syntax:
		>var serial = mySortables.serialize([index[, modifier]]);

	Arguments:
		index    - (number, optional) The index to serialize from the lists. Omit or pass false to serialize all lists.
		modifier - (function, optional) A function which returns important information, ie. the ID of the Element. See below.

	Returns:
		(array) An array containing the order of the elements.

	Examples:
		[javascript]
			//returns the second list serialized (remember, arrays are 0 based...)
			mySortables.serialize(1); //['item_1-1', 'item_1-2', 'item_1-3']

			//returns a nested array of all lists serialized, or if only one list exists, that lists order
			mySortables.serialize(); //[['item_1-1', 'item_1-2', 'item_1-3'], ['item_2-1', 'item_2-2', 'item_2-3'], ['item_3-1', 'item_3-2', 'item_3-3']]

			//joins the array with a '&' to return a string of the formatted ids of all the elmements in list 3 with their position
			mySortables.serialize(2, function(element, index){
				return element.get('id').replace('item_','') + '=' + index;
			}).join('&'); //'3-0=0&3-1=1&3-2=2'
		[/javascript]
	*/

	serialize: function(index, modifier){
		var map = modifier || function(element, index){
			return element.get('id');
		}.bind(this);

		var serial = this.lists.map(function(list){
			return list.getChildren().map(map, this);
		}, this);

		if (this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});
