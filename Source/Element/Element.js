/*
Script: Element.js
	One of the most important items of MooTools, contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

License:
	MIT-style license.
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
	el    - (mixed) The tag name for the Element to be created or an Element so that it can be extended.
	props - (object, optional) The properties to apply to the new Element.

	props (continued):
		The 'styles' and 'events' keys' values are used for <Element.setStyles> and <Element.addEvents>. All other properties are set as attributes of the element.

Returns:
	(element) A new HTML Element.

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
	
	name: 'Element',

	legacy: window.Element,

	initialize: function(el){
		var params = Array.link(arguments, {'document': Document.type, 'properties': Object.type});
		var props = params.properties || {}, doc = params.document || document;
		if ($type(el) == 'string'){
			el = el.toLowerCase();
			if (Browser.Engine.trident && props){
				['name', 'type', 'checked'].each(function(attribute){
					if (!props[attribute]) return;
					el += ' ' + attribute + '="' + props[attribute] + '"';
					if (attribute != 'checked') delete props[attribute];
				});
				el = '<' + el + '>';
			}
			el = doc.createElement(el);
		}
		el = $.element(el);
		return (!props || !el) ? el : el.set(props);
	},

	afterImplement: function(key, value){
		Elements.prototype[key] = Elements.multi(key);
		Element.Prototype[key] = value;
	}

});

Element.Prototype = {$family: {name: 'element'}};

var TextNode = new Native({

	name: 'TextNode',

	initialize: function(text, doc){
		return $extend((doc || document).createTextNode(text), this);
	}

});

/*
Native: IFrame
	Custom Native to create and easily work with IFrames.
*/

/*
Method: constructor
	Creates an iframe HTML Element and extends its window and document with MooTools.

Syntax:
	>var myIFrame = new IFrame([el][, props]);

Arguments:
	el    - (mixed, optional) The id for the Iframe to be converted, or the actual iframe element. If its not passed, a new iframe will be created.
	props - (object, optional) The properties to be applied to the new IFrame.

	props (continued):
		onload - (function, optional) The function executed when the iframe loads and accepts every property/object accepted by <Element.set>.

Returns:
	(element) A new iframe HTML Element.

Example:
	[javascript]
		var myIFrame = new IFrame({

			src: 'http://mootools.net/',

			onload: function(){
				alert('my iframe finished loading');
			},

			styles: {
				width: 800,
				height: 600,
				border: '1px solid #ccc'
			},

			events: {

				mouseenter: function(){
					alert('welcome aboard');
				},

				mouseleave: function(){
					alert('oo noes');
				}

			}

		});
	[/javascript]

Notes:
	- If the IFrame is from the same domain as the "host", its document and window will be extended with MooTools functionalities, allowing you to fully use MooTools within iframes.
	- If the iframe already exists, and it has different id/name, the name will be made the same as the id.
	- If the frame is from a different domain, its window and document will not be extended with MooTools methods.
*/

