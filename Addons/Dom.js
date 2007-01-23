/*
Script: Dom.js
	Css Query related function and <Element> extensions

Authors:
	- Valerio Proietti, <http://mad4milk.net>
	- Christophe Beyls, <http://digitalia.be>

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

Element.extend({

	/*
	Property: getElements 
		Gets all the elements within an element that match the given (single) selector.

	Arguments:
		selector - the css selector to match

	Example:
		>$('myElement').getElements('a'); // get all anchors within myElement
	*/

	getElements: function(selector){
		var elements = [];
		selector.clean().split(' ').each(function(sel, i){
			var param = sel.match(/^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([*^$]?=)["']?([^"'\]]*)["']?)?])?$/);
			//PARAM ARRAY: 0 = full string: 1 = tag; 2 = id; 3 = class; 4 = attribute; 5 = operator; 6 = value;
			if (!param) return;
			Filters.selector = param;
			param[1] = param[1] || '*';
			if (i == 0){
				if (param[2]){
					var el = this.getElementById(param[2]);
					if (!el || ((param[1] != '*') && (Element.prototype.getTag.call(el) != param[1]))) return;
					elements = [el];
				} else {
					elements = $A(this.getElementsByTagName(param[1]));
				}
			} else {
				elements = Elements.prototype.getElementsByTagName.call(elements, param[1], true);
				if (param[2]) elements = elements.filter(Filters.id);
			}
			if (param[3]) elements = elements.filter(Filters.className);
			if (param[4]) elements = elements.filter(Filters.attribute);
		}, this);
		return $$(elements);
	},

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

	getElementsBySelector: function(selector){
		var els = [];
		selector.split(',').each(function(sel){
			els.extend(this.getElements(sel));
		}, this);
		return $$(els);
	}

});

/* Section: document related functions */

document.extend({
	/*
	Function: document.getElementsByClassName 
		Returns all the elements that match a specific class name. 
		Here for compatibility purposes. can also be written: document.getElements('.className'), or $$('.className')
	*/

	getElementsByClassName: function(className){
		return document.getElements('.'+className);
	},
	getElement: Element.prototype.getElement,
	getElements: Element.prototype.getElements,
	getElementsBySelector: Element.prototype.getElementsBySelector

});

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
		var current = el.getAttribute(Filters.selector[4]);
		if (!current) return false;
		var operator = Filters.selector[5];
		if (!operator) return true;
		var value = Filters.selector[6];
		switch (operator){
			case '*=': return (current.test(value));
			case '=': return (current == value);
			case '^=': return (current.test('^'+value));
			case '$=': return (current.test(value+'$'));
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
		this.each(function(el){
			found.extend(el.getElementsByTagName(tagName));
		});
		return found;
	}

});