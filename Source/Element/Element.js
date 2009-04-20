/*
Script: Element.js
	Contains an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

(function(document){

var Element = this.Element = function(item, props){
	if (typeOf(item) != 'string') return document.id(item).set(props);
	
	if (!props) props = {};
	
	var parsed = slick.parse(item)[0][0], id;
	var tag = parsed.tag || 'div';
	if (parsed.id) props.id = parsed.id;
	
	if (parsed.attributes) parsed.attributes.forEach(function(att){
		if (att.value && att.operator == '=') props[att.name] = att.value;
	});
	
	if (parsed.classes) props['class'] = parsed.classes.join(' ');
	
	return document.newElement(tag, props);
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

var types = {

	object: function(item){
		return (item.toElement) ? item.toElement() : null;
	},

	string: function(item){
		return types.element(document.getElementById(item));
	},
	
	element: function(item){
		if (window.console) console.warn('Extending element manually.');
		Object.append(item, proto);
		item.constructor = Element;
		return item;
	}

};

types.window = types.document = types.textnode = types.whitespace = types.element = Function.argument(0);

var protoElement = {};

if (document.html.mergeAttributes){
	
	protoElement = document.createElement('div');
	protoElement._type_ = Function.from('element');

	types.element = function(item){
		item.mergeAttributes(protoElement);
		item.constructor = Element;
		return item;
	};

}

Element.mirror(function(name, method){
	protoElement[name] = method;
});

document.id = function(item){
	if (instanceOf(item, Element)) return item;
	var processor = types[typeOf(item)];
	return (processor) ? processor(item, this) : null;
};

var Elements = this.Elements = function(elements){
	if (!elements || !elements.length) return;
	slick.uniques(elements, this);
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Native('Elements', Elements).implement({

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
	
	newElement: function(tag, props){
		if (props && props.checked != null) props.defaultChecked = props.checked;
		return document.id(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	}
	
});

// search and find, slick integration

[Document, Element].call('implement', {
	
	search: function(expression){
		return slick(this, expression, new Elements);
	},
	
	find: function(expression){
		var element = slick(this, expression)[0];
		return (element) ? document.id(element) : null;
	}
	
});

Element.implement('match', function(expression){
	return slick.match(this, expression);
});

this.$ = function(expression){
	return document.id(expression);
};

this.$$ = function(expression){
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

Object.forEach(inserters, function(inserter, where){

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
		Array.flatten(arguments).forEach(function(element){
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

/* Element Storage */

Element.implement(new Storage);

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

Object.forEach(properties, function(real, key){
	Element.defineSetter(key, function(value){
		return this[real] = value;
	}).defineGetter(key, function(){
		return this[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.forEach(function(bool){
	Element.defineSetter(bool, function(value){
		return this[bool] = !!value;
	}).defineGetter(bool, function(){
		return !!this[bool];
	});
});

/* slick attribute integration */

slick.getAttribute = function(element, attribute){
	var getter = Element.lookupGetter(attribute);
	return (getter) ? getter.call(element) : element.getAttribute(attribute, 2);
};

/* get, set */

Element.implement({

	set: function(attribute, value){
		var setter = Element.lookupSetter(attribute);
		if (setter) setter.call(this, value);
		else if (value == null) this.removeAttribute(attribute);
		else this.setAttribute(attribute, '' + value);
		return this;
	}.setMany(),

	get: function(attribute){
		return slick.getAttribute(this, attribute = attribute.camelCase());
	}.getMany()

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

if (Browser.Engine.webkit && Browser.Engine.version < 420){

	var temp = document.newElement('div', {'css': 'position: absolute; visibility: hidden;'});
	
	Element.defineGetter('text', function(){
		if (this.innerText) return this.innerText;
		var text = temp.inject(document.body).set('html', this.innerHTML).innerText;
		temp.dispose();
		return text;
	});
	
}

})(document);
