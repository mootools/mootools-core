Class: Chain {#Chain}
=====================

A Utility Class which executes functions one after another, with each function firing after completion of the previous.
Its methods can be implemented with [Class:implement][] into any [Class][], and it is currently implemented in [Fx][] and [Request][].
In [Fx][], for example, it is used to create custom, complex animations.



Chain Method: constructor {#Chain:constructor}
----------------------------------------------


### Syntax:

#### For new classes:

	var MyClass = new Class({ Implements: Chain });

#### For existing classes:

	MyClass.implement(Chain);

#### Stand alone

	var myChain = new Chain;

### Example:

		var Todo = new Class({
			Implements: Chain,
			initialize: function(){
				this.chain.apply(this, arguments);
			}
		});

		var myTodoList = new Todo(
			function(){ alert('get groceries');	},
			function(){ alert('go workout'); },
			function(){ alert('code mootools documentation until eyes close involuntarily'); },
			function(){ alert('sleep');	}
		);

### See Also:

- [Class][]



Chain Method: chain {#Chain:chain}
----------------------------------

Adds functions to the end of the call stack of the Chain instance.

### Syntax:

	myClass.chain(fn[, fn2[, fn3[, ...]]]);

### Arguments:

1. fn - (*function* or *array*) The function (or array of functions) to add to the chain call stack. Will accept and number of functions or arrays of functions.

### Returns:

* (*object*) The current Class instance. Calls to chain can also be chained.

### Example:
	//Fx.Tween has already implemented the Chain class because of inheritance of the Fx class.
	var myFx = new Fx.Tween('myElement', {property: 'opacity'});
	myFx.start(1,0).chain(
		//Notice that "this" refers to the calling object (in this case, the myFx object).
		function(){ this.start(0,1); },
		function(){ this.start(1,0); },
		function(){ this.start(0,1); }
	); //Will fade the Element out and in twice.

### Note:

[Take care][resetThenable-note] when using Chain and [Class.Thenable][] together. When multiple "thenable" resolutions are chained, the registration of callbacks for later resolutions has to be chained as well.

### See Also:

- [Fx][], [Fx.Tween][]



Chain Method: callChain {#Chain:callChain}
------------------------------------------

Removes the first function of the Chain instance stack and executes it. The next function will then become first in the array.

### Syntax:

	myClass.callChain([any arguments]);

### Arguments:

1. Any arguments passed in will be passed to the "next" function.

### Returns:

* (*mixed*) The return value of the "next" function or false when the chain was empty.

### Example:

	var myChain = new Chain();
	myChain.chain(
		function(){ alert('do dishes'); },
		function(){ alert('put away clean dishes'); }
	);
	myChain.callChain(); // alerts 'do dishes'.
	myChain.callChain(); // alerts 'put away clean dishes'.



Chain Method: clearChain {#Chain:clearChain}
--------------------------------------------

Clears the stack of a Chain instance.

### Syntax:

	myClass.clearChain();

### Returns:

* (*object*) The current Class instance.

### Example:

	var myFx = Fx.Tween('myElement', 'color'); // Fx.Tween inherited Fx's implementation of Chain.
	myFx.chain(function(){ while(true) alert("D'oh!"); }); // chains an infinite loop of alerts.
	myFx.clearChain(); // cancels the infinite loop of alerts before allowing it to begin.

### See Also:

- [Fx][], [Fx.Tween][]



Class: Events {#Events}
=======================

A Utility Class. Its methods can be implemented with [Class:implement][] into any [Class][].
In [Fx][], for example, this Class is used to allow any number of functions to be added to the Fx events, like 'complete', 'start', and 'cancel'.
Events in a Class that implements [Events][] must be either added as an option or with addEvent, not directly through .options.onEventName.

### Syntax:

#### For new classes:

	var MyClass = new Class({ Implements: Events });

#### For existing classes:

	MyClass.implement(Events);

### Implementing:

- This class can be implemented into other classes to add its functionality to them.
- Events has been designed to work well with the [Options][] class. When the option property begins with 'on' and is followed by a capital letter it will be added as an event (e.g. 'onComplete' will add as 'complete' event).

### Example:

	var Widget = new Class({
		Implements: Events,
		initialize: function(element){
			// ...
		},
		complete: function(){
			this.fireEvent('complete');
		}
	});

	var myWidget = new Widget();
	myWidget.addEvent('complete', myFunction);

### Notes:

- Events starting with 'on' are still supported in all methods and are converted to their representation without 'on' (e.g. 'onComplete' becomes 'complete').


### See Also:

- [Class][], [Options][]



Events Method: addEvent {#Events:addEvent}
------------------------------------------

Adds an event to the Class instance's event stack.

### Syntax:

	myClass.addEvent(type, fn[, internal]);

### Arguments:

1. type     - (*string*) The type of event (e.g. 'complete').
2. fn       - (*function*) The function to execute.
3. internal - (*boolean*, optional) Sets the function property: internal to true. Internal property is used to prevent removal.

### Returns:

* (*object*) This Class instance.

### Example:

	var myFx = new Fx.Tween('element', 'opacity');
	myFx.addEvent('start', myStartFunction);


Events Method: addEvents {#Events:addEvents}
------------------------------------------

The same as [addEvent][], but accepts an object to add multiple events at once.

### Syntax:

	myClass.addEvents(events);

### Arguments:

1. events - (*object*) An object with key/value representing: key the event name (e.g. 'start'), and value the function that is called when the Event occurs.

### Returns:

* (*object*) This Class instance.

### Example:

	var myFx = new Fx.Tween('element', 'opacity');
	myFx.addEvents({
		start: myStartFunction,
		complete: function() {
			alert('Done.');
		}
	});



Events Method: fireEvent {#Events:fireEvent}
--------------------------------------------

Fires all events of the specified type in the Class instance.

### Syntax:

	myClass.fireEvent(type[, args[, delay]]);

### Arguments:

1. type  - (*string*) The type of event (e.g. 'complete').
2. args  - (*mixed*, optional) The argument(s) to pass to the function. To pass more than one argument, the arguments must be in an array.
3. delay - (*number*, optional) Delay in milliseconds to wait before executing the event (defaults to 0).

### Returns:

* (*object*) This Class instance.

### Example:

	var Widget = new Class({
		Implements: Events,
		initialize: function(arg1, arg2){
			//...
			this.fireEvent('initialize', [arg1, arg2], 50);
		}
	});



Events Method: removeEvent {#Events:removeEvent}
------------------------------------------------

Removes an event from the stack of events of the Class instance.

### Syntax:

	myClass.removeEvent(type, fn);

### Arguments:

1. type - (*string*) The type of event (e.g. 'complete').
2. fn   - (*function*) The function to remove.

### Returns:

* (*object*) This Class instance.

### Notes:

- If the function has the property internal and is set to true, then the event will not be removed.


Events Method: removeEvents {#Events:removeEvents}
--------------------------------------------------

Removes all events of the given type from the stack of events of a Class instance. If no type is specified, removes all events of all types.

### Syntax:

	myClass.removeEvents([events]);

### Arguments:

1. events - (optional) If not passed removes all events of all types.
	- (*string*) The event name (e.g. 'success'). Removes all events of that type.
	- (*object*) An object of type function pairs. Like the one passed to [addEvents][].

### Returns:

* (*object*) The current Class instance.

### Example:

	var myFx = new Fx.Tween('myElement', 'opacity');
	myFx.removeEvents('complete');


### Notes:

- removeEvents will not remove internal events. See [Events:removeEvent][].



Class: Options {#Options}
=========================

A Utility Class. Its methods can be implemented with [Class:implement][] into any [Class][].
Used to automate the setting of a Class instance's options.
Will also add Class [Events][] when the option property begins with 'on' and is followed by a capital letter (e.g. 'onComplete' adds a 'complete' event). You will need to call this.setOptions() for this to have an effect, however.

### Syntax:

#### For new classes:

	var MyClass = new Class({Implements: Options});

#### For existing classes:

	MyClass.implement(Options);



Options Method: setOptions {#Options:setOptions}
------------------------------------------------

Merges the default options of the Class with the options passed in. Every value passed in to this method will be deep copied. Therefore other class instances or objects that are not intended for copying must be passed to a class in other ways.

### Syntax:

	myClass.setOptions([options]);

### Arguments:

1. options - (*object*, optional) The user defined options to merge with the defaults.

### Returns:

* (*object*) The current Class instance.

### Example:

	var Widget = new Class({
		Implements: Options,
		options: {
			color: '#fff',
			size: {
				width: 100,
				height: 100
			}
		},
		initialize: function(options){
			this.setOptions(options);
		}
	});

	var myWidget = new Widget({
		color: '#f00',
		size: {
			width: 200
		}
	});

	//myWidget.options is now: {color: #f00, size: {width: 200, height: 100}}

	// Deep copy example
	var mySize = {
		width: 50,
		height: 50
	};

	var myWidget = new Widget({
		size: mySize
	});

	(mySize == myWidget.options.size) // false! mySize was copied in the setOptions call.

### Notes:

- Relies on the default options of a Class defined in its options property.


Options in combination with Events
-----------------------------------

If a Class has [Events][] as well as [Options][] implemented, every option beginning with 'on' and followed by a capital letter (e.g. 'onComplete') becomes a Class instance event, assuming the value of the option is a function.

### Example:

	var Widget = new Class({
		Implements: [Options, Events],
		options: {
			color: '#fff',
			size: {
				width: 100,
				height: 100
			}
		},
		initialize: function(options){
			this.setOptions(options);
		},
		show: function(){
			// Do some cool stuff

			this.fireEvent('show');
		}

	});

	var myWidget = new Widget({
		color: '#f00',
		size: {
			width: 200
		},
		onShow: function(){
			alert('Lets show it!');
		}
	});

	myWidget.show(); // fires the event and alerts 'Lets show it!'


[Class]: /core/Class/Class
[Class:implement]: /core/Class/Class/#Class:implement
[Class.Thenable]: /core/Class/Class/Class.Thenable
[Fx]: /core/Fx/Fx
[Fx.Tween]: /core/Fx/Fx.Tween
[Request]: /core/Request/Request
[Request.HTML]: /core/Request/Request.HTML
[Events:removeEvent]: /core/Element/Element.Event/#Element:removeEvent
[Events]: #Events
[Options]: #Options
[addEvent]: #Events:addEvent
[addEvents]: #Events:addEvents
[resetThenable-note]: /core/Class/Class.Thenable#Class.Thenable:resetThenable-note
