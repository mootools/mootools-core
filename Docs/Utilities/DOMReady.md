Window Event: domready
========================

Contains the window [Event][] 'domready', which executes when the DOM is loaded.

To ensure that DOM elements exist when the code attempts to access them is executed, they need to be placed within the 'domready' event.

### Note:

This event is only available to the window element.

### Example:

	window.addEvent('domready', function() {
		alert('The DOM is ready!');
	});

### See Also:
[Element.Event][]

[Event]: /core/Element/Element.Event
[Element.Event]: /core/Element/Element.Event
