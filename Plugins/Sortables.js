/*
Script: Sortables.js
	Contains <Sortables> Class.

License:
	MIT-style license.
*/

var Sortables = new Class({

	options: {
		clone: true,
		opacity: 0.4,
		handle: false,
		revert: false,
		onStart: $empty,
		onComplete: $empty,
		onListChange: $empty
	},

	initialize: function(lists, options){
		this.setOptions(options);

		this.busy = false;

		this.bound = {
			start: [],
			end: this.end.bind(this),
			move: this.move.bind(this),
			reset: this.reset.bind(this)
		};

		if (this.options.revert){
			var revertOptions = $merge({duration: 250, wait: false}, this.options.revert);
			this.effect = new Fx.Styles(null, revertOptions).addEvent('onComplete', this.bound.reset, true);
		}

		this.cloneContents = !!(this.options.clone);

		this.options.clone = (this.cloneContents) ? $merge({'opacity': 0.7}, this.options.clone, {wait: false}) : {'visibility': 'hidden'};

		this.lists = $$($(lists) || lists);

		this.refresh();
	},

	refresh: function(){
		this.items = [];

		this.lists.each(function(list){
			this.items.extend(list.getChildren());
		}, this);

		this.detach();

		this.items.each(function(item, i){
			this.bound.start[i] = this.start.bind(this, item, true);
		}, this);

		this.attach();
	},

	attach: function(){
		this.items.each(function(item, i){
			item.addEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	detach: function(){
		this.items.each(function(item, i){
			item.removeEvent('mousedown', this.bound.start[i]);
		}, this);
	},

	start: function(event, item){

		if (this.busy) return;

		this.mouse = {'start': {'x': event.page.x, 'y': event.page.y}};

		var styles = item.getStyles('margin-top', 'margin-left', 'border-top-width', 'border-left-width');
		this.margin = {
			'top': styles['margin-top'].toInt(),
			'left': styles['margin-left'].toInt()
		};

		this.lists.each(function(list){
			list.$offset = list.getPosition();
			list.$positioned = list.getStyle('position').test(/relative|absolute|fixed/);
		});

		var list = item.getParent();

		var position = item.getPosition(list);

		this.offset = {'x': event.page.x - position.x, 'y': event.page.y - position.y};

		this.clone = item.clone(this.cloneContents).setStyles(this.options.clone);

		this.item = item;
		this.list = list;

		var add = this.getPosition();

		this.clone.injectBefore(item.setStyles({
			'position': 'absolute',
			'opacity': this.options.opacity,
			'top': position.y + add.y,
			'left': position.x + add.x
		}));

		document.addEvent('mousemove', this.bound.move);
		document.addEvent('mouseup', this.bound.end);
		this.fireEvent('onStart', [this.item, this.list]);

		event.stop();
	},

	getPosition: function(){
		var position = {'x': - this.margin.left, 'y': - this.margin.top};
		if (Client.Engine.opera || this.list.$positioned){
			position.x += this.list.scrollLeft;
			position.y += this.list.scrollTop;
		}
		if (this.list.$positioned){
			position.x -= this.list.$offset.x;
			position.y -= this.list.$offset.y;
		}
		return position;
	},

	setItemPosition: function(){
		var position = {'x': this.mouse.now.x - this.offset.x, 'y': this.mouse.now.y - this.offset.y};
		var add = this.getPosition();
		this.item.setStyles({
			'top' : position.y + add.y,
			'left' : position.x + add.x
		});
	},

	swapItemList: function(list){
		var previous = this.list;
		this.item.inject(list);
		this.list = list;
		if (!this.check(this.item, list)){
			this.offset = {
				'x': this.item.offsetWidth / 2,
				'y': this.item.offsetHeight / 2
			};
			this.setItemPosition();
		}
		this.fireEvent('onListChange', [this.item, this.list, previous]);
	},

	move: function(event){
		this.mouse.now = {'x': event.page.x, 'y': event.page.y};

		this.setItemPosition();

		var found = false;

		for (var i = this.items.length; i--;){
			var item = this.items[i];
			if (item == this.item) continue;

			var list = item.getParent();
			if (this.check(list) && this.check(item, list)){
				if (list != this.list) this.swapItemList(list);
				this.clone.inject(item, this.where(item));
				found = true;
				break;
			}
		}

		if (!found){
			for (var j = this.lists.length; j--;){
				var current = this.lists[j];
				if (current == this.list) continue;

				if (this.check(current)){
					this.swapItemList(current);
					break;
				}
			}
		}

		this.mouse.start = {'x': event.page.x, 'y': event.page.y};
		event.stop();
	},

	check: function(item, list){
		var pos = item.getCoordinates(list);
		var now = this.mouse.now;
		return (now.x > pos.left && now.x < pos.right && now.y < pos.bottom && now.y > pos.top);
	},

	where: function(item){
		//check last & first
		var parent = item.getParent();
		if (parent.getLast() == item) return 'after';
		else if (parent.getFirst() == item) return 'before';

		//if no first & last, direction checks
		var diffs = {'x': this.mouse.start.x - this.mouse.now.x, 'y': this.mouse.start.y - this.mouse.now.y};

		//up & down have precedence
		if (diffs.y > 0) return 'before';
		else if (diffs.y < 0 && this.clone.getParent() != item.getParent()) return 'before';
		else if (diffs.y < 0) return 'after';

		//left & right, check for floats
		if (diffs.x < 0 && item.getStyle('float') == 'none') return 'before';
		else if (diffs.x < 0) return 'after';
		else return 'before';
	},

	end: function(){
		if (this.list != this.clone.getParent() && this.check(this.list)) this.clone.inject(this.list);

		document.removeEvent('mousemove', this.bound.move);
		document.removeEvent('mouseup', this.bound.end);

		var position = this.clone.getPosition(this.list);

		if (!this.effect){
			this.reset();
		} else {
			this.busy = true;
			this.effect.element = this.item;
			var add = this.getPosition();
			this.effect.start({
				'top' : position.y + add.y,
				'left' : position.x + add.x,
				'opacity' : 1
			});
		}
	},

	reset: function(){
		this.item.setStyles({
			'position': 'static',
			'opacity': 1
		}).injectBefore(this.clone);
		this.clone.destroy();
		this.fireEvent('onComplete', [this.item, this.list]);
		this.busy = false;
	},

	serialize: function(index, modifier){
		var map = modifier || function(element, index){
			return element.getProperty('id');
		}.bind(this);

		var serial = this.lists.map(function(list){
			return list.getChildren().map(map, this);
		}, this);

		if (this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});

Sortables.implement(new Events, new Options);