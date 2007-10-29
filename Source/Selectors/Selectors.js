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
		var Local = {};
		selectors = selectors.split(',');
		var elements = [], j = selectors.length;
		var ddup = (j > 1);
		for (var i = 0; i < j; i++){
			var selector = selectors[i], items = [], separators = [];
			selector = selector.trim().replace(Selectors.sRegExp, function(match){
				if (match.charAt(2)) match = match.trim();
				separators.push(match.charAt(0));
				return ':)' + match.charAt(1);
			}).split(':)');
			for (var k = 0, l = selector.length; k < l; k++){
				var sel = Selectors.parse(selector[k]);
				if (!sel) return [];
				var temp = Selectors.Method.getParam(items, separators[k - 1] || false, this, sel, Local);
				if (!temp) break;
				items = temp;
			}
			var partial = Selectors.Method.getItems(items, this);
			elements = (ddup) ? elements.concat(partial) : partial;
		}
		return new Elements(elements, {ddup: ddup, cash: !nocash, xtend: !nocash});
	}

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

});

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

	'regExp': (/:([^-:(]+)[^:(]*(?:\((["']?)(.*?)\2\))?|\[(\w+)(?:([!*^$~|]?=)(["']?)(.*?)\6)?\]|\.[\w-]+|#[\w-]+|\w+|\*/g),

	'sRegExp': (/\s*([+>~\s])[a-zA-Z#.*\s]/g)

};

Selectors.parse = function(selector){
	var params = {'tag': '*', 'id': null, 'classes': [], 'attributes': [], 'pseudos': []};
	selector = selector.replace(Selectors.regExp, function(bit){
		switch (bit.charAt(0)){
			case '.': params.classes.push(bit.slice(1)); break;
			case '#': params.id = bit.slice(1); break;
			case '[': params.attributes.push([arguments[4], arguments[5], arguments[7]]); break;
			case ':':
				var xparser = Selectors.Pseudo.get(arguments[1]);
				if (!xparser){
					params.attributes.push([arguments[1], arguments[3] ? '=' : '', arguments[3]]);
					break;
				}
				var pseudo = {'name': arguments[1], 'parser': xparser, 'argument': (xparser.parser) ? xparser.parser(arguments[3]) : arguments[3]};
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

	getParam: function(items, separator, context, params){
		var temp = context.namespaceURI ? 'xhtml:' : '';
		switch (separator){
			case ' ': temp += '//'; break;
			case '>': temp += '/'; break;
			case '+': temp += '/following-sibling::*[1]/self::'; break;
			case '~': temp += '/following-sibling::'; break;
		}
		temp += params.tag;
		var i;
		for (i = params.pseudos.length; i--; i){
			var pseudo = params.pseudos[i];
			if (pseudo.parser && pseudo.parser.xpath) temp += pseudo.parser.xpath(pseudo.argument);
			else temp += ($chk(pseudo.argument)) ? '[@' + pseudo.name + '="' + pseudo.argument + '"]' : '[@' + pseudo.name + ']';
		}
		if (params.id) temp += '[@id="' + params.id + '"]';
		for (i = params.classes.length; i--; i) temp += '[contains(concat(" ", @class, " "), " ' + params.classes[i] + ' ")]';
		for (i = params.attributes.length; i--; i){
			var bits = params.attributes[i];
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
		var doc = context.ownerDocument || context;
		var xpath = doc.evaluate('.//' + items.join(''), context, Selectors.XPath.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements[i] = xpath.snapshotItem(i);
		return elements;
	},

	resolver: function(prefix){
		return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	}

};

Selectors.Filter = {

	getParam: function(items, separator, context, params, Local){
		var found = [];
		var tag = params.tag;
		if (separator){
			var uniques = {}, child, children, item, k, l;
			var add = function(child){
				child.uid = child.uid || [Native.UID++];
				if (!uniques[child.uid] && Selectors.Filter.match(child, params, Local)){
					uniques[child.uid] = true;
					found.push(child);
					return true;
				}
				return false;
			};
			for (var i = 0, j = items.length; i < j; i++){
				item = items[i];	
				switch(separator){
					case ' ':
						children = item.getElementsByTagName(tag);
						params.tag = false;
						for (k = 0, l = children.length; k < l; k++) add(children[k]);
					break;
					case '>':
						children = item.childNodes;
						for (k = 0, l = children.length; k < l; k++){
							if (children[k].nodeType == 1) add(children[k]);
						}
					break;
					case '+':
						while ((item = item.nextSibling)){
							if (item.nodeType == 1){
								add(item);
								break;
							}
						}
					break;
					case '~':
						while ((item = item.nextSibling)){
							if (item.nodeType == 1 && add(item)) break;
						}
					break;
				}
			}	
			return found;
		}
		if (params.id){
			el = context.getElementById(params.id, true);
			params.id = false;
			return (el && Selectors.Filter.match(el, params, Local)) ? [el] : false;
		} else {
			items = context.getElementsByTagName(tag);
			params.tag = false;
			for (var m = 0, n = items.length; m < n; m++){
				if (Selectors.Filter.match(items[m], params, Local)) found.push(items[m]);
			}
		}
		return found;
	},

	getItems: $arguments(0)

};

Selectors.Filter.match = function(el, params, Local){
	Local = Local || {};

	if (params.id && params.id != el.id) return false;
	if (params.tag && params.tag != '*' && params.tag != el.tagName.toLowerCase()) return false;

	var i;

	for (i = params.classes.length; i--; i){
		if (!el.className || !el.className.contains(params.classes[i], ' ')) return false;
	}

	for (i = params.attributes.length; i--; i){
		var bits = params.attributes[i];
		var result = Element.prototype.getProperty.call(el, bits[0]);
		if (!result) return false;
		if (!bits[1]) continue;
		var condition;
		switch (bits[1]){
			case '=': condition = (result == bits[2]); break;
			case '*=': condition = (result.contains(bits[2])); break;
			case '^=': condition = (result.substr(0, bits[2].length) == bits[2]); break;
			case '$=': condition = (result.substr(result.length - bits[2].length) == bits[2]); break;
			case '!=': condition = (result != bits[2]); break;
			case '~=': condition = result.contains(bits[2], ' '); break;
			case '|=': condition = result.contains(bits[2], '-');
		}

		if (!condition) return false;
	}

	for (i = params.pseudos.length; i--; i){
		if (!params.pseudos[i].parser.filter.call(el, params.pseudos[i].argument, Local)) return false;
	}

	return true;
};

Selectors.Method = (Browser.Features.xpath) ? Selectors.XPath : Selectors.Filter;

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.implement({

	/*
	Method: match
		Matches the Element with the given selector.

	Syntax:
		>var matched = myElement.match(selector);

	Arguments:
		selector - (string) Selectors to match the element to.

	Returns:
		(boolean) true if matched, false otherwise.

	Example:
		[javascript]
			var elem = $('myelement');
			//later in the code, for whatever reason
			elem.match('div[name=somename]'); //returns true if the element is a div and has as name "somename".
		[/javascript]
	*/

	match: function(selector){
		return (!selector || Selectors.Filter.match(this, Selectors.parse(selector)));
	}

});
