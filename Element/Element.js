/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

var Element = function(el, props){

	/*
	Property: initialize
		Creates a new element of the type passed in.

	Arguments:
		el - string; the tag name for the element you wish to create. you can also pass in an element reference, in which case it will be extended.
		props - object; the properties you want to add to your element.
		Accepts the same keys as <Element.setProperties>, but also allows events and styles

	Props:
		the key styles will be used as setStyles, the key events will be used as addEvents. any other key is used as setProperty.

	Example:
		(start code)
		new Element('a', {
			'styles': {
				'display': 'block',
				'border': '1px solid black'
			},
			'events': {
				'click': function(){
					//aaa
				},
				'mousedown': function(){
					//aaa
				}
			},
			'class': 'myClassSuperClass',
			'href': 'http://mad4milk.net'
		});

		(end)
	*/

	if ($type(el) == 'string'){
		if (Client.Engine.ie && props && (props.name || props.type)){
			var name = (props.name) ? ' name="' + props.name + '"' : '';
			var type = (props.type) ? ' type="' + props.type + '"' : '';
			delete props.name;
			delete props.type;
			el = '<' + el + name + type + '>';
		}
		el = document.createElement(el);
	}
	el = $(el);
	return (!props || !el) ? el : el.set(props);
};

Element.prototype = HTMLElement.prototype;

/*
Class: Elements
	- Every dom function such as <$$>, or in general every function that returns a collection of nodes in mootools, returns them as an Elements class.
	- The purpose of the Elements class is to allow <Element> methods to work also on <Elements> array.
	- Elements is an Array in first place, so it accepts all the <Array> methods.
	- Array methods have priority, so overlapping Element methods (remove, getLast) are changed to "method + Elements" (removeElements, getLastElements)
	- Every node of the Elements instance is already extended with <$>.

Example:
	>$$('myselector').each(function(el){
	> //...
	>});

	some iterations here, $$('myselector') is also an array.

	>$$('myselector').setStyle('color', 'red');
	every element returned by $$('myselector') also accepts <Element> methods, in this example every element will be made red.
*/

var Elements = function(elements, nocheck){
	elements = elements || [];
	var l = elements.length;
	if (nocheck || l < 2) return $extend(elements, this);
	var uniques = {};
	var returned = [];
	for (var i = 0; i < l; i++){
		var el = $(elements[i]);
		if (!el || uniques[el.$attributes.uid]) continue;
		uniques[el.$attributes.uid] = true;
		returned.push(el);
	}
	return $extend(returned, this);
};

/*
Section: Utility Functions

Function: $
	returns the element passed in with all the Element prototypes applied.

Arguments:
	el - a reference to an actual element or a string representing the id of an element

Example:
	>$('myElement') // gets a DOM element by id with all the Element prototypes applied.
	>var div = document.getElementById('myElement');
	>$(div) //returns an Element also with all the mootools extensions applied.

	You'll use this when you aren't sure if a variable is an actual element or an id, as
	well as just shorthand for document.getElementById().

Returns:
	a DOM element or false (if no id was found).

Note:
	you need to call $ on an element only once to get all the prototypes.
	But its no harm to call it multiple times, as it will detect if it has been already extended.
*/

function $(el){
	if (!el) return null;
	if (el.htmlElement) return Garbage.collect(el);
	var type = $type(el);
	if (type == 'string'){
		el = document.getElementById(el);
		type = (el) ? 'element' : false;
	}
	if (type != 'element') return (['window', 'document'].contains(type)) ? el : null;
	if (el.htmlElement) return Garbage.collect(el);
	if (Element.$badTags.contains(el.tagName.toLowerCase())) return el;
	$extend(el, Element.prototype);
	el.htmlElement = $empty;
	return Garbage.collect(el);
};

