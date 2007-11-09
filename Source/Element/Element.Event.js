/*
Script: Element.Event.js
	Contains the Event Native, Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

var Event = new Native({

	name: 'Event',

	initialize: function(event, win){
		win = win || window;
		event = event || win.event;
		if (event.$extended) return event;
		this.$extended = true;
		var type = event.type;
		var target = event.target || event.srcElement;
		while (target && target.nodeType == 3) target = target.parentNode;
		if (type.test(/DOMMouseScroll|mousewheel/)){
			this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		} else if (type.test(/key/)){
			this.code = event.which || event.keyCode;
			var key = Event.Keys.keyOf(this.code);
			if (type == 'keydown'){
				var fKey = this.code - 111;
				if (fKey > 0 && fKey < 13) key = 'f' + fKey;
			}
			this.key = key || String.fromCharCode(this.code).toLowerCase();
		} else if (type.test(/(click|mouse|menu)/)){
			this.page = {
				x: event.pageX || event.clientX + win.document.documentElement.scrollLeft,
				y: event.pageY || event.clientY + win.document.documentElement.scrollTop
			};
			this.client = {
				x: event.pageX ? event.pageX - win.pageXOffset : event.clientX,
				y: event.pageY ? event.pageY - win.pageYOffset : event.clientY
			};
			this.rightClick = (event.which == 3) || (event.button == 2);
			var related = null;
			if (type.test(/over|out/)){
				switch (type){
					case 'mouseover': related = event.relatedTarget || event.fromElement; break;
					case 'mouseout': related = event.relatedTarget || event.toElement;
				}
				if ((function(){
					while (related && related.nodeType == 3) related = related.parentNode;
				}).create({attempt: Browser.Engine.gecko})() === false) related = false;
			}
		}

		return $extend(this, {
			event: event,
			type: type,
			relatedTarget: related,
			target: target,
			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey
		});
	}

});

Event.Keys = new Hash({
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
});

Event.implement({

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

Native.implement([Element, Window, Document], {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		events[type] = events[type] || {'keys': [], 'values': []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type, custom = Element.Events.get(type), condition = fn, self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event)) return fn.call(this, event);
					return false;
				};
			}
			realType = custom.base || realType;
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType] || 0;
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new Event(event, (self.ownerDocument || self).window);
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn);
		}
		events[type].values.push(defn);
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var pos = events[type].keys.indexOf(fn);
		if (pos == -1) return this;
		var key = events[type].keys.splice(pos, 1)[0];
		var value = events[type].values.splice(pos, 1)[0];
		var custom = Element.Events.get(type);
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn);
			type = custom.base || type;
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(type){
		var events = this.retrieve('events');
		if (!events) return this;
		if (!type){
			for (var evType in events) this.removeEvents(evType);
			events = null;
		} else if (events[type]){
			while (events[type].keys[0]) this.removeEvent(type, events[type].keys[0]);
			events[type] = null;
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		events[type].keys.each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = $(from);
		var fevents = from.retrieve('events');
		if (!fevents) return this;
		if (!type){
			for (var evType in fevents) this.cloneEvents(from, evType);
		} else if (fevents[type]){
			fevents[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	'click': 2, 'dblclick': 2, 'mouseup': 2, 'mousedown': 2, 'contextmenu': 2, //mouse buttons
	'mousewheel': 2, 'DOMMouseScroll': 2, //mouse wheel
	'mouseover': 2, 'mouseout': 2, 'mousemove': 2, 'selectstart': 2, 'selectend': 2, //mouse movement
	'keydown': 2, 'keypress': 2, 'keyup': 2, //keyboard
	'focus': 2, 'blur': 2, 'change': 2, 'reset': 2, 'select': 2, 'submit': 2, //form elements
	'load': 1, 'unload': 1, 'beforeunload': 1, 'resize': 1, 'move': 1, 'DOMContentLoaded': 1, 'readystatechange': 1, //window
	'error': 1, 'abort': 1, 'scroll': 1 //misc
};

(function(){

var checkRelatedTarget = function(event){
	var related = event.relatedTarget;
	if (!related) return true;
	return ($type(this) != 'document' && related != this && related.prefix != 'xul' && !this.hasChild(related));
};

Element.Events = new Hash({

	mouseenter: {

		base: 'mouseover',

		condition: checkRelatedTarget

	},

	mouseleave: {

		base: 'mouseout',

		condition: checkRelatedTarget

	},

	'mousewheel': {

		base: (Browser.Engine.gecko) ? 'DOMMouseScroll' : 'mousewheel'

	}

});

})();
