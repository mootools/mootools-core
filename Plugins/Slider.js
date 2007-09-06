/*
Script: Slider.js
	Contains <Slider>

License:
	MIT-style license.

Note:
	The Slider requires an XHTML doctype.
*/

/*
Class: Slider
	Creates a slider with two elements: a knob and a container.

Syntax:
	>var mySlider = new Slider(element, knob[, options]);

Arguments:
	element - (element) The knob element for the slider.
	knob    - (element) The handle element for the slider.
	options - (object) An optional object for customizing the Slider.

	options (continued):
		steps  - (number: defaults to 100) The number of steps the Slider should move/tick.
		mode   - (string: defaults to horizontal) The type of Slider can be either 'horizontal' or 'vertical' in movement.
		offset - (number: defaults to: 0) Relative offset for knob position at start.

Events:
	onChange - (function) Fires when the Slider's value changes.
		Signature:
			>onChange(step)

		Arguments:
			step - (number) The current step that the Slider is on.

	onComplete - (function) Fire when you're done dragging.
		Signature:
			>onComplete(step)

		Arguments:
			step - (string) The current step that the Slider is on as a string.

	onTick - (function) Fires when the user drags the knob. This Event can be overriden to alter the onTick behavior.
		Signature:
			>onTick(pos)

		Arguments:
			pos - (number) The current position that slider moved to.

		Note:
			Slider originally uses the onTick event to set the style of the knob to a new position.

Returns:
	(class) A new Slider instance.

Example:
	[javascript]
		var mySlider = new Slider('myElement', 'myKnob', {
			onStart: function(){
				this.borderFx = this.borderFx || this.element.effect('border').start('#ccc');
			}
			onTick: function(pos){
				this.element.setStyle('border-color', '#f00');
				this.knob.setStyle(this.p, pos);
			},
			onComplete: function(){
				this.element.effect('border').start('#000');
			}
		});
	[/javascript]
*/

var Slider = new Class({

	Implements: [Events, Options],

	options: {
		onTick: function(pos){
			this.knob.setStyle(this.p, pos);
		},
		mode: 'horizontal',
		steps: 100,
		offset: 0
	},

	initialize: function(element, knob, options){
		this.element = $(element);
		this.knob = $(knob);
		this.setOptions(options);
		this.previousChange = -1;
		this.previousEnd = -1;
		this.step = -1;
		this.element.addEvent('mousedown', this.clickedElement.bind(this));
		var mod, offset;
		switch (this.options.mode){
			case 'horizontal':
				this.z = 'x';
				this.p = 'left';
				mod = {'x': 'left', 'y': false};
				offset = 'offsetWidth';
				break;
			case 'vertical':
				this.z = 'y';
				this.p = 'top';
				mod = {'x': false, 'y': 'top'};
				offset = 'offsetHeight';
		}
		this.max = this.element[offset] - this.knob[offset] + (this.options.offset * 2);
		this.half = this.knob[offset] / 2;
		this.getPos = this.element['get' + this.p.capitalize()].bind(this.element);
		this.knob.setStyle('position', 'relative').setStyle(this.p, - this.options.offset);
		var lim = {};
		lim[this.z] = [- this.options.offset, this.max - this.options.offset];
		this.drag = new Drag(this.knob, {
			limit: lim,
			modifiers: mod,
			snap: 0,
			onStart: function(){
				this.draggedKnob();
			}.bind(this),
			onDrag: function(){
				this.draggedKnob();
			}.bind(this),
			onComplete: function(){
				this.draggedKnob();
				this.end();
			}.bind(this)
		});
	},

	/*
	Property: set
		The slider will move to the passed position.

	Syntax:
		>mySlider.set(step);

	Arguments:
		step - (number) A number to position the Slider to.

	Returns:
		(class) This Slider instance.

	Example:
		[javascript]
			var mySlider = new Slider('myElement', 'myKnob');
			mySlider.set(0);

			var myPeriodical = (function(){
				if(this.step == this.options.steps) $clear(myPeriodical);

				this.set(this.step++);
			}).periodical(1000, mySlider);
		[/javascript]

	Note:
		Step will automatically be limited between 0 and the optional steps value.
	*/

	set: function(step){
		this.step = step.limit(0, this.options.steps);
		this.checkStep();
		this.end();
		this.fireEvent('onTick', this.toPosition(this.step));
		return this;
	},

	clickedElement: function(event){
		var position = event.page[this.z] - this.getPos() - this.half;
		position = position.limit(-this.options.offset, this.max -this.options.offset);
		this.step = this.toStep(position);
		this.checkStep();
		this.end();
		this.fireEvent('onTick', position);
	},

	draggedKnob: function(){
		this.step = this.toStep(this.drag.value.now[this.z]);
		this.checkStep();
	},

	checkStep: function(){
		if (this.previousChange != this.step){
			this.previousChange = this.step;
			this.fireEvent('onChange', this.step);
		}
	},

	end: function(){
		if (this.previousEnd !== this.step){
			this.previousEnd = this.step;
			this.fireEvent('onComplete', this.step + '');
		}
	},

	toStep: function(position){
		return Math.round((position + this.options.offset) / this.max * this.options.steps);
	},

	toPosition: function(step){
		return this.max * step / this.options.steps;
	}

});