Class: Slider {#Slider}
=======================

**Creates a slider with two elements: a knob and a container.**

### Note:

- Slider requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Syntax:

	var mySlider = new Slider(element, knob[, options]);

### Arguments:

1. element - (*element*) The knob element for the slider.
2. knob    - (*element*) The handle element for the slider.
3. options - (*object*) An optional object for customizing the Slider.

#### Options:

1. snap   - (*boolean*: defaults to false) True if you want the knob to snap to the nearest value.
2. offset - (*number*: defaults to 0) Relative offset for knob position at start.
3. range  - (*mixed*: defaults to false) Array of numbers or false. The minimum and maximum limits values the slider will use.
4. wheel  - (*boolean*: defaults to false) True if you want the ability to move the knob by mousewheeling.
5. steps  - (*number*: defaults to 100) The number of steps the Slider should move/tick.
6. mode   - (*string*: defaults to horizontal) The type of Slider can be either 'horizontal' or 'vertical' in movement.

### Notes:

- Range option allows an array of numbers. Numbers can be negative and positive.



Slider Event: change {#Slider:change}
-----------------------------------------

* (*function*) Fires when the Slider's value changes.

### Signature:

	onChange(step)

### Arguments:

1. step - (*number*) The current step that the Slider is on.



Slider Event: onComplete {#Slider:complete}
---------------------------------------------

* (*function*) Fire when you're done dragging.

### Signature:

	onComplete(step)

### Arguments:

1. step - (*string*) The current step that the Slider is on as a string.



Slider Event: tick {#Slider:tick}
-------------------------------------

* (*function*) Fires when the user drags the knob. This Event can be overriden to alter the tick behavior.

### Signature:

	onTick(pos)

### Arguments:

1. pos - (*number*) The current position that slider moved to.

### Notes:

- Slider originally uses the 'tick' event to set the style of the knob to a new position.

### Returns:

* (*object*) A new Slider instance.

### Examples:

	var mySlider = new Slider('myElement', 'myKnob', {
		range: [-50, 50],
		wheel: true,
		snap: true,
		onStart: function(){
			this.borderFx = this.borderFx || this.element.tween('border').start('#ccc');
		},
		onTick: function(pos){
			this.element.setStyle('border-color', '#f00');
			this.knob.setStyle(this.p, pos);
		},
		onComplete: function(){
			this.element.tween('border').start('#000');
		}
	});



Slider Method: set {#Slider:set}
--------------------------------

**The slider will move to the passed position.**

###	Syntax:

	mySlider.set(step);

###	Arguments:

1. step - (*number*) A number to position the Slider to.

###	Returns:

* (*object*) This Slider instance.

### Examples:

	var mySlider = new Slider('myElement', 'myKnob');
	mySlider.set(0);

	var myPeriodical = (function(){
		if(this.step == this.options.steps) $clear(myPeriodical);
			this.set(this.step++);
	}).periodical(1000, mySlider);

###	Notes:

- Step will automatically be limited between 0 and the optional steps value.