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
	for (var target = event.target; target && target != self;){
		if (target && match(target, event)){
			fn.call(target, event, target);
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

var proto = Element.prototype, addEvent = proto.addEvent, removeEvent = proto.removeEvent;

var relay = function(old, method){
	return function(type, fn, useCapture){
		if (type.indexOf(':relay') == -1) return old.call(this, type, fn, useCapture);
		var parsed = Slick.parse(type).expressions[0][0];
		if (parsed.pseudos[0].key != 'relay') return old.call(this, type, fn, useCapture);
		var newType = parsed.tag;
		parsed.pseudos.slice(1).each(function(pseudo){
			newType += ':' + pseudo.key + (pseudo.value ? '(' + pseudo.value + ')' : '');
		});
		return method.call(this, newType, parsed.pseudos[0].value, fn);
	}
};

[Element, Window, Document].invoke('implement', {

	addEvent: relay(addEvent, function(type, match, fn){
		var storage = this.retrieve('delegates', {}), stored = storage[type];

		if (stored) for (var _uid in stored){
			if (stored[_uid].fn == fn && stored[_uid].match == match) return this;
		}

		var _type = type, _match = match, _fn = fn, _map = map[type] || {};
		type = _map.base || _type;

		match = function(target){
			return Slick.match(target, _match);
		};

		var elementEvent = Element.Events[_type];
		if (elementEvent && elementEvent.condition){
			var __match = match, condition = elementEvent.condition;
			match = function(target, event){
				return __match(target, event) && (condition.call(target, event));
			};
		}

		var self = this, uid = String.uniqueID();
		var delegator = _map.listen ? function(event){
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

		this.store('delegates', storage);
		return addEvent.call(this, type, delegator, _map.capture);
	}),

	removeEvent: relay(removeEvent, function(type, match, fn, _uid){
		var storage = this.retrieve('delegates', {}), stored = storage[type];
		if (!stored) return this;

		if (_uid){
			var _type = type, delegator = stored[_uid].delegator, _map = map[type] || {};
			type = _map.base || _type;
			if (_map.remove) _map.remove(this, _uid);
			delete stored[_uid];
			storage[_type] = stored;
			this.store('delegates', storage);
			return removeEvent.call(this, type, delegator);
		}

		var __uid, s;
		if (fn) for (__uid in stored){
			s = stored[__uid];
			if (s.match == match && s.fn == fn) return arguments.callee.call(this, removeEvent, type, match, fn, __uid);
		} else for (__uid in stored){
			s = stored[__uid];
			if (s.match == match) arguments.callee.call(this, removeEvent, type, match, s.fn, __uid);
		}
		return this;
	})

});

})();
