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
	togglers - required, a collection of elements, the elements handlers that will be clickable.
	options - optional, see options below, and <Fx.Base> options.

Options:
	show - integer, the Index of the element to show at start.
	display - integer, the Index of the element to show at start (with a transition). defaults to 0.
	fixedHeight - integer, if you want the elements to have a fixed height. defaults to false.
	fixedWidth - integer, if you want the elements to have a fixed width. defaults to false.
	onActive - function to execute when an element starts to show
	onBackground - function to execute when an element starts to hide
	height - boolean, will add a height transition to the accordion if true. defaults to true.
	opacity - boolean, will add an opacity transition to the accordion if true. defaults to true.
	width - boolean, will add a width transition to the accordion if true. defaults to false, css mastery is required to make this work!
	alwaysHide - boolean, will allow to hide all elements if true, instead of always keeping one element shown. defaults to false.
*/

var Accordion = Fx.Elements.extend({

	getExtended: function(){
		return {
			onActive: Class.empty,
			onBackground: Class.empty,
			display: 0,
			show: false,
			height: true,
			width: false,
			opacity: true,
			fixedHeight: false,
			fixedWidth: false,
			wait: false,
			alwaysHide: false
		};
	},

	initialize: function(togglers, elements, options){
		this.setOptions(this.getExtended(), options);
		this.previous = -1;
		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)){
			this.options.display = false;
			this.previous = this.options.show;
		}
		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}
		this.togglers = $$(togglers);
		this.elements = $$(elements);
		this.togglers.each(function(tog, i){
			tog.addEvent('click', this.display.bind(this, i));
		}, this);
		this.elements.each(function(el, i){
			el.fullOpacity = 1;
			if (this.options.fixedWidth) el.fullWidth = this.options.fixedWidth;
			if (this.options.fixedHeight) el.fullHeight = this.options.fixedHeight;
			el.setStyle('overflow', 'hidden');
		}, this);
		this.effects = {};
		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';
		this.elements.each(function(el, i){
			if (this.options.show === i) this.fireEvent('onActive', [this.togglers[i], el]);
			else for (var fx in this.effects) el.setStyle(fx, 0);
		}, this);
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
		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			if ((i != index) || (this.options.alwaysHide && (el.offsetHeight > 0))){
				this.fireEvent('onBackground', [this.togglers[i], el]);
				for (var fx in this.effects) obj[i][fx] = 0;
			} else {
				this.fireEvent('onActive', [this.togglers[i], el]);
				for (var fx in this.effects) obj[i][fx] = el[this.effects[fx]];
			}
		}, this);
		return this.start(obj);
	},

	showThisHideOpen: function(index){return this.display(index)}

});

Fx.Accordion = Accordion;