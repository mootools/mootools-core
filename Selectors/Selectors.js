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
		selector = selector.trim().replace(Selectors.sRegExp, function(match){
			if (match.charAt(2)) match = match.trim();
			separators.push(match.charAt(0));
			return '%' + match.charAt(1);
		}).split('%');
		for (var i = 0, j = selector.length; i < j; i++){
			var param = selector[i].match(Selectors.regExp);
			if (!param) throw new Error('bad selector');
			var temp = Selectors.Method.getParam(items, separators[i - 1] || false, this, param[1] || '*', param[2], param[3], param[4], param[5]);
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

var Selectors = {
	
	'regExp': /^(\w*|\*)(?:#([\w-]+))?(?:\.([\w-]+))?(?:\[(.*)\])?(?::(.*))?$/,
	
	'aRegExp': /^(\w+)(?:([!*^$~]?=)["']?([^"'\]]*)["']?)?$/,
	
	'sRegExp': /\s*([+>~\s])[a-zA-Z#.*\s]/g,
	
	'pRegExp': /^([\w-]+)(?:\((.*)\))?$/
	
};

Selectors.Pseudo = new Abstract();

Selectors.Pseudo.$parse = function(pseudo){
	pseudo = pseudo.match(Selectors.pRegExp);
	if (!pseudo) throw new Error('bad pseudo selector');
	var name = pseudo[1].split('-')[0];
	var argument = pseudo[2] || false;
	var xparser = Selectors.Pseudo[name];
	if (xparser && xparser.parser) return {'name': name, 'argument': (xparser.parser.apply) ? xparser.parser(argument) : xparser.parser};
	else return {'name': name, 'argument': argument};
};

Selectors.XPath = {

	getParam: function(items, separator, context, tag, id, className, attribute, pseudo){
		var temp = context.namespaceURI ? 'xhtml:' : '';
		switch(separator){
			case '~': case '+': temp += '/following-sibling::'; break;
			case '>': temp += '/'; break;
			case ' ': temp += '//';
		}
		temp += tag;
		if (separator == '+') temp += '[1]';
		if (pseudo){
			pseudo = Selectors.Pseudo.$parse(pseudo);
			var xparser = Selectors.Pseudo[pseudo.name];
			if (xparser && xparser.xpath) temp += xparser.xpath(pseudo.argument);
			else temp += ($chk(pseudo.argument)) ? '[@' + pseudo.name + '="' + pseudo.argument + '"]' : '[@' + pseudo.name + ']';
		}
		if (id) temp += '[@id="' + id + '"]';
		if (className) temp += '[contains(concat(" ", @class, " "), " ' + className + ' ")]';
		if (attribute){
			attribute = attribute.match(Selectors.aRegExp);
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
		var xpath = document.evaluate('.//' + items.join(''), context, Selectors.XPath.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements.push(xpath.snapshotItem(i));
		return (nocash) ? elements : new Elements(elements.map($));
	},
	
	resolver: function(prefix){
		return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	}
	
};

Selectors.Filter = {

	getParam: function(items, separator, context, tag, id, className, attribute, pseudo){
		if (separator){
			switch(separator){
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
		if (className) items = Elements.filterByClass(items, className, true);
		if (attribute){
			attribute = attribute.match(Selectors.aRegExp);
			if (!attribute) throw new Error('bad attribute selector');
			items = Elements.filterByAttribute(items, attribute[1], attribute[2], attribute[3], true);
		}
		if (pseudo){
			pseudo = Selectors.Pseudo.$parse(pseudo);
			var xparser = Selectors.Pseudo[pseudo.name];
			if (xparser && xparser.filter){
				var temp = {};
				items = items.filter(function(el, i, array){
					return xparser.filter(el, pseudo.argument, i, array, temp);
				});
				temp = null;
			} else {
				items = Elements.filterByAttribute(items, param.name, '=', param.arg, true);
			}
		}
		return items;
	},

	getItems: function(items, context, nocash){
		return (nocash) ? items : $$.unique(items);
	},
	
	hasTag: function(el, tag){
		return (el.nodeName && el.nodeType == 1 && (tag == '*' || el.tagName.toLowerCase() == tag));
	},
	
	getFollowingByTag: function(context, tag, all){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++){
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

Selectors.Method = (Client.features.xpath) ? Selectors.XPath : Selectors.Filter;