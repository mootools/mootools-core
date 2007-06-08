/*
Script: Element.Selectors.js
	Css Query related functions and <Element> extensions

License:
	MIT-style license.
*/

/* Section: Utility Functions */

/*
Function: $E
	Selects a single (i.e. the first found) Element based on the selector passed in and an optional filter element.
	Returns as <Element>.

Arguments:
	selector - string; the css selector to match
	filter - optional; a DOM element to limit the scope of the selector match; defaults to document.

Example:
	>$E('a', 'myElement') //find the first anchor tag inside the DOM element with id 'myElement'

Returns:
	a DOM element - the first element that matches the selector
*/

function $E(selector, filter){
	return ($(filter) || document).getElement(selector);
};

/*
Function: $ES
	Returns a collection of Elements that match the selector passed in limited to the scope of the optional filter.
	See Also: <Element.getElements> for an alternate syntax.
	Returns as <Elements>.

Returns:
	an array of dom elements that match the selector within the filter

Arguments:
	selector - string; css selector to match
	filter - optional; a DOM element to limit the scope of the selector match; defaults to document.

Examples:
	>$ES("a") //gets all the anchor tags; synonymous with $$("a")
	>$ES('a','myElement') //get all the anchor tags within $('myElement')
*/

function $ES(selector, filter){
	return ($(filter) || document).getElementsBySelector(selector);
};

