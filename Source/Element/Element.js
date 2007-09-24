/*
Script: Element.js
	One of the most important items of MooTools, contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license.
*/

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

/*
Method: constructor 
 	Creates a new Element of the type passed in. 
Syntax:
	>var myEl = new Element(el[, props]);

Arguments:
	el    - (mixed) The tag name for the Element to be created. It's also possible to add an Element for reference, in which case it will be extended.
	props - (object, optional) The properties to be applied to the new Element.

	props (continued):
		Assumes that all keys are properties that the <Element.setProperties receives, there are special keys, however: the 'styles' key whos value is passed to <Element.setStyles> and the 'events' key whos value is passed to <Element.addEvents>.

Example:
	[javascript]
		var myAnchor = new Element('a', {
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
	[/javascript]

See Also:
	<$>, <Element.set>
*/

var Element = new Native({

	initialize: function(el){
		if (Element.Builders[el]) return Element.Builders[el].run(Array.slice(arguments, 1));
		var params = Array.link(arguments, {'document': $type.document, 'properties': $type.object});
		var props = params.properties || {}, doc = params.document || document;
		if ($type(el) == 'string'){
			if (Client.Engine.ie && props && (props.name || props.type)){
				var name = (props.name) ? ' name="' + props.name + '"' : '';
				var type = (props.type) ? ' type="' + props.type + '"' : '';
				delete props.name;
				delete props.type;
				el = '<' + el + name + type + '>';
			}
			el = doc.createElement(el);
		}
		el = $(el);
		return (!props || !el) ? el : el.set(props);
	},
	
	afterImplement: function(key, value){
		HTMLElement.prototype[key] = value;
		Elements.prototype[(Array.prototype[key]) ? key + 'Elements' : key] = Elements.$multiply(key);
	}

});

/*
Native: IFrame
	Custom Native to create and easily work with IFrames.
*/

/*
Method: constructor
	Creates an iframe and extends its window and document.
	returns the raw element, if you want to work with the iframe use the "this" in the onload method you pass in.
*/

var IFrame = new Native({
	
	name: 'IFrame',

	initialize: function(props){
		var iframe = $(document.createElement('iframe'));
		iframe.name = props.name || 'IFrame_' + iframe.$attributes.uid;
		delete props.name;
		var onload = props.onload || $empty;
		delete props.onload;
		iframe.onload = function(){
			var frame = this.ownerDocument.window.frames[this.name];
			new Window(frame);
			new Document(frame.document);
			onload.call(frame);
		};
		return $extend(iframe, this).set(props);
	},
	
	generics: false

});

/*
Native: Elements
	The Elements class allows <Element> methods to work also on an <Elements> array. In MooTools, every DOM function, such as <$$> (and every other function that returns a collection of nodes) returns them as an Elements class.

Syntax:
	>var myElements = new Elements(elements[, nocheck]);

Arguments:
	elements - (array) A mixed array with items of Elements or an string ID reference.
	nocheck  - (boolean: defaults to false) Optionally bypasses the extending of Elements.

Returns:
	(array) An extended array with the <Element> methods.

Example:
	[javascript];
		//The following code would set the color of every paragraph to 'red'.
		$$('p').each(function(el){
		  el.setStyle('color', 'red');
		});

		//However, because $$('myselector') also accepts <Element> methods, the below example would have the same effect as the one above.
		$$('p').setStyle('color', 'red');

		//Create myElements from
		var myElements = new Elements(['myElementID', $('myElement'), 'myElementID2', document.getElementById('myElementID3')]);
		myElements.removeElements('found'); //notice how 'remove' is an <Array> method and therefore the correct usage is: <Element.removeEvents>
	[/javascript]

Note:
	- Because Elements is an Array, it accepts all the <Array> methods.
	- Array methods have priority, so overlapping Element methods (remove, getLast) are changed to "method + Elements" (removeElements, getLastElements).
	- Every node of the Elements instance is already extended with <$>.

See Also:
	<$$>
*/

