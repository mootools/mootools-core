/*
Script: Element.Event.js
	Contains Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

Event.extend(new Accessor('Pseudo')).extend(new Accessor('Modifier'));

Event.implement('remove', function(){
	this.context.removeEvent(this.definition, this.action);
	return this;
});

(function(){
	
	var natives = {
		click: 3, dblclick: 3, mouseup: 3, mousedown: 3, contextmenu: 2, //mouse buttons
		mousewheel: 3, DOMMouseScroll: 2, //mouse wheel
		mouseover: 3, mouseout: 3, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
		keydown: 3, keypress: 3, keyup: 3, //keyboard
		focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
		load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
		error: 1, abort: 1, scroll: 1 //misc
	};

	[Element, Window, Document].call('implement', {
		
		hasEvent: function(type){
			var eventTypes = this.retrieve('event.types'), eventType, eventName;
			if (!eventTypes || !(eventType = eventTypes[type])) return false;
			
			var len = 0;
			for (var name in eventType) len += eventType[name].length();
			return (len > 0);
		},

		addEvent: function(name, fn){

			var parsed = Slick.parse(name)[0][0], type = parsed.tag;
			
			var eventTypes = this.retrieve('event.types', {});
			var eventType = eventTypes[type] || (eventTypes[type] = {});
			var eventName = eventType[name] || (eventType[name] = new Table);
			if (eventName.get(fn)) return this;
			
			var modifier = Event.lookupModifier(type) || {};
			if (modifier.type) type = modifier.type;
			var condition = modifier.condition || Function.from(true);
			
			var pseudos = [], attributes = [];
			
			if (parsed.pseudos) parsed.pseudos.forEach(function(pseudo){
				var name = pseudo.name || '', argument = pseudo.argument || '';
				var parser = Event.lookupPseudo(name);
				if (parser) pseudos.push(function(event){
					return parser.call(this, event, argument);
				});
			});
			
			if (parsed.attributes) parsed.attributes.forEach(function(attribute){
				var name = attribute.name || '', operator = attribute.operator || '', value = attribute.value || '';
				attributes.push(function(event){
					var actual = event.get(name);
					if (!operator) return !!(actual);
					if (operator === '=') return (actual === value);
					if (actual == null && (!value || operator === '!=')) return false;
					return attribute.regexp.test(actual);
				});
			});
			
			var self = this, context = this, filter = function(event){
				event.set({'context': self, 'action': fn, 'definition': name, 'relayed': context});
				
				var value = true, i;
									
				for (i = 0; i < pseudos.length; i++){
					if (!(value = pseudos[i].call(context, event))) break;
					if (instanceOf(value, Object)) event.set('relayed', (context = value));
				}
				
				for (i = 0; i < attributes.length; i++){
					if (!(value = attributes[i](event))) break;
				}
				
				if (value && condition.call(context, event) && (fn.call(context, event) == false)) event.stop();
				
				context = self;
			};
			
			eventName.set(fn, filter);
			
			if (natives[type]){
				
				var bound = Storage.retrieve(filter, 'bound', function(event){
					filter(new Event(event));
				});
				
				if (this.addEventListener) this.addEventListener(type, bound, false);
				else this.attachEvent('on' + type, bound);
				
			}
			
			if (modifier.add) modifier.add.call(this, fn);
			
			return this;
			
		}.overload(Function.overloadPair),

		removeEvent: function(name, fn){
			
			var type = Slick.parse(name)[0][0].tag;
			
			var eventTypes = this.retrieve('event.types'), eventType, eventName, filter;
			if (!eventTypes || !(eventType = eventTypes[type]) || !(eventName = eventType[name]) || !(filter = eventName.erase(fn))) return this;

			var modifier = Event.lookupModifier(type) || {};
			if (modifier.type) type = modifier.type;
			
			// remove real event
			
			if (natives[type]){
				var bound = Storage.retrieve(filter, 'bound');
				if (this.removeEventListener) this.removeEventListener(type, bound, false);
				else this.detachEvent('on' + type, bound);
			}
			
			if (modifier.remove) modifier.remove.call(this, fn);

			return this;

		},
		
		removeEvents: function(){
			// TODO
		},
		
		fireEvent: function(name, args){
			
			var type = Slick.parse(name)[0][0].tag;
			
			var eventTypes = this.retrieve('event.types'), eventType, eventName;
			if (!eventTypes || !(eventType = eventTypes[type]) || !(eventName = eventType[name])) return this;
			
			eventName.forEach(function(filter, fn){
				fn.apply(this, Array.from(args));
			}, this);
			
			return this;

		},
		
		callEvent: function(name, event){
			
			var type = Slick.parse(name)[0][0].tag;
			
			var eventTypes = this.retrieve('event.types'), eventType;
			if (!eventTypes || !(eventType = eventTypes[type])) return this;
			
			Object.forEach(eventType, function(eventName, name){
				
				eventName.forEach(function(filter, fn){
					filter.call(this, event);
				}, this);

			}, this);
			
			return this;
			
		}

	});
	
	var related = function(event){
		var rt = event.get('related-target');
		return ((rt == null) || (typeOf(this) != 'document' && rt != this && rt.prefix != 'xul' && !this.find(rt)));
	};
	
	Event.defineModifier('mouseenter', {type: 'mouseover', condition: related});
	Event.defineModifier('mouseleave', {type: 'mouseout', condition: related});

})();

Event.definePseudo('flash', function(event, argument){
	event.remove();
	return true;
});

Event.definePseudo('relay', function(event, selector){
	for (var t = event.get('target'); t && t != this; t = t.parentNode)
		if (Slick.match(t, selector)) return document.id(t);
});

if (Browser.firefox) Event.defineModifier('mousewheel', {type: 'DOMMouseScroll'});

Element.defineSetter('events', function(events){
	this.addEvent(events);
});