var IFrame = new Native({

	name: 'IFrame',

	generics: false,

	initialize: function(){
		Native.UID++;
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		var props = params.properties || {};
		var iframe = $(params.iframe) || false;
		var onload = props.onload || $empty;
		delete props.onload;
		props.id = props.name = $pick(props.id, props.name, iframe.id, iframe.name, 'IFrame_' + Native.UID);
		((iframe = iframe || new Element('iframe'))).set(props);
		var onFrameLoad = function(){
			var host = $try(function(){
				return iframe.contentWindow.location.host;
			});
			if (host && host == window.location.host){
				iframe.window = iframe.contentWindow;
				var win = new Window(iframe.window);
				var doc = new Document(iframe.window.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow);
		};
		(!window.frames[props.id]) ? iframe.addListener('load', onFrameLoad) : onFrameLoad();
		return iframe;
	}

});

/*
Native: Elements
	The Elements class allows <Element> methods to work also on an <Elements> array.

Syntax:
	>var myElements = new Elements(elements[, options]);

Arguments:
	elements - (mixed) An array of elements and/or strings representing element ids, or an HTMLCollection.

Returns:
	(array) An extended array with the <Element> and <Elements> methods.

Examples:
	Set Every Paragraph's Color to Red:
	[javascript];
		$$('p').each(function(el){
		  el.setStyle('color', 'red');
		});

		//However, because $$('myselector') also accepts <Element> methods, the below example would have the same effect as the one above.
		$$('p').setStyle('color', 'red');
	[/javascript]

	Create Elements From an Array:
	[javascript]
		var myElements = new Elements(['myElementID', $('myElement'), 'myElementID2', document.getElementById('myElementID3')]);
		myElements.removeElements('found'); //notice how 'remove' is an <Array> method and therefore the correct usage is: <Element.removeEvents>
	[/javascript]

Notes:
	- In MooTools, every DOM function, such as <$$> (and every other function that returns a collection of nodes) returns them as an Elements class.
	- Because Elements is an Array, it accepts all the <Array> methods.
	- Array methods have priority, so overlapping Element methods (remove, getLast) are changed to "method + Elements" (removeElements, getLastElements).
	- Every node of the Elements instance is already "extended" with <$>.

See Also:
	<$$>
*/

var Elements = new Native({

	initialize: function(elements, options){
		options = $extend({ddup: true, cash: true, xtend: true}, options);
		elements = elements || [];
		if (options.ddup || options.cash){
			var uniques = {};
			var returned = [];
			for (var i = 0, l = elements.length; i < l; i++){
				var el = $.element(elements[i], !options.cash);
				if (options.ddup){
					if (uniques[el.uid]) continue;
					uniques[el.uid] = true;
				}
				returned.push(el);
			}
			elements = returned;
		}
		return (options.xtend) ? $extend(elements, this) : elements;
	}

});

Elements.multi = function(property){
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

	Syntax:
		>var myElement = $(el);

	Arguments:
		el - (mixed) A string containing the id of the DOM element desired or a reference to an actual DOM element.

	Returns:
		(mixed) A DOM element, or false if no ID was found.

	Examples:
		Get a DOM Element by ID:
		[javascript]
			var myElement = $('myElement');
		[/javascript]

		Extend an Element:
		[javascript]
			var div = document.getElementById('myElement');
			div = $(div); //returns an Element also with all the mootools extensions applied.
		[/javascript]

		You'll use this when you aren't sure if a variable is an actual element or an id, as
		well as just shorthand for document.getElementById().

	Note:
		While the $ function needs to be called only once on an element in order to get all the prototypes, extended Elements can be passed to this function multiple times without ill effects.
	*/

	$: function(el, notrash){
		if (el && el.$attributes) return el;
		var type = $type(el);
		return ($[type]) ? $[type](el, notrash, this.document) : null;
	},

	/*
	Function: $$
		Selects, and extends DOM elements. Elements arrays returned with $$ will also accept all the <Element> methods.
		The return type of element methods run through $$ is always an array. If the return array is only made by elements,
		$$ will be applied automatically.

	Syntax:
		>var myElements = $$(aTag[, anElement[, Elements[, ...]);

	Arguments:
		HTML Collections, arrays of elements, arrays of strings as element ids, elements, strings as selectors.
		Any number of the above as arguments are accepted.

	Returns:
		(array) - An array of all the DOM Elements matched, extended with <$>.

	Examples:
		Get Elements by Their Tags:
		[javascript]
			$$('a'); //returns all anchor Elements in the page

			$$('a', 'b'); //returns anchor and bold tags on the page
		[/javascript]

		Using CSS Selectors When <Element.Selectors.js> is Included:
		[javascript]
			$$('#myElement'); //returns an array containing only the element with the id 'myElement'

			$$('#myElement a.myClass'); //returns an array of all anchor tags with the class "myClass" within the DOM element with id "myElement"
		[/javascript]

		Complex $$:
		[javascript]
			$$(myelement, myelement2, 'a', ['myid', myid2, 'myid3'], document.getElementsByTagName('div'));
		[/javascript]

	Notes:
		- If you load <Element.Selectors.js>, $$ will also accept CSS Selectors, otherwise the only selectors supported are tag names.
		- If an element is not found, nothing will be included into the array (not even *null*)
	*/

	$$: function(selector){
		if (arguments.length == 1 && typeof selector == 'string') return this.document.getElements(selector);
		var elements = [];
		var args = Array.flatten(arguments);
		for (var i = 0, l = args.length; i < l; i++){
			var item = args[i];
			switch ($type(item)){
				case 'element': item = [item]; break;
				case 'string': item = this.document.getElements(item, true); break;
				default: item = false;
			}
			if (item) elements.extend(item);
		}
		return new Elements(elements);
	}

});

