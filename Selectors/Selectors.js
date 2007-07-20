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
		Returns as <Elements>.

	Arguments:
		selector - string; the css selector to match

	Examples:
		>$('myElement').getElements('a'); // get all anchors within myElement
		>$('myElement').getElements('input[name=dialog]') //get all input tags with name 'dialog'
		>$('myElement').getElements('input[name$=log]') //get all input tags with names ending with 'log'

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
		Same as <Element.getElements>, but returns only the first. Alternate syntax for <$E>, where filter is the Element.
		Returns as <Element>.

	Arguments:
		selector - string; css selector
	*/

	getElement: function(selector){
		return $(this.getElements(selector, true)[0] || null);
	},

	/*
	Property: getElementsBySelector
		Same as <Element.getElements>, but allows for comma separated selectors, as in css. Alternate syntax for <$$>, where filter is the Element.
		Returns as <Elements>.

	Arguments:
		selector - string; css selector
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
		Targets an element with the specified id found inside the Element. Does not overwrite document.getElementById.

	Arguments:
		id - string; the id of the element to find.
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

	'regExp': /:[^:]+|\[[^\]]+\]|\.[\w-]+|#[\w-]+|\w+|\*/g,

	'aRegExp': /^(\w+)(?:([!*^$~|]?=)["']?([^"'\]]*)["']?)?$/,

	'sRegExp': /\s*([+>~\s])[a-zA-Z#.*\s]/g,

	'pRegExp': /^([\w-]+)(?:\((.*)\))?$/

};

Selectors.$parse = function(selector){
	var params = {tag: '*', id: null, classes: [], attributes: [], pseudos: []};
	selector = selector.replace(Selectors.regExp, function(bit) {
		switch (bit.charAt(0)){
			case '.': params.classes.push(bit.slice(1)); break;
			case '#': params.id = bit.slice(1); break;
			case '[': if ((bit = bit.slice(1, bit.length - 1).match(Selectors.aRegExp))) params.attributes.push(bit); break;
			case ':': if ((bit = Selectors.Pseudo.$parse(bit.slice(1)))) params.pseudos.push(bit); break;
			default: params.tag = bit;
		}
		return '';
	});
	return params;
};

Selectors.Pseudo = new Abstract({

	$parse: function(pseudo){
		if (!(pseudo = pseudo.match(Selectors.pRegExp))) return false;
		var name = pseudo[1].split('-')[0];
		var xparser = Selectors.Pseudo[name];
		var params = {'name': name, 'parser': xparser, 'argument': pseudo[2] || false};
		if (xparser && xparser.parser) params.argument = (xparser.parser.apply) ? xparser.parser(params.argument) : xparser.parser;
		return params;
	}

});

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
			var attribute = attributes[i];
			if (attribute[2] && attribute[3]){
				switch (attribute[2]){
					case '=': temp += '[@' + attribute[1] + '="' + attribute[3] + '"]'; break;
					case '*=': temp += '[contains(@' + attribute[1] + ', "' + attribute[3] + '")]'; break;
					case '^=': temp += '[starts-with(@' + attribute[1] + ', "' + attribute[3] + '")]'; break;
					case '$=': temp += '[substring(@' + attribute[1] + ', string-length(@' + attribute[1] + ') - ' + attribute[3].length + ' + 1) = "' + attribute[3] + '"]'; break;
					case '!=': temp += '[@' + attribute[1] + '!="' + attribute[3] + '"]'; break;
					case '~=': temp += '[contains(concat(" ", @' + attribute[1] + ', " "), " ' + attribute[3] + ' ")]'; break;
					case '|=': temp += '[contains(concat("-", @' + attribute[1] + ', "-"), "-' + attribute[3] + '-")]';
				}
			} else {
				temp += '[@' + attribute[1] + ']';
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
		if (separator){
			switch (separator){
				case ' ': items = Selectors.Filter.getNestedByTag(items, tag); break;
				case '>': items = Selectors.Filter.getChildrenByTag(items, tag); break;
				case '+': items = Selectors.Filter.getFollowingByTag(items, tag); break;
				case '~': items = Selectors.Filter.getFollowingByTag(items, tag, true);
			}
			if (id) items = Elements.filterById(items, id, true);
		} else {
			if (id){
				var el = context.getElementById(id);
				if (!el || ((tag != '*') && (el.tagName.toLowerCase() != tag))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(tag));
			}
		}
		var i;
		for (i = classNames.length; i--; i) items = Elements.filterByClass(items, classNames[i], true);
		for (i = attributes.length; i--; i){
			var attribute = attributes[i];
			items = Elements.filterByAttribute(items, attribute[1], attribute[2], attribute[3], true);
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
	},

	getFollowingByTag: function(context, tag, all){
		var found = [];
		for (var i = 0, j = context.length, next; i < j; i++){
			var next = context[i].nextSibling;
			while (next){
				if (Selectors.Filter.hasTag(next, tag)){
					found.push(next);
					if (!all) break;
				}
				next = next.nextSibling;
			}
		}
		return found;
	},

	getChildrenByTag: function(context, tag){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++){
			var children = context[i].childNodes;
			for (var k = 0, l = children.length; k < l; k++){
				if (Selectors.Filter.hasTag(children[k], tag)) found.push(children[k]);
			}
		}
		return found;
	},

	getNestedByTag: function(context, tag){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++) found.extend(context[i].getElementsByTagName(tag));
		return found;
	}

};

Selectors.Method = (Client.Features.xpath) ? Selectors.XPath : Selectors.Filter;