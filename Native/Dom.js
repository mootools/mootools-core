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
	selector - the css selector to match
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
	selector - css selector to match
	filter - optional; a DOM element to limit the scope of the selector match; defaults to document.

Examples:
	>$ES("a") //gets all the anchor tags; synonymous with $$("a")
	>$ES('a','myElement') //get all the anchor tags within $('myElement')
*/

function $ES(selector, filter){
	return ($(filter) || document).getElementsBySelector(selector);
};

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.domMethods = {

	/*
	Property: getElements 
		Gets all the elements within an element that match the given (single) selector.

	Arguments:
		selector - the css selector to match

	Example:
		>$('myElement').getElements('a'); // get all anchors within myElement
		
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
		var xpath = (document.evaluate) ? true : false;
		selector = selector.clean().split(' ');
		for (var i = 0, j = selector.length; i < j; i++){
			var sel = selector[i];
			var param = sel.match(/^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/);
			if (!param) break;
			param[1] = (param[1]) ? param[1] : '*';
			if (xpath){
				var temp = this.namespaceURI ? ['xhtml:'] : [];
				temp.push(param[1]);
				if (param[2]) temp.push('[@id="', param[2], '"]');
				if (param[3]) temp.push('[contains(concat(" ", @class, " "), " ', param[3], ' ")]');
				if (param[4]){
					if (param[5] && param[6]){
						switch(param[5]){
							case '*=':  temp.push('[contains(@', param[4], ', "', param[6], '")]'); break;
							case '^=':  temp.push('[starts-with(@', param[4], ', "', param[6], '")]'); break;
							case '$=': temp.push('[substring(@', param[4], ', string-length(@', param[4], ') - ', param[6].length, ' + 1) = "', param[6], '"]'); break;
							case '=':  temp.push('[@', param[4], '="', param[6], '"]'); break;
							case '!=':  temp.push('[@', param[4], '!="', param[6], '"]');
						}
					} else temp.push('[@', param[4], ']');
				}
				items.push(temp.join(''));
				continue;
			}
			Filters.selector = param;
			if (i == 0){
				if (param[2]){
					var el = this.getElementById(param[2]);
					if (!el || ((param[1] != '*') && (Element.prototype.getTag.call(el) != param[1]))) break;
					items = [el];
				} else {
					items = $A(this.getElementsByTagName(param[1]));
				}
			} else {
				items = Elements.prototype.getElementsByTagName.call(items, param[1], true);
				if (param[2]) items = items.filter(Filters.id);
			}
			if (param[3]) items = items.filter(Filters.className);
			if (param[4]) items = items.filter(Filters.attribute);
		}
		if (xpath) items = this.getElementsByXpath(items.join('//'));
		return (nocash) ? items : $extend(items.map($), new Elements);
	},
	
	getElementsByXpath: function(xp){
		var result = [];
		var resolver = function(prefix){
			return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
		};
		var xpath = document.evaluate('.//' + xp, this, resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) result.push(xpath.snapshotItem(i));
		return result;
	},

	/*
	Property: getElement
		Same as <Element.getElements>, but returns only the first. Alternate syntax for <$E>, where filter is the Element.
	*/

	getElement: function(selector){
		return this.getElementsBySelector(selector)[0];
	},

	/*
	Property: getElementsBySelector
		Same as <Element.getElements>, but allows for comma separated selectors, as in css. Alternate syntax for <$$>, where filter is the Element.

	*/

	getElementsBySelector: function(selector, nocash){
		var elements = [];
		selector = selector.split(',');
		if (selector.length == 1) return this.getElements(selector[0], nocash);
		for (var i = 0, j = selector.length; i < j; i++){
			var temp = this.getElements(selector[i], true);
			if (i == 0) elements = temp;
			else elements.implement(temp);
		}
		return (nocash) ? elements : $extend(elements.map($), new Elements);
	},
	
	/*
	Property: getElementsByClassName 
		Returns all the elements that match a specific class name.
		Here for compatibility purposes. can also be written: document.getElements('.className'), or $$('.className')
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
		id - the id of the element to find.
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

/* Section: document related functions */

document.extend(Element.domMethods);
Element.extend(Element.domMethods);

//dom filters, internal methods.

var Filters = {

	selector: [],

	id: function(el){
		return (el.id == Filters.selector[2]);
	},

	className: function(el){
		return (Element.prototype.hasClass.call(el, Filters.selector[3]));
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
		}
		return false;
	}

};

/*
Class: Elements
	Methods for dom queries arrays, <$$>.
*/

Elements.extend({

	getElementsByTagName: function(tagName){
		var found = [];
		for (var i = 0, j = this.length; i < j; i++) found.extend(this[i].getElementsByTagName(tagName));
		return found;
	}

});