$.string = function(id, notrash, doc){
	id = (doc || document).getElementById(id);
	return (id) ? $.element(id, notrash) : null;
};

$.element = function(el, notrash){
	el.uid = el.uid || [Native.UID++];
	if (!notrash && Garbage.collect(el) && !el.$family) $extend(el, Element.Prototype);
	return el;
};

$.textnode = function(el, notrash){
	return (notrash || el.$family) ? el : $extend(el, TextNode.prototype);
};

$.window = $.document = $arguments(0);

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
		(mixed) If found returns an extended Element, otherwise returns null.

	Example:
		[javascript]
			var firstDiv = $(document.body).getElement('div');
		[/javascript]

	Notes:
		- This method is also available for the Document instances.
		- This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElement so that it maches with CSS selectors.
	*/

	getElement: function(selector, notrash){
		return $(this.getElements(selector, true)[0] || null, notrash);
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
			var allAnchors = $(document.body).getElements('a');
		[/javascript]

	Notes:
		- This method gets replaced when <Selector.js> is included. <Selector.js> enhances getElements so that it maches with CSS selectors.
		- This method is also available for the Document instances.
	*/

	getElements: function(tags, nocash){
		tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag){
			var partial = this.getElementsByTagName(tag.trim());
			(ddup) ? elements.extend(partial) : elements = partial;
		}, this);
		return new Elements(elements, {ddup: ddup, cash: !nocash, xtend: !nocash});
	}

});

Element.Storage = {

	get: function(uid){
		return (this[uid] = this[uid] || {});
	}

};

