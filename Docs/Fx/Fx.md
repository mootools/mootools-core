Class: Fx {#Fx}
===============

This Class will rarely be used on its own, but provides the foundation for all custom Fx Classes.
All of the other Fx Classes inherit from this one.

### Implements:

- [Chain][], [Events][], [Options][]



Fx Method: constructor {#Fx:constructor}
----------------------------------------

### Syntax:

	var myFx = new Fx([options]);

### Arguments:

1. options - (*object*, optional) An object with options for the effect. See below.

### Options:

* fps        - (*number*: defaults to 50) The frames per second for the transition.
* unit       - (*string*: defaults to false) The unit, e.g. 'px', 'em', or '%'. See [Element:setStyle](/Element/Element/#Element:setStyle).
* link       - (*string*: defaults to ignore) Can be 'ignore', 'cancel' and 'chain'.
	* 'ignore' - Any calls made to start while the effect is running will be ignored. (Synonymous with 'wait': true from 1.x)
	* 'cancel' - Any calls made to start while the effect is running will take precedence over the currently running transition. The new transition will start immediately, canceling the one that is currently running. (Synonymous with 'wait': false from 1.x)
	* 'chain'  - Any calls made to start while the effect is running will be chained up, and will take place as soon as the current effect has finished, one after another.
* duration   - (*number*: defaults to 500) The duration of the effect in ms. Can also be one of:
	* 'short'  - 250ms
	* 'normal' - 500ms
	* 'long'   - 1000ms
* transition - (*function*: defaults to ['sine:in:out'](/Fx/Fx.Transitions) The equation to use for the effect see [Fx.Transitions](/Fx/Fx.Transitions). Also accepts a string in the following form:

  transition\[:in\]\[:out\] - for example, 'linear', 'quad:in', 'back:in', 'bounce:out', 'elastic:out', 'sine:in:out'

### Events:

* start    		- (*function*) The function to execute when the effect begins.
* cancel   		- (*function*) The function to execute when you manually stop the effect.
* complete 		- (*function*) The function to execute after the effect has processed.
* chainComplete	- (*function*) The function to execute when using link 'chain' ([see options](#Fx:constructor)). It gets called after all effects in the chain have completed.

### Notes:

- You cannot change the transition if you haven't included Fx.Transitions.js, (unless you plan on developing your own curve). ;)
- The Fx Class is just a skeleton for other Classes to extend the basic functionality.

### See Also:

- [Fx.Tween][], [Fx.Morph][].



Fx Method: start {#Fx:start}
----------------------------

The start method is used to begin a transition.  Fires the 'start' event.

### Syntax:

	myFx.start(from[, to]);

### Arguments:

1. from - (*mixed*) The starting value for the effect. If only one argument is provided, this value will be used as the target value.
2. to   - (*mixed*, optional) The target value for the effect.

### Returns:

* (*object*) - This Fx instance.

### Examples:

- See examples in the documentation for each Fx subclass.

### Notes:

- If only one parameter is provided, the first argument to start will be used as the target value, and the initial value will be calculated from the current state of the element.
- The format and type of this value will be dependent upon implementation, and may vary greatly on a case by case basis.  Check each implementation for more details.



Fx Method: set {#Fx:set}
------------------------

The set method is fired on every step of a transition.  It can also be called manually to set a specific value to be immediately applied to the effect.

### Syntax:

	myFx.set(value);

### Arguments:

1. value - (*mixed*) The value to immediately apply to the transition.

### Returns:

* (*object*) - This Fx instance.

### Examples:

- See examples in the documentation for each Fx subclass.



Fx Method: cancel {#Fx:cancel}
------------------------------

The cancel method is used to cancel a running transition.  Fires the 'cancel' event.

### Syntax:

	myFx.cancel();

### Returns:

* (*object*) - This Fx instance.



Fx Method: pause {#Fx:pause}
----------------------------

Temporarily pause a currently running effect.

### Syntax:

	myFx.pause();

### Returns:

* (*object*) - This Fx instance.

### Notes:

- The timer will be stopped to allow the effect to continue where it left off by calling [Fx:resume](#Fx:resume).
- If you call start on a paused effect, the timer will simply be cleared allowing the new transition to start.



Fx Method: resume {#Fx:resume}
------------------------------

Resume a previously paused effect.

### Syntax:

	myFx.resume();

### Returns:

* (*object*) - This Fx instance.

### Notes:

- The effect will only be resumed if it has been previously paused.  Otherwise, the call to resume will be ignored.



[Fx]: #Fx
[Chain]: /Class/Class.Extras#Chain
[Events]: /Class/Class.Extras#Events
[Options]: /Class/Class.Extras#Options
[Fx.Tween]: /Fx/Fx.Tween
[Fx.Morph]: /Fx/Fx.Morph
