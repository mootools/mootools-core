/*
Script: Element.js
	One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser,
	time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
*/

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
	},

	getDocument: function(){
		return this;
	},

	getWindow: function(){
		return this.defaultView || this.parentWindow;
	},

	purge: function(){
		var elements = this.getElementsByTagName('*');
		for (var i = 0, l = elements.length; i < l; i++) Browser.freeMem(elements[i]);
	}

});

var Element = new Native({

	name: 'Element',

	legacy: window.Element,

	initialize: function(tag, props){
		var konstructor = Element.Constructors.get(tag);
		if (konstructor) return konstructor(props);
		if (typeof tag == 'string') return document.newElement(tag, props);
		return $(tag).set(props);
	},

	afterImplement: function(key, value){
		if (!Array[key]) Elements.implement(key, Elements.multi(key));
		Element.Prototype[key] = value;
	}

});

Element.Prototype = {$family: {name: 'element'}};

Element.Constructors = new Hash;

var IFrame = new Native({

	name: 'IFrame',

	generics: false,

	initialize: function(){
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		var props = params.properties || {};
		var iframe = $(params.iframe) || false;
		var onload = props.onload || $empty;
		delete props.onload;
		props.id = props.name = $pick(props.id, props.name, iframe.id, iframe.name, 'IFrame_' + $time());
		iframe = new Element(iframe || 'iframe', props);
		var onFrameLoad = function(){
			var host = $try(function(){
				return iframe.contentWindow.location.host;
			});
			if (host && host == window.location.host){
				var win = new Window(iframe.contentWindow);
				var doc = new Document(iframe.contentWindow.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow, iframe.contentWindow.document);
		};
		(!window.frames[props.id]) ? iframe.addListener('load', onFrameLoad) : onFrameLoad();
		return iframe;
	}

});

var Elements = new Native({

	initialize: function(elements, options){
		options = $extend({ddup: true, cash: true}, options);
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
		return (options.cash) ? $extend(elements, this) : elements;
	}

});

Elements.implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeof filter == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}

});

Elements.multi = function(property){
	return function(){
		var items = [];
		var elements = true;
		for (var i = 0, j = this.length; i < j; i++){
			var returns = this[i][property].apply(this[i], arguments);
			items.push(returns);
			if (elements) elements = ($type(returns) == 'element');
		}
		return (elements) ? new Elements(items) : items;
	};
};

Window.implement({

	$: function(el, nocash){
		if (el && el.$family && el.uid) return el;
		var type = $type(el);
		return ($[type]) ? $[type](el, nocash, this.document) : null;
	},

	$$: function(selector){
		if (arguments.length == 1 && typeof selector == 'string') return this.document.getElements(selector);
		var elements = [];
		var args = Array.flatten(arguments);
		for (var i = 0, l = args.length; i < l; i++){
			var item = args[i];
			switch ($type(item)){
				case 'element': item = [item]; break;
				case 'string': item = this.document.getElements(item, true); break;
				default: item = false;
			}
			if (item) elements.extend(item);
		}
		return new Elements(elements);
	},

	getDocument: function(){
		return this.document;
	},

	getWindow: function(){
		return this;
	}

});

$.string = function(id, nocash, doc){
	id = doc.getElementById(id);
	return (id) ? $.element(id, nocash) : null;
};

$.element = function(el, nocash){
	$uid(el);
	if (!nocash && !el.$family && !(/^object|embed$/i).test(el.tagName)){
		var proto = Element.Prototype;
		for (var p in proto) el[p] = proto[p];
	};
	return el;
};

$.object = function(obj, nocash, doc){
	if (obj.toElement) return $.element(obj.toElement(doc), nocash);
	return null;
};

$.textnode = $.whitespace = $.window = $.document = $arguments(0);

Native.implement([Element, Document], {

	getElement: function(selector, nocash){
		return $(this.getElements(selector, true)[0] || null, nocash);
	},

	getElements: function(tags, nocash){
		tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag){
			var partial = this.getElementsByTagName(tag.trim());
			(ddup) ? elements.extend(partial) : elements = partial;
		}, this);
		return new Elements(elements, {ddup: ddup, cash: !nocash});
	}

});

