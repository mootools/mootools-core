# Window Event: domready

Contains the window [Event][] 'domready', which executes when the DOM is loaded.

To ensure that DOM elements exist when the code attempts to access them is executed, they need to be placed within the 'domready' event.

### Example:

	window.addEvent('domready', function() {
		alert('The DOM is ready!');
	});

### Notes:

- This event is only available to the window element.
- In some versions of Internet Explorer (ie. IE6) a script tag might be executed twice if the content-type meta-tag declaration is put after a script tag. The content-type should always be declared before any script tags.

### See Also:
[Element.Event][Event]

[Event]: /core/Element/Element.Event