/*
Function: $$
	Selects, and extends DOM elements. Elements arrays returned with $$ will also accept all the <Element> methods.
	The return type of element methods run through $$ is always an array. If the return array is only made by elements,
	$$ will be applied automatically.

Arguments:
	HTML Collections, arrays of elements, arrays of strings as element ids, elements, strings as selectors.
	Any number of the above as arguments are accepted.

Note:
	if you load <Element.Selectors.js>, $$ will also accept CSS Selectors, otherwise the only selectors supported are tag names.

Example:
	>$$('a') //an array of all anchor tags on the page
	>$$('a', 'b') //an array of all anchor and bold tags on the page
	>$$('#myElement') //array containing only the element with id = myElement. (only with <Element.Selectors.js>)
	>$$('#myElement a.myClass') //an array of all anchor tags with the class "myClass"
	>//within the DOM element with id "myElement" (only with <Element.Selectors.js>)
	>$$(myelement, myelement2, 'a', ['myid', myid2, 'myid3'], document.getElementsByTagName('div')) //an array containing:
	>// the element referenced as myelement if existing,
	>// the element referenced as myelement2 if existing,
	>// all the elements with a as tag in the page,
	>// the element with id = myid if existing
	>// the element with id = myid2 if existing
	>// the element with id = myid3 if existing
	>// all the elements with div as tag in the page

Returns:
	array - array of all the dom elements matched, extended with <$>.  Returns as <Elements>.
*/

document.getElementsBySelector = document.getElementsByTagName;

function $$(){
	var elements = [];
	for (var i = 0, j = arguments.length; i < j; i++){
		var selector = arguments[i];
		switch ($type(selector)){
			case 'element': elements.push(selector); break;
			case false: break;
			case 'string': selector = document.getElementsBySelector(selector, true);
			default: elements.extend(selector);
		}
	}
	return new Elements(elements);
};

Element.extend = function(properties){
	for (var property in properties){
		Element.prototype[property] = properties[property];
		Element[property] = Native.generic(property);
		Elements.prototype[(Array.prototype[property]) ? property + 'Elements' : property] = Elements.$multiply(property);
	}
};

Client.expand = function(properties){
	Element.extend(properties);
	window.extend(properties);
	document.extend(properties);
};

Elements.extend = function(properties){
	for (var property in properties){
		Elements.prototype[property] = properties[property];
		Elements[property] = Native.generic(property);
	}
};

Elements.$multiply = function(property){
	return function(){
		var args = arguments;
		var items = [];
		var elements = true;
		this.each(function(element){
			var returns = element[property].apply(element, args);
			items.push(returns);
			if (elements) elements = ($type(returns) == 'element');
		});
		return (elements) ? new Elements(items) : items;
	};
};

Element.Setters = new Abstract({

	attributes: function(properties){
		this.setProperties(properties);
	}

});

