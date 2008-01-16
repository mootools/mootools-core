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
		Native.UID++;
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		var props = params.properties || {};
		var iframe = $(params.iframe) || false;
		var onload = props.onload || $empty;
		delete props.onload;
		props.id = props.name = $pick(props.id, props.name, iframe.id, iframe.name, 'IFrame_' + Native.UID);
		((iframe = iframe || new Element('iframe'))).set(props);
		var onFrameLoad = function(){
			var host = $try(function(){
				return iframe.contentWindow.location.host;
			});
			if (host && host == window.location.host){
				iframe.window = iframe.contentWindow;
				var win = new Window(iframe.window);
				var doc = new Document(iframe.window.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow);
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
			var uniques = {};
			var returned = [];
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

	filterBy: function(filter){
		if (!filter) return this;
		return new Elements(this.filter((typeof filter == 'string') ? function(item){
			return item.match(filter);
		} : filter));
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

	$: function(el, notrash){
		if (el && el.$attributes) return el;
		var type = $type(el);
		return ($[type]) ? $[type](el, notrash, this.document) : null;
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

$.string = function(id, notrash, doc){
	id = doc.getElementById(id);
	return (id) ? $.element(id, notrash) : null;
};

$.element = function(el, notrash){
	el.uid = el.uid || [Native.UID++];
	if (!notrash && Garbage.collect(el) && !el.$family) $extend(el, Element.Prototype);
	return el;
};

$.textnode = $.window = $.document = $arguments(0);

$.number = function(uid){
	return Garbage.Elements[uid] || null;
};

Native.implement([Element, Document], {

	getElement: function(selector, notrash){
		return $(this.getElements(selector, true)[0] || null, notrash);
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
		return (this[uid] = this[uid] || {});
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
		Element.Inserters[key](this, $(el, true));
		return this;
	});
	
	Element.implement('grab' + Key, function(el){
		Element.Inserters[key]($(el, true), this);
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
		return this.replaces(el).grab(el);
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
			this.appendChild($(element, true));
		}, this);
		return this;
	},

	dispose: function(){
		return this.parentNode.removeChild(this);
	},

	clone: function(contents){
		var temp = new Element('div').grab(this.cloneNode(contents !== false));
		Array.each(temp.getElementsByTagName('*'), function(element){
			if (element.id) element.removeAttribute('id');
		});
		return new Element('div').set('html', temp.innerHTML).getFirst();
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
		var result = null;
		if (this.currentStyle){
			result = this.currentStyle[property.camelCase()];
		} else {
			var computed = this.getWindow().getComputedStyle(this, null);
			if (computed) result = computed.getPropertyValue([property.hyphenate()]);
		}
		return result;
	},

	empty: function(){
		var elements = $A(this.getElementsByTagName('*'));
		elements.each(function(element){
			$try(Element.prototype.dispose, element);
		});
		Garbage.trash(elements);
		$try(Element.prototype.set, this, ['html', '']);
		return this;
	},

	destroy: function(){
		Garbage.kill(this.empty().dispose());
		return null;
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el){
			var name = el.name, type = el.type, value = Element.get(el, 'value');
			if (value === false || !name || el.disabled) return;
			$splat(value).each(function(val){
				queryString.push(name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	getProperty: function(attribute){
		var EA = Element.Attributes, key = EA.Props[attribute];
		var value = (key) ? this[key] : this.getAttribute(attribute);
		return (EA.Bools[attribute]) ? !!value : value;
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
		if (el.nodeType == 1 && Element.match(el, match)){
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
		if (!(el = $(el, true))) return false;
		return Element.getParents(el, this.get('tag'), true).contains(this);
	}

});

})();

Element.alias('dispose', 'remove').alias('getLast', 'getLastChild');

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

Element.Properties.value = {get: function(){
	switch (Element.get(this, 'tag')){
		case 'select':
			var values = [];
			Array.each(this.options, function(option){
				if (option.selected) values.push(option.value);
			});
			return (this.multiple) ? values : values[0];
		case 'input': if (['checkbox', 'radio'].contains(this.type) && !this.checked) return false;
		default: return $pick(this.value, false);
	}
}};

Element.Properties.tag = {get: function(){
	return this.tagName.toLowerCase();
}};

Element.Properties.html = {set: function(){
	return this.innerHTML = Array.flatten(arguments).join('');
}};

Element.implement({

	getText: function(){
		return this.get('text');
	},

	setText: function(text){
		return this.set('text', text);
	},

	setHTML: function(){
		return this.set('html', arguments);
	},
	
	getHTML: function(){
		return this.get('html');
	},

	getTag: function(){
		return this.get('tag');
	}

});

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

(function(EA){

	var EAB = EA.Bools, EAC = EA.Camels;
	EA.Bools = EAB = EAB.associate(EAB);
	Hash.extend(Hash.merge(EA.Props, EAB), EAC.associate(EAC.map(function(v){
		return v.toLowerCase();
	})));
	EA.remove('Camels');

})(Element.Attributes);

var Garbage = {

	Elements: {},

	ignored: {object: 1, embed: 1, OBJECT: 1, EMBED: 1},

	collect: function(el){
		if (el.$attributes) return true;
		if (Garbage.ignored[el.tagName]) return false;
		Garbage.Elements[el.uid] = el;
		el.$attributes = {};
		return true;
	},

	trash: function(elements){
		for (var i = elements.length, el; i--; i) Garbage.kill(elements[i]);
	},

	kill: function(el){
		if (!el || !el.$attributes) return;
		delete Garbage.Elements[el.uid];
		if (el.retrieve('events')) el.removeEvents();
		for (var p in el.$attributes) el.$attributes[p] = null;
		if (Browser.Engine.trident){
			for (var d in Element.Prototype) el[d] = null;
		}
		el.$attributes = el.uid = null;
	},

	empty: function(){
		for (var uid in Garbage.Elements) Garbage.kill(Garbage.Elements[uid]);
	}

};

window.addListener('beforeunload', function(){
	window.addListener('unload', Garbage.empty);
	if (Browser.Engine.trident) window.addListener('unload', CollectGarbage);
});
