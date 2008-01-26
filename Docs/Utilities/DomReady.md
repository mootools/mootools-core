Window Event: domready
========================

Contains the window Event 'domready', which will execute when the DOM has loaded.  To ensure that DOM elements exist when the code attempting to access them is executed, they should be placed within the 'domready' event.

This event is only available to the window Element.

### Example:

	window.addEvent('domready', function() {
		alert("The DOM is ready.");
	});

### See Also:
[Element.Event][]

[Element.Event]: /Element/Element.Event