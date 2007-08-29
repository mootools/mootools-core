/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license.
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM Element via the dollar function <$>.

See Also:
	<$>
*/

var Element = function(el, props){

	/*
	Property: initialize
		Creates a new Element of the type passed in.

	Syntax:
		>var myEl = new Element(el[, props]);

	Arguments:
		el - (mixed) The tag name for the Element to be created.  It's also possible to add an Element for reference, in which case it will be extended.
		props - (object, optional) The properties to be added to the new Element. Accepts the same keys as <Element.setProperties>, as well as Events and styles.

	Props:
		The key styles will be used as setStyles, the key events will be used as addEvents. Any other key is used as setProperty.

	Example:
		(start code)
		new Element('a', {
			'styles': {
				'display': 'block',
				'border': '1px solid black'
			},
			'events': {
				'click': function(){
					alert('omg u clicked');
				},
				'mousedown': function(){
					alert('omg ur gonna click');
				}
			},
			'class': 'myClassSuperClass',
			'href': 'http://mad4milk.net'
		});
		(end)

	See Also:
		<Element.set>
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
	- In MooTools, every DOM function, such as <$$> (and every other function that returns a collection of nodes) returns them as an Elements class.
	- The purpose of the Elements class is to allow <Element> methods to work also on <Elements> array.
	- Because Elements is an Array, it accepts all the <Array> methods.
	- Array methods have priority, so overlapping Element methods (remove, getLast) are changed to "method + Elements" (removeElements, getLastElements).
	- Every node of the Elements instance is already extended with <$>.

Syntax:
	>var myElements = new Elements([elements[, nocheck]]);

Arguments:
	elements - (array)
	nocheck - (boolean)

Returns:
	(array) An extended array with the Elements methods.

Example:
	(start code);
	//The following code would set the color of every paragraph to 'red'.
	$$('p').each(function(el){
	  el.setStyle('color', 'red');
	});

	//However, because $$('myselector') also accepts <Element> methods, the below example would have the same effect as the one above.
	$$('p').setStyle('color', 'red');
	(end)
*/

var Elements = function(elements, nocheck){
	elements = elements || [];
	var l = elements.length;
	if (nocheck || !l) return $extend(elements, this);
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
	Returns the Element passed in with all the Element prototypes applied.

Syntax:
	>var myEl = $(el);

Arguments:
	el - (mixed) A string containing the id of the DOM Element desired or a reference to an actual DOM Element.

Example:
	(start code)
	>$('myElement') // gets a DOM Element by id with all the Element prototypes applied.
	>var div = document.getElementById('myElement');
	>$(div) //returns an Element also with all the mootools extensions applied.

	You'll use this when you aren't sure if a variable is an actual Element or an id, as
	well as just shorthand for document.getElementById().
	(end)

Returns:
	a DOM Element or false (if no id was found).

Note:
	 - While the $ function needs to be called only once on an Element in order to get all the prototypes, extended Elements can be passed to this function multiple times without ill effects.
	 - Any Element whose tags are considered "bad" will not be extended. See: <Element.$badTags>
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

document.getElementsBySelector = document.getElementsByTagName;

/*
Function: $$
	Selects, and extends DOM Elements. Elements arrays returned with $$ will also accept all the <Element> methods.
	The return type of Element methods run through $$ is always an array. If the return array is only made by Elements,
	$$ will be applied automatically.

Syntax:
	>var elements = $$(selector, [selector2[, selector3[, ...]]]);

Arguments:
	HTML Collections, arrays of Elements, arrays of strings as Element ids, Elements, strings as selectors.
	Any number of the above as arguments are accepted.

Note:
	If you load <Element.Selectors.js>, $$ will also accept CSS Selectors, otherwise the only selectors supported are tag names.

Example:
	(start code)
	$$('a'); //returns an array of all anchor tags on the page.

	$$('a', 'b'); //returns an array of all anchor and bold tags on the page.

	$$('#myElement'); //returns an array containing only the Element with id = myElement (requires Element.Selectors.js).

	$$('#myElement a.myClass'); //returns an array of all anchor tags with the class "myClass" within the DOM Element with id "myElement" (requires Element.Selectors.js).
	(end)

	Returns a collection of the Element referenced as myelement, the Element referenced as myelement2, all of the anchor tags on the page, the Element with the id 'myid', followed by the Elements with the ids of 'myid2' and 'myid3', and finally all the div Elements on the page. NOTE: If an Element is not found, nothing will be included into the array (not even *null*).
	(start code)
	$$(myelement, myelement2, 'a', ['myid', myid2, 'myid3'], document.getElementsByTagName('div'));
	(end)

Returns:
	(array) An array of all the dom Elements matched with all its items extended with <$>.  Returns as <Elements>.
*/

function $$(){
	var elements = [];
	for (var i = 0, j = arguments.length; i < j; i++){
		var selector = arguments[i];
		switch ($type(selector)){
			case 'element': elements.push(selector); break;
			case false: case null: break;
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
		var items = [];
		var elements = true;
		for (var i = 0, j = this.length; i < j; i++){
			var returns = this[i][property].apply(this[i], arguments);
			items.push(returns);
			if (elements) elements = ($type(returns) == 'element');
		}
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
	Custom class to allow all of its methods to be used with any DOM Element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: getElement
		Searches all descendents for the first Element whose tag matches the tag provided. getElement method will also automatically extend the Element.

	Syntax:
		>var element = myElement.getElement(tag);

	Arguments:
		tag - (string) String of the tag to match.

	Returns:
		(mixed) If found returns an extended Element, else returns null.

	Example:
		(start code)
		var body = $(document.body);
		var firstDiv = body.getElement('div');
		// or
		var firstDiv = $(document.body).getElement('div');
		(end)

	Note:
		This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElement so that it maches with CSS selectors.
	*/

	getElement: function(tag){
		return $(this.getElementsByTagName(tag)[0] || null);
	},

	/*
	Property: getElements
		Searches and returns all descendant Elements that match the tag provided.

	Syntax:
		>var elements = myElement.getElements(tag);

	Arguments:
		tag - (string) String of the tag to match.

	Returns:
		(array) An array of all matched Elements. If none of the descendants matched the tag, will return an empty array.

	Example:
		(start code)
		var body = $(document.body);
		var allAnchors = body.getElements('a');
		// or
		var allAnchors = $(document.body).getElement('a');
		(end)

	Note:
		This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElements so that it maches with CSS selectors.
	*/

	getElements: function(tag){
		return $$(this.getElementsByTagName(tag));
	},

	/*
	Property: set
		With this method you can set events, styles and properties to the Element (same as calling new Element with the second paramater).

	Syntax:
		>myElement.set(props);

	Arguments:
		props - (object) An object with various properties used to modify the current Element. Keyword properties are: 'styles' and 'events' all other are considered properties. See also: new <Element>

	Returns:
		(element) This Element.

	Example:
		(start code)
		var body = $(document.body);
		body.set({
			'styles': { // property styles passes the object to <Element.setStyles>
				'font': '12px Arial',
				'color': 'blue'
			},
			'events': { // property events passes the object to <Element.addEvents>
				'click': function(){ alert('click'); },
				'scroll': function(){
			},
			'id': 'documentBody' //any other property uses setProperty
		});
		(end)

	See Also:
		<Element>, <Element.setStyles>, <Element.addEvents>, <Element.setProperty>
	*/
	set: function(props){
		for (var prop in props){
			if (Element.Setters[prop]) Element.Setters[prop].call(this, props[prop]);
			else this.setProperty(prop, props[prop]);
		}
		return this;
	},

	/*
	Property: inject
		Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the paramter).

	Syntax:
		>myElement.inject(el[, where]);

	Arguments:
		el    - (mixed) el can be: the string of the id of the Element or an Element.
		where - (string, optional) The place to inject this Element to (defaults to the bottom of the el's child nodes).

	Returns:
		(element) This Element.

	Example:
		(start code)
		var myDiv = new Element('div', {id: 'mydiv'});
		myDiv.inject(document.body);
		// or inline
		var myDiv = new Element('div', {id: 'mydiv'}).inject(document.body);

		new Element('a').inject('mydiv'); // is also valid since myDiv is now inside the body
		(end)

	See Also:
		<Element.adopt>
	*/

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
		Inserts the Element before the passed Element.

	Syntax:
		>myElement.injectBefore(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected before.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

		(start code)
		$('mySecondElement').injectBefore('myElement');
		(end)

		Result
		(start html)
		<div id="mySecondElement"></div>
		<div id="myElement"></div>
		(end)

	See Also:
		<Element.inject>
	*/

	injectBefore: function(el){
		return this.inject(el, 'before');
	},

	/*
	Property: injectAfter
		Inserts the Element after the passed Element.

	Syntax:
		>myElement.injectAfter(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected after.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="mySecondElement"></div>
		<div id="myElement"></div>
		(end)

		(start code)
		$('mySecondElement').injectBefore('myElement');
		(end)

		Result
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

	See Also:
		<Element.inject>, <Element.injectBefore>
	*/

	injectAfter: function(el){
		return this.inject(el, 'after');
	},

	/*
	Property: injectInside
		Injects the Element inside and at the end of the child nodes of the passed in Element.

	Syntax:
		>myElement.injectInside(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected inside.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

		(start code)
		$('mySecondElement').injectInside('myElement');
		(end)

		Result
		(start html)
		<div id="myElement">
			<div id="mySecondElement"></div>
		</div>
		(end)

	See Also:
		<Element.inject>
	*/

	injectInside: function(el){
		return this.inject(el, 'bottom');
	},

	/*
	Property: injectTop
		Same as <Element.injectInside>, but inserts the Element inside, at the top.

	Syntax:
		>myElement.injectTop(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected top.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement">
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		</div>
		<div id="myFourthElement"></div>
		(end)

		(start code)
		$('myFourthElement').injectTop('myElement');
		(end)

		Result
		(start html)
		<div id="myElement">
			<div id="myFourthElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		</div>
		(end)

	See Also:
		<Element.inject>
	*/

	injectTop: function(el){
		return this.inject(el, 'top');
	},

	/*
	Property: adopt
		Inserts the passed Elements inside the Element.

	Syntax:
		>myElement.adopt(el[, el2[, ...]]);

	Arguments:
		Accepts Elements references, Element ids as string, selectors ($$('stuff')) / array of Elements, array of ids as strings and collections.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		<div id="myThirdElement"></div>
		<div id="myFourthElement"></div>
		(end)

		(start code)
		$('myElement').adopt('mySecondElement', 'myThirdElement', 'myFourthElement');
		(end)

		Result
		(start html)
		<div id="myElement">
			<div id="myFourthElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		</div>
		(end)

	See Also:
		<Element.inject>
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

	Syntax:
		>var removedElement = myElement.remove();

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

		(start code)
		$('myElement').remove() //bye bye
		(end)

		Results
		(start html)
		<div id="mySecondElement"></div>
		(end)

	Note:
		For <Elements> this method is named removeElements, because <Array.remove> has priority.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.removeChild>
	*/

	remove: function(){
		return this.parentNode.removeChild(this);
	},

	/*
	Property: clone
		Clones the Element and returns the cloned one.

	Syntax:
		>var copy = myElement.clone([contents]);

	Arguments:
		contents - (boolean, optional) When true the Element is cloned with childNodes, default true

	Returns:
		(element) The cloned Element without Events.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		(end)

		(start code)
		var clone = $('myElement').clone().injectAfter('myElement'); //clones the Element and append the clone after the Element.
		(end)

		Results:
		(start html)
		<div id="myElement"></div>
		<div id=""></div>
		(end)

	Note:
		The returned Element does not have an attached events. To clone the events use <Element.cloneEvents>.

	See Also:
		<Element.cloneEvents>
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
		Replaces the Element with an Element passed.

	Syntax:
		>var replacingElement = myElement.replaceWidth(el);

	Arguments:
		el - (mixed) A string id representing the Element to be injected in, or an Element reference. In addition, if you pass div or another tag, the Element will be created.

	Returns:
		(element) The passed in Element.

	Example:
		>$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.replaceChild>
	*/

	replaceWith: function(el){
		el = $(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},

	/*
	Property: appendText
		Appends text node to a DOM Element.

	Syntax:
		>myElement.appendText(text);

	Arguments:
		text - (string) The text to append.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement">hey</div>
		(end)

		(start code)
		$('myElement').appendText(' howdy'); //myElement innerHTML is now "hey howdy"
		(end)

		(start html)
		<div id="myElement">hey howdy</div>
		(end)
	*/

	appendText: function(text){
		this.appendChild(document.createTextNode(text));
		return this;
	},

	/*
	Property: hasClass
		Tests the Element to see if it has the passed in className.

	Syntax:
		>var result = myElement.hasClass(className);

	Arguments:
		className - (string) The class name to test.

	Returns:
		(boolean) Returns true if the Element has the class, otherwise false.

	Example:
		(start html)
		<div id="myElement" class="testClass"></div>
		(end)

		(start code)
		$('myElement').hasClass('testClass'); //returns true
		(end)
	*/

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	/*
	Property: addClass
		Adds the passed in class to the Element, if the Element doesnt already have it.

	Syntax:
		>myElement.addClass(className);

	Arguments:
		className - (string) The class name to add.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement" class="testClass"></div>
		(end)

		(start code)
		$('myElement').addClass('newClass');
		(end)

		Result
		(start html)
		<div id="myElement" class="testClass newClass"></div>
		(end)
	*/

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	/*
	Property: removeClass
		Works like <Element.addClass>, but removes the class from the Element.

	Syntax:
		>myElement.removeClass(className);

	Arguments:
		className - (string) The class name to remove.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement" class="testClass newClass"></div>
		(end)

		(start code)
		$('myElement').removeClass('newClass');
		(end)

		Result
		(start html)
		<div id="myElement" class="testClass"></div>
		(end)
	*/

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1').clean();
		return this;
	},

	/*
	Property: toggleClass
		Adds or removes the passed in class name to the Element, depending on if it's present or not.

	Syntax:
		>myElement.toggleClass(className);

	Arguments:
		className - (string) The class to add or remove.

	Returns:
		(element) This Element.

	Example:
		(start html)
		<div id="myElement" class="myClass"></div>
		(end)

		(start code)
		$('myElement').toggleClass('myClass');
		(end)

		Results
		(start html)
		<div id="myElement" class=""></div>
		(end)

		(start code)
		$('myElement').toggleClass('myClass');
		(end)

		Results
		(start html)
		<div id="myElement" class="myClass"></div>
		(end)
	*/

	toggleClass: function(className){
		return this[this.hasClass(className) ? 'removeClass' : 'addClass'](className);
	},

	walk: function(brother, start){
		brother += 'Sibling';
		var el = (start) ? this[start] : this[brother];
		while (el && $type(el) != 'element') el = el[brother];
		return $(el);
	},

	/*
	Property: getPrevious
		Returns the previousSibling of the Element (excluding text nodes).

	Syntax:
		>var previousSibling = myElement.getPrevious();

	Returns:
		(mixed) The previous sibling Element, or returns null if none found.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

		(start code)
		$('mySecondElement').getPrevious().remove(); //get the previous DOM Element from mySecondElement and removes.
		(end)

		Result
		(start html)
		<div id="mySecondElement"></div>
		(end)

		See Also:
			<Element.remove>
	*/

	getPrevious: function(){
		return this.walk('previous');
	},

	/*
	Property: getNext
		Works as Element.getPrevious, but tries to find the nextSibling (excluding text nodes).

	Syntax:
		>var nextSibling = myElement.getNext();

	Returns:
		(mixed) The next sibling Element, or returns null if none found.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		(end)

		(start code)
		$('myElement').getNext().addClass('found'); //get the next DOM Element from myElement and adds class 'found'.
		(end)

		Result
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement" class="found"></div>
		(end)

	See Also:
		<Element.addClass>
	*/

	getNext: function(){
		return this.walk('next');
	},

	/*
	Property: getFirst
		Works as <Element.getPrevious>, but tries to find the firstChild (excluding text nodes).

	Syntax:
		>var firstElement = myElement.getFirst();

	Returns:
		(mixed) The first sibling Element, or returns null if none found.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		<div id="myThirdElement"></div>
		(end)

		(start code)
		$('myThirdElement').getFirst().inject('mySecondElement'); //gets the first DOM Element from myThirdElement and injects inside mySecondElement.
		(end)

		Result
		(start html)
		<div id="mySecondElement">
			<div id="myElement"></div>
		</div>
		<div id="myThirdElement"></div>
		(end)

	See Also:
		<Element.inject>
	*/

	getFirst: function(){
		return this.walk('next', 'firstChild');
	},

	/*
	Property: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.

	Syntax:
		>var lastElement = myElement.getLast();

	Returns:
		(mixed) The first sibling Element, or returns null if none found.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		<div id="mySecondElement"></div>
		<div id="myThirdElement"></div>
		(end)

		(start code)
		$('myElement').getLast().adopt('mySecondElement'); //gets the last DOM Element from myElement and adopts mySecondElement.
		(end)

		Result
		(start html)
		<div id="myElement"></div>
		<div id="myThirdElement">
			<div id="mySecondElement"></div>
		</div>
		(end)

	Note:
		For <Elements> this method is named getLastElements, because <Array.getLast> has priority.

	See Also:
		<Element.adopt>
	*/

	getLast: function(){
		return this.walk('previous', 'lastChild');
	},

	/*
	Property: getParent
		Returns the parent node extended.

	Syntax:
		>var parent = myElement.getParent();

	Returns:
		(element) This Element's parent.

	Example:
		HTML
		(start html)
		<div id="myElement">
			<div id="mySecondElement"></div>
		</div>
		(end)

		(start code)
		$('mySecondElement').getParent().addClass('papa');
		(end)

		Result
		(start html)
		<div id="myElement" class="papa">
			<div id="mySecondElement"></div>
		</div>

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.parentNode>
	*/

	getParent: function(){
		return $(this.parentNode);
	},

	/*
	Property: getChildren
		Returns all the Element's children (excluding text nodes). Returns as <Elements>.

	Syntax:
		>var children = myElement.getChildren();

	Returns:
		(array) A <Elements> array with all of the Element's children except the text nodes.

	Example:
		HTML
		(start html)
		<div id="myElement">
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		</div>
		(end)

		(start code)
		$('myElement').getChildren().removeElements(); // notice how <Element.remove> is renamed removeElements due to Array precedence.
		(end)

		Result
		(start html)
		<div id="myElement"></div>
		(end)

	See Also:
		<Elements>, <Elements.remove>
	*/

	getChildren: function(){
		return $$(this.childNodes);
	},

	/*
	Property: hasChild
		Checks all children (including text nodes) for a match.

	Syntax:
		>var result = myElement.hasChild(el);

	Arguments:
		el - (mixed) Can be a Element reference or string id.

	Returns:
		(boolean) Returns true if the passed in Element is a child of the Element, otherwise false.

	Example:
		HTML
		(start html)
		<div id="Darth_Vader">
			<div id="Luke"></div>
		</div>
		(end)

		(start code)
		if($('Darth_Vader').hasChild('Luke')) alert('Luke, I am your father.'); // tan tan tannn.....
		(end)
	*/

	hasChild: function(el){
		return !!$A(this.getElementsByTagName('*')).contains(el);
	},

	/*
	Property: getProperty
		Gets the an attribute of the Element.

	Syntax:
		>myElement.getProperty(property);

	Arguments:
		property - (string) The attribute to retrieve.

	Returns:
		(mixed) The value of the property, or an empty string.

	Example:
		HTML
		(start html)
		<img id="myImage" src="mootools.png" />
		(end)

		(start code)
		$('myImage').getProperty('src') // returns mootools.png
		(end)
	*/

	getProperty: function(property){
		var index = Element.$attributes[property];
		if (index) return this[index];
		var flag = Element.$attributesIFlag[property] || 0;
		if (!Client.Engine.ie || flag) return this.getAttribute(property, flag);
		var node = (this.attributes) ? this.attributes[property] : null;
		return (node) ? node.nodeValue : null;
	},

	/*
	Property: removeProperty
		Removes an attribute from the Element.

	Syntax:
		>myElement.removeProperty(property);

	Arguments:
		property - (string) The attribute to remove.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<a id="myAnchor" href="#" onmousedown="alert('click');"></a>
		(end)

		(start code)
		$('myAnchor').removeProperty('onmousedown'); //eww inline javascript is bad! Let's get rid of it.
		(end)

		Result
		(start html)
		<a id="myAnchor" href="#"></a>
		(end)
	*/

	removeProperty: function(property){
		var index = Element.$attributes[property];
		if (index) this[index] = '';
		else this.removeAttribute(property);
		return this;
	},

	/*
	Property: getProperties
		Same as <Element.getStyles>, but for properties.

	Syntax:
		>var myProps = myElement.getProperties();

	Returns:
		(object) An object containing all of the Element's properties.

	Example:
		HTML
		(start html)
		<img id="myImage" src="mootools.png" title="MooTools, the compact JavaScript framework" alt="" />
		(end)

		(start code)
		var imgProps = $('myImage').getProperties(); // returns: { id: 'myImage', src: 'mootools.png', title: 'MooTools, the compact JavaScript framework', alt: '' }
		(end)

	See Also:
		<Element.getProperty>
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
		property - (string) The property to assign the value passed in.
		value - (mixed) The value to assign to the property passed in.

	Return:
		(element) - This Element.

	Example:
		HTML
		(start html)
		<img id="myImage" />
		(end)

		(start code)
		$('myImage').setProperty('src', 'mootools.png');
		(end)

		Result
		(start html)
		<img id="myImage" src="mootools.png" />
		(end)
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
		properties - (object) An object with key/value pairs.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<img id="myImage" />
		(end)

		(start code)
		$('myImage').setProperties({
			src: 'whatever.gif',
			alt: 'whatever dude'
		});
		(end)

		Result
		(start html)
		<img id="myImage" src="whatever.gif" alt="whatever dude" />
		(end)
	*/

	setProperties: function(properties){
		for (var property in properties) this.setProperty(property, properties[property]);
		return this;
	},

	/*
	Property: setHTML
		Sets the innerHTML of the Element.

	Syntax:
		>myElement.setHTML([htmlString[, htmlString2[, htmlString3[, ..]]]);

	Arguments:
		Any number of string paramters with html.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		(end)

		(start code)
		$('myElement').setHTML('<div></div>', '<p></p>');
		(end)

		Result
		(start html)
		<div id="myElement">
			<div></div>
			<p></p>
		</div>

	Note:
		Any Elements added with setHTML will not be <Garbage> collected. This may be a source of memory leak.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.innerHTML>
	*/

	setHTML: function(){
		this.innerHTML = Array.join(arguments, '');
		return this;
	},

	/*
	Property: setText
		Sets the inner text of the Element.

	Syntax:
		>myElement.setText(text);

	Arguments:
		text - (string) The new text content for the Element.

	Returns:
		(element) This Element.

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		(end)

		(start code)
		$('myElement').setText('some text') //the text of myElement is now = 'some text'
		(end)

		(start html)
		<div id="myElement">some text</div>
		(end)
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

	Syntax:
		>var myText = myElement.getText();

	Returns:
		(string) The text of the Element.

	Example:
		HTML
		(start html)
		<div id="myElement">my text</div>
		(end)

		(start code)
		var myText = $('myElement').getText(); //myText = 'my text';
		(end)
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
		return $pick(this.innerText, this.textContent);
	},

	/*
	Property: getTag
		Returns the tagName of the Element in lower case.

	Syntax:
		>var myTag = myElement.getTag();

	Returns:
		(string) The tag name in lower case

	Example:
		HTML
		(start html)
		<img id="myImage" />
		(end)

		(start code)
		var myTag = $('myImage').getTag() // myTag = 'img';
		(end)

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.tagName>
	*/

	getTag: function(){
		return this.tagName.toLowerCase();
	},

	/*
	Property: empty
		Empties an Element of all its children.

	Syntax:
		>myElement.empty();

	Returns:
		(element) This Element..

	Example:
		HTML
		(start html)
		<div id="myElement">
			<p></p>
			<span></span>
		</div>
		(end)

		(start code)
		$('myElement').empty() // empties the Div and returns it
		(end)

		Result
		(start html)
		<div id="myElement"></div>
		(end)
	*/

	empty: function(){
		Garbage.trash(this.getElementsByTagName('*'));
		return this.setHTML('');
	},

	/*
	Property: destroy
		Empties an Element of all its children, removes and garbages the Element.

	Syntax:
		>myElement.destroy();

	Returns:
		(null)

	Example:
		HTML
		(start html)
		<div id="myElement"></div>
		(end)

		(start code)
		$('myElement').destroy() // the Element is no more.
		(end)

	See Also:
		<Element.empty>
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
		if (Client.Engine.ie){
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
