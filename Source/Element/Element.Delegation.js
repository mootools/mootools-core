/*
---

name: Element.Delegation

description: Extends the Element native object to include the delegate method for more efficient event management.

license: MIT-style license.

requires: [Element.Event]

provides: [Element.Delegation]

...
*/

(function(){

var eventListenerSupport = !(window.attachEvent && !window.addEventListener),
	nativeEvents = Element.NativeEvents;

nativeEvents.focusin = 2;
nativeEvents.focusout = 2;

var bubbleUp = function(self, match, fn, event){
	for (var target = event.target; target && target != this;){
		if (target && match(target, event)){
			fn.call(self, event, target);
			break;
		}
		target = document.id(target.parentNode);
	}
};

var formObserver = function(type){

	var _key = '_delegation:';

	return {

		base: 'focusin',

		remove: function(self, uid){
			var list = self.retrieve(_key + type + 'listeners', {})[uid];
			if (list && list.forms) for (var i = list.forms.length; i--;){
				list.forms[i].removeEvent(type, list.fns[i]);
			}
		},

		listen: function(self, match, fn, event, uid){
			var target = event.target,
				form = (target.get('tag') == 'form') ? target : event.target.getParent('form');
			if (!form) return;

			var listeners = self.retrieve(_key + type + 'listeners', {}),
				listener = listeners[uid] || {forms: [], fns: []},
				forms = listener.forms, fns = listener.fns;

			if (forms.indexOf(form) != -1) return;
			forms.push(form);

			var _fn = function(event){
				bubbleUp(self, match, fn, event);
			};
			form.addEvent(type, _fn);
			fns.push(_fn);

			listeners[uid] = listener;
			self.store(_key + type + 'listeners', listeners);
		}
	};
};

var inputObserver = function(type){
	return {
		base: 'focusin',
		listen: function(self, match, fn, event){
			var events = {blur: function(){
				this.removeEvents(events);
			}};
			events[type] = function(event){
				bubbleUp(self, match, fn, event);
			};
			event.target.addEvents(events);
		}
	};
};

var map = {
	mouseenter: {
		base: 'mouseover'
	},
	mouseleave: {
		base: 'mouseout'
	},
	focus: {
		base: 'focus' + (eventListenerSupport ? '' : 'in'),
		capture: true
	},
	blur: {
		base: eventListenerSupport ? 'blur' : 'focusout',
		capture: true
	}
};

if (!eventListenerSupport) Object.append(map, {
	submit: formObserver('submit'),
	reset: formObserver('reset'),
	change: inputObserver('change'),
	select: inputObserver('select')
});

[Element, Window, Document].invoke('implement', {

	delegate: function(type, match, fn){
		var storage = this.retrieve('delegates', {}), stored = storage[type];

		if (stored) for (var _uid in stored){
			if (stored[_uid].fn == fn && stored[_uid].match == match) return this;
		}

		var _type = type, _match = match, _fn = fn, _map = map[type] || {};
		type = _map.base || _type;

		if (typeof match == 'string') match = function(target){
			return Slick.match(target, _match);
		};

		var elementEvent = Element.Events[_type];
		if (elementEvent && elementEvent.condition){
			var __match = match, condition = elementEvent.condition;
			match = function(target, event){
				return __match(target, event) && (condition.call(target, event));
			};
		}

		var self = this, uid = String.uniqueID(), delegator = _map.listen ? function(event){
			_map.listen(self, match, fn, event, uid);
		} : function(event){
			bubbleUp(self, match, fn, event);
		};

		if (!stored) stored = {};
		stored[uid] = {
			match: _match,
			fn: _fn,
			delegator: delegator
		};
		storage[_type] = stored;

		return this.addEvent(type, delegator, _map.capture).store('delegates', storage)
	},

	delegates: function(match, events){
		for (var type in events) this.delegate(type, match, events[type]);
		return this;
	},

	undelegate: function(type, match, fn, _uid){
		var storage = this.retrieve('delegates', {}), stored = storage[type];
		if (!stored) return this;

		if (_uid){
			var _type = type, delegator = stored[_uid].delegator, _map = map[type] || {};
			type = _map.base || _type;
			if (_map.remove) _map.remove(this, _uid);
			delete stored[_uid];
			storage[_type] = stored;
			return this.removeEvent(type, delegator).store('delegates', storage);
		}

		var __uid, s;
		if (fn) for (__uid in stored){
			s = stored[__uid];
			if (s.match == match && s.fn == fn) return this.undelegate(type, match, fn, __uid);
		} else if (match) for (__uid in stored){
			s = stored[__uid];
			if (s.match == match) this.undelegate(type, match, s.fn, __uid);
		} else for (__uid in stored){
			s = stored[__uid];
			this.undelegate(type, s.match, s.fn, __uid);
		}
		return this;
	},

	undelegates: function(match, events){
		for (var type in events) this.undelegate(type, match, events[type]);
		return this;
	}

});

// Old API support

var proto = Element.prototype, relay = function(old, method){
	return function(type, fn){
		if (type.indexOf(':') == -1) return old.apply(this, arguments);
		var parsed = Slick.parse(type).expressions[0][0];
		if (parsed.pseudos[0].key != 'relay') return old.apply(this, arguments);
		return this[method](parsed.tag, parsed.pseudos[0].value, fn);
	}
};

[Element, Window, Document].invoke('implement', {
	addEvent: relay(proto.addEvent, 'delegate'),
	removeEvent: relay(proto.removeEvent, 'undelegate')
});

})();
