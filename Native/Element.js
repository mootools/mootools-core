/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.

Authors:
	- Valerio Proietti, <http://mad4milk.net>
	- Christophe Beyls, <http://digitalia.be>

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
		el - the tag name for the element you wish to create. you can also pass in an element reference, in which case it will be extended.
		props - an object, the properties you want to add to your element.
		
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

	initialize: function(el, props){
		if ($type(el) == 'string') el = document.createElement(el);
		el = $(el);
		if (!props || !el) return el;
		for (var prop in props){
			switch(prop){
				case 'styles': el.setStyles(props[prop]); break;
				case 'events': el.addEvents(props[prop]); break;
				case 'properties': el.setProperties(props[prop]); break;
				default: el.setProperty(prop, props[prop]);
			}
		}
		return el;
	}

});

/*
Section: Utility Functions

Function: $
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
	if (el.htmlElement) return Garbage.collect(el);
	if ([window, document].test(el)) return el;
	var type = $type(el);
	if (type == 'string'){
		el = document.getElementById(el);
		type = (el) ? 'element' : false;
	}
	if (type != 'element') return false;
	if (['object', 'embed'].test(el.tagName.toLowerCase())) return el;
	$extend(el, Element.prototype);
	el.htmlElement = true;
	return Garbage.collect(el);
};

//elements class

var Elements = new Class({});

$native(Elements);

document.getElementsBySelector = document.getElementsByTagName;

/*
Function: $$
	Selects, and extends DOM elements.

Arguments:
	HTMLCollection(document.getElementsByTagName, element.childNodes), an array of elements, a string.

Note:
	if you loaded <Dom.js>, $$ will also accept CSS Selectors.

Example:
	>$$('a') //an array of all anchor tags on the page
	>$$('a', 'b') //an array of all anchor and bold tags on the page
	>$$('#myElement') //array containing only the element with id = myElement. (only with <Dom.js>)
	>$$('#myElement a.myClass') //an array of all anchor tags with the class "myClass" within the DOM element with id "myElement" (only with <Dom.js>)

Returns:
	array - array of all the dom elements matched
*/

function $$(){
	if (!arguments) return false;
	var elements = [];
	for (var i = 0, j = arguments.length; i < j; i++){
		var selector = arguments[i];
		switch($type(selector)){
			case 'element': elements.include($(selector)); break;
			case 'string': selector = document.getElementsBySelector(selector, true);
			default:
				if (selector.length){
					for (var k = 0, l = selector.length; k < l; k++){
						var el = $(selector[k]);
						if (el) elements.include(el);
					}
				}
		}
	}
	return $extend(elements, new Elements);
};

