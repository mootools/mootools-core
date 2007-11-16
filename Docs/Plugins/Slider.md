Class: Slider {#Slider}
=======================

**Creates a slider with two elements: a knob and a container.**

### Remark:

- The Slider requires an XHTML doctype.

### Syntax:

	var mySlider = new Slider(element, knob[, options]);

### Arguments:

1. **element** - (*element*) The knob element for the slider.
2. **knob**    - (*element*) The handle element for the slider.
3. **options** - (*object*) An optional object for customizing the Slider.

#### Options:

1. **steps**  - (*number*: defaults to 100) The number of steps the Slider should move/tick.
2. **mode**   - (*string*: defaults to horizontal) The type of Slider can be either 'horizontal' or 'vertical' in movement.
3. **offset** - (*number*: defaults to: 0) Relative offset for knob position at start.



Slider Event: onChange {#Slider:onChange}
-----------------------------------------

* (*function*) Fires when the Slider's value changes.

### Signature:

	onChange(step)

### Arguments:

1. **step** - (*number*) The current step that the Slider is on.



Slider Event: onComplete {#Slider:onComplete}
---------------------------------------------

* (*function*) Fire when you're done dragging.

### Signature:

	onComplete(step)

### Arguments:

1. **step** - (*string*) The current step that the Slider is on as a string.



Slider Event: onTick {#Slider:onTick}
-------------------------------------

* (*function*) Fires when the user drags the knob. This Event can be overriden to alter the onTick behavior.

### Signature:

	onTick(pos)

### Arguments:

1. **pos** - (*number*) The current position that slider moved to.

### Notes:

- Slider originally uses the onTick event to set the style of the knob to a new position.

### Properties:

1. **element** - (*element*) The knob element for the slider.
2. **knob**    - (*element*) The handle element for the slider.
3. **step**    - (*integer*) The current location of the knob.
4. **drag**    - (*object*) An instance of <Drag> used for the knob.

### Returns:

* (*object*) A new Slider instance.

### Examples:

	var mySlider = new Slider('myElement', 'myKnob', {
		onStart: function(){
			this.borderFx = this.borderFx || this.element.tween('border').start('#ccc');
		}
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

1. **step** - (*number*) A number to position the Slider to.

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