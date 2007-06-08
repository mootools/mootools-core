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
	
	'regExp': /^(\w*|\*)(?:#([\w-]+))?(?:\.([\w-]+))?(?:\[([\w\W]+)\])?$/,
	
	'aRegExp': /^(\w+)(?:([!*^$\~]?=)["']?([^"'\]]*)["']?)?$/,
	
	'sRegExp': /\s\~\s|\s\+\s|\s\>\s|\s/g
	
};

DOM.XPath = {

	getParam: function(items, separator, context, param){
		var temp = context.namespaceURI ? 'xhtml:' : '';
		switch(separator){
			case ' ~ ': case ' + ': temp += '/following-sibling::'; break;
			case ' > ': temp += '/'; break;
			case ' ': temp += '//'; break;
		}
		temp += param[1];
		if (separator == ' + ') temp += '[1]';
		if (param[2]) temp += '[@id="' + param[2] + '"]';
		if (param[3]) temp += '[contains(concat(" ", @class, " "), " ' + param[3] + ' ")]';
		if (param[4]){
			var attr = param[4].match(DOM.aRegExp);
			if (!attr) throw new Error('bad attribute selector');
			if (attr[2] && attr[3]){
				switch(attr[2]){
					case '=': temp += '[@' + attr[1] + '="' + attr[3] + '"]'; break;
					case '*=': temp += '[contains(@' + attr[1] + ', "' + attr[3] + '")]'; break;
					case '^=': temp += '[starts-with(@' + attr[1] + ', "' + attr[3] + '")]'; break;
					case '$=': temp += '[substring(@' + attr[1] + ', string-length(@' + attr[1] + ') - ' + attr[3].length + ' + 1) = "' + attr[3] + '"]'; break;
					case '!=': temp += '[@' + attr[1] + '!="' + attr[3] + '"]'; break;
					case '~=': temp += '[contains(concat(" ", @' + attr[1] + ', " "), " ' + attr[3] + ' ")]';
				}
			} else {
				temp += '[@' + attr[1] + ']';
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

	getParam: function(items, separator, context, param){
		if (separator){
			var name = 'getFollowingByTag';
			switch(separator){
				case ' ': name = 'getNestedByTag'; break;
				case ' > ': name = 'getChildrenByTag';
			}
			items = DOM.Walker[name](items, param[1], (separator == ' ~ '));
			if (param[2]) items = Elements.filterById(items, param[2], true);
		} else {
			if (param[2]){
				var el = context.getElementById(param[2]);
				if (!el || ((param[1] != '*') && (Element.getTag(el) != param[1]))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(param[1]));
			}
		}
		if (param[3]) items = Elements.filterByClass(items, param[3], true);
		if (param[4]){
			var attr = param[4].match(DOM.aRegExp);
			if (!attr) throw new Error('bad attribute selector');
			items = Elements.filterByAttribute(items, attr[1], attr[2], attr[3], true);
		}
		return items;
	},

	getItems: function(items, context, nocash){
		return (nocash) ? items : $$.unique(items);
	},
	
	hasTag: function(el, tag){
		return ($type(el) == 'element' && (Element.getTag(el) == tag || tag == '*'));
	},
	
	getFollowingByTag: function(context, tag, all){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++){
			var next = context[i].nextSibling;
			while (next){
				if (DOM.Walker.hasTag(next, tag)){
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
				if (DOM.Walker.hasTag(children[k], tag)) found.push(children[k]);
			}
		}
		return found;
	},

	getNestedByTag: function(context, tagName){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++) found.extend(context[i].getElementsByTagName(tagName));
		return found;
	}
	
};

DOM.Method = (Client.features.xpath) ? DOM.XPath : DOM.Walker;

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
		selector = selector.trim().replace(DOM.sRegExp, function(match){
			separators.push(match);
			return ' ';
		});
		selector = selector.split(' ');
		for (var i = 0, j = selector.length; i < j; i++){
			var sel = selector[i];
			var param = sel.match(DOM.regExp);
			if (!param) throw new Error('bad selector');
			param[1] = param[1] || '*';
			var temp = DOM.Method.getParam(items, separators[i - 1] || false, this, param);
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
		if (!el) return false;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return false;
		}
		return el;
	}

});

document.extend(Element.$domMethods);
Element.extend(Element.$domMethods);