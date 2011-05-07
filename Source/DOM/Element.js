/*
---
name: DOM.Element
description: The MooTools DOM library, making the DOM FUN FUN FUN!
provides: [DOM, DOM.id, DOM.Element, DOM.Elements, DOM.Document, DOM.document, DOM.Window, DOM.window]
requires: [Type, typeOf, Array, String, Function, Number, Object, Accessor, Slick.Parser, Store]
...
*/

(function(){

var window = this, document = window.document,
	html = document.documentElement;

var nodeOf = function(item){
	return (item != null && item.toNode) ? item.toNode() : item;
};

var wrappers = {};

// Base DOM Class

var DOM = this.DOM = new Class({

	implement: [Events, Store],

	initialize: function(node){
		node = this.node = nodeOf(node);
		var uid = SelectorEngine.uidOf(node);
		return (wrappers[uid] || (wrappers[uid] = this));
	},

	toNode: function(){
		return this.node;
	},

	addEventListener: ((html.addEventListener) ? function(type, fn){
		this.node.addEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.attachEvent('on' + type, fn);
		return this;
	}),

	removeEventListener: ((html.removeEventListener) ? function(type, fn){
		this.node.removeEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.detachEvent('on' + type, fn);
		return this;
	})

});

DOM.prototype.log = DOM.prototype.toNode;

// Basic Selector Engine methods

SelectorEngine = {};

DOM.extend('defineSelectorEngine', function(engine){
	if (!engine) return this;

	['search', 'find', 'match', 'contains', 'uidOf', 'parse'].each(function(name){
		if (engine[name]) SelectorEngine[name] = engine[name];
	});

	return this;

}).defineSelectorEngine({

	search: function(){
		return [];
	},

	find: function(){
		return null;
	},

	match: function(){
		return false;
	},

	contains: function(){
		return false;
	},

	uidOf: function(node){
		return node.uniqueID || (node.uniqueID = String.uniqueID());
	},

	parse: Slick.parse

}).extend({

	search: function(expression){
		SelectorEngine.search(document, expression, new Elements);
	},

	find: function(expression){
		var found = SelectorEngine.find(document, expression);
		return found ? new Element(found) : null;
	}

});



// No more bling bling $ or $$
var id = DOM.id = function(item){
	var type;
	return (item == null) ? null
		: (item instanceof Element) ? item
		: (item == window) ? hostWindow
		: (item == document) ? hostDocument
		: ((type = typeOf(item)) == 'element') ? new Element(item)
		: (type == 'string') ? DOM.find('#' + item.replace(/(\W)/g, '\\$1'))
		: null;
};


// Element and Element subclassing

var matchers = [];

Class.defineMutator('Matches', function(match){
	matchers.push({_match: match, _class: this});
});

var Element = DOM.Element = new Class({

	Extends: DOM,

	initialize: function(node, props, nomatch){
		if (node == null) node = 'div';

		if (typeof node == 'string') return hostDocument.build(node, props);

		if (node.toElement) node = node.toElement();
		if (node.toNode) node = node.toNode();

		if (!nomatch) for (var l = matchers.length; l--;){
			var current = matchers[l];
			if (SelectorEngine.match(node, current._match)){
				return new current._class(node, props, true);
			}
		}

		return this.parent(node).set(props);
	}

}).mirror(function(key){
	if (Array.prototype[key]) return;

	Elements.implement(key, function(){
		var results = [], isElements = true;
		for (var i = 0, l = this.length; i < l; i++){
			var element = this[i],
				result = element[key].apply(element, arguments);
			if (isElements && !(result instanceof Element)) isElements = false;
			results[i] = nodeOf(result);
		}
		return (isElements) ? new Elements(results) : results;
	});
});

// Collections of Elements

var Elements = DOM.Elements = function(nodes){
	if (nodes && nodes.length){
		var uniques = {}, node;
		for (var i = 0; node = id(nodes[i++]);){
			var uid = SelectorEngine.uidOf(nodeOf(node));
			if (!uniques[uid]){
				uniques[uid] = true;
				this.push(node);
			}
		}
	}
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

	filter: function(filter, context){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, context));
	}.protect(),

	push: function(){
		var length = this.length;
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = id(arguments[i]);
			if (item) this[length++] = item;
		}
		return (this.length = length);
	}.protect(),

	unshift: function(){
		var items = [];
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = id(arguments[i]);
			if (item) items.push(item);
		}
		return Array.prototype.unshift.apply(this, items);
	}.protect(),

	concat: function(){
		var newElements = new Elements(this);
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = arguments[i];
			if (Type.isEnumerable(item)) newElements.append(item);
			else newElements.push(item);
		}
		return newElements;
	}.protect(),

	append: function(collection){
		for (var i = 0, l = collection.length; i < l; i++) this.push(collection[i]);
		return this;
	}.protect(),

	empty: function(){
		while (this.length) delete this[--this.length];
		return this;
	}.protect(),

	log: function(){
		return this.map(function(wrapper){
			return wrapper.toNode();
		});
	}.protect()

});

