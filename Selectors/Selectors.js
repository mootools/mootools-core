/*
Script: Selectors.js
	Css Query related <Element> extensions

License:
	MIT-style license.
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any Selectors element via the dollar function <$>.
*/

Element.$DOMMethods = {

	/*
	Property: getElements
		Gets all the elements within an element that match the given (single) selector.

	Syntax:
		>var myElements = myElement.getElements(selector[, nocash]);

	Arguments:
		selector - (string) The CSS Selector to match.
		nocash   - (boolean, optional: defaults to false) If true, the found Elements are not extended.

	Returns:
		(array) An <Elements> collections.

	Examples:
		[javascript]
			$('myElement').getElements('a'); // get all anchors within myElement
		[/javascript]

		[javascript]
			$('myElement').getElements('input[name=dialog]') //get all input tags with name 'dialog'
		[/javscript]

		[javascript]
			$('myElement').getElements('input[name$=log]') //get all input tags with names ending with 'log'
		[/javascript]

		[javascript]
			$(document.body).getElements('a.email').addEvents({
				'mouseenter': function(){
					this.href = 'real@email.com';
				},
				'mouseleave': function(){
					this.href = '#';
				}
			});
		[/javascript]

	Notes:
		Supports these operators in attribute selectors:

		- = : is equal to
		- ^= : starts-with
		- $= : ends-with
		- != : is not equal to

		Xpath is used automatically for compliant browsers.
	*/

	getElements: function(selector, nocash){
		var items = [];
		var separators = [];
		selector = selector.trim().replace(Selectors.sRegExp, function(match){
			if (match.charAt(2)) match = match.trim();
			separators.push(match.charAt(0));
			return '%' + match.charAt(1);
		}).split('%');
		for (var i = 0, j = selector.length; i < j; i++){
			var params = Selectors.$parse(selector[i]);
			if (!params) break;
			var temp = Selectors.Method.getParam(items, separators[i - 1] || false, this, params.tag, params.id, params.classes, params.attributes, params.pseudos);
			if (!temp) break;
			items = temp;
		}
		return Selectors.Method.getItems(items, this, nocash);
	},

	/*
	Property: getElement
		Same as <Element.getElements>, but returns only the first.

	Syntax:
		>var anElement = myElement.getElement(selector);

	Arguments:
		selector - (string) The CSS Selector to match.

	Returns:
		(mixed) An extended Element, or null if not found.

	Example:
		[javascript]
			var found = $('myElement').getElement('.findMe').setStyle('color', '#f00');
		[/javascript]

	Note:
		Alternate syntax for <$E>, where filter is the Element.
	*/

	getElement: function(selector){
		return $(this.getElements(selector, true)[0] || null);
	},

	/*
	Property: getElementsBySelector
		Same as <Element.getElements>, but allows for comma separated selectors, as in css.

	Syntax:
		>var myElements = myElement.getElementsBySelector(selector, nocash);

	Arguments:
		selector - (string) The CSS Selector to match.
		nocash   - (boolean, optional: defaults to false) If true, the found Elements are not extended.

	Returns:
		(array) An <Elements> collection.

	Example:
		[javascript]
			var myElements = $('myElement').getElementsBySelector('div#scene1, a, span.myClass');
		[/javascript]

	Note:
		Alternate syntax for <$$>, where filter is the Element.
	*/

	getElementsBySelector: function(selector, nocash){
		var elements = [];
		selector = selector.split(',');
		for (var i = 0, j = selector.length; i < j; i++) elements = elements.concat(this.getElements(selector[i], true));
		return (nocash) ? elements : new Elements(elements);
	}

};

Element.extend({

	/*
	Property: getElementById
		Targets an element with the specified id found inside the Element.

	Syntax:
		>var anElement = myElement.getElementById(id);

	Arguments:
		id - (string) The string ID of the element to find.

	Returns:
		(mixed) Returns the found element, otherwise null.

	Example:
		[javascript]
			var anElement = $('myElement').getElementById('anElement').addClass('found');
		[/javascript]

	Note:
		Does not override document.getElementById.
	*/

	getElementById: function(id){
		var el = document.getElementById(id);
		if (el){
			while ((el = el.parentNode)) if (el == this) return el;
		}
		return null;
	}

});

document.extend(Element.$DOMMethods);
Element.extend(Element.$DOMMethods);

/* Section: Utility Functions */

/*
Function: $E
	Alias for <Element.getElement>, using document as context.
*/

var $E = document.getElement.bind(document);

