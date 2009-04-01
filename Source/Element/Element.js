/*
Script: Element.js
	Contains an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

var Element = function(item, props){
	return (typeOf(item) == 'string') ? document.newElement(item, props) : document.id(item).set(props);
};

Element.prototype = Browser.Element.prototype;

// mirror element methods to Elements

new Native('Element', Element).mirror(function(name, method){
	if (Array[name]) return;
	Elements.implement(name, function(){
		var results = [], args = arguments, elements = true;
		for (var i = 0, l = this.length; i < l; i++){
			var element = this[i], result = element[name].apply(element, args);
			results[i] = result;
			elements = (elements && typeOf(result) == 'element');
		}
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
		},
		
		element: function(item){
			if (window.console) console.warn('Extending element manually.');
			Object.append(item, proto);
			item.constructor = Element;
			return item;
		}

	};
	
	types.window = types.document = types.textnode = types.whitespace = types.element = Function.argument(0);
	
	var proto = {};

	if (document.html.mergeAttributes){
		
		proto = document.createElement('div');
		proto[':type'] = Function.from('element');

		types.element = function(item){
			item.mergeAttributes(proto);
			item.constructor = Element;
			return item;
		};

	}
	
	Element.mirror(function(name, method){
		proto[name] = method;
	});
	
	return function(item){
		if (instanceOf(item, Element)) return item;
		var processor = types[typeOf(item)];
		return (processor) ? processor(item, this) : null;
	};

})();

var Elements = function(elements, unique){
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

new Native('Elements', Elements).implement('filter', function(filter, bind){
	if (!filter) return this;
	return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
		return item.match(filter);
	} : filter, bind));
}.protect());

Elements.implement(Array.prototype);

Array.mirror(Elements);

Element.extend(new Accessors);

Element.extend({
	
	definePseudoConstructor: function(name, fn){
		return Storage.store(this, 'constructor.' + name, fn);
	},
	
	lookupPseudoConstructor: function(name){
		return Storage.retrieve(this, 'constructor.' + name);
	},
	
	defineConstructorModifier: function(name, fn){
		return Storage.store(this, 'modifier.' + name, fn);
	},
	
	lookupConstructorModifier: function(name){
		return Storage.retrieve(this, 'modifier.' + name);
	}
	
});

Document.implement({
	
	newElement: function(tag, props){
		if (!props) props = {};
		
		var parsed = slick.parse(tag)[0][0], id;
		tag = parsed.tag;
		if (parsed.id) props.id = parsed.id;

		if (parsed.attributes) parsed.attributes.each(function(att){
			if (att.value && att.operator == '=') props[att.name] = att.value;
		});
		
		if (parsed.classes) props['class'] = parsed.classes.join(' ');
		if (props.checked != null) props.defaultChecked = props.checked;
		
		var modifier = Element.lookupConstructorModifier(tag);
		var element = document.id((modifier) ? modifier() : this.createElement(tag)).set(props);
		
		if (parsed.pseudos) parsed.pseudos.each(function(pseudo){
			var parser = Element.lookupPseudoConstructor(pseudo.name);
			if (parser) parser.call(element, pseudo.argument);
		});

		return element;
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
		var element = slick(this, expression)[0];
		return (element) ? document.id(element) : null;
	}
	
});

Element.implement('match', function(expression){
	return slick.match(this, expression);
});

var $ = function(expression){
	var match = (typeOf(expression) != 'string') ? expression : (match = expression.match(/^#?([\w-]+)$/)) ? match[1] : null;
	if (match) return document.id(match);
	return document.find(expression);
};

var $$ = function(expression){
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
				if ((element = document.id(element))) this.appendChild(element);
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

/* slick attribute integration */
	
slick.getAttribute = function(element, attribute){
	var getter = Element.lookupGetter(attribute = attribute.camelCase());
	if (getter) return getter.call(element);
	return element.getAttribute(attribute, 2);
};

/* Attribute Getters, Setters */

(function(){

	var properties = [
		'checked', 'defaultChecked', 'type', 'name', 'id', 'value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
		'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'
	];

	properties = Object.append(Object.from(properties, properties), {
		'html': 'innerHTML',
		'class': 'className',
		'for': 'htmlFor',
		'text': (function(){
			var temp = document.createElement('div');
			return (temp.innerText == null) ? 'textContent' : 'innerText';
		})()
	});

	Object.each(properties, function(real, key){
		Element.defineSetter(key, function(value){
			return this[real] = value;
		});
		Element.defineGetter(key, function(){
			return this[real];
		});
	});

	var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
		'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

	bools.each(function(bool){
		Element.defineSetter(bool, function(value){
			return this[bool] = !!value;
		});
		Element.defineGetter(bool, function(){
			return !!this[bool];
		});
	});

	Element.implement({

		set: function(attribute, value){
			var setter = Element.lookupSetter(attribute = attribute.camelCase());
			if (setter) setter.call(this, value);
			else if (value == null) this.removeAttribute(attribute);
			else this.setAttribute(attribute, '' + value);
			return this;
		}.setMany(),

		get: function(attribute){
			return slick.getAttribute(this, attribute);
		}.getMany()

	});

})();

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
	
	var tableAble = Function.stab(function(){
		var table = document.createElement('table');
		table.innerHTML = '<tr><td></td></tr>';
	});
	
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
		var wrap = (!tableAble && translations[this.get('tag')]);
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
