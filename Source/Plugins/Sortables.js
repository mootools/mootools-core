var Sortables = new Class({
	
	Implements: [Events, Options],
	
	options: {/*
		onSort: $empty,
		onStart: $empty,
		onComplete: $empty,*/
		handle: false,
		revert: false,
		cloneOpacity: 0.7,
		elementOpacity: 0.3
	},
	
	initialize: function(lists, options){
		this.setOptions(options);
		this.elements = [];
		this.lists = [];
		this.idle = true;
		this.bound = {
			'start': {},
			'insert': {},
			'reset': this.reset.bind(this)
		};
		
		this.addLists($$($(lists) || lists));
		if (this.options.revert) this.effect = new Fx.Morph(null, $merge({duration: 250, link: 'cancel'}, this.options.revert));
	},
	
	attach: function(){
		this.addLists(this.lists);
	},
	
	detach: function(){
		this.lists = this.removeLists(this.lists);
	},
	
	addItems: function(){
		Array.flatten(arguments).each(function(element){
			var uid = element.uid[0];
			this.elements.push(element);
			
			this.bound.start[uid] = this.start.bindWithEvent(this, element);
			this.bound.insert[uid] = this.insert.bind(this, element);
			
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', this.bound.start[uid]);
			element.addEvent('over', this.bound.insert[uid]);
		}, this);
	},
	
	addLists: function(){
		Array.flatten(arguments).each(function(list){
			var uid = list.uid[0];
			this.lists.push(list);
			
			this.addItems(list.getChildren());
			this.bound.insert[uid] = this.insert.bind(this, [list, 'inside']);
			list.addEvent('over', this.bound.insert[uid]);
		}, this);
	},
	
	removeItems: function(){
		var elements = [];
		Array.flatten(arguments).each(function(element){
			elements.push(element);
			var uid = element.uid[0];
			this.elements.remove(element);
			
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', this.bound.start[uid]);
			element.removeEvent('over', this.bound.insert[uid]);
		}, this);
		return elements;
	},
	
	removeLists: function(){
		var lists = [];
		Array.flatten(arguments).each(function(list){
			lists.push(list);
			var uid = list.uid[0];
			this.lists.remove(list);
			this.removeItems(list.getChildren());
			list.removeEvent('over', this.bound.insert[uid]);
		}, this);
		return lists;
	},
	
	getClone: function(element){
		return element.clone(true).setStyles({
			'margin': '0px',
			'position': 'absolute',
			'visibility': 'hidden'
		}).inject(this.list).setPosition(element.getPosition(true), true);
	},
	
	getDroppables: function(){
		return this.lists.concat(this.list.getChildren()).remove(this.clone).remove(this.element).remove(this.list);
	},
	
	insert: function(element, where){
		if (where) {
			this.list = element;
			this.drag.droppables = this.getDroppables();
		}
		where = where || (this.element.getAllPrevious().contains(element) ? 'before' : 'after');
		this.element.inject(element, where);
	},
	
	start: function(event, element){
		if (!this.idle) return;
		this.idle = false;
		
		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(element);
		
		this.drag = this.clone.makeDraggable({
			snap: 0,
			droppables: this.getDroppables(),
			onStart: function(){
				event.stop();
				this.clone.set('opacity', this.options.cloneOpacity);
				this.element.set('opacity', this.options.elementOpacity);
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
			var parent = this.clone.getParent();
			var dim = this.element.getStyles('width', 'height');
			var pos = this.element.getPosition((parent.getStyle('position') != 'static') ? parent : false);
			pos = this.clone.computePosition(pos, true);
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
		this.clone.dispose();
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