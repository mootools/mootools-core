Custom Event: Change
==========================

- This custom change event unifies the behavior of radios and checkboxes across browsers and enables accurate delegation support for the change event.
- The change event is strictly intended for elements that support the native onchange event. This custom event does not unify the behavior of the key cycling of options on select elements.
- For further information on cross-browser issues with the change event, visit Peter-Paul Koch's Quirksmode [change event compatibility page](http://www.quirksmode.org/dom/events/change.html).

Element.Events.change
----------------------

### Event: change {#Element-Events:change}

This event fires immediatly after an element's value changes

#### Examples:
	// Adding a change event directly to an element
	$('myElement').addEvent('change', myFunction);
	
	// Delegating a change event to many elements
	$('myContainer').addEvent('change:relay(input)', myFunction);