Native.implement([Window, Document, Element], {

	retrieve: function(property, dflt){
		var storage = Element.Storage.get(this.uid);
		var prop = storage[property];
		if ($defined(dflt) && !$defined(prop)) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(property, value){
		var storage = Element.Storage.get(this.uid);
		storage[property] = value;
		return this;
	},

	pull: function(property){
		var storage = Element.Storage.get(this.uid);
		delete storage[property];
	}

});

Element.Inserters = new Hash({

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

	before: function(context, element){
		if (element.parentNode) element.parentNode.insertBefore(context, element);
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

	after: function(context, element){
		if (!element.parentNode) return;
		var next = element.nextSibling;
		(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
	},
	
	
	/*
	Method: injectBottom
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

	bottom: function(context, element){
		element.appendChild(context);
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

	top: function(context, element){
		var first = element.firstChild;
		(first) ? element.insertBefore(context, first) : element.appendChild(this);
	}

});

Element.Inserters.inside = Element.Inserters.bottom;

(function(){
	var methods = {};
	Element.Inserters.each(function(value, key){
		methods['inject' + key.capitalize()] = function(el){
			return Element.inject(this, el, key);
		};
	});
	Element.implement(methods);
})();

Element.implement({

	/*
	Method: getElementById
		Targets an element with the specified id found inside the Element.

	Syntax:
		>var myElement = anElement.getElementById(id);

	Arguments:
		id - (string) The ID of the Element to find.

	Returns:
		(mixed) The Element found, otherwise null.

	Example:
		[javascript]
			var myParent = $('myParent');
			var myChild = myParent.getElementById('aChild');
		[/javascript]

	Note:
		Does not overwrite document.getElementById.
	*/

	getElementById: function(id, nocash){
		var el = this.ownerDocument.getElementById(id);
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return $.element(el, notrash);
	},

	/*
	Method: set
		This is a "dynamic arguments" method. The first argument can be one of the properties of the <Element.Setters> Hash.

	Syntax:
		>myElement.set(property[, value]);

	Arguments:
		property - (mixed) Accepts a string for setting the property and value, or an object with its keys/values representing properties for the Element.
		value    - (mixed, optional) The value to set for the given property.

	Returns:
		(element) This Element.

	Examples:
		With an Object:
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

		With Property and Value:
		[javascript]
			var body = $(document.body).set('styles', { // property styles passes the object to <Element.setStyles>
				'font': '12px Arial',
				'color': 'blue'
			});
		[/javascript]

	Notes:
		- All additional arguments are passed to the method of the <Element.Setters> Hash.
		- If no matching property is found in <Element.Setters>, it falls back to settimg attributes of the element, making this method the perfect shortcut.

	See Also:
		<Element>, <Element.Setters>, <Element.setStyles>, <Element.addEvents>
	*/

	set: function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				var setter = Element.Setters.get(prop);
				(setter) ? setter.apply(this, Array.slice(arguments, 1)) : this.setProperty(prop, value);
		}
		return this;
	},

	/*
	Method: get
		This is a "dynamic arguments" method. The first argument can be one of the properties of the <Element.Getters> Hash.

	Syntax:
		>myElement.get(property);

	Arguments:
		property - (mixed) Accepts a string for getting the value of a certain property.

	Returns:
		(mixed) Whatever the result of the function in the <Element.Getters> Hash is, or the value of the corresponding attribute.

	Examples:
		Using Custom Getters:
		[javascript]
			var tag = $('myDiv').get('tag'); //returns 'div'
			var coords = $('myDiv').getCoordinates; //returns the elements coordinates
		[/javascript]

		Fallback to Element Attributes:
		[javascript]
			var id = $('myDiv').get('id); //returns 'myDiv'
			var value = $('myInput').get('value'); //returns this input element's value
		[/javascript]

	Notes:
		- If no matching property is found in Element.Getters, it falls back to gettimg attributes of the element.

	See Also:
		<Element>, <Element.Getters>
	*/

	get: function(prop){
		var getter = Element.Getters.get(prop);
		return (getter) ? getter.apply(this, Array.slice(arguments, 1)) : this.getProperty(prop);
	},

	/*
	Method: clear
		This is a "dynamic arguments" method. The first argument can be one of the properties of the <Element.Clearer> Hash.

	Syntax:
		>myElement.clear(property);

	Arguments:
		property - (mixed) Accepts a string representing the property to be cleared.

	Returns:
		(mixed) Whatever the result of the function in the <Element.Clearer> Hash is.

	Examples:
		[javascript]
			$('myDiv').clear('id'); //removes the id from myDiv
			$('myDiv').clear('class'); //myDiv element no longer has any classNames set
		[/javascript]

	Note:
		- If no matching property is found in <Element.Clearer>, it falls back to removing the specified attribute of the element.

	See Also:
		<Element>, <Element.Clearer>
	*/

	erase: function(prop){
		var eraser = Element.Erasers.get(prop);
		(eraser) ? eraser.apply(this, Array.slice(arguments, 1)) : this.removeProperty(prop);
		return this;
	},

	/*
	Method: match
		Tests this element to see if it matches the given tagName.

	Syntax:
		>myElement.match(tag);

	Arguments:
		tag - (string) The tagName to test against this element.

	Returns:
		(boolean) If the element has the specified tagName, returns true. Otherwise, returns false.

	Example:
		[javascript]
			$('myDiv').match('div'); //true if myDiv is a div
		[/javascript]

	Note:
		- This method is overwritten by a more powerful version when Selectors.js is included.
	*/

	match: function(tag){
		return (!tag || Element.get(this, 'tag') == tag);
	},

	/*
	Method: inject
		Injects, or inserts, the Element at a particular place relative to the Element's children (specified by the second the paramter).

	Syntax:
		>myElement.inject(el[, where]);

	Arguments:
		el	- (mixed) el can be the id of an element or an element.
		where - (string, optional) The place to inject this Element to (defaults to the bottom of the el's child nodes).

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var myFirstElement = new Element('div', {id: 'myFirstElement'});
			var mySecondElement = new Element('div', {id: 'mySecondElement'});
		[/javascript]

		Inject Inside:
		[javascript]
			myFirstElement.inject(mySecondElement);
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement">
				<div id="myFirstElement"></div>
			</div>
		[/html]

		Inject Before:
		[javascript]
			myFirstElement.inject(mySecondElement, 'before');
		[/javascript]

		Result:
		[html]
			<div id="myFirstElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		Inject After:
		[javascript]
			myFirstElement.inject(mySecondElement, 'after');
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement"></div>
			<div id="myFirstElement"></div>
		[/html]

	See Also:
		<Element.adopt>, <Element.append>
	*/

	inject: function(el, where){
		Element.Inserters.get(where || 'bottom')(this, $(el, true));
		return this;
	},

	wraps: function(el, where){
		el = $(el, true);
		Element.Inserters.after(this, el);
		return this.grab(el, where);
	},
	
	/*
	Method: grab
		Works as <Element.inject>, but in reverse.
		Appends the Element at a particular place relative to the Element's children (specified by the second the paramter).

	Syntax:
		>myElement.grab(el[, where]);

	Arguments:
		el	- (mixed) el can be the id of an element or an element.
		where - (string, optional) The place to append this Element to (defaults to the bottom of the el's child nodes).

	Returns:
		(element) This Element.

	Example:
		[javascript]
			var myFirstElement = new Element('div', {id: 'myFirstElement'});
			var mySecondElement = new Element('div', {id: 'mySecondElement'});
			myFirstElement.grab(mySecondElement);
		[/javascript]

		Result:
		[html]
			<div id="myFirstElement">
				<div id="mySecondElement"></div>
			</div>
		[/html]

	Note:
		grab supports only top and bottom.

	See Also:
		<Element.inject>, <Element.adopt>
	*/
	
	grab: function(el, where){
		Element.Inserters.get(where || 'bottom')($(el, true), this);
		return this;
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
			$('myElement').appendText('. howdy');
		[/javascript]

		Result:
		[html]
			<div id="myElement">hey. howdy</div>
		[/html]
	*/

	appendText: function(text, where){
		return this.grab(new TextNode(text, this.ownerDocument), where);
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
			<div id="myFirstElement"></div>
			<div id="mySecondElement"></div>
			<div id="myThirdElement"></div>
			<div id="myFourthElement"></div>
		[/html]

		[javascript]
			$('myFirstElement').adopt('mySecondElement', 'myThirdElement', 'myFourthElement');
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
		Array.flatten(arguments).each(function(element){
			this.appendChild($(element, true));
		}, this);
		return this;
	},

	/*
	Method: dispose
		Removes the Element from the DOM.

	Syntax:
		>var removedElement = myElement.dispose();

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement"></div>
			<div id="mySecondElement"></div>
		[/html]

		[javascript]
			$('myElement').dispose() //bye bye
		[/javascript]

		Results:
		[html]
			<div id="mySecondElement"></div>
		[/html]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.removeChild>
	*/

	dispose: function(){
		return this.parentNode.removeChild(this);
	},

	/*
	Method: clone
		Clones the Element and returns the cloned one.

	Syntax:
		>var copy = myElement.clone([contents]);

	Arguments:
		contents - (boolean, optional: defaults to true) When true the Element is cloned with childNodes.

	Returns:
		(element) The cloned Element.

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
		var temp = new Element('div').grab(this.cloneNode(contents !== false));
		Array.each(temp.getElementsByTagName('*'), function(element){
			if (element.id) element.removeAttribute('id');
		});
		return new Element('div').set('html', temp.innerHTML).getFirst();
	},

	/*
	Method: replaceWith
		Replaces the Element with an Element passed.

	Syntax:
		>var replacingElement = myElement.replaceWidth(el);

	Arguments:
		el - (mixed) A string id representing the Element to be injected in, or an Element reference.
			In addition, if you pass div or another tag, the Element will be created.

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
			$('mySecondElement').getPrevious().dispose(); //get the previous DOM Element from mySecondElement and removes.
		[/javascript]

		Result:
		[html]
			<div id="mySecondElement"></div>
		[/html]

		See Also:
			<Element.remove>
	*/

	getPrevious: function(match, all){
		return Element.walk(this, 'previousSibling', null, match, all);
	},
	
	/*
	Method: getAllNPrevious
		like Element.getPrevious, but returns a collection of all the matched previousSiblings.
	*/
	
	getAllPrevious: function(match){
		return this.getPrevious(match, true);
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

	getNext: function(match, all){
		return Element.walk(this, 'nextSibling', null, match, all);
	},
	
	/*
	Method: getAllNext
		like Element.getNext, but returns a collection of all the matched nextSiblings.
	*/
	
	getAllNext: function(match){
		return this.getNext(match, true);
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

	getFirst: function(match){
		return Element.walk(this, 'nextSibling', 'firstChild', match);
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

	getLast: function(match){
		return Element.walk(this, 'previousSibling', 'lastChild', match);
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

	getParent: function(match, all){
		return Element.walk(this, 'parentNode', null, match, all);
	},
	
	/*
	Method: getParents
		like Element.getParent, but returns a collection of all the matched parentNodes.
	*/
	
	getParents: function(match){
		return this.getParent(match, true);
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

	getChildren: function(match){
		return Element.walk(this, 'nextSibling', 'firstChild', match, true);
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
		if (!(el = $(el, true))) return false;
		return !!$A(this.getElementsByTagName(Element.get(el, 'tag'))).contains(el);
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
		var elements = $A(this.getElementsByTagName('*'));
		elements.each(function(element){
			$try(Element.prototype.dispose, element);
		});
		Garbage.trash(elements);
		$try(Element.prototype.set, this, ['html', '']);
		return this;
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
		Garbage.kill(this.empty().dispose());
		return null;
	},

	/*
	Method: toQueryString
		Reads the children inputs of the Element and generates a query string, based on their values.

	Syntax:
		>var query = myElement.toQueryString();

	Returns:
		(string) A string representation of a Form element and its children.

	Example:
		[html]
			<form id="myForm" action="submit.php">
				<input name="email" value="bob@bob.com">
				<input name="zipCode" value="90210">
			</form>
		[/html]

		[/javascript]
			$('myForm').toQueryString() //email=bob@bob.com&zipCode=90210\
		[/javascript]

	Note:
		Used internally in <Ajax>.
	*/

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el){
			var name = el.name, type = el.type, value = Element.get(el, 'value');
			if (value === false || !name || el.disabled) return;
			$splat(value).each(function(val){
				queryString.push(name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	getProperty: function(attribute){
		var key = Element.Attributes.Properties[attribute];
		var value = (key) ? this[key] : this.getAttribute(attribute);
		return (Element.Attributes.Booleans[attribute]) ? !!value : value;
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
			var imgProps = $('myImage').getProperties();
			// returns: { id: 'myImage', src: 'mootools.png', title: 'MooTools, the compact JavaScript framework', alt: '' }
		[/javascript]

	See Also:
		<Element.getProperty>
	*/

	getProperties: function(){
		var result = {};
		Array.each(arguments, function(attribute){
			result[attribute] = this.getProperty(attribute);
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

	setProperty: function(attribute, value){
		if (!$chk(value)) return this.removeProperty(attribute);
		var key = Element.Attributes.Properties[attribute];
		value = (Element.Attributes.Booleans[attribute] && value) ? attribute : value;
		if (key) this[key] = value;
		this.setAttribute(attribute, value);
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

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
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

	removeProperty: function(attribute){
		var key = Element.Attributes.Properties[attribute];
		if (key) this[key] = Element.Attributes.Booleans[attribute] ? false : '';
		this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	}

});

TextNode.implement({

	inject: Element.prototype.inject,

	dispose: Element.prototype.dispose

});

Element.alias('dispose', 'remove');

Element.Setters = new Hash({

	style: function(text){
		this.style.cssText = text;
	},

	/*
	Element Setter: html
		Sets the innerHTML of the Element.

	Syntax:
		>myElement.set('html', [htmlString[, htmlString2[, htmlString3[, ..]]]);

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
			$('myElement').set('html', '<div></div>', '<p></p>');
		[/javascript]

		Result:
		[html]
			<div id="myElement">
				<div></div>
				<p></p>
			</div>
		[/html]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.innerHTML>
	*/

	html: function(){
		this.innerHTML = Array.join(arguments, '');
	},

	/*
	Element Setter: text
		Sets the inner text of the Element.

	Syntax:
		>myElement.set('text', text);

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
			$('myElement').set('text', 'some text') //the text of myElement is now = 'some text'
		[/javascript]

		Result:
		[html]
			<div id="myElement">some text</div>
		[/html]
	*/

	text: function(text){
		if (this.get('tag') == 'style'){
			if (Browser.Engine.trident){
				this.styleSheet.cssText = text;
			} else {
				if (this.firstChild) this.removeChild(this.firstChild);
				this.appendText(text);
			}
		} else {
			var innerText = this.innerText;
			this[$defined(innerText) ? 'innerText' : 'textContent'] = text;
		}
	}

});

Element.Getters = new Hash({

	style: function(){
		return this.style.cssText;
	},

	/*
	Element Getter: value
		Returns the value of the Element, if its tag is textarea, select or input. getValue called on a multiple select will return an array.

	Syntax:
		>var value = myElement.get('value');

	Returns:
		(mixed) Returns false if if tag is not a 'select', 'input', or 'textarea'. Otherwise returns the value of the Element.

	Example:
		HTML:
		[html]
			<form id="myForm">
				<select>
					<option value="volvo">Volvo</option>
					<option value="saab" selected="yes">Saab</option>
					<option value="opel">Opel</option>
					<option value="audi">Audi</option>
				</select>
			</form>
		[/html]

		Result:
		[javascript]
			var result = $('myForm').getElement('select').get('value'); // returns 'Saab'
		[/javascript]
	*/

	value: function(){
		switch (Element.get(this, 'tag')){
			case 'select':
				var values = [];
				Array.each(this.options, function(option){
					if (option.selected) values.push(option.value);
				});
				return (this.multiple) ? values : values[0];
			case 'input': if (['checkbox', 'radio'].contains(this.type) && !this.checked) return false;
			default: return $pick(this.value, false);
		}
	},

	/*
	Element Getter: tag
		Returns the tagName of the Element in lower case.

	Syntax:
		>var myTag = myElement.get('tag');

	Returns:
		(string) The tag name in lower case

	Example:
		HTML:
		[html]
			<img id="myImage" />
		[/html]

		[javascript]
			var myTag = $('myImage').get('tag') // myTag = 'img';
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.tagName>
	*/

	tag: function(){
		return this.tagName.toLowerCase();
	},

	/*
	Element Getter: html
		returns the innerHTML of the Element.

	Syntax:
		>myElement.get('html');

	Returns:
		(element) This Element.

	Example:
		HTML:
		[html]
			<div id="myElement">ciao</div>
		[/html]

		[javascript]
			$('myElement').get('html');
		[/javascript]

		Result: ciao

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.innerHTML>
	*/

	html: function(){
		return this.innerHTML;
	},

	/*
	Element Getter: text
		Gets the inner text of the Element.

	Syntax:
		>var myText = myElement.get('text');

	Returns:
		(string) The text of the Element.

	Example:
		HTML:
		[html]
			<div id="myElement">my text</div>
		[/html]

		[javascript]
			var myText = $('myElement').get('text'); //myText = 'my text';
		[/javascript]
	*/

	text: function(){
		if (this.get('tag') == 'style') return (Browser.Engine.trident) ? this.styleSheet.cssText : this.innerHTML;
		var innerText = this.innerText;
		var textContent = this.textContent;
		return $pick(innerText, textContent);
	}

});

Element.Erasers = new Hash({

	style: function(){
		this.style.cssText = '';
	}

});

Element.walk = function(element, walk, start, match, all){
	var el = (start) ? element[start] : element[walk];
	var elements = [];
	while (el){
		if (el.nodeType == 1 && Element.match(el, match)){
			elements.push(el);
			if (!all) break;
		}
		el = el[walk];
	}
	return (all) ? new Elements(elements) : $(elements[0]);
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

Element.Attributes = {

	Properties: {
		'accesskey': 'accessKey', 'cellpadding': 'cellPadding', 'cellspacing': 'cellSpacing', 'colspan': 'colSpan',
		'class': 'className', 'for': 'htmlFor', 'frameborder': 'frameBorder', 'maxlength': 'maxLength', 'readonly': 'readOnly',
		'rowspan': 'rowSpan', 'tabindex': 'tabIndex', 'usemap': 'useMap', 'value': 'value'
	},

	Booleans: ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer']

};

Element.Attributes.Booleans = Element.Attributes.Booleans.associate(Element.Attributes.Booleans);
Hash.merge(Element.Attributes.Properties, Element.Attributes.Booleans);

var Garbage = {

	Elements: {},

	ignored: {'object': 1, 'embed': 1, 'OBJECT': 1, 'EMBED': 1},

	collect: function(el){
		if (el.$attributes) return true;
		if (Garbage.ignored[el.tagName]) return false;
		Garbage.Elements[el.uid] = el;
		el.$attributes = {};
		return true;
	},

	trash: function(elements){
		for (var i = elements.length, el; i--; i) Garbage.kill(elements[i]);
	},

	kill: function(el){
		if (!el || !el.$attributes) return;
		delete Garbage.Elements[el.uid];
		if (el.retrieve('events')) el.removeEvents();
		for (var p in el.$attributes) el.$attributes[p] = null;
		if (Browser.Engine.trident){
			for (var d in Element.Prototype) el[d] = null;
		}
		el.$attributes = el.uid = null;
	},

	empty: function(){
		for (var uid in Garbage.Elements) Garbage.kill(Garbage.Elements[uid]);
	}

};

window.addListener('beforeunload', function(){
	window.addListener('unload', Garbage.empty);
	if (Browser.Engine.trident) window.addListener('unload', CollectGarbage);
});