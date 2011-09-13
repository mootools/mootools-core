Type: Element {#Element}
========================

Extends the [Element][] type to include event-delegation in its event system.

Event delegation is a common practice where an event listener is attached to a parent element to monitor its children rather than attach events to every single child element. It's more efficient for dynamic content or highly interactive pages with a lot of DOM elements.

### Demo:

* [Element.Delegation](http://mootools.net/demos/?demo=Element.Delegation)

### Example:

An example of how delegation is usually applied. Delegation is extra useful when working with dynamic content like AJAX.

	var myElement = $('myElement');
	var request = new Request({
		// other options
		onSuccess: function(text){
			myElement.set('html', text); // No need to attach more click events.
		}
	});
	// Adding the event, notice the :relay syntax with the selector that matches the target element inside of myElement.
	// Every click on an anchor-tag inside of myElement executes this function.
	myElement.addEvent('click:relay(a)', function(event, target){
		event.preventDefault();
		request.send({
			url: target.get('href')
		});
	});

### Notes:

* Delegation is especially useful if you are using AJAX to load content into your pages dynamically, as the contents of an element can change with new elements added or others removed and your delegated events need not change.
* By delegating events to parent objects you can dramatically increase the efficiency of your pages. Consider the example above. You could attach events to every link on a page - which may be hundreds of DOM elements - or you can delegate the event to the document body, evaluating your code only when the user actually clicks a link (instead of on page load/domready).
* You can use any selector in combination with any event
* Be wary of the cost of delegation; for example, mouseover/mouseout delegation on an entire document can cause your page to run the selector constantly as the user moves his or her mouse around the page. Delegation is not always the best solution.
* In general it is always better to delegate to the closest parent to your elements as possible; delegate to an element in the page rather than the document body for example.

Element method: addEvent {#Element:addEvent}
--------------------------------------------

Delegates the methods of an element's children to the parent element for greater efficiency when a selector is provided. Otherwise it will work like [addEvent][].

### Syntax:

	myElement.addEvent(typeSelector, fn);

### Arguments:

2. typeSelector - (*string*) An event name (click, mouseover, etc) that should be monitored paired with a selector (see example) to limit functionality to child elements.
3. fn - (*function*) The callback to execute when the event occurs (passed the event just like any other [addEvent][] usage and a second argument, the element that matches your selector that was clicked).


### Example:

	// Alerts when an anchor element with class 'myStyle' is clicked inside of myElement
	document.id(myElement).addEvent('click:relay(a.myStyle)', function(){
		alert('hello');
	});


	document.id('myElement').addEvent('click:relay(a)', function(event, clicked){
		event.preventDefault(); //don't follow the link
		alert('you clicked a link!');
		// You can reference the element clicked with the second
		// Argument passed to your callback
		clicked.setStyle('color', '#777');
	});

### Returns:

* *element* - This element.

Element method: addEvents {#Element:addEvents}
----------------------------------------------

Delegates the events to the parent just as with addEvent above. Works like [addEvents][].

### Example:

	$('myElement').addEvents({
		// monitor an element for mouseover
		mouseover: fn,
		// but only monitor child links for clicks
		'click:relay(a)': fn2
	});


Element method: removeEvent {#Element:removeEvent}
--------------------------------------------------

Removes a method from an element like [removeEvent][].

### Example:

	var monitor = function(event, element){
		alert('you clicked a link!');
	};

	$('myElement').addEvent('click:relay(a)', monitor);
	// link clicks are delegated to element

	// remove delegation:
	$('myElement').removeEvent('click:relay(a)', monitor);


Element method: removeEvents {#Element:removeEvents}
----------------------------------------------------

Removes a series of methods from delegation if the functions were used for delegation or else works like [removeEvents][].

### Example:

	var monitor = function(){
		alert('you clicked or moused over a link!');
	};

	$('myElement').addEvents({
		'mouseover:relay(a)': monitor,
		'click:relay(a)': monitor
	});

	// link clicks are delegated to element
	// remove the delegation:
	$('myElement').removeEvents({
		'mouseover:relay(a)': monitor,
		'click:relay(a)': monitor
	});

	// remove all click:relay(a) events
	$('myElement').removeEvents('click:relay(a)');



[Element]: /core/Element/Element
[addEvent]: /core/Element/Element.Event#Element:addEvent
[addEvents]: /core/Element/Element.Event#Element:addEvents
[removeEvent]: /core/Element/Element.Event#Element:removeEvent
[removeEvents]: /core/Element/Element.Event#Element:removeEvents
