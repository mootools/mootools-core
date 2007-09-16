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

Native.implement([Element, Document], {

	/*
	Property: getElements
		Gets all the elements within an element that match the given selector.

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
		[/javascript]

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

	getElements: function(selectors, nocash){
		var elements = [];
		selectors = selectors.split(',');
		for (var i = 0, j = selectors.length; i < j; i++){
			var selector = selectors[i], items = [], separators = [];
			selector = selector.trim().replace(Selectors.sRegExp, function(match){
				if (match.charAt(2)) match = match.trim();
				separators.push(match.charAt(0));
				return '%' + match.charAt(1);
			}).split('%');
			for (var k = 0, l = selector.length; k < l; k++){
				var params = Selectors.$parse(selector[k]);
				if (!params) break;
				var temp = Selectors.Method.getParam(items, separators[k - 1] || false, this, params.tag, params.id, params.classes, params.attributes, params.pseudos);
				if (!temp) break;
				items = temp;
			}
			elements = elements.concat(Selectors.Method.getItems(items, this));
		}
		return (nocash) ? elements : new Elements(elements);
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
	}

});

/* Section: Utility Functions */

/*
Function: $E
	Alias for <Element.getElement>, using document as context.
*/

Window.implement({

	$E: function(selector){
		return this.document.getElement(selector);
	}

});

var Selectors = {
	
	'regExp': /:([^-:(]+)[^:(]*(?:\((["']?)(.*?)\2\))?|\[(\w+)(?:([!*^$~|]?=)(["']?)(.*?)\6)?\]|\.[\w-]+|#[\w-]+|\w+|\*/g,
	
	'sRegExp': /\s*([+>~\s])[a-zA-Z#.*\s]/g

};

Selectors.$parse = function(selector){
	var params = {'tag': '*', 'id': null, 'classes': [], 'attributes': [], 'pseudos': []};
	selector = selector.replace(Selectors.regExp, function(bit){
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

Selectors.Pseudo = new Hash;

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

	getItems: function(items, context){
		var elements = [];
		var doc = ($type(context) == 'document') ? context : context.ownerDocument;
		var xpath = doc.evaluate('.//' + items.join(''), context, Selectors.XPath.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements[i] = xpath.snapshotItem(i);
		return elements;
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
				var el = context.getElementById(id, true);
				if (!el || ((tag != '*') && (el.tagName.toLowerCase() != tag))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(tag));
			}
		}
		var i;
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

	getItems: function(items, context){
		return items;
	},

	hasTag: function(el, tag){
		return (el.nodeName && el.nodeType == 1 && (tag == '*' || el.tagName.toLowerCase() == tag));
	},

	getFollowingByTag: function(context, tag, all){
		var found = [];
		for (var i = 0, j = context.length, next; i < j; i++){
			next = context[i].nextSibling;
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