var Elements = new Native({
	
	initialize: function(elements, nocheck){
		elements = elements || [];
		var length = elements.length;
		if (nocheck || !length) return $extend(elements, this);
		var uniques = {};
		var returned = [];
		for (var i = 0; i < length; i++){
			var el = $(elements[i]);
			if (!el || uniques[el.$attributes.uid]) continue;
			uniques[el.$attributes.uid] = true;
			returned.push(el);
		}
		return $extend(returned, this);
	}

});

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

/*
Native: Window
	these methods are attached to the window[s] object.
*/

Window.implement({
	
	/*
	Function: $
		Returns the element passed in with all the Element prototypes applied.

	Arguments:
		el - (mixed) A string containing the id of the DOM element desired or a reference to an actual DOM element.

	Example:
		>$('myElement') // gets a DOM element by id with all the Element prototypes applied.
		>var div = document.getElementById('myElement');
		>$(div) //returns an Element also with all the mootools extensions applied.

		You'll use this when you aren't sure if a variable is an actual element or an id, as
		well as just shorthand for document.getElementById().

	Returns:
		a DOM element or false (if no id was found).

	Note:
		While the $ function needs to be called only once on an element in order to get all the prototypes,
		extended Elements can be passed to this function multiple times without ill effects.
	*/

	$: function(el){
		if (!el) return null;
		if (el.htmlElement) return Garbage.collect(el);
		var type = $type(el);
		if (type == 'string'){
			el = this.document.getElementById(el);
			type = (el) ? 'element' : false;
		}
		if (type != 'element') return (['window', 'document'].contains(type)) ? el : null;
		if (el.htmlElement) return Garbage.collect(el);
		if (Element.$badTags.contains(el.tagName.toLowerCase())) return el;
		$extend(el, Element.prototype);
		el.htmlElement = $empty;
		return Garbage.collect(el);
	},

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
	>$$('a'); 
	Returns an array of all anchor tags on the page.

	>$$('a', 'b');
	Returns an array of all anchor and bold tags on the page.

	>$$('#myElement');
	Returns an array containing only the element with id = myElement (requires Element.Selectors.js).

	>$$('#myElement a.myClass');
	Returns an array of all anchor tags with the class "myClass" within the DOM element with id "myElement" (requires Element.Selectors.js).

	>$$(myelement, myelement2, 'a', ['myid', myid2, 'myid3'], document.getElementsByTagName('div'));
	Returns a collection of the element referenced as myelement, the element referenced as myelement2, all of the link tags on the page,
	the element with the id 'myid', followed by the elements with the ids of 'myid2' and 'myid3', and finally all the div elements on the page.
	NOTE: If an element is not found, nothing will be included into the array (not even *null*).

	Returns:
		array - array of all the dom elements matched, extended with <$>.  Returns as <Elements>.
	*/

	$$: function(){
		var elements = [];
		for (var i = 0, j = arguments.length; i < j; i++){
			var selector = arguments[i];
			switch ($type(selector)){
				case 'element': elements.push(selector); break;
				case false: case null: break;
				case 'string': selector = this.document.getElements(selector, true);
				default: elements.extend(selector);
			}
		}
		return new Elements(elements);
	}

});

