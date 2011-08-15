Custom Event: Change
==========================

- This custom change event ensures the onchange event behaves the same across browsers.
- The change event is strictly intended for elements that support the native onchange event.
- For further information on cross-browser issues with the change event, visit Peter-Paul Koch's Quirksmode change event page: http://www.quirksmode.org/dom/events/change.html

Element.Events.change
----------------------

### Event: change {#Element-Events:change}

This event fires immediatly after an element's value changes

#### Examples:
	// Adding a change event directly to an element
	$('myElement').addEvent('change', myFunction);
	
	// Delegating a change event to many elements
	$('myContainer').addEvent('change:relay(input)', myFunction);