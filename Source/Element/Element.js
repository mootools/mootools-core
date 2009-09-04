/*=
name: Element
description: Element class, Elements class, and basic dom methods.,
requires:
  - Accessor
  - Storage
  - Slick
=*/

(function(){

var Element = this.Element = function(item, props){
	if (typeOf(item) != 'string') return document.id(item).set(props);
	
	if (!props) props = {};
	
	var parsed = Slick.parse(item).expressions[0][0], id;
	
	var tag = parsed.tag || 'div';
	if (parsed.id) props.id = parsed.id;
	
	var classes = [];
	
	parsed.parts.each(function(part){
		
		switch (part.type){
			case 'class': classes.push(part.value); break;
			case 'attribute':
				if (part.value && part.operator == '=') props[part.key] = part.value;
			break;
		}
		
	});
	
	if (classes.length) props['class'] = classes.join(' ');
	
	return document.newElement(tag, props);
};

Element.prototype = Browser.Element.prototype;

// mirror element methods to Elements

new Type('Element', Element).mirror(function(name, method){
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

var types = {

	object: function(item){
		return (item.toElement) ? item.toElement() : null;
	},

	string: function(item){
		return types.element(document.getElementById(item));
	}

};

types.window = types.document = types.textnode = types.whitespace = function(item){
	return item;
};

if (document.html.mergeAttributes){
	
	var protoElement = document.createElement('div');
	protoElement.$typeOf = Function.from('element');

	types.element = function(item){
		item.mergeAttributes(protoElement);
		item.constructor = Element;
		return item;
	};
	
	Element.mirror(function(name, method){
		protoElement[name] = method;
	});

}

var Elements = this.Elements = function(elements){
	if (!elements || !elements.length) return;
	Slick.uniques(elements, this);
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
	
	push: function(item){
		if (document.id(item)) this[this.length++] = item;
		return this.length;
	}.protect()

});

Elements.implement(Array.prototype);

Array.mirror(Elements);

Document.implement({
	
	id: function(item){
		if (instanceOf(item, Element)) return item;
		var processor = types[typeOf(item)];
		return (processor) ? processor(item) : null;
	},
	
	newElement: function(tag, props){
		if (props && props.checked != null) props.defaultChecked = props.checked;
		return document.id(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
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

Element.implement('match', function(expression){
	return Slick.match(this, expression);
});

if (this.$ == null) this.$ = document.id;

if (this.$$ == null) this.$$ = function(expression){
	return document.search(expression);
};

/* ClassNames Accessor */

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
	
	dispose: function(){
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
		interters[where || 'bottom'](document.id(el), this);
		return this;
	},

	inject: function(el, where){
		interters[where || 'bottom'](this, document.id(el));
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

/* Attribute Getters, Setters */

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

/* Slick attribute integration */

Slick.getAttribute = function(element, attribute){
	var getter = Element.lookupGetter(attribute);
	return (getter) ? getter.call(element) : element.getAttribute(attribute, 2);
};

/* get, set */

Element.implement({

	set: function(object){
		for (var attribute in object){
			var value = object[attribute];
			attribute = attribute.camelCase();
			var setter = Element.lookupSetter(attribute);
			if (setter) setter.call(this, value);
			else if (value == null) this.removeAttribute(attribute);
			else this.setAttribute(attribute, '' + value);
		}
		return this;
	}.overload(Function.overloadPair),

	get: function(){
		var key, results = {};
		for (var i = 0, l = arguments.length; i < l; i++){
			key = arguments[i].camelCase();
			results[key] = Slick.getAttribute(this, key);
		}
		return (l == 1) ? results[key] : results;
	}.overload(Function.overloadList)

});

Element.defineSetter('css', function(style){
	return this.style.cssText = style;
}).defineGetter({

	css: function(){
		return this.style.cssText;
	},

	tag: function(){
		return this.tagName.toLowerCase();
	}

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