Element.Setters.properties = Element.Setters.attributes;

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	getElement: function(tag){
		return $(this.getElementsByTagName(tag)[0] || null);
	},

	getElements: function(tag){
		return $$(this.getElementsByTagName(tag));
	},

	/*
	Property: set
		you can set events, styles and properties with this shortcut. same as calling new Element.
	*/

	set: function(props){
		for (var prop in props){
			if (Element.Setters[prop]) Element.Setters[prop].call(this, props[prop]);
			else this.setProperty(prop, props[prop]);
		}
		return this;
	},

	inject: function(el, where){
		el = $(el);
		switch (where){
			case 'before': el.parentNode.insertBefore(this, el); break;
			case 'after':
				var next = el.getNext();
				if (!next) el.parentNode.appendChild(this);
				else el.parentNode.insertBefore(this, next);
				break;
			case 'top':
				var first = el.firstChild;
				if (first){
					el.insertBefore(this, first);
					break;
				}
			default: el.appendChild(this);
		}
		return this;
	},

	/*
	Property: injectBefore
		Inserts the Element before the passed element.

	Arguments:
		el - an element reference or the id of the element to be injected in.

	Example:
		>html:
		><div id="myElement"></div>
		><div id="mySecondElement"></div>
		>js:
		>$('mySecondElement').injectBefore('myElement');
		>resulting html:
		><div id="mySecondElement"></div>
		><div id="myElement"></div>
	*/

	injectBefore: function(el){
		return this.inject(el, 'before');
	},

	/*
	Property: injectAfter
		Same as <Element.injectBefore>, but inserts the element after.
	*/

	injectAfter: function(el){
		return this.inject(el, 'after');
	},

	/*
	Property: injectInside
		Same as <Element.injectBefore>, but inserts the element inside.
	*/

	injectInside: function(el){
		return this.inject(el, 'bottom');
	},

	/*
	Property: injectTop
		Same as <Element.injectInside>, but inserts the element inside, at the top.
	*/

	injectTop: function(el){
		return this.inject(el, 'top');
	},

	/*
	Property: adopt
		Inserts the passed elements inside the Element.

	Arguments:
		accepts elements references, element ids as string, selectors ($$('stuff')) / array of elements, array of ids as strings and collections.
	*/

	adopt: function(){
		var elements = [];
		$each(arguments, function(argument){
			elements = elements.concat(argument);
		});
		$$(elements).inject(this);
		return this;
	},

	/*
	Property: remove
		Removes the Element from the DOM.

	Note:
		For <Elements> this method is named removeElements, because <Array.remove> has priority.

	Example:
		>$('myElement').remove() //bye bye
	*/

	remove: function(){
		return this.parentNode.removeChild(this);
	},

	/*
	Property: clone
		Clones the Element and returns the cloned one.

	Arguments:
		contents - boolean, when true the Element is cloned with childNodes, default true

	Returns:
		the cloned element

	Example:
		>var clone = $('myElement').clone().injectAfter('myElement');
		>//clones the Element and append the clone after the Element.
	*/

	clone: function(contents){
		var el = $(this.cloneNode(contents !== false));
		if (!el.$events) return el;
		el.$events = {};
		for (var type in this.$events) el.$events[type] = {
			'keys': $A(this.$events[type].keys),
			'values': $A(this.$events[type].values)
		};
		return el.removeEvents();
	},

	/*
	Property: replaceWith
		Replaces the Element with an element passed.

	Arguments:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.

	Returns:
		the passed in element

	Example:
		>$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.
	*/

	replaceWith: function(el){
		el = $(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},

	/*
	Property: appendText
		Appends text node to a DOM element.

	Arguments:
		text - the text to append.

	Example:
		><div id="myElement">hey</div>
		>$('myElement').appendText(' howdy'); //myElement innerHTML is now "hey howdy"
	*/

	appendText: function(text){
		this.appendChild(document.createTextNode(text));
		return this;
	},

	/*
	Property: hasClass
		Tests the Element to see if it has the passed in className.

	Returns:
		true - the Element has the class
		false - it doesn't

	Arguments:
		className - string; the class name to test.

	Example:
		><div id="myElement" class="testClass"></div>
		>$('myElement').hasClass('testClass'); //returns true
	*/

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	/*
	Property: addClass
		Adds the passed in class to the Element, if the element doesnt already have it.

	Arguments:
		className - string; the class name to add

	Example:
		><div id="myElement" class="testClass"></div>
		>$('myElement').addClass('newClass'); //<div id="myElement" class="testClass newClass"></div>
	*/

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	/*
	Property: removeClass
		Works like <Element.addClass>, but removes the class from the element.
	*/

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1').clean();
		return this;
	},

	/*
	Property: toggleClass
		Adds or removes the passed in class name to the element, depending on if it's present or not.

	Arguments:
		className - the class to add or remove

	Example:
		><div id="myElement" class="myClass"></div>
		>$('myElement').toggleClass('myClass');
		><div id="myElement" class=""></div>
		>$('myElement').toggleClass('myClass');
		><div id="myElement" class="myClass"></div>
	*/

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	},

	walk: function(brother, start){
		brother += 'Sibling';
		var el = (start) ? this[start] : this[brother];
		while (el && $type(el) != 'element') el = el[brother];
		return $(el);
	},

	/*
	Property: getPrevious
		Returns the previousSibling of the Element, excluding text nodes.

	Example:
		>$('myElement').getPrevious(); //get the previous DOM element from myElement

	Returns:
		the sibling element or undefined if none found.
	*/

	getPrevious: function(){
		return this.walk('previous');
	},

	/*
	Property: getNext
		Works as Element.getPrevious, but tries to find the nextSibling.
	*/

	getNext: function(){
		return this.walk('next');
	},

	/*
	Property: getFirst
		Works as <Element.getPrevious>, but tries to find the firstChild.
	*/

	getFirst: function(){
		return this.walk('next', 'firstChild');
	},

	/*
	Property: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.

	Note:
		For <Elements> this method is named getLastElements, because <Array.getLast> has priority.
	*/

	getLast: function(){
		return this.walk('previous', 'lastChild');
	},

	/*
	Property: getParent
		returns the $(element.parentNode)
	*/

	getParent: function(){
		return $(this.parentNode);
	},

	/*
	Property: getChildren
		returns all the $(element.childNodes), excluding text nodes. Returns as <Elements>.
	*/

	getChildren: function(){
		return $$(this.childNodes);
	},

	/*
	Property: hasChild
		returns true if the passed in element is a child of the $(element).
	*/

	hasChild: function(el){
		return !!$A(this.getElementsByTagName('*')).contains(el);
	},

	/*
	Property: getProperty
		Gets the an attribute of the Element.

	Arguments:
		property - string; the attribute to retrieve

	Example:
		>$('myImage').getProperty('src') // returns whatever.gif

	Returns:
		the value, or an empty string
	*/

	getProperty: function(property){
		var index = Element.$attributes[property];
		if (index) return this[index];
		var flag = Element.$attributesIFlag[property] || 0;
		if (!Client.Engine.ie || flag) return this.getAttribute(property, flag);
		var node = this.attributes[property];
		return (node) ? node.nodeValue : null;
	},

	/*
	Property: removeProperty
		Removes an attribute from the Element

	Arguments:
		property - string; the attribute to remove
	*/

	removeProperty: function(property){
		var index = Element.$attributes[property];
		if (index) this[index] = '';
		else this.removeAttribute(property);
		return this;
	},

	/*
	Property: getProperties
		same as <Element.getStyles>, but for properties
	*/

	getProperties: function(){
		var result = {};
		$each(arguments, function(key){
			result[key] = this.getProperty(key);
		}, this);
		return result;
	},

	/*
	Property: setProperty
		Sets an attribute for the Element.

	Arguments:
		property - string; the property to assign the value passed in
		value - the value to assign to the property passed in

	Example:
		>$('myImage').setProperty('src', 'whatever.gif'); //myImage now points to whatever.gif for its source
	*/

	setProperty: function(property, value){
		var index = Element.$attributes[property];
		if (index) this[index] = value;
		else this.setAttribute(property, value);
		return this;
	},

	/*
	Property: setProperties
		Sets numerous attributes for the Element.

	Arguments:
		source - an object with key/value pairs.

	Example:
		(start code)
		$('myElement').setProperties({
			src: 'whatever.gif',
			alt: 'whatever dude'
		});
		<img src="whatever.gif" alt="whatever dude">
		(end)
	*/

	setProperties: function(properties){
		for (var property in properties) this.setProperty(property, properties[property]);
		return this;
	},

	/*
	Property: setHTML
		Sets the innerHTML of the Element.

	Arguments:
		html - string; the new innerHTML for the element.

	Example:
		>$('myElement').setHTML(newHTML) //the innerHTML of myElement is now = newHTML
	*/

	setHTML: function(){
		this.innerHTML = $A(arguments).join('');
		return this;
	},

	/*
	Property: setText
		Sets the inner text of the Element.

	Arguments:
		text - string; the new text content for the element.

	Example:
		>$('myElement').setText('some text') //the text of myElement is now = 'some text'
	*/

	setText: function(text){
		var tag = this.getTag();
		if (['style', 'script'].contains(tag)){
			if (Client.Engine.ie){
				if (tag == 'style') this.styleSheet.cssText = text;
				else if (tag ==  'script') this.setProperty('text', text);
				return this;
			} else {
				if (this.firstChild) this.removeChild(this.firstChild);
				return this.appendText(text);
			}
		}
		this[$defined(this.innerText) ? 'innerText' : 'textContent'] = text;
		return this;
	},

	/*
	Property: getText
		Gets the inner text of the Element.
	*/

	getText: function(){
		var tag = this.getTag();
		if (['style', 'script'].contains(tag)){
			if (Client.Engine.ie){
				if (tag == 'style') return this.styleSheet.cssText;
				else if (tag ==  'script') return this.getProperty('text');
			} else {
				return this.innerHTML;
			}
		}
		return ($pick(this.innerText, this.textContent));
	},

	/*
	Property: getTag
		Returns the tagName of the element in lower case.

	Example:
		>$('myImage').getTag() // returns 'img'

	Returns:
		The tag name in lower case
	*/

	getTag: function(){
		return this.tagName.toLowerCase();
	},

	/*
	Property: empty
		Empties an element of all its children.

	Example:
		>$('myDiv').empty() // empties the Div and returns it

	Returns:
		The element.
	*/

	empty: function(){
		Garbage.trash(this.getElementsByTagName('*'));
		return this.setHTML('');
	},

	/*
	Property: destroy
		Empties an element of all its children, removes and garbages the element.

	Example:
		>$('myDiv').destroy() // Div is no more.

	Returns:
		null
	*/

	destroy: function(){
		Garbage.kill(this.empty().remove());
		return null;
	}

});

