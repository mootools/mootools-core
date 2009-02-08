/*
Script: Element.js
	One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser,
	time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

var Element = new Native('Element', function(tag, props){
	if (typeOf(tag) == 'string') return document.newElement(tag, props);
	var element = $(tag);
	for (var p in props) element.set(p, props[p]);
	return element;
}, window.Element);

Element.Prototype = document.createElement('div');
Element.Prototype._type = Function.from('element');
Element.Prototype.constructor = Element;


Element._onImplement = function(key, value){
	Element.Prototype[key] = value;
	if (Array[key]) return;
	Elements.implement(Object.from(key, function(){
		var items = [], elements = true;
		for (var i = 0, j = this.length; i < j; i++){
			var returns = this[i][key].apply(this[i], arguments);
			items.push(returns);
			if (elements) elements = (typeOf(returns) == 'element');
		}
		return (elements) ? new Elements(items) : items;
	}));
};

// var IFrame = new Native({
// 
// 	name: 'IFrame',
// 
// 	generics: false,
// 
// 	initialize: function(){
// 		var params = Array.link(arguments, {properties: Type.isObject, iframe: Type.isDefined});
// 		var props = params.properties || {};
// 		var iframe = $(params.iframe) || false;
// 		var onload = props.onload || Function.empty;
// 		delete props.onload;
// 		props.id = props.name = Utility.pick(props.id, props.name, iframe.id, iframe.name, 'IFrame_' + Date.now());
// 		iframe = new Element(iframe || 'iframe', props);
// 		var onFrameLoad = function(){
// 			var host = Function.stab(function(){
// 				return iframe.contentWindow.location.host;
// 			});
// 			if (host && host == window.location.host){
// 				var win = new Window(iframe.contentWindow);
// 				new Document(iframe.contentWindow.document);
// 				Object.append(win.Element.prototype, Element.Prototype);
// 			}
// 			onload.call(iframe.contentWindow, iframe.contentWindow.document);
// 		};
// 		(window.frames[props.id]) ? onFrameLoad() : iframe.addListener('load', onFrameLoad);
// 		return iframe;
// 	}
// 
// });

var Elements = new Native('Elements', function(elements, options){
	
	options = Object.append({ddup: true, cash: true}, options);
	elements = elements || [];
	if (options.ddup || options.cash){
		var uniques = {}, returned = [];
		for (var i = 0, l = elements.length; i < l; i++){
			var el = $.element(elements[i], !options.cash);
			if (options.ddup){
				if (uniques[el.uid]) continue;
				uniques[el.uid] = true;
			}
			returned.push(el);
		}
		elements = returned;
	}
	return (options.cash) ? Object.append(elements, this) : elements;

});

Elements.superClass = Array;

Elements.implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}

});

Document.implement({

	newElement: function(tag, props){
		if (Browser.Engine.trident && props){
			['name', 'type', 'checked'].each(function(attribute){
				if (!props[attribute]) return;
				tag += ' ' + attribute + '="' + props[attribute] + '"';
				if (attribute != 'checked') delete props[attribute];
			});
			tag = '<' + tag + '>';
		}
		return $.element(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	}

});

Window.implement({

	$: (function(el, nocash){
		if (el && el._type && el.uid) return el;
		var type = typeOf(el);
		return ($[type]) ? $[type](el, nocash) : null;
	}).extend({
		
		string: function(id, nocash){
			id = document.getElementById(id);
			return (id) ? $.element(id, nocash) : null;
		},
		
		element: function(el, nocash){
			Native.uid(el);
			if (!nocash && !el._type && !(/^object|embed$/i).test(el.tagName)){
				if (el.mergeAttributes) el.mergeAttributes(Element.Prototype);
				else Object.append(el, Element.Prototype);
			}
			return el;
		},
		
		object: function(obj, nocash){
			return (obj.toElement) ? $.element(obj.toElement(), nocash) : null;
		}

	}),

	$$: function(selector){
		if (arguments.length == 1 && typeOf(selector) == 'string') return document.getElements(selector);
		var elements = [];
		var args = Array.flatten(arguments);
		for (var i = 0, l = args.length; i < l; i++){
			var item = args[i];
			switch (typeOf(item)){
				case 'element': elements.push(item); break;
				case 'string': elements.append(document.getElements(item, true));
			}
		}
		return new Elements(elements);
	}

});

$.textnode = $.whitespace = $.window = $.document = Function.argument(0);

[Element, Document].call('implement', {

	getElement: function(selector, nocash){
		return $(this.getElements(selector, true)[0] || null, nocash);
	},

	getElements: function(tags, nocash){
		tags = tags.split(',');
		var elements = [], ddup = (tags.length > 1);
		tags.each(function(tag){
			var partial = this.getElementsByTagName(tag.trim());
			(ddup) ? elements.append(partial) : elements = partial;
		}, this);
		return new Elements(elements, {ddup: ddup, cash: !nocash});
	}

});

/* Cloning, Purging, Destroying */

