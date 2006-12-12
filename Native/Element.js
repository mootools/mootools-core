/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.
	
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>

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
	},

	inject: function(el, where){
		el = $(el) || new Element(el);
		switch(where){
			case "before": $(el.parentNode).insertBefore(this, el); break;
			case "after": {
					if (!el.getNext()) $(el.parentNode).appendChild(this);
					else $(el.parentNode).insertBefore(this, el.getNext());
			} break;
			case "inside": el.appendChild(this); break;
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
		>resulting html
		><div id="myElement"></div>
		><div id="mySecondElement"></div>

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
		return $(this.cloneNode(contents || true));
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
		var el = $(el) || new Element(el);
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
		if (this.getTag() == 'style' && window.ActiveXObject) this.styleSheet.cssText = text;
		else this.appendChild(document.createTextNode(text));
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
		return !!this.className.test("\\b"+className+"\\b");
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
		if (!this.hasClass(className)) this.className = (this.className+' '+className.trim()).clean();
		return this;
	},
	
	/*	
	Property: removeClass
		works like <Element.addClass>, but removes the class from the element.
	*/

	removeClass: function(className){
		if (this.hasClass(className)) this.className = this.className.replace(className.trim(), '').clean();
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
		if (this.hasClass(className)) return this.removeClass(className);
		else return this.addClass(className);
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
		if ($type(source) == 'object') {
			for (var property in source) this.setStyle(property, source[property]);
		} else if ($type(source) == 'string') {
			if (window.ActiveXObject) this.cssText = source;
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
		if (window.ActiveXObject) this.style.filter = "alpha(opacity=" + opacity*100 + ")";
		this.style.opacity = opacity;
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
		var proPerty = property.camelCase();
		var style = this.style[proPerty] || false;
		if (!style) {
			if (document.defaultView) style = document.defaultView.getComputedStyle(this,null).getPropertyValue(property);
			else if (this.currentStyle) style = this.currentStyle[proPerty];
		}
		if (style && ['color', 'backgroundColor', 'borderColor'].test(proPerty) && style.test('rgb')) style = style.rgbToHex();
		return style;
	},

	/*	
	Property: addEvent
		Attaches an event listener to a DOM element.
		
	Arguments:
		action - the event to monitor ('click', 'load', etc)
		fn - the function to execute
		
	Example:
		>$('myElement').addEvent('click', function(){alert('clicked!')});
	*/

	addEvent: function(action, fn){
		this[action+fn] = fn.bind(this);
		if (this.addEventListener) this.addEventListener(action, fn, false);
		else this.attachEvent('on'+action, this[action+fn]);
		var el = this;
		if (this != window) Unload.functions.push(function(){
			el.removeEvent(action, fn);
			el[action+fn] = null;
		});
		return this;
	},
	
	/*	
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.
	*/
	
	removeEvent: function(action, fn){
		if (this.removeEventListener) this.removeEventListener(action, fn, false);
		else this.detachEvent('on'+action, this[action+fn]);
		return this;
	},

	getBrother: function(what){
		var el = this[what+'Sibling'];
		while ($type(el) == 'textnode') el = el[what+'Sibling'];
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
	Property: getNext
		Works as <Element.getPrevious>, but tries to find the firstChild.
	*/

	getFirst: function(){
		var el = this.firstChild;
		while ($type(el) == 'textnode') el = el.nextSibling;
		return $(el);
	},

	/*
	Property: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.
	*/

	getLast: function(){
		var el = this.lastChild;
		while ($type(el) == 'textnode')
		el = el.previousSibling;
		return $(el);
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
		switch(property){
			case 'class': this.className = value; break;
			case 'style': this.setStyles(value); break;
			case 'name': if (window.ActiveXObject && this.getTag() == 'input'){
				el = $(document.createElement('<input name="'+value+'" />'));
				$A(this.attributes).each(function(attribute){
					if (attribute.name != 'name') el.setProperty(attribute.name, attribute.value);
					
				});
				if (this.parentNode) this.replaceWith(el);
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
		return this.getAttribute(property);
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
	
	getOffset: function(what){
		what = what.capitalize();
		var el = this;
		var offset = 0;
		do {
			offset += el['offset'+what] || 0;
			el = el.offsetParent;
		} while (el);
		return offset;
	},

	/*	
	Property: getTop
		Returns the distance from the top of the window to the Element.
	*/
	
	getTop: function(){
		return this.getOffset('top');
	},
	
	/*	
	Property: getLeft
		Returns the distance from the left of the window to the Element.
	*/
	
	getLeft: function(){
		return this.getOffset('left');
	},
	
	/*	
	Property: getValue
		Returns the value of the Element, if its tag is textarea, select or input.
	*/
	
	getValue: function(){
		var value = false;
		switch(this.getTag()){
			case 'select': value = this.getElementsByTagName('option')[this.selectedIndex].value; break;
			case 'input': if ( (this.checked && ['checkbox', 'radio'].test(this.type)) || (['hidden', 'text', 'password'].test(this.type)) ) 
				value = this.value; break;
			case 'textarea': value = this.value;
		}
		return value;
	}

});

new Object.Native(Element);

Element.extend({
	hasClassName: Element.prototype.hasClass,
	addClassName: Element.prototype.addClass,
	removeClassName: Element.prototype.removeClass,
	toggleClassName: Element.prototype.toggleClass
});

/* Section: Utility Functions  */

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
	if ($type(args) != 'array') args = [args];
	return Element.prototype[method].apply(el, args);
};

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
	a DOM element or false (if no id was found)
		
Note:
	you need to call $ on an element only once to get all the prototypes.
	But its no harm to call it multiple times, as it will detect if it has been already extended.
*/

function $(el){
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) == 'element'){
		if (!el.extend){
			Unload.elements.push(el);
			el.extend = Object.extend;
			el.extend(Element.prototype);
		}
		return el;
	} else return false;
};

window.addEvent = document.addEvent = Element.prototype.addEvent;
window.removeEvent = document.removeEvent = Element.prototype.removeEvent;

var Unload = {

	elements: [], functions: [], vars: [],

	unload: function(){
		Unload.functions.each(function(fn){
			fn();
		});
		
		window.removeEvent('unload', window.removeFunction);
		
		Unload.elements.each(function(el){
			for(var p in Element.prototype){
				window[p] = null;
				document[p] = null;
				el[p] = null;
			}
			el.extend = null;
		});
	}
	
};

window.removeFunction = Unload.unload;
window.addEvent('unload', window.removeFunction);