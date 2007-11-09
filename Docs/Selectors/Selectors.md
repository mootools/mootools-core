Script: Selectors.js
	Css Query related <Element> extensions

License:
	MIT-style license.



Class: Element
	Custom class to allow all of its methods to be used with any Selectors element via the dollar function <$>.



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




Function: $E
	Alias for <Element.getElement>, using document as context.




Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.




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