Element.$badTags = ['object', 'embed'];

Element.$attributes = {
	'class': 'className', 'for': 'htmlFor', 'colspan': 'colSpan', 'rowspan': 'rowSpan',
	'accesskey': 'accessKey', 'tabindex': 'tabIndex', 'maxlength': 'maxLength',
	'readonly': 'readOnly', 'frameborder': 'frameBorder', 'value': 'value',
	'disabled': 'disabled', 'checked': 'checked', 'multiple': 'multiple', 'selected': 'selected'
};

Element.$attributesIFlag = {
	'href': 2, 'src': 2
};

Client.expand({

	addListener: function(type, fn){
		if (this.addEventListener) this.addEventListener(type, fn, false);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, false);
		else this.detachEvent('on' + type, fn);
		return this;
	}

});

Element.UID = 0;

var Garbage = {

	elements: {},

	collect: function(el){
		if (!el.$attributes){
			el.$attributes = {'opacity': 1, 'uid': Element.UID++};
			Garbage.elements[el.$attributes.uid] = el;
		}
		return el;
	},

	trash: function(elements){
		for (var i = elements.length, el; i--;){
			if (!(el = elements[i]) || !el.$attributes) continue;
			if (!el.tagName || Element.$badTags.contains(el.tagName.toLowerCase())) Garbage.kill(el);
		}
	},

	kill: function(el, unload){
		delete Garbage.elements[String(el.$attributes.uid)];
		if (el.$events) el.fireEvent('trash', unload).removeEvents();
		for (var p in el.$attributes) el.$attributes[p] = null;
		if (window.ie){
			for (var d in Element.prototype) el[d] = null;
		}
		el.htmlElement = el.$attributes = el = null;
	},

	empty: function(){
		Garbage.collect(window);
		Garbage.collect(document);
		for (var uid in Garbage.elements) Garbage.kill(Garbage.elements[uid], true);
	}

};

window.addListener('beforeunload', function(){
	window.addListener('unload', Garbage.empty);
	if (Client.Engine.ie) window.addListener('unload', CollectGarbage);
});