var DOM = {
	
	'regExp': /^(\w*|\*)(?:#([\w-]+))?(?:\.([\w-]+))?(?:\[(.*)\])?(?::(.*))?$/,
	
	'aRegExp': /^(\w+)(?:([!*^$\~]?=)["']?([^"'\]]*)["']?)?$/,
	
	'pRegExp': /^([\w-]+)(?:\((.*)\))?$/,
	
	'nRegExp': /^([+]?\d*)?([nodev]+)?([+]?\d*)?$/,
	
	'sRegExp': /\s*([+>~\s])\s*/
	
};

DOM.parsePseudo = function(pseudo){
	pseudo = pseudo.match(DOM.pRegExp);
	if (!pseudo) throw new Error('bad pseudo selector');
	var pparam = [];
	switch(pseudo[1].split('-')[0]){
		case 'nth':
			pparam = pseudo[2].match(DOM.nRegExp);
			if (!pparam) throw new Error('bad nth pseudo selector parameters');
			if (!$chk(parseInt(pparam[1]))) pparam[1] = 1;
			pparam[2] = pparam[2] || false;
			pparam[3] = parseInt(pparam[3]) || 0;
		break;
	}
	return {'name': pseudo[1], 'params': pparam};
};

DOM.XPath = {

	getParam: function(items, separator, context, tag, id, klass, attribute, pseudo){
		var temp = context.namespaceURI ? 'xhtml:' : '';
		switch(separator){
			case '~': case '+': temp += '/following-sibling::'; break;
			case '>': temp += '/'; break;
			case ' ': temp += '//';
		}
		temp += tag;
		if (separator == '+') temp += '[1]';
		if (pseudo){
			pseudo = DOM.parsePseudo(pseudo);
			switch(pseudo.name){
				case 'nth':
					var nth = '';
					switch(pseudo.params[2]){
						case 'n': nth = 'mod ' + pseudo.params[1] + ' = ' + pseudo.params[3]; break;
						case 'odd': nth = 'mod 2 = 1'; break;
						case 'even': nth =  'mod 2 = 0'; break;
						case false: nth = '= ' + pseudo.params[1];
					}
					temp += '[count(preceding-sibling::*) ' + nth + ']';
				break;
			}
		}
		if (id) temp += '[@id="' + id + '"]';
		if (klass) temp += '[contains(concat(" ", @class, " "), " ' + klass + ' ")]';
		if (attribute){
			attribute = attribute.match(DOM.aRegExp);
			if (!attribute) throw new Error('bad attribute selector');
			if (attribute[2] && attribute[3]){
				switch(attribute[2]){
					case '=': temp += '[@' + attribute[1] + '="' + attribute[3] + '"]'; break;
					case '*=': temp += '[contains(@' + attribute[1] + ', "' + attribute[3] + '")]'; break;
					case '^=': temp += '[starts-with(@' + attribute[1] + ', "' + attribute[3] + '")]'; break;
					case '$=': temp += '[substring(@' + attribute[1] + ', string-length(@' + attribute[1] + ') - ' + attribute[3].length + ' + 1) = "' + attribute[3] + '"]'; break;
					case '!=': temp += '[@' + attribute[1] + '!="' + attribute[3] + '"]'; break;
					case '~=': temp += '[contains(concat(" ", @' + attribute[1] + ', " "), " ' + attribute[3] + ' ")]';
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
		var xpath = document.evaluate('.//' + items.join(''), context, DOM.XPath.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements.push(xpath.snapshotItem(i));
		return (nocash) ? elements : new Elements(elements.map($));
	},
	
	resolver: function(prefix){
		return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	}
	
};

DOM.Walker = {

	getParam: function(items, separator, context, tag, id, klass, attribute, pseudo){
		if (separator){
			switch(separator){
				case ' ': items = Elements.getNestedByTag(items, tag, true); break;
				case '>': items = Elements.getChildrenByTag(items, tag, true); break;
				case '+': items = Elements.getFollowingByTag(items, tag, true, false); break;
				case '~': items = Elements.getFollowingByTag(items, tag, true, true);
			}
			if (id) items = Elements.filterById(items, id, true);
		} else {
			if (id){
				var el = context.getElementById(id);
				if (!el || ((tag != '*') && (Element.getTag(el) != tag))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(tag));
			}
		}
		if (klass) items = Elements.filterByClass(items, klass, true);
		if (attribute){
			attribute = attribute.match(DOM.aRegExp);
			if (!attribute) throw new Error('bad attribute selector');
			items = Elements.filterByAttribute(items, attribute[1], attribute[2], attribute[3], true);
		}
		if (pseudo){
			pseudo = DOM.parsePseudo(pseudo);
			switch(pseudo.name){
				case 'nth': items = Elements.filterByNth(items, pseudo.params[1], pseudo.params[2], pseudo.params[3], true); break;
			}
		}
		return items;
	},

	getItems: function(items, context, nocash){
		return (nocash) ? items : $$.unique(items);
	},
	
	hasTag: function(el, tag){
		return ($type(el) == 'element' && (Element.getTag(el) == tag || tag == '*'));
	}
	
};

DOM.Method = (Client.features.xpath) ? DOM.XPath : DOM.Walker;

//elements

Elements.extend({
	
	getFollowingByTag: function(tag, all, nocash){
		var found = [];
		for (var i = 0, j = this.length; i < j; i++){
			var next = this[i].nextSibling;
			while (next){
				if (DOM.Walker.hasTag(next, tag)){
					found.push(next);
					if (!all) break;
				}
				next = next.nextSibling;
			}
		}
		return (nocash) ? found : $$.unique(found);
	},
	
	getChildrenByTag: function(tag, nocash){
		var found = [];
		for (var i = 0, j = this.length; i < j; i++){
			var children = this[i].childNodes;
			for (var k = 0, l = children.length; k < l; k++){
				if (DOM.Walker.hasTag(children[k], tag)) found.push(children[k]);
			}
		}
		return (nocash) ? found : $$.unique(found);
	},
	
	getNestedByTag: function(tag, nocash){
		var found = [];
		for (var i = 0, j = this.length; i < j; i++) found.extend(this[i].getElementsByTagName(tag));
		return (nocash) ? found : $$.unique(found);
	}
	
});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.$domMethods = {

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
		selector = selector.trim().replace(/~=/g, '%=').split(DOM.sRegExp);
		for (var i = 0, j = selector.length; i < j; i+=2){
			var param = selector[i].match(DOM.regExp);
			if (!param) throw new Error('bad selector');
			if (param[4]) param[4] = param[4].replace('%=', '~=');
			var temp = DOM.Method.getParam(items, selector[i - 1] || false, this, param[1] || '*', param[2], param[3], param[4], param[5]);
			if (!temp) break;
			items = temp;
		}
		return DOM.Method.getItems(items, this, nocash);
	},

	/*
	Property: getElement
		Same as <Element.getElements>, but returns only the first. Alternate syntax for <$E>, where filter is the Element.
		Returns as <Element>.

	Arguments:
		selector - string; css selector
	*/

	getElement: function(selector){
		return $(this.getElements(selector, true)[0] || false);
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
		return (nocash) ? elements : $$.unique(elements);
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
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return el;
	}

});

document.extend(Element.$domMethods);
Element.extend(Element.$domMethods);