/*
---

name: Element.Event

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events, if necessary.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event

...
*/

(function(){

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

var patched_buttons = []; // needed for a Firefox patch - see below

[Element, Window, Document].invoke('implement', {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		if (!events[type]) events[type] = {keys: [], values: []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type,
			custom = Element.Events[type],
			condition = fn,
			self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn, type);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event, type)) return fn.call(this, event);
					return true;
				};
			}
			if (custom.base) realType = Function.from(custom.base).call(this, type);
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new DOMEvent(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn, arguments[2]);
		}
		events[type].values.push(defn);
      /**
       * Patch for Firefox - firing mouseenter and mouseleave events of elements inside <button>
       *
       * Firefox, as well as other browsers except IE, does not have a native support
       * for mouseenter/mouseleave events, so MooTools does some custom implementation.
       *
       * But when we add these events to an element which is nested inside a <button>,
       * they are not fired
      **/
      if (Browser.name == 'firefox' && ['mouseenter', 'mouseleave'].contains(type)){
         // check if the element is nested in a <button>
         var button = (function(elem){
            // search DOM tree above up to `limit` elements
            var limit = 20;
            do {
              elem = elem.parentNode; 
            } while (elem && elem.tagName !== 'BUTTON' && --limit);
            return limit ? document.id(elem) : null;
         })(this);
         if (button && !button.retrieve('ff:patchedelements', []).contains(this)){
            // this element is descendant of a <button> and is not yet patched
            if (!patched_buttons.contains(button)){
               patched_buttons.push(button); // mark the button as patched
               // add handlers to <button>
               button.addEvents({
                  // onmousemove: check if the cursor is over each patched element
                  mousemove: function(e) {
                     this.retrieve('ff:patchedelements').each(function(el){
                        var coords = el.getCoordinates();
                        if (
                           coords.left <= e.page.x && coords.right   >= e.page.x &&
                           coords.top  <= e.page.y && coords.bottom  >= e.page.y
                        ){
                           if (!el.retrieve('ff:mouseenter')){
                              // make sure we fire onmouseenter only once
                              el.store('ff:mouseenter', true);
                              el.fireEvent('mouseenter', [new DOMEvent({type:'mouseenter',target:el})]);
                           }
                        } else if (el.retrieve('ff:mouseenter')){
                           // make sure we fire onmouseleave only once
                           el.store('ff:mouseenter', false);
                           el.fireEvent('mouseleave', [new DOMEvent({type:'mouseleave',target:el})]);
                        }
                     });
                  },
                  // onmouseleave: just in case check if we need to fire onmouseleave over patched elements
                  mouseleave: function(e){
                     this.retrieve('ff:patchedelements').each(function(el){
                        if (el.retrieve('ff:mouseenter')){
                           el.store('ff:mouseenter', false);
                           el.fireEvent('mouseleave', [new DOMEvent({type:'mouseleave',target:el})]);
                        }
                     });
                  }
               });
            }
            button.retrieve('ff:patchedelements').push(this);
         }
      }
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var list = events[type];
		var index = list.keys.indexOf(fn);
		if (index == -1) return this;
		var value = list.values[index];
		delete list.keys[index];
		delete list.values[index];
		var custom = Element.Events[type];
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn, type);
			if (custom.base) type = Function.from(custom.base).call(this, type);
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value, arguments[2]) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) return this;
		if (!events){
			for (type in attached) this.removeEvents(type);
			this.eliminate('events');
		} else if (attached[events]){
			attached[events].keys.each(function(fn){
				this.removeEvent(events, fn);
			}, this);
			delete attached[events];
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		args = Array.from(args);

		events[type].keys.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = document.id(from);
		var events = from.retrieve('events');
		if (!events) return this;
		if (!type){
			for (var eventType in events) this.cloneEvents(from, eventType);
		} else if (events[type]){
			events[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	wheel: 2, mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	orientationchange: 2, // mobile
	touchstart: 2, touchmove: 2, touchend: 2, touchcancel: 2, // touch
	gesturestart: 2, gesturechange: 2, gestureend: 2, // gesture
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, paste: 2, input: 2, //form elements
	load: 2, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	hashchange: 1, popstate: 2, // history
	error: 1, abort: 1, scroll: 1, message: 2 //misc
};

Element.Events = {
	mousewheel: {
		base: 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll'
	}
};

var check = function(event){
	var related = event.relatedTarget;
	if (related == null) return true;
	if (!related) return false;
	return (related != this && related.prefix != 'xul' && typeOf(this) != 'document' && !this.contains(related));
};

if ('onmouseenter' in document.documentElement){
	Element.NativeEvents.mouseenter = Element.NativeEvents.mouseleave = 2;
	Element.MouseenterCheck = check;
} else {
	Element.Events.mouseenter = {
		base: 'mouseover',
		condition: check
	};

	Element.Events.mouseleave = {
		base: 'mouseout',
		condition: check
	};
}

/*<ltIE9>*/
if (!window.addEventListener){
	Element.NativeEvents.propertychange = 2;
	Element.Events.change = {
		base: function(){
			var type = this.type;
			return (this.get('tag') == 'input' && (type == 'radio' || type == 'checkbox')) ? 'propertychange' : 'change';
		},
		condition: function(event){
			return event.type != 'propertychange' || event.event.propertyName == 'checked';
		}
	};
}
/*</ltIE9>*/

//<1.2compat>

Element.Events = new Hash(Element.Events);

//</1.2compat>

})();
