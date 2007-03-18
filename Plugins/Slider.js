/*
Script: Slider.js
	Contains <Slider>

License:
	MIT-style license.
*/

/*
Class: Slider
	Creates a slider with two elements: a knob and a container. Returns the values.

Arguments:
	element - the knob container
	knob - the handle
	options - see Options below

Options:
	onChange - a function to fire when the value changes.
	onComplete - a function to fire when you're done dragging.
	onTick - optionally, you can alter the onTick behavior, for example displaying an effect of the knob moving to the desired position.
		Passes as parameter the new position.
	steps - the number of steps for your slider.
	mode - either 'horizontal' or 'vertical'. defaults to horizontal.
	wheel - experimental! Also use the mouse wheel to control the slider. defaults to false.
*/

var Slider = new Class({

	options: {
		onChange: Class.empty,
		onComplete: Class.empty,
		onTick: function(pos){
			this.knob.setStyle(this.p, pos);
		},
		steps: 100,
		mode: 'horizontal',
		wheel: false
	},

	initialize: function(el, knob, options){
		this.element = $(el);
		this.knob = $(knob);
		this.setOptions(options);
		this.previousChange = -1;
		this.previousEnd = -1;
		this.step = -1;
		this.element.addEvent('mousedown', this.clickedElement.bindWithEvent(this));
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement.bindWithEvent(this));
		var mod;
		if (this.options.mode == 'horizontal'){
			this.z = 'x';
			this.p = 'left';
			mod = {'x': 'left', 'y': false};
			this.max = this.element.offsetWidth - this.knob.offsetWidth;
			this.half = this.knob.offsetWidth/2;
			this.getPos = this.element.getLeft.bind(this.element);
		} else if (this.options.mode == 'vertical'){
			this.z = 'y';
			this.p = 'top';
			mod = {'x': false, 'y': 'top'};
			this.max = this.element.offsetHeight - this.knob.offsetHeight;
			this.half = this.knob.offsetHeight/2;
			this.getPos = this.element.getTop.bind(this.element);
		}
		this.knob.setStyle('position', 'relative').setStyle(this.p, 0);
		var lim = {};
		lim[this.z] = [0, this.max];
		this.drag = new Drag.Base(this.knob, {
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
		if (this.options.initialize) this.options.initialize.call(this);
	},

	/*
	Property: set
		The slider will get the step you pass.

	Arguments:
		step - one integer
	*/

	set: function(step){
		if (step > this.options.steps) step = this.options.steps;
		else if (step < 0) step = 0;
		this.step = step;
		this.checkStep();
		this.end();
		this.fireEvent('onTick', this.toPosition(this.step));
		return this;
	},

	scrolledElement: function(event){
		if (event.wheel < 0) this.set(this.step + 1);
		else if (event.wheel > 0) this.set(this.step - 1);
		event.stop();
	},

	clickedElement: function(event){
		var position = event.page[this.z] - this.getPos() - this.half;
		if (position > this.max) position = this.max;
		else if (position < 0) position = 0;
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
		return Math.round(position/this.max*this.options.steps);
	},

	toPosition: function(step){
		return (this.max)*step/this.options.steps;
	}

});

Slider.implement(new Events);
Slider.implement(new Options);