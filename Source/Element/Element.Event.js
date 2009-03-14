/*
Script: Element.Event.js
	Contains Element methods for dealing with events, and custom Events.

License:
	MIT-style license.
*/

(function(){
	
	var natives = {
		click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
		mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
		mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
		keydown: 2, keypress: 2, keyup: 2, //keyboard
		focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
		load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
		error: 1, abort: 1, scroll: 1 //misc
	};
	
	[Element, Window, Document].call('extend', {
		
		defineAddEvent: function(type, fn){
			return Storage.store(this, 'events.add.' + type, fn);
		},
		
		lookupAddEvent: function(type){
			return Storage.retrieve(this, 'events.add.' + type);
		},
		
		defineRemoveEvent: function(type, fn){
			return Storage.store(this, 'events.remove.' + type, fn);
		},
		
		lookupRemoveEvent: function(type){
			return Storage.retrieve(this, 'events.remove.' + type);
		},
		
		defineEvent: function(type, obj){
			if (obj.add) this.defineAddEvent(type, obj.add);
			if (obj.remove) this.defineRemoveEvent(type, obj.remove);
			return this;
		}
		
	});

	[Element, Window, Document].call('implement', {

		addEvent: function(type, fn){

			var table = this.retrieve('events.table.' + type, new Table);
			if (table.get(fn)) return this;
			Events.addEvent(this, type, fn);
			
			var cfn = fn, custom = constructorOf(this).lookupAddEvent(type);

			if (custom){
				var modifiers = custom.call(this, fn);
				if (modifiers){
					type = modifiers[0];
					cfn = modifiers[1];
				}
			}
			
			var e = natives[type], self = this, bound = function(event){
				event = (e == 2) ? new Event(event) : event;
				if (cfn.call(self, event) == false && e == 2) event.stop();
			};

			table.set(fn, bound);
			
			if (!e) return this;
			
			// add real event
			
			if (this.addEventListener) this.addEventListener(type, bound, false);
			else this.attachEvent('on' + type, bound);
			return this;
			
		}.asSetter(),

		removeEvent: function(type, fn){
			
			var table = this.retrieve('events.table.' + type, new Table), bound = table.erase(fn);
			if (!bound) return this;
			Events.removeEvent(this, type, fn);
			
			var custom = constructorOf(this).lookupRemoveEvent(type);

			if (custom){
				var ntype = custom.call(this, fn);
				if (ntype) type = ntype;
			}
			
			if (!natives[type]) return this;
			
			// remove real event

			if (this.removeEventListener) this.removeEventListener(type, bound, false);
			else this.detachEvent('on' + type, bound);
			return this;
			
		}.asSetter()

	});
	
	var rts = /^(\w+)\((.+)\)$/;
	
	var checkOverOut = function(self, event){
		var related = event.get('relatedTarget');
		return (related == null || (typeOf(self) != 'document' && related != self && related.prefix != 'xul' && !self.find(related)));
	};
	
	[Element, Document].call('implement', {
		
		observe: function(ts, fn){
			
			var match = ts.match(rts);
			if (!match) return this;
			var type = match[1], selector = match[2];
			
			var table = this.retrieve('events.observed.' + ts, new Table);
			if (table.get(fn)) return this;
			
			if (type == 'mouseenter') type = 'mouseover';
			else if (type == 'mouseleave') type = 'mouseout';
			
			var isOverOut = (/^mouse(over|out)$/).test(type);
	
			var self = this, newfn = function(event){
				var nodes = self.search(selector), target = event.get('target');
				for (var i = nodes.length; i --; i){
					var node = document.id(nodes[i]);
					if (target === node || node.find(target)){
						if (!isOverOut || checkOverOut(node, event)) fn.call(node, event);
						break;
					}
				}
			};
			
			table.set(fn, newfn);
			return this.addEvent(type, newfn);
			
		}.asSetter(),
		
		overlook: function(ts, fn){
			
			var match = ts.match(rts);
			if (!match) return this;
			var type = match[1], selector = match[2];
			
			var table = this.retrieve('events.observed.' + ts, new Table);
			if (!table.get(fn)) return this;
			
			var oldfn = table.erase(fn);
			return this.removeEvent(type, oldfn);
			
		}.asSetter(),
		
		overlooks: function(ts){
			
			this.retrieve('events.observed.' + ts, new Table).each(function(v, k){
				this.overlook(ts, k);
			}, this);
			return this;
			
		}
		
	});
	
	[Element, Window, Document].call('implement', new Events);
	
	[Window, Document].call('defineAddEvent', ['unload', function(fn){
		return ['unload', function(){
			this.removeEvent('unload', fn);
			fn.call(this);
		}];
	}]);
	
	var mouseCheck = function(fn){
		return function(event){
			if (checkOverOut(this, event)) fn.call(this, event);
		};
	};
	
	[Document, Element].call('defineEvent', ['mouseenter', {
		
		add: function(fn){
			return ['mouseover', mouseCheck(fn)];
		},
		
		remove: function(fn){
			return 'mouseover';
		}

	}]);
	
	[Document, Element].call('defineEvent', ['mouseleave', {
		
		add: function(fn){
			return ['mouseout', mouseCheck(fn)];
		},
		
		remove: function(fn){
			return 'mouseout';
		}

	}]);
	
	if (Browser.Engine.gecko) [Element, Document, Window].call('defineEvent', ['mousewheel', {
			
		add: function(fn){
			return ['DOMMouseScroll', fn];
		},
		
		remove: function(fn){
			return 'DOMMouseScroll';
		}

	}]);

})();
