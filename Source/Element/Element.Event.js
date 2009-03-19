/*
Script: Element.Event.js
	Contains Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

[Element, Window, Document].call('extend', {
	
	definePseudoEvent: function(name, fn){
		return Storage.store(this, 'events.pseudo.' + name, fn);
	},
	
	lookupPseudoEvent: function(name){
		return Storage.retrieve(this, 'events.pseudo.' + name);
	},
	
	defineEventModifier: function(name, fn){
		return Storage.store(this, 'events.modifier.' + name, fn);
	},
	
	lookupEventModifier: function(name){
		return Storage.retrieve(this, 'events.modifier.' + name);
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
			if (!parsed.pseudos) parsed.pseudos = [];

			var modifier = constructorOf(this).lookupEventModifier(type), mfn = fn;
			
			if ((modifier = Function.from(modifier).call(this, fn))){
				var parsed2 = slick.parse(modifier[0])[0][0];
				type = parsed2.tag;
				parsed.pseudos.append(parsed2.pseudos || []);
				if (modifier[1]) mfn = modifier[1];
			}
			
			var self = this, pseudos = [];
			
			parsed.pseudos.each(function(pseudo){
				
				var parser = constructorOf(this).lookupPseudoEvent(pseudo.name);
				
				if (parser) pseudos.push(function(event){
					return parser.call(this, event, pseudo.argument);
				});

			}, this);
			
			var ntype = natives[type], context = this, bound = function(event){
				event = new Event((ntype > 1) ? event : {});
				
				event.context = self;
				event.action = fn;
				event.definition = name;
				
				var value = true;
				
				if (ntype > 1){
					
					for (var i = 0; i < pseudos.length; i++){
						if (!(value = pseudos[i].call(context, event))) break;
						if (instanceOf(value, Object)) context = value;
					}

					event.relayed = context;
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
			var modifier = constructorOf(this).lookupEventModifier(type);
			if ((modifier = Function.from(modifier).call(this, fn, true))) type = slick.parse(modifier[0])[0][0].tag;
			
			// remove real event
			
			if (natives[type]){
				if (this.removeEventListener) this.removeEventListener(type, bound, false);
				else this.detachEvent('on' + type, bound);
			}

			return this;
			
		}

	});
	
	window.fireEvent = document.fireEvent = null;

})();

[Element, Window, Document].call('implement', new Events);

[Element, Document].call('definePseudoEvent', 'key', function(event, argument){
	return (event.get('key') == argument);
});

[Element, Document].call('definePseudoEvent', 'modifier', function(event, argument){
	switch (argument){
		case 'shift': case '⇧': return event.get('shift');
		case 'control': case '⌃': return event.get('control');
		case 'meta': case '⌘': case 'command': return event.get('meta');
		case 'alt': case '⌥': case 'option': return event.get('alt');
		default: return false;
	}
});

[Element, Window, Document].call('definePseudoEvent', 'flash', function(event, argument){
	event.remove();
	return true;
});

[Document, Element].call('definePseudoEvent', 'relay', function(event, selector){
	var nodes = this.search(selector), target = event.get('target');
	for (var i = nodes.length; i--; i){
		var node = document.id(nodes[i]);
		if (target === node || node.find(target)) return node;
	}
	return false;
});

[Document, Element].call('definePseudoEvent', 'related', function(event){
	var related = event.get('related-target');
	if (related == null) return true;
	return (typeOf(this) != 'document' && related != this && related.prefix != 'xul' && !this.find(related));
});

[Document, Element].call('defineEventModifier', 'mouseenter', ['mouseover:related']);
[Document, Element].call('defineEventModifier', 'mouseleave', ['mouseout:related']);

if (Browser.Engine.gecko) [Element, Document, Window].call('defineEventModifier', 'mousewheel', ['DOMMouseScroll']);
