/*
Script: Sortables.js
	Class for creating a drag and drop sorting interface for lists of items.

License:
	MIT-style license.
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onSort: $empty,
		onStart: $empty,
		onComplete: $empty,*/
		snap: 4,
		handle: false,
		revert: false,
		constrain: false,
		cloneOpacity: 0.7,
		elementOpacity: 0.3
	},

	initialize: function(lists, options){
		this.setOptions(options);
		this.elements = [];
		this.lists = [];
		this.idle = true;

		this.addLists($$($(lists) || lists));
		if (this.options.revert) this.effect = new Fx.Morph(null, $merge({duration: 250, link: 'cancel'}, this.options.revert));
	},

	attach: function(){
		this.addLists(this.lists);
		return this;
	},

	detach: function(){
		this.lists = this.removeLists(this.lists);
		return this;
	},

	addItems: function(){
		Array.flatten(arguments).each(function(element){
			this.elements.push(element);
			var start = element.retrieve('sortables:start', this.start.bindWithEvent(this, element));
			var insert = element.retrieve('sortables:insert', this.insert.bind(this, element));
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
			element.addEvent('over', insert);
		}, this);
		return this;
	},

	addLists: function(){
		Array.flatten(arguments).each(function(list){
			this.lists.push(list);
			this.addItems(list.getChildren());
			list.addEvent('over', list.retrieve('sortables:insert', this.insert.bind(this, [list, 'inside'])));
		}, this);
		return this;
	},

	removeItems: function(){
		var elements = [];
		Array.flatten(arguments).each(function(element){
			elements.push(element);
			this.elements.erase(element);
			var start = element.retrieve('sortables:start');
			var insert = element.retrieve('sortables:insert');
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);
			element.removeEvent('over', insert);
		}, this);
		return elements;
	},

	removeLists: function(){
		var lists = [];
		Array.flatten(arguments).each(function(list){
			lists.push(list);
			this.lists.erase(list);
			this.removeItems(list.getChildren());
			list.removeEvent('over', list.retrieve('sortables:insert'));
		}, this);
		return lists;
	},

	getClone: function(element){
		return element.clone(true).setStyles({
			'margin': '0px',
			'position': 'absolute',
			'visibility': 'hidden'
		}).inject(this.list).position(element.getPosition(element.offsetParent));
	},

	getDroppables: function(){
		var droppables = this.list.getChildren();
		if (!this.options.constrain) droppables = this.lists.concat(droppables).erase(this.list);
		return droppables.erase(this.clone).erase(this.element);
	},

	insert: function(element, where){
		if (where) {
			this.list = element;
			this.drag.droppables = this.getDroppables();
		}
		where = where || (this.element.getAllPrevious().contains(element) ? 'before' : 'after');
		this.element.inject(element, where);
		this.fireEvent('onSort', [this.element, this.clone]);
	},

	start: function(event, element){
		if (!this.idle) return;
		this.idle = false;

		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(element);

		this.drag = this.clone.makeDraggable({
			snap: this.options.snap,
			container: this.options.constrain && this.clone.getParent(),
			droppables: this.getDroppables(),
			onStart: function(){
				event.stop();
				this.clone.set('opacity', this.options.cloneOpacity);
				this.element.set('opacity', this.options.elementOpacity);
				this.fireEvent('onStart', [this.element, this.clone]);
			}.bind(this),
			onCancel: this.reset.bind(this),
			onComplete: this.end.bind(this)
		});

		this.drag.start(event);
	},

	end: function(){
		this.element.set('opacity', this.opacity);
		this.drag.detach();
		if (this.effect){
			var dim = this.element.getStyles('width', 'height');
			var pos = this.clone.computePosition(this.element.getPosition(this.clone.offsetParent), this.clone.getParent().positioned());
			this.effect.element = this.clone;
			this.effect.start({
				'top': pos.top,
				'left': pos.left,
				'width': dim.width,
				'height': dim.height,
				'opacity': 0.25
			}).chain(this.reset.bind(this));
		} else {
			this.reset();
		}
	},

	reset: function(){
		this.idle = true;
		this.clone.destroy();
		this.fireEvent('onComplete', this.element);
	},

	serialize: function(index, modifier){
		var serial = this.lists.map(function(list){
			return list.getChildren().map(modifier || function(element, index){
				return element.get('id');
			}, this);
		}, this);

		if (this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});