// FF, IE
var splice = Array.prototype.splice, object = {'0': 0, '1': 1, length: 2};

splice.call(object, 1, 1);
if (object[1] == 1) Elements.implement('splice', function(){
	var length = this.length;
	splice.apply(this, arguments);
	while (length >= this.length) delete this[length--];
	return this;
}.protect());

Elements.implement(Array.prototype);

Array.mirror(Elements);


// Put all those useful methods in Element

Element.implement({

	appendChild: function(child){
		return this.node.appendChild(nodeOf(id(child)));
	},

	setAttribute: function(name, value){
		return this.node.setAttribute(name, value);
	},

	getAttribute: function(name){
		return this.node.getAttribute(name);
	},

	contains: function(node){
		return !!((node = id(node)) && SelectorEngine.contains(this.node, nodeOf(node)));
	},

	match: function(expression){
		return SelectorEngine.match(this.node, expression);
	},

	toString: function(){
		var tag = this.get('tag'), id = this.get('id'), className = this.get('class');
		var str = '<' + tag;
		if (id) str += '#' + id;
		if (className) str += '.' + className.replace(/\s+/g, '.');
		return str + '>';		
	}

});

/* Classes */

var classRegExps = {};
var classRegExpOf = function(string){
	return classRegExps[string] || (classRegExps[string] = new RegExp('(^|\\s)' + string.escapeRegExp() + '(?:\\s|$)'));
};

Element.implement({

	hasClass: function(className){
		return classRegExpOf(className).test(this.node.className);
	},

	addClass: function(className){
		var node = this.node;
		if (!this.hasClass(className)) node.className = (node.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		var node = this.node;
		node.className = node.className.replace(classRegExpOf(className), '$1').clean();
		return this;
	},

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	}

});

/* Injections / Dejections */

var inserters = {

	before: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}

};

Element.implement({

	inject: function(element, where){
		inserters[where || 'bottom'](this.node, nodeOf(id(element)));
		return this;
	},

	eject: function(){
		var parent = this.node.parentNode;
		if (parent) parent.removeChild(this.node);
		return this;
	},

	adopt: function(){
		var parent = this.node, fragment,
			elements = Array.flatten(arguments), length = elements.length;
		if (length > 1) parent = fragment = document.createDocumentFragment();

		for (var i = 0; i < length; i++){
			var element = id(elements[i], true);
			if (element) parent.appendChild(element.node);
		}

		if (fragment) this.node.appendChild(fragment);

		return this;
	},

	appendText: function(text, where){
		inserters[where || 'bottom'](document.createTextNode(text), this.node);
		return this;
	},

	grab: function(element, where){
		inserters[where || 'bottom'](nodeOf(id(element)), this.node);
		return this;
	},

	// No replaces like 1.x ??
	replace: function(element){
		element = nodeOf(id(element));
		element.parentNode.replaceChild(this.node, element);
		return this;
	},

	// No wraps like 1.x ??
	wrap: function(element, where){
		element = nodeOf(id(element));
		return this.replace(element).grab(element, where);
	}

});

/* Tree Walking */

var methods = {
	find: {
		getNext: '~',
		getPrevious: '!~',
		getFirst: '^',
		getLast: '!^',
		getParent: '!'
	},
	search: {
		getAllNext: '~',
		getAllPrevious: '!~',
		getSiblings: '~~',
		getChildren: '>',
		getParents: '!'
	}
};

Object.each(methods, function(getters, method){

	Element.implement(Object.map(getters, function(combinator){
		return function(expression){
			return this[method](combinator + (expression || '*'));
		};
	}));

});


/* Attribute Getters, Setters */

Element.extend(new Accessor('Getter')).extend(new Accessor('Setter'));

var properties = [
	'checked', 'defaultChecked', 'type', 'value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
	'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap',
	// Attributes
	'id', 'attributes', 'childNodes', 'className', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'dir', 'firstChild',
	'lang', 'lastChild', 'name', 'nextSibling', 'nodeName', 'nodeType', 'nodeValue',
	'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth',
	'ownerDocument', 'parentNode', 'prefix', 'previousSibling', 'scrollHeight', 'scrollWidth', 'tabIndex', 'tagName',
	'textContent', 'innerHTML', 'title'
];

