/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

var Element = new Class({

	/*
	Property: initialize
		Creates a new element of the type passed in.

	Arguments:
		el - the tag name for the element you wish to create.

	Example:
		>var div = new Element('div');
	*/

	initialize: function(el){
		if ($type(el) == 'string') el = document.createElement(el);
		return $(el);
	}

});

//htmlelement mapping

if (typeof HTMLElement == 'undefined'){
	var HTMLElement = Class.empty;
	HTMLElement.prototype = {};
}

/*
Function: $()
	returns the element passed in with all the Element prototypes applied.

Arguments:
	el - a reference to an actual element or a string representing the id of an element

Example:
	>$('myElement') // gets a DOM element by id with all the Element prototypes applied.
	>var div = document.getElementById('myElement');
	>$(div) //returns an Element also with all the mootools extentions applied.

	You'll use this when you aren't sure if a variable is an actual element or an id, as
	well as just shorthand for document.getElementById().

Returns:
	a DOM element or false (if no id was found).

Note:
	you need to call $ on an element only once to get all the prototypes.
	But its no harm to call it multiple times, as it will detect if it has been already extended.
*/

function $(el){
	if (!el) return false;
	if (el._element_extended_) return el;
	if ([window, document].test(el)) return el;
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) != 'element') return false;
	if (['object', 'embed'].test(el.tagName.toLowerCase())) return el;
	if (!el.extend){
		el._element_extended_ = true;
		Garbage.collect(el);
		el.extend = Object.extend;
		if (!(el instanceof HTMLElement)) el.extend(Element.prototype);
	}
	return el;
};

//elements class

var Elements = new Class({});

new Object.Native(Elements);

document.getElementsBySelector = document.getElementsByTagName;

/*
Function: $$(), $S()
	Selects, and extends DOM elements.

Arguments:
	HTMLCollection(document.getElementsByTagName, element.childNodes), an array of elements, a string.

Note:
	if you loaded <Dom.js>, $$ will also accept CSS Selectors.

Example:
	>$S('a') //an array of all anchor tags on the page
	>$S('a', 'b') //an array of all anchor and bold tags on the page
	>$S('#myElement') //array containing only the element with id = myElement. (only with <Dom.js>)
	>$S('#myElement a.myClass') //an array of all anchor tags with the class "myClass" within the DOM element with id "myElement" (only with <Dom.js>)

Returns:
	array - array of all the dom elements matched
*/

function $$(){
	if (!arguments) return false;
	if (arguments.length == 1 && arguments[0]._elements_extended_) return arguments[0];
	var items = [];
	var elements = [];
	$each(arguments, function(selector){
		if ($type(selector) == 'string') items.extend(document.getElementsBySelector(selector));
		else if ($type(selector) == 'element') items.push($(selector));
		else if (selector.length){
			$each(selector, function(sel){
				items.push(sel);
			});
		}
	});
	items.each(function(item){
		if ($(item)) elements.push(item);
	});
	elements._elements_extended_ = true;
	return Object.extend(elements, new Elements);
};

Elements.Multi = function(property){
	return function(){
		var args = arguments;
		var items = [];
		var elements = true;
		$each(this, function(el){
			var returns = el[property].apply(el, args);
			var type = $type(returns);
			if (type != 'element') elements = false;
			items.push(returns);
		});
		if (elements) items = $$(items);
		return items;
	};
};

Element.extend = function(properties){
	for (var property in properties){
		HTMLElement.prototype[property] = properties[property];
		Element.prototype[property] = properties[property];
		Elements.prototype[property] = Elements.Multi(property);
	}
};

