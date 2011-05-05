/*
---
name: DOM.Element
description: The DOM.Element Class
provides: DOM.Element
requires: [Type, typeOf, Array, String, Function, Number, Object, Accessor, Slick.Parser, Store]
...
*/

(function(){

var nodeOf = function(item){
	return (item != null && item.toNode) ? item.toNode() : item;
};

// Basic Selector Engine methods

DOM.node = {};

DOM.extend('defineSelectorEngine', function(engine){
	if (!engine) return this;

	['search', 'find', 'match', 'contains', 'uidOf', 'parse'].each(function(name){
		var method = engine[name];
		if (!method) return;

		DOM.node[name] = method;

		DOM[name] = name == 'search' ? function(expression){
			return method(document, expression, new Elements);
		} : (name == 'find') ? function(expression){
			var found = method(document, expression);
			return found ? new Element(found) : null;
		} : name == 'match' ? function(node, expression){
			return method(nodeOf(node), expression);
		} : name == 'contains' ? function(container, node){
			return method(nodeOf(container), nodeOf(node));
		} : name == 'uidOf' ? function(node){
			return method(nodeOf(node));
		} : method;
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

});

// No more bling bling $ or $$
var id = DOM.id = function(item){
	var type;
	return (item == null) ? null
		: (item instanceof Element) ? item
		: (item == window) ? hostWindow
		: (item == document) ? hostDocument
		: ((type = typeOf(item)) == 'element') ? new Element(item)
		: (type == 'string') ? DOM.find('#' + item)
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

		if (typeof node == 'string') return hostDocument.build(node);

		if (node.toElement) node = node.toElement();
		if (node.toNode) node = node.toNode();

		if (!nomatch) for (var l = matchers.length; l--;){
			var current = matchers[l];
			if (DOM.match(node, current._match)){
				return new current._class(node, props, true);
			}
		}

		return this.parent(node).set(props);
	}

});

// Collections of Elements

var Elements = DOM.Elements = new Type('Elements', function(nodes){
	if (!(nodes && nodes.length)) return;
	var i = 0, uniques = {}, node;
	while ((node = nodes[i++])){
		var uid = DOM.uidOf(node);
		if (!uniques[uid]){
			uniques[uid] = true;
			this.push(node);
		}
	}
});

Element.mirror(function(key){
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

Elements.implement({

	length: 0,

	filter: function(filter, context){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, context));
	},

	push: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = $(arguments[i]);
			if (item) this[this.length++] = item;
		}
		return this.length;
	},

	log: function(){
		return this.map(function(wrapper){
			return wrapper.toNode();
		});
	}

});

// fetch all Array methods and put them in Elements

var arrayMethods = ['pop', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
'indexOf', 'lastIndexOf', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'].pair(function(m){
	return Array.prototype[m];
});

Elements.implement(arrayMethods).implement(Array.prototype);

// from now on, everytime you implement to Array you also implement to Elements.

Array.mirror(function(key, value){
	Elements.implement(key, value);
});


// Put all those useful methods in Element

Element.implement({

	appendChild: function(child){
		return this.node.appendChild(id(child));
	},

	setAttribute: function(name, value){
		return this.node.setAttribute(name, value);
	},

	getAttribute: function(name){
		return this.node.getAttribute(name);
	},

	contains: function(node){
		return DOM.node.contains(this.node, id(node));
	},

	match: function(expression){
		return DOM.node.match(this.node, expression);
	}

});

Element.prototype.toString = function(){
	var tag = this.get('tag'), id = this.get('id'), className = this.get('class');
	var str = '<' + tag;
	if (id) str += '#' + id;
	if (className) str += '.' + className.replace(/\s+/, '.');
	return str + '>';
};

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
		inserters[where || 'bottom'](this.node, id(element));
		return this;
	},

	eject: function(){
		var parent = this.node.parentNode;
		if (parent) parent.removeChild(this.node);
		return this;
	},

	adopt: function(){
		Array.each(arguments, function(element){
			if ((element = id(element))) this.node.appendChild(element);
		}, this);
		return this;
	},

	appendText: function(text, where){
		inserters[where || 'bottom'](document.createTextNode(text), this.node);
		return this;
	},

	grab: function(element, where){
		inserters[where || 'bottom'](id(element), this.node);
		return this;
	},

	replace: function(element){
		element = id(element);
		element.parentNode.replaceChild(this.node, element);
		return this;
	},

	wrap: function(element, where){
		return this.replace(element).grab(element, where);
	}

});

/* Tree Walking */

var methods = {
	find: {
		getNext: '+',
		getPrevious: '!+',
		getFirst: '^',
		getLast: '!^',
		getParent: '!>'
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


/* Attribute Getters, Setters, using Slick */

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
		return (temp.innerText == null) ? 'textContent' : 'innerText';
	})()
});

Object.each(properties, function(real, key){
	Element.defineSetter(key, function(value){
		return this.node[real] = value;
	}).defineGetter(key, function(){
		return this.node[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.each(function(bool){
	Element.defineSetter(bool, function(value){
		return this.node[bool] = !!value;
	}).defineGetter(bool, function(){
		return !!this.node[bool];
	});
});

Element.defineGetters({

	'class': function(){
		var node = this.node;
		return ('className' in node) ? node.className : node.getAttribute('class');
	},

	'for': function(){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
	},

	'href': function(){
		var node = this.node;
		return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
	},

	'style': function(){
		var node = this.node;
		return (node.style) ? node.style.cssText : node.getAttribute('style');
	}

}).defineSetters({

	'class': function(value){
		var node = this.node;
		return ('className' in node) ? node.className = value : node.setAttribute('class', value);
	},

	'for': function(value){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
	},

	'style': function(value){
		var node = this.node;
		return (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
	}

});

/* get, set */

Element.implement({

	set: function(name, value){
		var setter = Element.lookupSetter(name = name.camelCase());
		if (setter) setter.call(this, value);
		else if (value == null) this.node.removeAttribute(name);
		else this.node.setAttribute(name, value);
	}.overloadSetter(),

	get: function(name){
		var getter = Element.lookupGetter(name = name.camelCase());
		if (getter) return getter.call(this);
		return this.node.getAttribute(name);
	}.overloadGetter()

});

Element.defineGetter('tag', function(){
	return this.node.tagName.toLowerCase();
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

Element.defineSetter('html', function(html){
	if (typeOf(html) == 'array') html = html.join(' ');
	var wrap = (!tableTest && tableTranslations[this.get('tag')]);
	if (wrap){
		var first = tableWrapper;
		first.innerHTML = wrap[1] + html + wrap[2];
		for (var i = wrap[0]; i--; i) first = first.firstChild;
		this.set('html', '').adopt(first.childNodes);
	} else {
		this.innerHTML = html;
	}
	return html;
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

	build: function(tag){
		var props = {};

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
		return DOM.node.search(this.node, expression, new Elements);
	},

	find: function(expression){
		var found = DOM.node.find(this.node, nodeOf(expression));
		return found ? new Element(found) : null;
	}

});


})();
