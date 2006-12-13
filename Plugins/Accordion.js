/*
Script: Accordion.js
	Contains <Accordion>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Accordion
	The Accordion class creates a group of elements that are toggled when their handles are clicked. When one elements toggles in, the others toggles back.

Arguments:
	elements - required, a collection of elements the transitions will be applied to.
	togglers - required, a collection of elements, the elements handlers.
	options - optional, see options below, and <Fx.Base> options.

Options:
	show - integer, the Index of the element to show at start.
	display - integer, the Index of the element to show at start (with a transition).
	fixedHeight - integer, if you want your accordion to have a fixed height. defaults to false.
	fixedWidth - integer, if you want your accordion to have a fixed width. defaults to false.
	onActive - function to execute when an element starts to show
	onBackground - function to execute when an element starts to hide
	height - boolean, will add a height transition to the accordion if true. defaults to true.
	opacity - boolean, will add an opacity transition to the accordion if true. defaults to true.
	width - boolean, will add a width transition to the accordion if true. defaults to false, css mastery is required to make this work!
	alwaysHide - 
*/

var Accordion = Fx.Elements.extend({

	getExtended: function(){
		return {
			onActive: Class.empty,
			onBackground: Class.empty,
			display: 0,
			show: false,
			height: true,
			opacity: true,
			width: false,
			fixedHeight: false,
			fixedWidth: false,
			wait: false,
			alwaysHide: false
		};
	},

	initialize: function(togglers, elements, options){
		this.setOptions(this.getExtended(), options);

		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)) this.options.display = false;

		this.togglers = $$(togglers);
		this.elements = $$(elements);

		this.previous = -1;

		this.togglers.each(function(tog, i){
			tog.addEvent('click', this.display.bind(this, i));
		}, this);

		this.elements.each(function(el, i){
			el.fullOpacity = 1;
			el.fullWidth = this.options.fixedWidth || el.offsetWidth;
			el.fullHeight = this.options.fixedHeight || el.scrollHeight;
			el.setStyle('overflow', 'hidden');
		}, this);

		this.effects = {};

		if (this.options.height) this.effects.height = ['fullHeight', 0];
		if (this.options.opacity) this.effects.opacity = ['fullOpacity', 0];
		if (this.options.width) this.effects.width = ['fullWidth', 0];

		for (var fx in this.effects){
			this.elements.each(function(el, i){
				if (this.options.show === i) return this.fireEvent('onActive', [this.togglers[i], el]);
				else return el.setStyle(fx, this.effects[fx][1]);
			}, this);
		}

		this.parent(this.elements, this.options);

		if ($chk(this.options.display)) this.display(this.options.display);
	},

	/*
	Property: display
		Shows a specific section and hides all others. Useful when triggering an accordion from outside.

	Arguments:
		index - integer, the index of the item to show.
	*/

	display: function(index){
		if (this.timer && this.options.wait) return this;
		if (index === this.previous && !this.options.wait) return this;
		this.previous = index;
		var obj = {};
		for (var fx in this.effects){
			this.elements.each(function(el, i){
				obj[i] = obj[i] || {};
				if (i != index || (this.options.alwaysHide && i == index && el.offsetHeight > 0)){
					this.fireEvent('onBackground', [this.togglers[i], this.elements[i]]);
					obj[i][fx] = this.effects[fx][1];
				} else if (i == index){
					this.fireEvent('onActive', [this.togglers[i], this.elements[i]]);
					obj[i][fx] = el[this.effects[fx][0]];
				}
			}, this);
		}
		return this.start(obj);
	}

});

Fx.Accordion = Accordion;