properties = Object.append(Object.from(properties, properties), {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'text': (function(){
		var temp = document.createElement('div');
		return (temp.innerText == null) ? 'innerText' : 'textContent';
	})()
});

Object.each(properties, function(real, key){
	Element.defineSetter(key, function(node, value){
		return node[real] = value;
	}).defineGetter(key, function(node){
		return node[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.each(function(bool){
	Element.defineSetter(bool, function(node, value){
		return node[bool] = !!value;
	}).defineGetter(bool, function(node){
		return !!node[bool];
	});
});

// Can't we use Slick.getAttribute ?

Element.defineGetters({

	'class': function(node){
		return node.getAttribute('class') || node.className;
	},

	'for': function(node){
		return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
	},

	'href': function(node){
		return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
	},

	'style': function(node){
		return (node.style) ? node.style.cssText : node.getAttribute('style');
	},

	'tabindex': function(node){
		var attributeNode = node.getAttributeNode('tabindex');
		return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
	}

}).defineSetters({

	'class': function(node, value){
		('className' in node) ? node.className = value : node.setAttribute('class', value);
	},

	'for': function(node, value){
		('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
	},

	'style': function(node, value){
		(node.style) ? node.style.cssText = value : node.setAttribute('style', value);
	}

});

/* get, set */

Element.implement({

	set: function(name, value){
		var setter = Element.lookupSetter(name = name.camelCase());
		if (setter) setter.call(this, this.node, value);
		else if (value == null) this.node.removeAttribute(name);
		else this.node.setAttribute(name, value);
	}.overloadSetter(),

	get: function(name){
		var getter = Element.lookupGetter(name = name.camelCase());
		if (getter) return getter.call(this, this.node);
		return this.node.getAttribute(name);
	}.overloadGetter()

});

Element.defineGetter('tag', function(node){
	return node.tagName.toLowerCase();
});

var tableTest = Function.attempt(function(){
	var table = document.createElement('table');
	table.innerHTML = '<tr><td></td></tr>';
});

var tableWrapper = document.createElement('div');

var tableTranslations = {
	'table': [1, '<table>', '</table>'],
	'select': [1, '<select>', '</select>'],
	'tbody': [2, '<table><tbody>', '</tbody></table>'],
	'tr': [3, '<table><tbody><tr>', '</tr></tbody></table>']
};

Element.defineSetter('html', function(node, html){
	if (typeOf(html) == 'array') html = html.join('');
	var wrap = (!tableTest && tableTranslations[this.get('tag')]);
	if (wrap){
		var first = tableWrapper;
		first.innerHTML = wrap[1] + html + wrap[2];
		for (var i = wrap[0]; i--;) first = first.firstChild;
		this.node.innerHTML = '';
		this.adopt(first.childNodes);
	} else {
		node.innerHTML = html;
	}
});


// TODO: Cloning?


// Wrap Document and Window

var Document = DOM.Document = new Class({

	Extends: DOM,

	newElement: function(tag, props){
		return new Element(this.node.createElement(tag), props);
	},

	newTextNode: function(text){
		return this.node.createTextNode(text);
	},

	build: function(tag, props){
		if (!props) props = {};

		if (!(/^[\w-]+$/).test(tag)){
			var parsed = Slick.parse(tag).expressions[0][0];
			tag = (parsed.tag == '*') ? 'div' : parsed.tag;
			if (parsed.id && props.id == null) props.id = parsed.id;

			var attributes = parsed.attributes;
			if (attributes) for (var attr, i = 0, l = attributes.length; i < l; i++){
				attr = attributes[i];
				if (props[attr.key] != null) continue;

				if (attr.value != null && attr.operator == '=') props[attr.key] = attr.value;
				else if (!attr.value && !attr.operator) props[attr.key] = true;
			}

			if (parsed.classList && props['class'] == null) props['class'] = parsed.classList.join(' ');
		}
		return this.newElement(tag, props);
	},

	toString: function(){
		return '<document>';
	}

});

var hostDocument = DOM.document = new Document(document);

var Window = DOM.Window = new Class({

	Extends: DOM,

	toString: function(){
		return '<window>';
	}

});

var hostWindow = DOM.window = new Window(window);


/* Add search and find methods */

[Element, Document].invoke('implement', {

	search: function(expression){
		return SelectorEngine.search(this.node, expression, new Elements);
	},

	find: function(expression){
		var found = SelectorEngine.find(this.node, nodeOf(expression));
		return found ? new Element(found) : null;
	}

});


})();
