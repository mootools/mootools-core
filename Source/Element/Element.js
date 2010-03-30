/*
---
name: Element
description: The MooTools DOM library.
requires: [Type, typeOf, instanceOf, Browser, Window, Document, Array, String, Function, Number, Object, Accessor, Slick.Parser, Slick.Finder]
provides: [Element, Elements, $, $$]
...
*/

(function(){

var document = this.document;

var Element = this.Element = function(item, props){
	var element = (typeOf(item) == 'string') ? document.build(item) : document.id(item);
	return (element) ? element.set(props) : null;
};

var types = {

	object: function(item){
		return (item.toElement) ? item.toElement() : null;
	},

	string: function(item){
		return types.element(document.getElementById(item));
	}

};

types.element = types.window = types.document = types.textnode = types.whitespace = function(item){
	return item;
};

if (Browser.Element){
	
	Element.prototype = Browser.Element.prototype;
	
} else {
	
	Element.parent = Object;
	
	var protoElement = document.createElement('div');
	protoElement.$typeOf = Function.from('element').hide();
	
	Element.mirror(function(name, method){
		protoElement[name] = method;
	});

	types.element = function(item){
		item.mergeAttributes(protoElement);
		item.constructor = Element;
		return item;
	};
	
}

// mirror element methods to Elements

new Type('Element', Element).mirror(function(name, method){
	if (Array[name]) return;
	Elements.implement(name, function(){
		var results = [], args = arguments, elements = true;
		for (var i = 0, l = this.length; i < l; i++){
			var element = this[i], result = results[i] = element[name].apply(element, args);
			elements = (elements && typeOf(result) == 'element');
		}
		return (elements) ? new Elements(results) : results;
	});
});

var Elements = this.Elements = function(elements){
	if (elements && elements.length) Slick.uniques(elements, this);
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}.protect(),
	
	push: function(){
		var length = this.length;
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = document.id(arguments[i]);
			if (item) this[length++] = item;
		}
		return (this.length = length);
	}.protect()

}).implement(Array.prototype);

Array.mirror(Elements);

Document.implement({
	
	id: function(item){
		if (instanceOf(item, Element)) return item;
		var processor = types[typeOf(item)];
		return (processor) ? processor(item) : null;
	},
	
	newElement: function(tag, props){
		if (props && props.checked != null) props.defaultChecked = props.checked;
		return this.id(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	},
	
	build: function(selector){

		if ((/^[\w-]+$/).test(selector)) return this.newElement(selector);
			
		var props = {},
			parsed = Slick.parse(selector).expressions[0][0],
			tag = (parsed.tag == '*') ? 'div' : parsed.tag;

		props.id = parsed.id;

		var classes = [];

		for (var part in parsed.parts){
			var current = parsed.parts[part];
			if (current.type == 'class') classes.push(current.value);
			else if (current.type == 'attribute' && current.operator == '=') props[current.key] = current.value;
		}

		if (classes.length) props['class'] = classes.join(' ');
		
		return this.newElement(tag, props);
		
	}
	
});

// search and find, Slick integration

[Document, Element].call('implement', {
	
	search: function(expression){
		return Slick(this, expression, new Elements);
	},
	
	find: function(expression){
		var element = Slick(this, expression)[0];
		return (element) ? document.id(element) : null;
	}
	
});

Element.protect('contains').implement({
	
	contains: function(element){
		return Slick.contains(this, element);
	},
	
	match: function(expression){
		return Slick.match(this, expression);
	}
	
});

Document.implement('contains', function(element){
	var html = this.html;
	return (element == html) || Slick.contains(html, element);
});

if (this.$ == null) this.$ = document.id;

if (this.$$ == null) this.$$ = function(expression){
	return document.search(expression);
};

/* ClassNames Accessor */

var regexes = {};
var regexOf = function(string){
	return regexes[string] || (regexes[string] = new RegExp('(^|\\s)' + string.escapeRegExp() + '(?:\\s|$)'));
};

Element.implement({

	hasClass: function(className){
		return regexOf(className).test(this.className);
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(regexOf(className), '$1').clean();
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

inserters.inside = inserters.bottom;

Element.implement({
	
	eject: function(){
		var parent = this.parentNode;
		return (parent) ? parent.removeChild(this) : this;
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
		inserters[where || 'bottom'](document.id(el), this);
		return this;
	},

	inject: function(el, where){
		inserters[where || 'bottom'](this, document.id(el));
		return this;
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

});

var methods = {};

Object.each(inserters, function(inserter, where){
	
	var Where = where.capitalize();
	
	methods['inject' + Where] = function(el){
		return this.inject(el, where);
	};

	methods['grab' + Where] = function(el){
		return this.grab(el, where);
	};

});

Element.implement(methods);

/* Tree Walking */

methods = {
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

/* Element Storage */

['store', 'retrieve', 'dump'].each(function(name){
	
	Element.implement(name, function(){
		Object.append(this, new Storage);
		return this[name].apply(this, arguments);
	});
	
});

/* Attribute Getters, Setters, using Slick */

Element.extend(new Accessor('Getter')).extend(new Accessor('Setter'));

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
	}).defineGetter(key, function(){
		return this[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.each(function(bool){
	Element.defineSetter(bool, function(value){
		return this[bool] = !!value;
	}).defineGetter(bool, function(){
		return !!this[bool];
	});
});

Element.defineGetters({

	'class': function(){
		return ('className' in this) ? this.className : this.getAttribute('class');
	},

	'for': function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	},

	'href': function(){
		return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
	},

	'style': function(){
		return (this.style) ? this.style.cssText : this.getAttribute('style');
	}

}).defineSetters({

	'class': function(value){
		return ('className' in this) ? this.className = value : this.setAttribute('class', value);
	},

	'for': function(value){
		return ('htmlFor' in this) ? this.htmlFor = value : this.setAttribute('for', value);
	},

	'style': function(value){
		return (this.style) ? this.style.cssText = value : this.setAttribute('style', value);
	}

});

/* get, set */

Element.implement({
	
	set: function(name, value){
		name = name.camelCase();
		var setter = Element.lookupSetter(name);
		if (setter) setter.call(this, name, value);
		else if (value == null) this.removeAttribute(name);
		else this.setAttribute(name, value);
	}.overloadSetter(),

	get: function(name){
		name = name.camelCase();
		var getter = Element.lookupGetter(name);
		if (getter) return getter.call(this, name);
		return this.getAttribute(name);
	}.overloadGetter()

});

Element.defineGetter('tag', function(){
	return this.tagName.toLowerCase();
});

var tableTest = Function.stab(function(){
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

})();
