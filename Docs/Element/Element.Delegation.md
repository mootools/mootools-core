Type: Element {#Element}
========================

Extends the [Element][] type to include delegations in the addEvent and addEvents methods.

### Demo:

* [Element.Delegation](http://mootools.net/demos/?demo=Element.Delegation)

### Notes:

* By delegating events to parent objects you can dramatically increase the efficiency of your pages. Consider the example above. You could attach events to every link on a page - which may be hundreds of DOM elements - or you can delegate the event to the document body, evaluating your code only when the user actually clicks a link (instead of on page load/domready).
* You can use any selector in combination with any event
* Be wary of the cost of delegation; for example, mouseover/mouseout delegation on an entire document can cause your page to run the selector constantly as the user moves his or her mouse around the page. Delegation is not always the best solution.
* Delegation is especially useful if you are using AJAX to load content into your pages dynamically, as the contents of an element can change with new elements added or others removed and your delegated events need not change.
* In general it is always better to delegate to the closest parent to your elements as possible; delegate to an element in the page rather than the document body for example.

Element method: addEvent {#Element:addEvent}
--------------------------------------------

Delegates the methods of an element's children to the parent element for greater efficiency when a filter is provided. Otherwise works normally as [addEvent][] always does.

### Syntax:

	myElement.addEvent(typeSelector, fn);

### Arguments:

2. typeSelector - (*string*) An event name (click, mouseover, etc) that should be monitored paired with a selector (see example) to limit functionality to child elements.
3. fn - (*function*) The callback to execute when the event occurs (passed the event just like any other [addEvent][] usage and a second argument, the element that matches your selector that was clicked).


### Example:

	// Alerts when an anchor element is clicked with class myStyle in myElement
	document.id(myElement).addEvent('click:relay(a.myStyle)', function(){
		alert('hello');
	});


	$(element).addEvent('click:relay(a)', function(event, clicked){
		event.preventDefault(); //don't follow the link
		alert('you clicked a link!');
		//you can reference the element clicked with the second
		//argument passed to your callback
		clicked.setStyle('color', '#777');
	});

### Returns:

* *element* - This element.

Element method: addEvents {#Element:addEvents}
----------------------------------------------

Delegates the events to the parent just as with addEvent above. Works as [addEvents][] does.

### Example:

	myElement.addEvents({
		//monitor an element for mouseover
		mouseover: fn,
		//but only monitor child links for click
		'click:relay(a)': fn2
	});


Element method: removeEvent {#Element:removeEvent}
--------------------------------------------------

Removes a method from an element as [removeEvent][] always does.

### Example:

	var monitor = function(event, element){ alert('you clicked a link!')};
	$(element).addEvent('click:relay(a)', monitor);
	//link clicks are delegated to element

	//...now we remove the delegation:
	$(element).removeEvent('click:relay(a)', monitor);


Element method: removeEvents {#Element:removeEvents}
---------------------------------------------------

Removes a series of methods from delegation if the functions were used for delegation or else works as [removeEvents][] always does.

### Example:

	var monitor = function(){
		alert('you clicked or moused over a link!');
	};

	$(element).addEvents({
		'mouseover:relay(a)': monitor,
		'click:relay(a)': monitor
	});

	// link clicks are delegated to element
	// ...now we remove the delegation:
	$(element).removeEvents({
		'mouseover:relay(a)': monitor,
		'click:relay(a)': monitor
	});

	//or we could remove all click:relay(a) events
	$(element).removeEvents('click:relay(a)');



[Element]: /core/Element/Element
[addEvent]: /core/Element/Element.Event#Element:addEvent
[addEvents]: /core/Element/Element.Event#Element:addEvents
[removeEvent]: /core/Element/Element.Event#Element:removeEvent
[removeEvents]: /core/Element/Element.Event#Element:removeEvents
