/*
Script: Element.Event.js
	Contains Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

Event.extend({
	
	definePseudo: function(name, fn){
		return Storage.store(this, 'pseudo.' + name, fn);
	},
	
	lookupPseudo: function(name){
		return Storage.retrieve(this, 'pseudo.' + name);
	},
	
	defineModifier: function(name, fn){
		return Storage.store(this, 'modifier.' + name, fn);
	},
	
	lookupModifier: function(name){
		return Storage.retrieve(this, 'modifier.' + name);
	}
	
});

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
		
		hasEvent: function(name, fn){
			var table = this.retrieve('events.table.' + name);
			return !!(table && table.get(fn));
		},

		addEvent: function(name, fn){

			var table = this.retrieve('events.table.' + name, new Table);
			if (table.get(fn)) return this;
			Events.addEvent(this, name, fn);
			
			var parsed = slick.parse(name)[0][0], type = parsed.tag;

			var modifier = Event.lookupModifier(type), mfn = fn;
			
			if (modifier){
				if (modifier.type) type = modifier.type;
				if (modifier.action) mfn = modifier.action(fn);
				if (modifier.add) modifier.add.call(this, fn);
			}
			
			var self = this, pseudos = [], attributes = [];
			
			if (parsed.pseudos) parsed.pseudos.each(function(pseudo){
				
				var parser = Event.lookupPseudo(pseudo.name);
				
				if (parser) pseudos.push(function(event){
					return parser.call(this, event, pseudo.argument);
				});

			});
			
			if (parsed.attributes) parsed.attributes.each(function(attribute){
				attributes.push(function(event){
					var operator = attribute.operator, value = attribute.value;
					var actual = event.get(attribute.name);
					if (!operator) return !!(actual);
					if (operator === '=') return (actual === value);
					if (actual == null && (!value || operator === '!=')) return false;
					return attribute.regexp.test(actual);
				});
			});
			
			var ntype = natives[type], context = this, bound = function(event){
				event = new Event((ntype > 1) ? event : {});
				Object.append(event, {context: self, action: fn, definition: name});
				
				var value = true, i;
				
				if (ntype > 1){
					
					for (i = 0; i < pseudos.length; i++){
						if (!(value = pseudos[i].call(context, event))) break;
						if (instanceOf(value, Object)) context = value;
						event.relayed = context;
					}
					
					for (i = 0; i < attributes.length; i++){
						if (!(value = attributes[i](event))) break;
					}

				}
				
				if (value && mfn.call(context, event) == false && ntype > 1) event.stop();

				context = self;
			};

			table.set(fn, bound);
			
			if (ntype){
				if (this.addEventListener) this.addEventListener(type, bound, false);
				else this.attachEvent('on' + type, bound);
			}
			
			return this;
			
		},

		removeEvent: function(name, fn){
			
			var table = this.retrieve('events.table.' + name, new Table), bound = table.erase(fn);
			if (!bound) return this;
			Events.removeEvent(this, name, fn);
			
			var type = slick.parse(name)[0][0].tag;
			var modifier = Event.lookupModifier(type);
			if (modifier){
				if (modifier.type) type = modifier.type;
				if (modifier.remove) modifier.remove.call(this, fn);
			}
			
			// remove real event
			
			if (natives[type]){
				if (this.removeEventListener) this.removeEventListener(type, bound, false);
				else this.detachEvent('on' + type, bound);
			}

			return this;
			
		}

	});
	
	window.fireEvent = document.fireEvent = null;
	
	var related = function(fn){
		return function(event){
			var rt = event.get('related-target');
			if ((rt == null) || (typeOf(this) != 'document' && rt != this && rt.prefix != 'xul' && !this.find(rt))) fn.call(this, event);
		};
	};
	
	Event.defineModifier('mouseenter', {type: 'mouseover', action: related});
	Event.defineModifier('mouseleave', {type: 'mouseout', action: related});

})();

[Element, Window, Document].call('implement', new Events);

Event.definePseudo('flash', function(event, argument){
	event.remove();
	return true;
});

Event.definePseudo('relay', function(event, selector){
	var nodes = this.search(selector), target = event.get('target');
	for (var i = nodes.length; i--; i){
		var node = document.id(nodes[i]);
		if (target === node || node.find(target)) return node;
	}
	return false;
});

if (Browser.Engine.gecko) Event.defineModifier('mousewheel', {type: 'DOMMouseScroll'});