/*
Native: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Native.implement([Element, Document], {
	
	/*
	Method: getElement
		Searches all descendents for the first Element whose tag matches the tag provided. getElement method will also automatically extend the Element.

	Syntax:
		>var myElement = myElement.getElement(tag);

	Arguments:
		tag - (string) String of the tag to match.

	Returns:
		(mixed) If found returns an extended Element, else returns null.

	Example:
		[javascript]
			var body = $(document.body);
			var firstDiv = body.getElement('div');
			// or
			var firstDiv = $(document.body).getElement('div');
		[/javascript]

	Note:
		This method is also available for the Document instances.
		This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElement so that it maches with CSS selectors.
	*/
	
	getElement: function(tag, nocash){
		var element = this.getElementsByTagName(tag)[0] || null;
		return (nocash) ? element : $(element);
	},
	
	/*
	Method: getElements
		Searches and returns all descendant Elements that match the tag provided.

	Syntax:
		>var myElements = myElement.getElements(tag);

	Arguments:
		tag - (string) String of the tag to match.

	Returns:
		(array) An array of all matched Elements. If none of the descendants matched the tag, will return an empty array.

	Example:
		[javascript]
			var body = $(document.body);
			var allAnchors = body.getElements('a');
			// or
			var allAnchors = $(document.body).getElement('a');
		[/javascript]

	Note:
		This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElements so that it maches with CSS selectors.
		This method is also available for the Document instances.
	*/

	getElements: function(tag, nocash){
		var elements = this.getElementsByTagName(tag);
		return (nocash) ? elements : $$(elements);
	}

});

Element.Setters = new Hash({

	attributes: function(properties){
		this.setProperties(properties);
	}

});

Element.Builders = new Hash({
	
	iframe: function(props){
		return new IFrame(props);
	}
	
});

Element.Setters.properties = Element.Setters.attributes;