var Selectors = {

	'regExp': /:([^-:(]+)[^:(]*(?:\((["']?)(.*?)\2\))?|\[(\w+)(?:([!*^$~|]?=)(["']?)(.*?)\6)?\]|\.[\w-]+|#[\w-]+|\w+|\*/g,

	'sRegExp': /\s*([+>~\s])[a-zA-Z#.*\s]/g

};

Selectors.$parse = function(selector){
	var params = {tag: '*', id: null, classes: [], attributes: [], pseudos: []};
	selector = selector.replace(Selectors.regExp, function(bit) {
		switch (bit.charAt(0)){
			case '.': params.classes.push(bit.slice(1)); break;
			case '#': params.id = bit.slice(1); break;
			case '[': params.attributes.push([arguments[4], arguments[5], arguments[7]]); break;
			case ':':
				var name = arguments[1];
				var xparser = Selectors.Pseudo[name];
				var pseudo = {'name': name, 'parser': xparser, 'argument': arguments[3]};
				if (xparser && xparser.parser) pseudo.argument = (xparser.parser.apply) ? xparser.parser(pseudo.argument) : xparser.parser;
				params.pseudos.push(pseudo);
				break;
			default: params.tag = bit;
		}
		return '';
	});
	return params;
};

Selectors.Pseudo = new Abstract();

Selectors.XPath = {

	getParam: function(items, separator, context, tag, id, classNames, attributes, pseudos){
		var temp = context.namespaceURI ? 'xhtml:' : '';
		switch (separator){
			case '~': case '+': temp += '/following-sibling::'; break;
			case '>': temp += '/'; break;
			case ' ': temp += '//';
		}
		temp += tag;
		if (separator == '+') temp += '[1]';
		var i;
		for (i = pseudos.length; i--; i){
			var pseudo = pseudos[i];
			if (pseudo.parser && pseudo.parser.xpath) temp += pseudo.parser.xpath(pseudo.argument);
			else temp += ($chk(pseudo.argument)) ? '[@' + pseudo.name + '="' + pseudo.argument + '"]' : '[@' + pseudo.name + ']';
		}
		if (id) temp += '[@id="' + id + '"]';
		for (i = classNames.length; i--; i) temp += '[contains(concat(" ", @class, " "), " ' + classNames[i] + ' ")]';
		for (i = attributes.length; i--; i){
			var bits = attributes[i];
			switch (bits[1]){
				case '=': temp += '[@' + bits[0] + '="' + bits[2] + '"]'; break;
				case '*=': temp += '[contains(@' + bits[0] + ', "' + bits[2] + '")]'; break;
				case '^=': temp += '[starts-with(@' + bits[0] + ', "' + bits[2] + '")]'; break;
				case '$=': temp += '[substring(@' + bits[0] + ', string-length(@' + bits[0] + ') - ' + bits[2].length + ' + 1) = "' + bits[2] + '"]'; break;
				case '!=': temp += '[@' + bits[0] + '!="' + bits[2] + '"]'; break;
				case '~=': temp += '[contains(concat(" ", @' + bits[0] + ', " "), " ' + bits[2] + ' ")]'; break;
				case '|=': temp += '[contains(concat("-", @' + bits[0] + ', "-"), "-' + bits[2] + '-")]'; break;
				default: temp += '[@' + bits[0] + ']';
			}
		}
		items.push(temp);
		return items;
	},

	getItems: function(items, context, nocash){
		var elements = [];
		var xpath = document.evaluate('.//' + items.join(''), context, Selectors.XPath.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements[i] = (nocash) ? xpath.snapshotItem(i) : $(xpath.snapshotItem(i));
		return (nocash) ? elements : new Elements(elements, true);
	},

	resolver: function(prefix){
		return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	}

};

Selectors.Filter = {

	getParam: function(items, separator, context, tag, id, classNames, attributes, pseudos){
		var i;
		if (separator){
			var found = [], j = items.length;
			switch (separator){
				case ' ':
					for (i = 0; i < j; i++) found.extend(items[i].getElementsByTagName(tag));
					break;
				case '>':
					for (i = 0; i < j; i++){
						var children = items[i].childNodes;
						for (var k = 0, l = children.length; k < l; k++){
							if (Selectors.Filter.hasTag(children[k], tag)) found.push(children[k]);
						}
					}
					break;
				default:
					var all = !!(separator == '~');
					for (i = 0; i < j; i++){
						var next = items[i];
						while ((next = next.nextSibling)){
							if (Selectors.Filter.hasTag(next, tag)){
								found.push(next);
								if (!all) break;
							}
						}
					}
			}
			items = (id) ? Elements.filterById(found, id, true) : found;
		} else {
			if (id){
				var el = context.getElementById(id);
				if (!el || ((tag != '*') && (tag != el.tagName.toLowerCase()))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(tag));
			}
		}
		for (i = classNames.length; i--; i) items = Elements.filterByClass(items, classNames[i], true);
		for (i = attributes.length; i--; i){
			var bits = attributes[i];
			items = Elements.filterByAttribute(items, bits[0], bits[1], bits[2], true);
		}
		for (i = pseudos.length; i--; i){
			var pseudo = pseudos[i];
			if (pseudo.parser && pseudo.parser.filter){
				var temp = {}, xparser = pseudo.parser, argument = pseudo.argument;
				items = items.filter(function(el, i, array){
					return xparser.filter(el, argument, i, array, temp);
				});
				temp = null;
			} else {
				items = Elements.filterByAttribute(items, pseudo.name, ($chk(pseudo.argument)) ? '=' : false, pseudo.argument, true);
			}
		}
		return items;
	},

	getItems: function(items, context, nocash){
		return (nocash) ? items : new Elements(items);
	},

	hasTag: function(el, tag){
		return (el.nodeName && el.nodeType == 1 && (tag == '*' || el.tagName.toLowerCase() == tag));
	}

};

Selectors.Method = (Client.Features.xpath) ? Selectors.XPath : Selectors.Filter;
