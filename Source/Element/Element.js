/*
Script: Element.js
	Contains an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

function Element(item, props){
	return (typeOf(item) == 'string') ? document.newElement(item, props) : document.id(item).set(props);
};

Element.prototype = Browser.Element.prototype;

// mirror element methods to Elements

new Native(Element).mirror(function(name, method){
	Elements.implement(name, function(){
		var results = [], args = arguments, elements = true;
		this.each(function(element){
			var result = element[name].apply(element, args);
			results.push(result);
			if (elements && typeOf(result) != 'element') elements = false;
		});
		return (elements) ? new Elements(results) : results;
	});
});

document.id = (function(){
	
	var types = {

		object: function(item, doc){
			return (item.toElement) ? item.toElement() : null;
		},

		string: function(item, doc){
			return types.element(doc.getElementById(item));
		}

	};
	
	types.window = types.document = types.textnode = types.whitespace = types.element = Function.argument(0);

	if (Browser.Engine.trident){
		
		var proto = document.createElement('div');
		proto[':type'] = Function.from('element');
		
		Element.mirror(function(name, method){
			proto[name] = method;
		});

		types.element = function(item){
			item.mergeAttributes(proto);
			item.constructor = Browser.Element;
			return item;
		};

	}
	
	return function(item){
		if (instanceOf(item, Browser.Element)) return item;
		var processor = types[typeOf(item)];
		return (processor) ? processor(item, this) : null;
	};

})();

function Elements(elements, unique){
	if (!elements || !elements.length) return;
	if (unique == null) unique = true;
	var uniques = {};
	for (var i = 0, l = elements.length; i < l; i++){
		var element = document.id(elements[i]);
		if (!element) continue;
		if (unique){
			var uid = slick.uidOf(element);
			if (uniques[uid]) continue;
			uniques[uid] = true;
		}
		this.push(element);
	}
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Native(Elements).implement('filter', function(filter, bind){
	if (!filter) return this;
	return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
		return item.match(filter);
	} : filter, bind));
});

Elements.implement(Array.prototype);

Array.mirror(Elements);

Document.implement({
	
	newElement: function(tag, props){
		var element;
		
		if ((/^<\w/).test(tag)){
			var temp = this.createElement('div');
			temp.innerHTML = tag;
			element = temp.firstChild;
		} else if (Browser.Engine.trident && props){
			['name', 'type', 'checked'].each(function(attribute){
				if (!props[attribute]) return;
				tag += ' ' + attribute + '="' + props[attribute] + '"';
				if (attribute != 'checked') delete props[attribute];
			});
			tag = '<' + tag + '>';
		}

		if (!element) element = this.createElement(tag);
		return this.id(element).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	}
	
});

// search and find, slick integration

[Document, Element].call('implement', {
	
	search: function(expression){
		return new Elements(slick(this, expression), false);
	},
	
	find: function(expression){
		return document.id(slick(this, expression)[0]);
	}
	
});

Element.implement('match', function(expression){
	return slick.match(this, expression);
});

function $(expression){
	if (typeof expression!='string') return document.id(expression);
	
	var match = expression.match(/^#?([\w-]+)$/);
	if (match) return document.id(match[1]); //compat
	return document.find(expression);
};

function $$(expression){
	return document.search(expression);
};

/* ClassNames Accessors */

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

/* Injections / Dejections */

(function(){
	
	var inserters = {

		Before: function(context, element){
			if (element.parentNode) element.parentNode.insertBefore(context, element);
		},

		After: function(context, element){
			if (!element.parentNode) return;
			var next = element.nextSibling;
			if (next) element.parentNode.insertBefore(context, next);
			else element.parentNode.appendChild(context);
		},

		Bottom: function(context, element){
			element.appendChild(context);
		},

		Top: function(context, element){
			var first = element.firstChild;
			if (first) element.insertBefore(context, first);
			else element.appendChild(context);
		}

	};

	inserters.Inside = inserters.Bottom;
	
	var methods = {};

	Object.each(inserters, function(inserter, where){
	
		methods['inject' + where] = function(el){
			inserter(this, document.id(el));
			return this;
		};
	
		methods['grab' + where] = function(el){
			inserter(document.id(el), this);
			return this;
		};
	
	});
	
	Element.implement(Object.append(methods, {
		
		dispose: function(){
			return (this.parentNode) ? this.parentNode.removeChild(this) : this;
		},
		
		adopt: function(){
			Array.flatten(arguments).each(function(element){
				if (element = document.id(element)) this.appendChild(element);
			}, this);
			return this;
		},

		appendText: function(text, where){
			return this.grab(document.newTextNode(text), where);
		},

		grab: function(el, where){
			return this['grab' + (where ? where.capitalize() : 'Bottom')](el);
		},

		inject: function(el, where){
			return this['inject' + (where ? where.capitalize() : 'Bottom')](el);
		},

		replaces: function(el){
			el = document.id(el);
			el.parentNode.replaceChild(this, el);
			return this;
		},

		wraps: function(el, where){
			el = document.id(el);
			return this.replaces(el).grab(el, where);
		}
		
	}));
	
})();

