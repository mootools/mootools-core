/*
Script: Dom.js
	Css Query related function and <Element> extensions

License:
	MIT-style license.
*/

/* Section: Utility Functions */

/* 
Function: $E 
	Selects a single (i.e. the first found) Element based on the selector passed in and an optional filter element.

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

$$.shared = {
	
	cache: {},

	regexp: /^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/,

	getNormalParam: function(selector, items, context, param, i){
		Filters.selector = param;
		if (i == 0){
			if (param[2]){
				var el = context.getElementById(param[2]);
				if (!el || ((param[1] != '*') && (el.tagName.toLowerCase() != param[1]))) return false;
				items = [el];
			} else {
				items = $A(context.getElementsByTagName(param[1]));
			}
		} else {
			items = $$.shared.getElementsByTagName(items, param[1]);
			if (param[2]) items = items.filter(Filters.id);
		}
		if (param[3]) items = items.filter(Filters.className);
		if (param[4]) items = items.filter(Filters.attribute);
		return items;
	},
	
	getXpathParam: function(selector, items, context, param, i){
		if ($$.shared.cache[selector].xpath){
			items.push($$.shared.cache[selector].xpath);
			return items;
		}
		var temp = context.namespaceURI ? ['xhtml:'] : [];
		temp.push(param[1]);
		if (param[2]) temp.push('[@id="', param[2], '"]');
		if (param[3]) temp.push('[contains(concat(" ", @class, " "), " ', param[3], ' ")]');
		if (param[4]){
			if (param[5] && param[6]){
				switch(param[5]){
					case '*=': temp.push('[contains(@', param[4], ', "', param[6], '")]'); break;
					case '^=': temp.push('[starts-with(@', param[4], ', "', param[6], '")]'); break;
					case '$=': temp.push('[substring(@', param[4], ', string-length(@', param[4], ') - ', param[6].length, ' + 1) = "', param[6], '"]'); break;
					case '=': temp.push('[@', param[4], '="', param[6], '"]'); break;
					case '!=': temp.push('[@', param[4], '!="', param[6], '"]');
				}
			} else temp.push('[@', param[4], ']');
		}
		temp = temp.join('');
		$$.shared.cache[selector].xpath = temp;
		items.push(temp);
		return items;
	},
	
	getNormalItems: function(items, context, nocash){
		return (nocash) ? items : $$.$$(items);
	},
	
	getXpathItems: function(items, context, nocash){
		var elements = [];
		var xpath = document.evaluate('.//' + items.join('//'), context, $$.shared.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements.push(xpath.snapshotItem(i));
		return (nocash) ? elements : $extend(elements.map($), new Elements);
	},
	
	resolver: function(prefix){
		return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	},
	
	getElementsByTagName: function(context, tagName){
		var found = [];
		for (var i = 0, j = context.length; i < j; i++) found = found.concat($A(context[i].getElementsByTagName(tagName)));
		return found;
	}

};

if (window.xpath){
	$$.shared.getParam = $$.shared.getXpathParam;
	$$.shared.getItems = $$.shared.getXpathItems;
} else {
	$$.shared.getParam = $$.shared.getNormalParam;
	$$.shared.getItems = $$.shared.getNormalItems;
}

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.domMethods = {

	/*
	Property: getElements 
		Gets all the elements within an element that match the given (single) selector.

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
		selector = selector.split(' ');
		for (var i = 0, j = selector.length; i < j; i++){
			var sel = selector[i];
			var param;
			if ($$.shared.cache[sel]){
				param = $$.shared.cache[sel].param;
			} else {
				param = sel.match($$.shared.regexp);
				if (!param) break;
				param[1] = param[1] || '*';
				$$.shared.cache[sel] = {'param': param};
			}
			var temp = $$.shared.getParam(sel, items, this, param, i);
			if (!temp) break;
			items = temp;
		}
		return $$.shared.getItems(items, this, nocash);
	},

	/*
	Property: getElement
		Same as <Element.getElements>, but returns only the first. Alternate syntax for <$E>, where filter is the Element.

	Arguments:
		selector - string; css selector
	*/

	getElement: function(selector){
		return $(this.getElements(selector, true)[0] || false);
	},

	/*
	Property: getElementsBySelector
		Same as <Element.getElements>, but allows for comma separated selectors, as in css. Alternate syntax for <$$>, where filter is the Element.

	Arguments:
		selector - string; css selector
	*/

	getElementsBySelector: function(selector, nocash){
		var elements = [];
		selector = selector.split(',');
		for (var i = 0, j = selector.length; i < j; i++) elements = elements.concat(this.getElements(selector[i], true));
		return (nocash) ? elements : $$.$$(elements);
	},
	
	/*
	Property: getElementsByClassName 
		Returns all the elements that match a specific class name.
		Here for compatibility purposes. can also be written: document.getElements('.className'), or $$('.className')

	Arguments:
		className - string; css classname
	*/

	getElementsByClassName: function(className){
		return this.getElements('.' + className);
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

document.extend(Element.domMethods);
Element.extend(Element.domMethods);

//dom filters, internal methods.

var Filters = {

	selector: [],

	id: function(el){
		return (el.id == Filters.selector[2]);
	},

	className: function(el){
		return el.className.hasListed(Filters.selector[3]);
	},

	attribute: function(el){
		var current = Element.prototype.getProperty.call(el, Filters.selector[4]);
		if (!current) return false;
		var operator = Filters.selector[5];
		if (!operator) return true;
		var value = Filters.selector[6];
		switch(operator){
			case '=': return (current == value);
			case '*=': return (current.test(value));
			case '^=': return (current.test('^' + value));
			case '$=': return (current.test(value + '$'));
			case '!=': return (current != value);
			case '~=': return current.hasListed(value);
		}
		return false;
	}

};