Element.Storage = {

	get: function(uid){
		return (this[uid] || (this[uid] = {}));
	}

};

Element.Inserters = new Hash({

	before: function(context, element){
		if (element.parentNode) element.parentNode.insertBefore(context, element);
	},

	after: function(context, element){
		if (!element.parentNode) return;
		var next = element.nextSibling;
		(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		var first = element.firstChild;
		(first) ? element.insertBefore(context, first) : element.appendChild(context);
	}

});

Element.Inserters.inside = Element.Inserters.bottom;

Element.Inserters.each(function(value, key){

	var Key = key.capitalize();

	Element.implement('inject' + Key, function(el){
		value(this, $(el, true));
		return this;
	});

	Element.implement('grab' + Key, function(el){
		value($(el, true), this);
		return this;
	});

});

Element.implement({

	getDocument: function(){
		return this.ownerDocument;
	},

	getWindow: function(){
		return this.ownerDocument.getWindow();
	},

	getElementById: function(id, nocash){
		var el = this.ownerDocument.getElementById(id);
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return $.element(el, nocash);
	},

	set: function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				(property && property.set) ? property.set.apply(this, Array.slice(arguments, 1)) : this.setProperty(prop, value);
		}
		return this;
	},

	get: function(prop){
		var property = Element.Properties.get(prop);
		return (property && property.get) ? property.get.apply(this, Array.slice(arguments, 1)) : this.getProperty(prop);
	},

	erase: function(prop){
		var property = Element.Properties.get(prop);
		(property && property.erase) ? property.erase.apply(this, Array.slice(arguments, 1)) : this.removeProperty(prop);
		return this;
	},

	match: function(tag){
		return (!tag || Element.get(this, 'tag') == tag);
	},

	inject: function(el, where){
		Element.Inserters.get(where || 'bottom')(this, $(el, true));
		return this;
	},

	wraps: function(el, where){
		el = $(el, true);
		return this.replaces(el).grab(el, where);
	},

	grab: function(el, where){
		Element.Inserters.get(where || 'bottom')($(el, true), this);
		return this;
	},

	appendText: function(text, where){
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	adopt: function(){
		Array.flatten(arguments).each(function(element){
			element = $(element, true);
			if (element) this.appendChild(element);
		}, this);
		return this;
	},

	dispose: function(){
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	clone: function(contents, keepid){
		switch ($type(this)){
			case 'element':
				var attributes = {};
				for (var j = 0, l = this.attributes.length; j < l; j++){
					var attribute = this.attributes[j], key = attribute.nodeName.toLowerCase();
					if (Browser.Engine.trident && (/input/i).test(this.tagName) && (/width|height/).test(key)) continue;
					var value = (key == 'style' && this.style) ? this.style.cssText : attribute.nodeValue;
					if (!$chk(value) || key == 'uid' || (key == 'id' && !keepid)) continue;
					if (value != 'inherit' && ['string', 'number'].contains($type(value))) attributes[key] = value;
				}
				var element = new Element(this.nodeName.toLowerCase(), attributes);
				if (contents !== false){
					for (var i = 0, k = this.childNodes.length; i < k; i++){
						var child = Element.clone(this.childNodes[i], true, keepid);
						if (child) element.grab(child);
					}
				}
				return element;
			case 'textnode': return document.newTextNode(this.nodeValue);
		}
		return null;
	},

	replaces: function(el){
		el = $(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1').clean();
		return this;
	},

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	},

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var computed = this.getWindow().getComputedStyle(this, null);
		return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	},

	empty: function(){
		$A(this.childNodes).each(function(node){
			Browser.freeMem(node);
			Element.empty(node);
			Element.dispose(node);
		}, this);
		return this;
	},

	destroy: function(){
		Browser.freeMem(this.empty().dispose());
		return null;
	},

	getSelected: function(){
		return new Elements($A(this.options).filter(function(option){
			return option.selected;
		}));
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea').each(function(el){
			if (!el.name || el.disabled) return;
			var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
			$splat(value).each(function(val){
				if (val) queryString.push(el.name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	getProperty: function(attribute){
		var EA = Element.Attributes, key = EA.Props[attribute];
		var value = (key) ? this[key] : this.getAttribute(attribute, 2);
		return (EA.Bools[attribute]) ? !!value : (key) ? value : value || null;
	},

	getProperties: function(){
		var args = $A(arguments);
		return args.map(function(attr){
			return this.getProperty(attr);
		}, this).associate(args);
	},

	setProperty: function(attribute, value){
		var EA = Element.Attributes, key = EA.Props[attribute], hasValue = $defined(value);
		if (key && EA.Bools[attribute]) value = (value || !hasValue) ? true : false;
		else if (!hasValue) return this.removeProperty(attribute);
		(key) ? this[key] = value : this.setAttribute(attribute, value);
		return this;
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
	},

	removeProperty: function(attribute){
		var EA = Element.Attributes, key = EA.Props[attribute], isBool = (key && EA.Bools[attribute]);
		(key) ? this[key] = (isBool) ? false : '' : this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	}

});

(function(){

var walk = function(element, walk, start, match, all, nocash){
	var el = element[start || walk];
	var elements = [];
	while (el){
		if (el.nodeType == 1 && (!match || Element.match(el, match))){
			elements.push(el);
			if (!all) break;
		}
		el = el[walk];
	}
	return (all) ? new Elements(elements, {ddup: false, cash: !nocash}) : $(elements[0], nocash);
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
	},

	hasChild: function(el){
		el = $(el, true);
		return (!!el && $A(this.getElementsByTagName(el.tagName)).contains(el));
	}

});

})();

Element.Properties = new Hash;

Element.Properties.style = {

	set: function(style){
		this.style.cssText = style;
	},

	get: function(){
		return this.style.cssText;
	},

	erase: function(){
		this.style.cssText = '';
	}

};

Element.Properties.tag = {get: function(){
	return this.tagName.toLowerCase();
}};

Element.Properties.href = {get: function(){
	return (!this.href) ? null : this.href.replace(new RegExp('^' + document.location.protocol + '\/\/' + document.location.host), '');
}};

Element.Properties.html = {set: function(){
	return this.innerHTML = Array.flatten(arguments).join('');
}};

Native.implement([Element, Window, Document], {

	addListener: function(type, fn){
		if (this.addEventListener) this.addEventListener(type, fn, false);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, false);
		else this.detachEvent('on' + type, fn);
		return this;
	},

	retrieve: function(property, dflt){
		var storage = Element.Storage.get(this.uid);
		var prop = storage[property];
		if ($defined(dflt) && !$defined(prop)) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(property, value){
		var storage = Element.Storage.get(this.uid);
		storage[property] = value;
		return this;
	},

	eliminate: function(property){
		var storage = Element.Storage.get(this.uid);
		delete storage[property];
		return this;
	}

});

Element.Attributes = new Hash({
	Props: {'html': 'innerHTML', 'class': 'className', 'for': 'htmlFor', 'text': (Browser.Engine.trident) ? 'innerText' : 'textContent'},
	Bools: ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'],
	Camels: ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap']
});

Browser.freeMem = function(item){
	if (!item) return;
	if (Browser.Engine.trident && (/object/i).test(item.tagName)){
		for (var p in item){
			if (typeof item[p] == 'function') item[p] = $empty;
		}
		Element.dispose(item);
	}
	if (item.uid && item.removeEvents) item.removeEvents();
};

(function(EA){

	var EAB = EA.Bools, EAC = EA.Camels;
	EA.Bools = EAB = EAB.associate(EAB);
	Hash.extend(Hash.combine(EA.Props, EAB), EAC.associate(EAC.map(function(v){
		return v.toLowerCase();
	})));
	EA.erase('Camels');

})(Element.Attributes);

window.addListener('unload', function(){
	window.removeListener('unload', arguments.callee);
	document.purge();
	if (Browser.Engine.trident) CollectGarbage();
});