Elements.Multi = function(property){
	return function(){
		var args = arguments;
		var items = [];
		var elements = true;
		$each(this, function(el){
			var returns = el[property].apply(el, args);
			if ($type(returns) != 'element') elements = false;
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

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	inject: function(el, where){
		el = $(el);
		switch(where){
			case "before": el.parentNode.insertBefore(this, el); break;
			case "after":
				var next = el.getNext();
				if (!next) el.parentNode.appendChild(this);
				else el.parentNode.insertBefore(this, next);
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

	adopt: function(){
		$each(arguments, function(el){
			this.appendChild($(el));
		}, this);
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
		return $(this.cloneNode(contents !== false));
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
		this.parentNode.replaceChild(el, this);
		return $(el);
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
		return this.className.test('(?:^|\\s)'+className+'(?:\\s|$)');
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
		this.className = this.className.replace(new RegExp('(^|\\s)'+className+'(?:\\s|$)'), '$1').clean();
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
		switch(property){
			case 'opacity': return this.setOpacity(parseFloat(value));
			case 'float': property = (window.ie) ? 'styleFloat' : 'cssFloat';
		}
		property = property.camelCase();
		switch($type(value)){
			case 'number': if (property != 'zIndex') value += 'px'; break;
			case 'array': value = 'rgb(' + value.join(',') + ')';
		}
		this.style[property] = value;
		return this;
	},

	/*
	Property: setStyles
		Applies a collection of styles to the Element.

	Arguments:
		source - an object or string containing all the styles to apply. You cannot set the opacity using a string.

	Examples:
		>$('myElement').setStyles({
		>	border: '1px solid #000',
		>	width: '300px',
		>	height: '400px'
		>});

		OR

		>$('myElement').setStyles('border: 1px solid #000; width: 300px; height: 400px;');
	*/

	setStyles: function(source){
		switch($type(source)){
			case 'object':
				for (var property in source) this.setStyle(property, source[property]);
				break;
			case 'string': this.style.cssText = source;
		}
		return this;
	},

	/*
	Property: setOpacity
		Sets the opacity of the Element, and sets also visibility == "hidden" if opacity == 0, and visibility = "visible" if opacity > 0.

	Arguments:
		opacity - Accepts numbers from 0 to 1.

	Example:
		>$('myElement').setOpacity(0.5) //make it 50% transparent
	*/

	setOpacity: function(opacity){
		if (opacity == 0){
			if (this.style.visibility != "hidden") this.style.visibility = "hidden";
		} else {
			if (this.style.visibility != "visible") this.style.visibility = "visible";
		}
		if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
		if (window.ie) this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
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
		var style = this.style[property];
		if (!$chk(style)){
			if (property == 'opacity') return $chk(this.opacity) ? this.opacity : 1;
			if (['margin', 'padding'].test(property)){
				var result = [];
				['top', 'right', 'bottom', 'left'].each(function(prop){
					result.push(this.getStyle(property + '-' + prop) || '0');
				}, this);
				var every = result.every(function(val){
					return val == result[0];
				});
				return (every) ? result[0] : result;
			}
			if (document.defaultView) style = document.defaultView.getComputedStyle(this, null).getPropertyValue(property.hyphenate());
			else if (this.currentStyle) style = this.currentStyle[property];
		}
		if (style == 'auto' && ['height', 'width'].test(property)) return this['offset'+property.capitalize()] + 'px';
		return (style && property.test(/color/i) && style.test(/rgb/)) ? style.rgbToHex() : style;
	},

	/*
	Property: getStyles
		Returns an object of styles of the Element for each argument passed in.
		Arguments:
		properties - any number of style properties
	Example:
		>$('myElement').getStyles('width','height','padding');
		>//returns an object like:
		>{width: "10px", height: "10px", padding: "10px 0px 10px 0px"}
	*/

	getStyles: function(){
		var result = {};
		$each(arguments, function(argument){
			result[argument] = this.getStyle(argument);
		}, this);
		return result;
	},

	walk: function(brother, start){
		brother += 'Sibling';
		var el = (start) ? this[start] : this[brother];
		while ($type(el) == 'whitespace') el = el[brother];
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
	
	hasChild: function(el) {
		return ($A(this.getElementsByTagName('*')).test(el)) ? true : false;
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
		switch(property){
			case 'class': this.className = value; break;
			case 'style': this.setStyles(value); break;
			case 'name': 
				if (window.ie6){
					var el = new Element('<' + this.getTag() + ' name="' + value + '" />');
					['value', 'id', 'className', 'style'].each(function(attribute){
						el[attribute] = this[attribute];
					});
					if (this.parentNode) this.replaceWith(el);
					return el;
				}
			default: this.setAttribute(property, value);
		}
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

	setHTML: function(){
		this.innerHTML = $A(arguments).join('');
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
	Property: getValue
		Returns the value of the Element, if its tag is textarea, select or input. getValue called on a multiple select will return an array.
	*/

	getValue: function(){
		switch(this.getTag()){
			case 'select':
				var values = [];
				$each(this.options, function(opt){
					if (opt.selected) values.push((opt.value !== null) ? opt.value : opt.text);
				});
				return (this.multiple) ? values : values[0];
			case 'input': if (!(this.checked && ['checkbox', 'radio'].test(this.type)) && !['hidden', 'text', 'password'].test(this.type)) break;
			case 'textarea': return this.value;
		}
		return false;
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
	Property: getPosition
		Returns the real offsets of the element.

	Example:
		>$('element').getPosition();

	Returns:
		>{x: 100, y:500};
	*/

	getPosition: function(overflown){
		overflown = overflown || [];
		var el = this, left = 0, top = 0;
		do {
			left += el.offsetLeft || 0;
			top += el.offsetTop || 0;
			el = el.offsetParent;
		} while (el);
		overflown.each(function(element){
			left -= element.scrollLeft || 0;
			top -= element.scrollTop || 0;
		});
		return {'x': left, 'y': top};
	},

	/*
	Property: getTop
		Returns the distance from the top of the window to the Element.
	*/

	getTop: function(){
		return this.getPosition().y;
	},

	/*
	Property: getLeft
		Returns the distance from the left of the window to the Element.
	*/

	getLeft: function(){
		return this.getPosition().x;
	},
	/*
	Property: getCoordinates
		Returns an object with width, height, left, right, top, and bottom, representing the values of the Element

	Example:
		(start code)
		var myValues = $('myElement').getCoordinates();
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

	getCoordinates: function(overflown){
		var position = this.getPosition(overflown);
		var obj = {
			'width': this.offsetWidth,
			'height': this.offsetHeight,
			'left': position.x,
			'top': position.y
		};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}

});

Element.eventMethods = {

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
		this.events[type] = this.events[type] || {'keys': [], 'values': []};
		if (!this.events[type].keys.test(fn)){
			this.events[type].keys.push(fn);
			if (this.addEventListener){
				this.addEventListener((type == 'mousewheel' && window.gecko) ? 'DOMMouseScroll' : type, fn, false);
			} else {
				fn = fn.bind(this);
				this.attachEvent('on'+type, fn);
				this.events[type].values.push(fn);
			}
		}
		return this;
	},

	addEvents: function(source){
		for (var type in source) this.addEvent(type, source[type]);
		return this;
	},

	/*
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.
	*/

	removeEvent: function(type, fn){
		if (this.events && this.events[type]){
			var pos = this.events[type].keys.indexOf(fn);
			if (pos == -1) return this;
			var key = this.events[type].keys.splice(pos,1)[0];
			if (this.removeEventListener){
				this.removeEventListener((type == 'mousewheel' && window.gecko) ? 'DOMMouseScroll' : type, key, false);
			} else {
				this.detachEvent('on'+type, this.events[type].values.splice(pos,1)[0]);
			}
		}
		return this;
	},

	/*
	Property: removeEvents
		removes all events of a certain type from an element. if no argument is passed in, removes all events.
	*/

	removeEvents: function(type){
		if (this.events){
			if (type){
				if (this.events[type]){
					this.events[type].keys.each(function(fn){
						this.removeEvent(type, fn);
					}, this);
					this.events[type] = null;
				}
			} else {
				for (var evType in this.events) this.removeEvents(evType);
				this.events = null;
			}
		}
		return this;
	},

	/*
	Property: fireEvent
		executes all events of the specified type present in the element.
	*/

	fireEvent: function(type, args){
		if (this.events && this.events[type]){
			this.events[type].keys.each(function(fn){
				fn.bind(this, args)();
			}, this);
		}
	}

};

window.extend(Element.eventMethods);
document.extend(Element.eventMethods);
Element.extend(Element.eventMethods);

var Garbage = {

	elements: [],

	collect: function(el){
		if (!el.collected) Garbage.elements.push(el);
		el.collected = true;
		return el;
	},

	trash: function(){
		Garbage.collect(window);
		Garbage.collect(document);
		Garbage.elements.each(function(el){
			el.removeEvents();
			for (var p in Element.prototype) el[p] = null;
			el.htmlElement = null;
			el.collected = null;
		});
	}

};

window.addEvent('unload', Garbage.trash);