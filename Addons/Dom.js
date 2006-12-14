/*
Script: Dom.js
	Css Query related function and <Element> extensions

Author:
	Valerio Proietti, <http://mad4milk.net>

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

Retunrs:
	array - an array of dom elements that match the selector within the filter

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

	Credits:
		Say thanks to Christophe Beyls <http://digitalia.be> for the new regular expression that rules getElements, a big step forward in terms of speed.
	*/

	getElements: function(selector){
		var filters = [];
		selector.clean().split(' ').each(function(sel, i){
			var param = sel.match('^(\\w*|\\*)(?:#([\\w_-]+)|\\.([\\w_-]+))?(?:\\[["\']?(\\w+)["\']?(?:([\\*\\^\\$]?=)["\']?(\\w*)["\']?)?\\])?$');
			//PARAM ARRAY: 0 = full string: 1 = tag; 2 = id; 3 = class; 4 = attribute; 5 = operator; 6 = value;
			if (!param) return;
			param[1] = param[1] || '*';
			if (i == 0){
				if (param[2]){
					var el = this.getElementById(param[2]);
					if (!el || ((param[1] != '*') && ($Element(el, 'getTag') != param[1]))) return;
					filters = [el];
				} else {
					filters = $A(this.getElementsByTagName(param[1]));
				}
			} else {
				filters = Elements.prototype.filterByTagName.call(filters, param[1]);
				if (param[2]) filters = Elements.prototype.filterById.call(filters, param[2]);
			}
			if (param[3]) filters = Elements.prototype.filterByClassName.call(filters, param[3]);
			if (param[4]) filters = Elements.prototype.filterByAttribute.call(filters, param[4], param[6], param[5]);
		}, this);
		return $$(filters);
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

document.extend = Object.extend;

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

/*
Class: Elements
	Methods for dom queries arrays, as <$$>.
*/

Elements.extend({

	//internal methods

	filterById: function(id, tag){
		var found = [];
		this.each(function(el){
			if (el.id == id) found.push(el);
		});
		return found;
	},

	filterByClassName: function(className){
		var found = [];
		this.each(function(el){
			if ($Element(el, 'hasClass', className)) found.push(el);
		});
		return found;
	},

	filterByTagName: function(tagName){
		var found = [];
		this.each(function(el){
			found.extend(el.getElementsByTagName(tagName));
		});
		return found;
	},

	filterByAttribute: function(name, value, operator){
		var found = [];
		this.each(function(el){
			var att = el.getAttribute(name);
			if (!att) return found;
			if (!operator) return found.push(el);

			switch (operator){
				case '*=': if (att.test(value)) found.push(el); break;
				case '=': if (att == value) found.push(el); break;
				case '^=': if (att.test('^'+value)) found.push(el); break;
				case '$=': if (att.test(value+'$')) found.push(el);
			}
			return found;
		});
		return found;
	}

});