Element.extend({

	inject: function(el, where){
		el = $(el) || new Element(el);
		switch (where){
			case "before": $(el.parentNode).insertBefore(this, el); break;
			case "after":
				if (!el.getNext()) $(el.parentNode).appendChild(this);
				else $(el.parentNode).insertBefore(this, el.getNext());
				break;
			case "inside": el.appendChild(this);
		}
		return this;
	},

	/*
	Property: injectBefore
		Inserts the Element before the passed element.

	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.

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
		return this.inject(el, 'inside');
	},

	/*
	Property: adopt
		Inserts the passed element inside the Element. Works as <Element.injectInside> but in reverse.

	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.
	*/

	adopt: function(el){
		this.appendChild($(el) || new Element(el));
		return this;
	},

	/*
	Property: remove
		Removes the Element from the DOM.

	Example:
		>$('myElement').remove() //bye bye
	*/

	remove: function(){
		this.parentNode.removeChild(this);
		return this;
	},

	/*
	Property: clone
		Clones the Element and returns the cloned one.

	Returns: 
		the cloned element

	Example:
		>var clone = $('myElement').clone().injectAfter('myElement');
		>//clones the Element and append the clone after the Element.
	*/

	clone: function(contents){
		var el = this.cloneNode(contents !== false);
		return $(el);
	},

	/*
	Property: replaceWith
		Replaces the Element with an element passed.

	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.

	Returns:
		the passed in element

	Example:
		>$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.
	*/

	replaceWith: function(el){
		el = $(el) || new Element(el);
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
		if (window.ie){
			switch(this.getTag()){
				case 'style': this.styleSheet.cssText = text; return this;
				case 'script': this.setProperty('text', text); return this;
			}
		}
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
		className - the class name to test.
	 
	Example:
		><div id="myElement" class="testClass"></div>
		>$('myElement').hasClass('testClass'); //returns true
	*/

	hasClass: function(className){
		return this.className.test('(?:^|\\s+)' + className + '(?:\\s+|$)');
	},

	/*
	Property: addClass
		Adds the passed in class to the Element, if the element doesnt already have it.

	Arguments:
		className - the class name to add

	Example: 
		><div id="myElement" class="testClass"></div>
		>$('myElement').addClass('newClass'); //<div id="myElement" class="testClass newClass"></div>
	*/

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className+' '+className).clean();
		return this;
	},

	/*
	Property: removeClass
		works like <Element.addClass>, but removes the class from the element.
	*/

	removeClass: function(className){
		if (this.hasClass(className)) this.className = this.className.replace(className, '').clean();
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

	/*
	Property: setStyle
		Sets a css property to the Element.

		Arguments:
			property - the property to set
			value - the value to which to set it

		Example:
			>$('myElement').setStyle('width', '300px'); //the width is now 300px
	*/

	setStyle: function(property, value){
		if (property == 'opacity') this.setOpacity(parseFloat(value));
		else this.style[property.camelCase()] = value;
		return this;
	},

	/*
	Property: setStyles
		Applies a collection of styles to the Element.

	Arguments:
		source - an object or string containing all the styles to apply

	Examples:
		>$('myElement').setStyles({
		>	border: '1px solid #000',
		>	width: '300px',
		>	height: '400px'
		>});

		OR

		>$('myElement').setStyle('border: 1px solid #000; width: 300px; height: 400px;');
	*/

	setStyles: function(source){
		switch ($type(source)){
			case 'object':
				for (var property in source) this.setStyle(property, source[property]);
				break;
			case 'string':
				if (window.ie) this.cssText = source;
				else this.setAttribute('style', source);
		}
		return this;
	},

	/*
	Property: setOpacity
		Sets the opacity of the Element, and sets also visibility == "hidden" if opacity == 0, and visibility = "visible" if opacity == 1.

	Arguments:
		opacity - Accepts numbers from 0 to 1.

	Example:
		>$('myElement').setOpacity(0.5) //make it 50% transparent
	*/

	setOpacity: function(opacity){
		if (opacity == 0){
			if(this.style.visibility != "hidden") this.style.visibility = "hidden";
		} else {
			if(this.style.visibility != "visible") this.style.visibility = "visible";
		}
		if (window.ie) this.style.filter = "alpha(opacity=" + opacity*100 + ")";
		this.style.opacity = this.opacity = opacity;
		return this;
	},

	/*
	Property: getStyle
		Returns the style of the Element given the property passed in.

	Arguments:
		property - the css style property you want to retrieve

	Example:
		>$('myElement').getStyle('width'); //returns "400px"
		>//but you can also use
		>$('myElement').getStyle('width').toInt(); //returns "400"

	Returns:
		the style as a string
	*/

	getStyle: function(property){
		property = property.camelCase();
		var style = this.style[property] || false;
		if (!$chk(style)){
			if (property == 'opacity') return (this.opacity != undefined) ? this.opacity : 1;
			if (['margin', 'padding'].test(property)){
				var top = this.getStyle(property+'-top') || 0; var right = this.getStyle(property+'-right') || 0;
				var bottom = this.getStyle(property+'-bottom') || 0; var left = this.getStyle(property+'-left') || 0;
				return top+' '+right+' '+bottom+' '+left;
			}
			if (document.defaultView) style = document.defaultView.getComputedStyle(this,null).getPropertyValue(property.hyphenate());
			else if (this.currentStyle) style = this.currentStyle[property];
		}
		return (style && property.test('color', 'i') && style.test('rgb')) ? style.rgbToHex() : style;
	},

	/*
	Property: addEvent
		Attaches an event listener to a DOM element.

	Arguments:
		type - the event to monitor ('click', 'load', etc) without the prefix 'on'.
		fn - the function to execute

	Example:
		>$('myElement').addEvent('click', function(){alert('clicked!')});
	*/

	addEvent: function(type, fn){
		this.events = this.events || {};
		this.events[type] = this.events[type] || {};
		if (this.events[type][fn]) return this;
		if (this.addEventListener){
			this.events[type][fn] = fn;
			var realType = type;
			if (type == 'mousewheel' && !window.khtml) realType = 'DOMMouseScroll';
			this.addEventListener(realType, this.events[type][fn], false);
		} else {
			var binded = fn.bind(this);
			this.events[type][fn] = binded;
			this.attachEvent('on'+type, this.events[type][fn]);
		}
		return this;
	},

	addEvents: function(source){
		if (!source) return this;
		for (var type in source) this.addEvent(type, source[type]);
		return this;
	},

	/*
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.
	*/

	removeEvent: function(type, fn){
		if (!this.events) return this;
		if (!this.events[type]) return this;
		if (!this.events[type][fn]) return this;
		if (this.removeEventListener){
			var realType = type;
			if (type == 'mousewheel' && !window.khtml) realType = 'DOMMouseScroll';
			this.removeEventListener(realType, this.events[type][fn], false);
		}
		else this.detachEvent('on'+type, this.events[type][fn]);
		this.events[type][fn] = null;
		return this;
	},

	/*
	Property: removeEvents
		removes all events of a certain type from an element. if no argument is passed in, removes all events.
	*/

	removeEvents: function(type){
		if (!this.events) return this;
		if (type){
			if (!this.events[type]) return this;
			for (var fn in this.events[type]) this.removeEvent(type, fn);
			this.events[type] = null;
		} else {
			for (var evType in this.events) this.removeEvents(evType);
			this.events = null;
		}
		return this;
	},

	/*
	Property: fireEvent
		executes all events of the specified type present in the element.
	*/

	fireEvent: function(type, args){
		if (!this.events || !this.events[type]) return;
		for (var fn in this.events[type]){
			if (this.events[type][fn]) this.events[type][fn].apply(this, args);
		}
	},

	getBrother: function(what){
		var el = this[what+'Sibling'];
		while ($type(el) == 'whitespace') el = el[what+'Sibling'];
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
		return this.getBrother('previous');
	},

	/*
	Property: getNext
		Works as Element.getPrevious, but tries to find the nextSibling.
	*/

	getNext: function(){
		return this.getBrother('next');
	},

	/*
	Property: getFirst
		Works as <Element.getPrevious>, but tries to find the firstChild.
	*/

	getFirst: function(){
		var el = this.firstChild;
		while ($type(el) == 'whitespace') el = el.nextSibling;
		return $(el);
	},

	/*
	Property: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.
	*/

	getLast: function(){
		var el = this.lastChild;
		while ($type(el) == 'whitespace') el = el.previousSibling;
		return $(el);
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
	Property: setProperty
		Sets an attribute for the Element.

	Arguments:
		property - the property to assign the value passed in
		value - the value to assign to the property passed in

	Example:
		>$('myImage').setProperty('src', 'whatever.gif'); //myImage now points to whatever.gif for its source
	*/

	setProperty: function(property, value){
		var el = false;
		switch (property){
			case 'class': this.className = value; break;
			case 'style': this.setStyles(value); break;
			case 'name': if (window.ie6){
				var el = $(document.createElement('<'+this.getTag()+' name="'+value+'" />'));
				$each(this.attributes, function(attribute){
					if (attribute.name != 'name') el.setProperty(attribute.name, attribute.value);
				});
				if (this.parentNode) this.replaceWith(el);
				break;
			};
			default: this.setAttribute(property, value);
		}
		return el || this;
	},

	/*
	Property: setProperties
		Sets numerous attributes for the Element.

	Arguments:
		source - an object with key/value pairs.

	Example:
		>$('myElement').setProperties({
		>	src: 'whatever.gif',
		>	alt: 'whatever dude'
		>});
		><img src="whatever.gif" alt="whatever dude">
	*/

	setProperties: function(source){
		for (var property in source) this.setProperty(property, source[property]);
		return this;
	},

	/*
	Property: setHTML
		Sets the innerHTML of the Element.

	Arguments:
		html - the new innerHTML for the element.

	Example:
		>$('myElement').setHTML(newHTML) //the innerHTML of myElement is now = newHTML
	*/

	setHTML: function(html){
		this.innerHTML = html;
		return this;
	},

	/*
	Property: getProperty
		Gets the an attribute of the Element.

	Arguments:
		property - the attribute to retrieve

	Example:
		>$('myImage').getProperty('src') // returns whatever.gif

	Returns:
		the value, or an empty string
	*/

	getProperty: function(property){
		return (property == 'class') ? this.className : this.getAttribute(property);
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

	getOffsets: function(){
		var el = this, offsetLeft = 0, offsetTop = 0;
		do {
			offsetLeft += el.offsetLeft || 0;
			offsetTop += el.offsetTop || 0;
			el = el.offsetParent;
		} while (el);
		return {'x': offsetLeft, 'y': offsetTop};
	},

	/*
	Property: scrollTo
		scrolls the element to the specified coordinated (if the element has an overflow)

	Arguments:
		x - the x coordinate
		y - the y coordinate

	Example:
		>$('myElement').scrollTo(0, 100)
	*/

	scrollTo: function(x, y){
		this.scrollLeft = x;
		this.scrollTop = y;
	},

	/*
	Property: getSize
		return an Object representing the size/scroll values of the element.

	Example:
		(start code)
		$('myElement').getSize();
		(end)

	Returns:
		(start code)
		{
			'scroll': {'x': 100, 'y': 100},
			'size': {'x': 200, 'y': 400},
			'scrollSize': {'x': 300, 'y': 500}
		}
		(end)
	*/

	getSize: function(){
		return {
			'scroll': {'x': this.scrollLeft, 'y': this.scrollTop},
			'size': {'x': this.offsetWidth, 'y': this.offsetHeight},
			'scrollSize': {'x': this.scrollWidth, 'y': this.scrollHeight}
		};
	},

	/*
	Property: getTop
		Returns the distance from the top of the window to the Element.
	*/

	getTop: function(){
		return this.getOffsets().y;
	},

	/*
	Property: getLeft
		Returns the distance from the left of the window to the Element.
	*/

	getLeft: function(){
		return this.getOffsets().x;
	},

	/*
	Property: getPosition
		Returns an object with width, height, left, right, top, and bottom, representing the values of the Element

	Example:
		(start code)
		var myValues = $('myElement').getPosition();
		(end)

	Returns:
		(start code)
		{
			width: 200,
			height: 300,
			left: 100,
			top: 50,
			right: 300,
			bottom: 350
		}
		(end)
	*/

	getPosition: function(){
		var obj = {}, offs = this.getOffsets();
		obj.width = this.offsetWidth; obj.height = this.offsetHeight;
		obj.left = offs.x; obj.top = offs.y;
		obj.right = obj.left + obj.width; obj.bottom = obj.top + obj.height;
		return obj;
	},

	/*
	Property: getValue
		Returns the value of the Element, if its tag is textarea, select or input. no multiple select support.
	*/

	getValue: function(){
		switch (this.getTag()){
			case 'select': if (this.selectedIndex != -1) return this.options[this.selectedIndex].value; break;
			case 'input': if ((this.checked && ['checkbox', 'radio'].test(this.type)) || ['hidden', 'text', 'password'].test(this.type)) 
				return this.value; break;
			case 'textarea': return this.value;
		}
		return false;
	}

});

/* Section: Utility Functions */

/*
Function: $Element
	Applies a method with the passed in args to the passed in element. Useful if you dont want to extend the element

	Arguments:
		el - the element
		method - a string representing the Element Class method to execute on that element
		args - an array representing the arguments to pass to that method

	Example:
		>$Element(el, 'hasClass', className) //true or false
*/

function $Element(el, method, args){
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) != 'element') return false;
	if (!args) args = [];
	else if ($type(args) != 'array') args = [args];
	return Element.prototype[method].apply(el, args);
};

/* Section: Browser Detection */

/*
Properties:
	window.ie - will be set to true if the current browser is internet explorer (any).
	window.ie6 - will be set to true if the current browser is internet explorer 6.
	window.ie7 - will be set to true if the current browser is internet explorer 7.
	window.khtml - will be set to true if the current browser is Safari/Konqueror.
*/

if (window.ActiveXObject) window.ie = window[window.XMLHttpRequest ? 'ie7' : 'ie6'] = true;
else if (document.childNodes && !document.all && !navigator.taintEnabled) window.khtml = true;

var Window = window;

window.addEvent = document.addEvent = Element.prototype.addEvent;
window.removeEvent = document.removeEvent = Element.prototype.removeEvent;

var Garbage = {

	elements: [],

	collect: function(element){
		Garbage.elements.push(element);
	},

	trash: function(){
		window.removeEvent('unload', Garbage.trash);
		Garbage.elements.each(function(el){
			el.removeEvents();
			for (var p in Element.prototype){
				HTMLElement[p] = null;
				window[p] = null;
				document[p] = null;
				el[p] = null;
			}
			el.extend = null;
		});
	}

};

window.addEvent('unload', Garbage.trash);