(function(){

	var collected = {};
	var props = {
		input: 'checked',
		option: 'selected',
		textarea: (Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerHTML' : 'value'
	};

	var clean = function(item, retain){
		if (!item) return;
		var uid = item.uid;
		if (Browser.Engine.trident){
			if (item.clearAttributes){
				var clone = retain && item.cloneNode(false);
				item.clearAttributes();
				if (clone) item.mergeAttributes(clone);
			} else if (item.removeEvents){
				item.removeEvents();
			}
			if ((/object/i).test(item.tagName)){
				for (var p in item){
					if (typeOf(item[p]) == 'function') item[p] = Function.empty;
				}
				Element.dispose(item);
			}
		}	
		if (!uid) return;
		collected[uid] = null;
	};

	var purge = function(){
		Object.each(collected, clean);
		if (Browser.Engine.trident) Array.from(document.getElementsByTagName('object')).each(clean);
		if (window.CollectGarbage) CollectGarbage();
		collected = null;
	};

	Element.implement({
		
		clone: function(contents, keepid){
			contents = contents !== false;
			var clone = this.cloneNode(contents);
			var clean = function(node, element){
				if (!keepid) node.removeAttribute('id');
				if (Browser.Engine.trident){
					node.clearAttributes();
					node.mergeAttributes(element);
					node.removeAttribute('uid');
					if (node.options){
						var no = node.options, eo = element.options;
						for (var j = no.length; j--;) no[j].selected = eo[j].selected;
					}
				}
				var prop = props[element.tagName.toLowerCase()];
				if (prop && element[prop]) node[prop] = element[prop];
			};

			if (contents){
				var ce = clone.getElementsByTagName('*'), te = this.getElementsByTagName('*');
				for (var i = ce.length; i--;) clean(ce[i], te[i]);
			}

			clean(clone, this);
			return $(clone);
		},
		
		destroy: function(){
			Element.empty(this);
			Element.dispose(this);
			clean(this, true);
			return null;
		},

		empty: function(){
			Array.from(this.childNodes).each(Element.destroy);
			return this;
		}

	});

	[Element, Window, Document].call('implement', {

		addListener: function(type, fn){
			if (type == 'unload'){
				var old = fn, self = this;
				fn = function(){
					self.removeListener('unload', fn);
					old();
				};
			} else {
				collected[Native.uid(this)] = this;
			}
			if (this.addEventListener) this.addEventListener(type, fn, false);
			else this.attachEvent('on' + type, fn);
			return this;
		},

		removeListener: function(type, fn){
			if (this.removeEventListener) this.removeEventListener(type, fn, false);
			else this.detachEvent('on' + type, fn);
			return this;
		}

	});

	window.addListener('unload', purge);

})();

/* Misc DOM */

Element.implement({

	getElementById: function(id, nocash){
		var children = element.getElementsByTagName('*');
		for (var i = 0, l = children.length; i < l; i++){
			if (children[i].id == id) return $.element(children[i], nocash);
		}
		return null;
	},

	getSelected: function(){
		return new Elements(Array.from(this.options).filter(function(option){
			return option.selected;
		}));
	},

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var computed = document.defaultView.getComputedStyle(this, null);
		return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el){
			if (!el.name || el.disabled) return;
			var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
			Array.from(value).each(function(val){
				if (typeOf(val) != 'undefined') queryString.push(el.name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	hasChild: function(el){
		el = $(el, true);
		if (!el) return false;
		if (Browser.Engine.webkit && Browser.Engine.version < 420) return Array.from(this.getElementsByTagName(el.tagName)).contains(el);
		return (this.contains) ? (this != el && this.contains(el)) : !!(this.compareDocumentPosition(el) & 16);
	},

	match: function(tag){
		return (!tag || (tag == this) || (Element.get(this, 'tag') == tag));
	}

});

/* Injections / Dejections */

(function(){
	
	var inserters = {

		Before: function(context, element){
			if (element.parentNode) element.parentNode.insertBefore(context, element);
		},

		After: function(context, element){
			if (!element.parentNode) return;
			var next = element.nextSibling;
			(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
		},

		Bottom: function(context, element){
			element.appendChild(context);
		},

		Top: function(context, element){
			var first = element.firstChild;
			(first) ? element.insertBefore(context, first) : element.appendChild(context);
		}

	};

	inserters.Inside = inserters.Bottom;
	
	var methods = {};

	Object.each(inserters, function(inserter, where){
	
		methods['inject' + where] = function(el){
			inserter(this, $(el, true));
			return this;
		};
	
		methods['grab' + where] = function(el){
			inserter($(el, true), this);
			return this;
		};
	
	});
	
	Element.implement(Object.append(methods, {
		
		dispose: function(){
			return (this.parentNode) ? this.parentNode.removeChild(this) : this;
		},
		
		adopt: function(){
			Array.flatten(arguments).each(function(element){
				element = $(element, true);
				if (element) this.appendChild(element);
			}, this);
			return this;
		},

		appendText: function(text, where){
			return this.grab(document.newTextNode(text), where);
		},

		grab: function(el, where){
			return this['grab' + where || 'Bottom'](el);
		},

		inject: function(el, where){
			return this['inject' + where || 'Bottom'](el);
		},

		replaces: function(el){
			el = $(el, true);
			el.parentNode.replaceChild(this, el);
			return this;
		},

		wraps: function(el, where){
			el = $(el, true);
			return this.replaces(el).grab(el, where);
		}
		
	}));
	
	
})();

/* Class Accessors */

Element.implement({

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	}

});

/* Walkers */

(function(){

	var walk = function(element, walk, start, match, all, nocash){
		var el = element[start || walk];
		var elements = [];
		while (el){
			if (el.nodeType == 1 && (!match || Element.match(el, match))){
				if (!all) return $(el, nocash);
				elements.push(el);
			}
			el = el[walk];
		}
		return (all) ? new Elements(elements, {ddup: false, cash: !nocash}) : null;
	};
	
	Element.implement({

		getPrevious: function(match, nocash){
			return walk(this, 'previousSibling', null, match, false, nocash);
		},

		getAllPrevious: function(match, nocash){
			return walk(this, 'previousSibling', null, match, true, nocash);
		},

		getNext: function(match, nocash){
			return walk(this, 'nextSibling', null, match, false, nocash);
		},

		getAllNext: function(match, nocash){
			return walk(this, 'nextSibling', null, match, true, nocash);
		},

		getFirst: function(match, nocash){
			return walk(this, 'nextSibling', 'firstChild', match, false, nocash);
		},

		getLast: function(match, nocash){
			return walk(this, 'previousSibling', 'lastChild', match, false, nocash);
		},

		getParent: function(match, nocash){
			return walk(this, 'parentNode', null, match, false, nocash);
		},

		getParents: function(match, nocash){
			return walk(this, 'parentNode', null, match, true, nocash);
		},

		getChildren: function(match, nocash){
			return walk(this, 'nextSibling', 'firstChild', match, true, nocash);
		}

	});
	
})();

/* Storage */

(function(){
	
	var storage = {};
	
	var getStorage = function(element){
		var uid = Native.uid(element);
		return (storage[uid] || (storage[uid] = {}));
	};
	
	[Window, Document, Element].call('implement', {
		
		retrieve: function(property, dflt){
			var storage = getStorage(this), prop = storage[property];
			if (dflt != null && prop == null) prop = storage[property] = dflt;
			return Utility.pick(prop);
		},

		store: function(property, value){
			var storage = getStorage(this);
			storage[property] = value;
			return this;
		},

		dump: function(property){
			var storage = getStorage(this);
			delete storage[property];
			return this;
		}

	});
	
	
})();

/* Getters, Setters, Erasers */

(function(){

	var properties = {};
	
	var getKey = function(key){
		return (properties[key] || (properties[key] = {}));
	};
	
	Element.extend({

		addGetter: function(key, fn){
			getKey(key).get = fn;
		},

		addSetter: function(key, fn){
			getKey(key).set = fn;
		},

		addEraser: function(key, fn){
			getKey(key).erase = fn;
		}

	});
	
	var attributes = {
		'html': 'innerHTML',
		'class': 'className',
		'for': 'htmlFor',
		'text': (Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)) ? 'innerText' : 'textContent'
	};
	
	var camels = ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
		'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];
		
	Object.append(attributes, Object.from(camels.map(String.toLowerCase), camels));
	
	Object.each(attributes, function(realKey, key){
		Element.addSetter(key, function(value){
			this[realKey] = value;
		});
		Element.addGetter(key, function(){
			return this[realKey];
		});
	});

	var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
		'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'];
		
	bools.each(function(bool){
		Element.addSetter(bool, function(value){
			this[bool] = !!value;
		});
		Element.addGetter(bool, function(){
			return !!this[bool];
		});
		Element.addEraser(bool, function(){
			this[bool] = false;
		});
	});
	
	Element.implement({

		set: function(attribute, value){
			var property = properties[attribute];
			if (property && property.set) property.set.apply(this, Array.slice(arguments, 1));
			else this.setAttribute(attribute, '' + value);
			return this;
		},

		get: function(attribute){
			var property = properties[attribute];
			if (property && property.get) return property.get.apply(this, Array.slice(arguments, 1));
			else return this.getAttribute(attribute, 2);
		},

		erase: function(attribute){
			var property = properties[attribute];
			if (property){
				if (property.erase) property.erase.apply(this);
				else if (property.set) property.set.apply(this, '');
			} else {
				this.removeAttribute(attribute);
			}
			return this;
		}
	
	});

	//shhh
	Element.Properties = properties;

})();

Element.addSetter('css', function(style){
	this.style.cssText = style;
});

Element.addGetter('css', function(){
	return this.style.cssText;
});

Element.addGetter('tag', function(){
	return this.tagName.toLowerCase();
});

Element.addSetter('html', (function(){
	
	var wrapper = document.createElement('div');

	var translations = {
		table: [1, '<table>', '</table>'],
		select: [1, '<select>', '</select>'],
		tbody: [2, '<table><tbody>', '</tbody></table>'],
		tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};
	translations.thead = translations.tfoot = translations.tbody;
	
	return function(){
		var html = Array.flatten(arguments).join('');
		var wrap = Browser.Engine.trident && translations[this.get('tag')];
		if (wrap){
			var first = wrapper;
			first.innerHTML = wrap[1] + html + wrap[2];
			for (var i = wrap[0]; i--;) first = first.firstChild;
			this.empty().adopt(first.childNodes);
		} else {
			this.innerHTML = html;
		}
	};

})());

if (Browser.Engine.webkit && Browser.Engine.version < 420) Element.addGetter('text', function(){
	if (this.innerText) return this.innerText;
	var temp = document.newElement('div', {html: this.innerHTML}).inject(document.body);
	var text = temp.innerText;
	temp.destroy();
	return text;
});