/* Element Storage */

Element.implement(new Storage);

/* Attribute Getters, Setters, Erasers */

Element.extend(new Accessors);

Element.defineEraser = function(key, fn){
	Storage.retrieve(this, 'accessors:erase', {})[key] = fn;
	return this;
};

Element.lookupEraser = function(key, fn){
	return Storage.retrieve(this, 'accessors:erase', {})[key];
};

(function(){
	
	var camels = ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
		'frameBorder', 'maxLength', 'rowSpan', 'tabIndex', 'useMap'];
		
	var attributes = Object.append({
		'html': 'innerHTML',
		'class': 'className',
		'for': 'htmlFor',
		'text': (Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)) ? 'innerText' : 'textContent'
	}, Object.from(camels.map(String.toLowerCase), camels));
	
	Object.each(attributes, function(realKey, key){
		Element.defineSetter(key, function(value){
			return this[realKey] = value;
		});
		Element.defineGetter(key, function(){
			return this[realKey];
		});
	});
	
	var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
		'disabled', 'multiple', 'selected', 'noresize', 'defer'];
		
	bools.each(function(bool){
		Element.defineSetter(bool, function(value){
			return this[bool] = !!value;
		});
		Element.defineGetter(bool, function(){
			return !!this[bool];
		});
		Element.defineEraser(bool, function(){
			this[bool] = false;
		});
	});
	
	['readonly', 'readOnly'].each(function(bool){
		Element.defineSetter(bool, function(value){
			return this.readonly = this.readOnly = !!value;
		});
		Element.defineGetter(bool, function(){
			return !!(this.readonly || this.readOnly);
		});
		Element.defineEraser(bool, function(){
			this.readonly = this.readOnly = false;
		});
	});
	
	Element.implement({

		set: function(attribute, value){
			var setter = Element.lookupSetter(attribute);
			if (setter) setter.call(this, value);
			else this.setAttribute(attribute, '' + value);
			return this;
		}.asSetter(),

		get: function(attribute){
			var getter = Element.lookupGetter(attribute);
			if (getter) return getter.call(this);
			else return this.getAttribute(attribute, 2);
		}.asGetter(),

		erase: function(attribute){
			var value = this.get(attribute);
			var eraser = Element.lookupEraser(attribute);
			if (eraser) eraser.call(this);
			else if (Element.lookupSetter(attribute)) this.set(attribute, '');
			else this.removeAttribute(attribute);
			return value;
		}.asGetter()
	
	});

})();

//slick attribute integration

slick.getAttribute = Element.get;

Element.defineSetter('css', function(style){
	return this.style.cssText = style;
});

Element.defineGetter('css', function(){
	return this.style.cssText;
});

Element.defineGetter('tag', function(){
	return this.tagName.toLowerCase();
});

Element.defineSetter('html', (function(){
	
	var wrapper = document.createElement('div');

	var translations = {
		'table': [1, '<table>', '</table>'],
		'select': [1, '<select>', '</select>'],
		'tbody': [2, '<table><tbody>', '</tbody></table>'],
		'tr': [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};

	translations.thead = translations.tfoot = translations.tbody;
	
	return function(html){
		if (typeOf(html) == 'array') html = html.join(' ');
		var wrap = (Browser.Engine.trident && translations[this.get('tag')]);
		if (wrap){
			var first = wrapper;
			first.innerHTML = wrap[1] + html + wrap[2];
			for (var i = wrap[0]; i--; i) first = first.firstChild;
			this.set('html', '').adopt(first.childNodes);
		} else {
			this.innerHTML = html;
		}
		return html;
	};

})());

if (Browser.Engine.webkit && Browser.Engine.version < 420) Element.defineGetter('text', (function(){
	var temp = document.newElement('div', {'css': 'position: absolute; visibility: hidden;'});
	
	return function(){
		if (this.innerText) return this.innerText;
		var text = temp.inject(document.body).set('html', this.innerHTML).innerText;
		temp.dispose();
		return text;
	};

})());