Element.implement({
	
	/*
	Method: getElementById
		Targets an element with the specified id found inside the Element. Does not overwrite document.getElementById.

	Arguments:
		id - (string) the id of the element to find.
		
	Returns:
		(mixed) The element you find or null if none found.
	*/

	getElementById: function(id, nocash){
		var el = this.ownerDocument.getElementById(id);
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return (nocash) ? el : $(el);
	},

	/*
	Method: set
		With this method you can set events, styles, and properties to the Element (same as calling new Element with the second paramater).

	Syntax:
		>myElement.set(props);

	Arguments:
		props - (object) An object with various properties used to modify the current Element. Keyword properties are: 'styles' and 'events' all other are considered properties. See also: new <Element>

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var body = $(document.body).set({
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
		[/javascript]

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
	Method: inject
		Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the paramter).

	Syntax:
		>myElement.inject(el[, where]);

	Arguments:
		el    - (mixed) el can be: the string of the id of the Element or an Element.
		where - (string, optional) The place to inject this Element to (defaults to the bottom of the el's child nodes).

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var myDiv = new Element('div', {id: 'mydiv'});
			myDiv.inject(document.body);
			// or inline
			var myDiv = new Element('div', {id: 'mydiv'}).inject(document.body);

			new Element('a').inject('mydiv'); // is also valid since myDiv is now inside the body
		[/javascript]

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
	Method: injectBefore
		Inserts the Element before the passed Element.

	Syntax:
		>myElement.injectBefore(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected before.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('mySecondElement').injectBefore('myElement');
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement"></div>
			<div id="myElement"></div>
		[/html]

	See Also:
		<Element.inject>
	*/

	injectBefore: function(el){
		return this.inject(el, 'before');
	},

	/*
	Method: injectAfter
		Inserts the Element after the passed Element.

	Syntax:
		>myElement.injectAfter(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected after.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="mySecondElement"></div>
			<div id="myElement"></div>
		[/html]

		[javascript]
			$('mySecondElement').injectBefore('myElement');
		[/javascript]

		Result:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

	See Also:
		<Element.inject>, <Element.injectBefore>
	*/

	injectAfter: function(el){
		return this.inject(el, 'after');
	},

	/*
	Method: injectInside
		Injects the Element inside and at the end of the child nodes of the passed in Element.

	Syntax:
		>myElement.injectInside(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected inside.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('mySecondElement').injectInside('myElement');
		[/javascript]

		Result:
		[html]
			<div id="myElement">
				<div id="mySecondElement"></div>
			</div>
		[/html]

	See Also:
		<Element.inject>
	*/

	injectInside: function(el){
		return this.inject(el, 'bottom');
	},

	/*
	Method: injectTop
		Same as <Element.injectInside>, but inserts the Element inside, at the top.

	Syntax:
		>myElement.injectTop(el);

	Arguments:
		el - (mixed) An Element reference or the id of the Element to be injected top.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div id="mySecondElement"></div>
				<div id="myThirdElement"></div>
			</div>
			<div id="myFourthElement"></div>
		[/html]

		[javascript]
			$('myFourthElement').injectTop('myElement');
		[/javascript]

		Result:
		[html]
			<div id="myElement">
				<div id="myFourthElement"></div>
				<div id="mySecondElement"></div>
				<div id="myThirdElement"></div>
			</div>
		[/html]

	See Also:
		<Element.inject>
	*/

	injectTop: function(el){
		return this.inject(el, 'top');
	},

	/*
	Method: adopt
		Inserts the passed Elements inside the Element.

	Syntax:
		>myElement.adopt(el[, el2[, ...]]);

	Arguments:
		Accepts Elements references, Element ids as string, selectors ($$('stuff')) / array of Elements, array of ids as strings and collections.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
			<div id="myFourthElement"></div>
		[/html]

		[javascript]
			$('myElement').adopt('mySecondElement', 'myThirdElement', 'myFourthElement');
		[/javascript]

		Result:
		[html]
			<div id="myElement">
				<div id="myFourthElement"></div>
				<div id="mySecondElement"></div>
				<div id="myThirdElement"></div>
			</div>
		[/html]

	See Also:
		<Element.inject>
	*/

	adopt: function(){
		var elements = [];
		Array.each(arguments, function(argument){
			elements = elements.concat(argument);
		});
		$$(elements).inject(this);
		return this;
	},

	/*
	Method: remove
		Removes the Element from the DOM.

	Syntax:
		>var removedElement = myElement.remove();

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('myElement').remove() //bye bye
		[/javascript]

		Results:
		[html]
			<div id="mySecondElement"></div>
		[/html]

	Note:
		For <Elements> this method is named removeElements, because <Array.remove> has priority.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.removeChild>
	*/

	remove: function(){
		return this.parentNode.removeChild(this);
	},

	/*
	Method: clone
		Clones the Element and returns the cloned one.

	Syntax:
		>var copy = myElement.clone([contents]);

	Arguments:
		contents - (boolean, optional) When true the Element is cloned with childNodes, default true

	Returns:
		(element) The cloned Element without Events.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
		[/html]

		[javascript]
			var clone = $('myElement').clone().injectAfter('myElement'); //clones the Element and append the clone after the Element.
		[/javascript]

		Results:
		[html]
			<div id="myElement"></div>
			<div id=""></div>
		[/html]

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
	Method: replaceWith
		Replaces the Element with an Element passed.

	Syntax:
		>var replacingElement = myElement.replaceWidth(el);

	Arguments:
		el - (mixed) A string id representing the Element to be injected in, or an Element reference. In addition, if you pass div or another tag, the Element will be created.

	Returns:
		(element) The passed in Element.

	Example:
		[javascript]
			$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.
		[/javascript]]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.replaceChild>
	*/

	replaceWith: function(el){
		el = $(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},

	/*
	Method: appendText
		Appends text node to a DOM Element.

	Syntax:
		>myElement.appendText(text);

	Arguments:
		text - (string) The text to append.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement">hey</div>
		[/html]

		[javascript]
			$('myElement').appendText('. howdy'); //myElement innerHTML is now "hey howdy"
		[/javascript]

		Result:
		[html]
			<div id="myElement">hey. howdy</div>
		[/html]
	*/

	appendText: function(text){
		this.appendChild(this.ownerDocument.createTextNode(text));
		return this;
	},

	/*
	Method: hasClass
		Tests the Element to see if it has the passed in className.

	Syntax:
		>var result = myElement.hasClass(className);

	Arguments:
		className - (string) The class name to test.

	Returns:
		(boolean) Returns true if the Element has the class, otherwise false.

	Example:
		[html]
			<div id="myElement" class="testClass"></div>
		[/html]

		[javascript]
			$('myElement').hasClass('testClass'); //returns true
		[/javascript]
	*/

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	/*
	Method: addClass
		Adds the passed in class to the Element, if the Element doesnt already have it.

	Syntax:
		>myElement.addClass(className);

	Arguments:
		className - (string) The class name to add.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement" class="testClass"></div>
		[/html]

		[javascript]
			$('myElement').addClass('newClass');
		[/javascript]

		Result:
		[html]
			<div id="myElement" class="testClass newClass"></div>
		[/html]
	*/

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	/*
	Method: removeClass
		Works like <Element.addClass>, but removes the class from the Element.

	Syntax:
		>myElement.removeClass(className);

	Arguments:
		className - (string) The class name to remove.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement" class="testClass newClass"></div>
		[/html]

		[javascript]
			$('myElement').removeClass('newClass');
		[/javascript]

		Result:
		[html]
			<div id="myElement" class="testClass"></div>
		[/html]
	*/

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1').clean();
		return this;
	},

	/*
	Method: toggleClass
		Adds or removes the passed in class name to the Element, depending on if it's present or not.

	Syntax:
		>myElement.toggleClass(className);

	Arguments:
		className - (string) The class to add or remove.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement" class="myClass"></div>
		[/html]

		[javascript]
			$('myElement').toggleClass('myClass');
		[/javascript]

		Result:
		[html]
			<div id="myElement" class=""></div>
		[/html]

		[javascript]
			$('myElement').toggleClass('myClass');
		[/javascript]

		Result:
		[html]
			<div id="myElement" class="myClass"></div>
		[/html]
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
	Method: getPrevious
		Returns the previousSibling of the Element (excluding text nodes).

	Syntax:
		>var previousSibling = myElement.getPrevious();

	Returns:
		(mixed) The previous sibling Element, or returns null if none found.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('mySecondElement').getPrevious().remove(); //get the previous DOM Element from mySecondElement and removes.
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement"></div>
		[/html]

		See Also:
			<Element.remove>
	*/

	getPrevious: function(){
		return this.walk('previous');
	},

	/*
	Method: getNext
		Works as Element.getPrevious, but tries to find the nextSibling (excluding text nodes).

	Syntax:
		>var nextSibling = myElement.getNext();

	Returns:
		(mixed) The next sibling Element, or returns null if none found.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('myElement').getNext().addClass('found'); //get the next DOM Element from myElement and adds class 'found'.
		[/javascript]

		Result:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement" class="found"></div>
		[/html]

	See Also:
		<Element.addClass>
	*/

	getNext: function(){
		return this.walk('next');
	},

	/*
	Method: getFirst
		Works as <Element.getPrevious>, but tries to find the firstChild (excluding text nodes).

	Syntax:
		>var firstElement = myElement.getFirst();

	Returns:
		(mixed) The first sibling Element, or returns null if none found.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		[/html]

		[javascript]
			$('myThirdElement').getFirst().inject('mySecondElement'); //gets the first DOM Element from myThirdElement and injects inside mySecondElement.
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement">
				<div id="myElement"></div>
			</div>
			<div id="myThirdElement"></div>
		[/html]

	See Also:
		<Element.inject>
	*/

	getFirst: function(){
		return this.walk('next', 'firstChild');
	},

	/*
	Method: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.

	Syntax:
		>var lastElement = myElement.getLast();

	Returns:
		(mixed) The first sibling Element, or returns null if none found.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
		[/html]

		[javascript]
			$('myElement').getLast().adopt('mySecondElement'); //gets the last DOM Element from myElement and adopts mySecondElement.
		[/javascript]

		Result:
		[html]
			<div id="myElement"></div>
			<div id="myThirdElement">
				<div id="mySecondElement"></div>
			</div>
		[/html]

	Note:
		For <Elements> this method is named getLastElements, because <Array.getLast> has priority.

	See Also:
		<Element.adopt>
	*/

	getLast: function(){
		return this.walk('previous', 'lastChild');
	},

	/*
	Method: getParent
		Returns the parent node extended.

	Syntax:
		>var parent = myElement.getParent();

	Returns:
		(element) This Element's parent.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div id="mySecondElement"></div>
			</div>
		[/html]

		[javascript]
			$('mySecondElement').getParent().addClass('papa');
		[/javascript]

		Result:
		[html]
			<div id="myElement" class="papa">
				<div id="mySecondElement"></div>
			</div>
		[/html]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.parentNode>
	*/

	getParent: function(){
		return $(this.parentNode);
	},

	/*
	Method: getChildren
		Returns all the Element's children (excluding text nodes). Returns as <Elements>.

	Syntax:
		>var children = myElement.getChildren();

	Returns:
		(array) A <Elements> array with all of the Element's children except the text nodes.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div id="mySecondElement"></div>
				<div id="myThirdElement"></div>
			</div>
		[/html]

		[javascript]
			$('myElement').getChildren().removeElements(); // notice how <Element.remove> is renamed removeElements due to Array precedence.
		[/javascript]

		Result:
		[/html]
			<div id="myElement"></div>
		[/javascript]

	See Also:
		<Elements>, <Elements.remove>
	*/

	getChildren: function(){
		return $$(this.childNodes);
	},

	/*
	Method: hasChild
		Checks all children (including text nodes) for a match.

	Syntax:
		>var result = myElement.hasChild(el);

	Arguments:
		el - (mixed) Can be a Element reference or string id.

	Returns:
		(boolean) Returns true if the passed in Element is a child of the Element, otherwise false.

	Example:
		HTML:
		[html]
			<div id="Darth_Vader">
				<div id="Luke"></div>
			</div>
		[/html]

		[javascript]
			if($('Darth_Vader').hasChild('Luke')) alert('Luke, I am your father.'); // tan tan tannn.....
		[/javascript]
	*/

	hasChild: function(el){
		return !!$A(this.getElementsByTagName('*')).contains(el);
	},

	/*
	Method: getProperty
		Gets the an attribute of the Element.

	Syntax:
		>myElement.getProperty(property);

	Arguments:
		property - (string) The attribute to retrieve.

	Returns:
		(mixed) The value of the property, or an empty string.

	Example:
		HTML:
		[html]
			<img id="myImage" src="mootools.png" />
		[/html]

		[javascript]
			$('myImage').getProperty('src') // returns mootools.png
		[/javascript]
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
	Method: removeProperty
		Removes an attribute from the Element.

	Syntax:
		>myElement.removeProperty(property);

	Arguments:
		property - (string) The attribute to remove.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<a id="myAnchor" href="#" onmousedown="alert('click');"></a>
		[/html]

		[javascript]
			$('myAnchor').removeProperty('onmousedown'); //eww inline javascript is bad! Let's get rid of it.
		[/javascript]

		Result:
		[html]
			<a id="myAnchor" href="#"></a>
		[/html]
	*/

	removeProperty: function(property){
		var index = Element.$attributes[property];
		if (index) this[index] = '';
		else this.removeAttribute(property);
		return this;
	},

	/*
	Method: getProperties
		Same as <Element.getStyles>, but for properties.

	Syntax:
		>var myProps = myElement.getProperties();

	Returns:
		(object) An object containing all of the Element's properties.

	Example:
		HTML:
		[html]
			<img id="myImage" src="mootools.png" title="MooTools, the compact JavaScript framework" alt="" />
		[/html]

		[javascript]
			var imgProps = $('myImage').getProperties(); // returns: { id: 'myImage', src: 'mootools.png', title: 'MooTools, the compact JavaScript framework', alt: '' }
		[/javascript]

	See Also:
		<Element.getProperty>
	*/

	getProperties: function(){
		var result = {};
		Array.each(arguments, function(key){
			result[key] = this.getProperty(key);
		}, this);
		return result;
	},

	/*
	Method: setProperty
		Sets an attribute for the Element.

	Arguments:
		property - (string) The property to assign the value passed in.
		value - (mixed) The value to assign to the property passed in.

	Return:
		(element) - This Element.

	Example:
		HTML:
		[html]
			<img id="myImage" />
		[/html]

		[javascript]
			$('myImage').setProperty('src', 'mootools.png');
		[/javascript]

		Result:
		[html]
			<img id="myImage" src="mootools.png" />
		[/html]
	*/

	setProperty: function(property, value){
		var index = Element.$attributes[property];
		if (index) this[index] = value;
		else this.setAttribute(property, value);
		return this;
	},

	/*
	Method: setProperties
		Sets numerous attributes for the Element.

	Arguments:
		properties - (object) An object with key/value pairs.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<img id="myImage" />
		[/html]

		[javascript]
			$('myImage').setProperties({
				src: 'whatever.gif',
				alt: 'whatever dude'
			});
		[/javascript]

		Result:
		[html]
			<img id="myImage" src="whatever.gif" alt="whatever dude" />
		[/html]
	*/

	setProperties: function(properties){
		for (var property in properties) this.setProperty(property, properties[property]);
		return this;
	},

	/*
	Method: setHTML
		Sets the innerHTML of the Element.

	Syntax:
		>myElement.setHTML([htmlString[, htmlString2[, htmlString3[, ..]]]);

	Arguments:
		Any number of string paramters with html.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
		[/html]

		[javascript]
			$('myElement').setHTML('<div></div>', '<p></p>');
		[/javascript]

		Result:
		[html]
			<div id="myElement">
				<div></div>
				<p></p>
			</div>
		[/html]

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
	Method: setText
		Sets the inner text of the Element.

	Syntax:
		>myElement.setText(text);

	Arguments:
		text - (string) The new text content for the Element.

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
		[/html]

		[javascript]
			$('myElement').setText('some text') //the text of myElement is now = 'some text'
		[/javascript]

		Result:
		[html]
			<div id="myElement">some text</div>
		[/html]
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
	Method: getText
		Gets the inner text of the Element.

	Syntax:
		>var myText = myElement.getText();

	Returns:
		(string) The text of the Element.

	Example:
		HTML:
		[html]
			<div id="myElement">my text</div>
		[/html]

		[javascript]
			var myText = $('myElement').getText(); //myText = 'my text';
		[/javascript]
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
	Method: getTag
		Returns the tagName of the Element in lower case.

	Syntax:
		>var myTag = myElement.getTag();

	Returns:
		(string) The tag name in lower case

	Example:
		HTML:
		[html]
			<img id="myImage" />
		[/html]

		[javascript]
			var myTag = $('myImage').getTag() // myTag = 'img';
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.tagName>
	*/

	getTag: function(){
		return this.tagName.toLowerCase();
	},

	/*
	Method: empty
		Empties an Element of all its children.

	Syntax:
		>myElement.empty();

	Returns:
		(element) This Element..

	Example:
		HTML:
		[html]
			<div id="myElement">
				<p></p>
				<span></span>
			</div>
		[/html]

		[javascript]
			$('myElement').empty() // empties the Div and returns it
		[/javascript]

		Result:
		[html]
			<div id="myElement"></div>
		[/html]
	*/

	empty: function(){
		Garbage.trash(this.getElementsByTagName('*'));
		return this.setHTML('');
	},

	/*
	Method: destroy
		Empties an Element of all its children, removes and garbages the Element.

	Syntax:
		>myElement.destroy();

	Returns:
		(null)

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
		[/html]

		[javascript]
			$('myElement').destroy() // the Element is no more.
		[/javascript]

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

Native.implement([Element, Window, Document], {

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
		for (var i = elements.length, el; i--; i){
			if (!(el = elements[i]) || !el.$attributes) continue;
			if (el.tagName && !Element.$badTags.contains(el.tagName.toLowerCase())) Garbage.kill(el);
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
