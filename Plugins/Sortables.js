/*
Script: Sortables.js
	Contains <Sortables> Class.
	
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>, <Fx.js>, <Drag.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Sortables
	Creates an interface for <Drag> and drop, resorting of a list.

Arguments:
	elements - requires,  the collection of elements that will become sortables.
	options - an Object, see options below.

Options:
	handles - a collection of elements to be used for drag handles. defaults to the elements.
	fxDuration - the duration in ms of the effects applied to the dragged element and its clone. defaults to 250 ms.
	fxTransition - the transition for the effects (see also: <Fx.Transitions>).
	maxOpacity - the opacity for the dragged clone
	onStart - function executed when the item starts dragging
	onComplete - function executed when the item ends dragging
	contain - boolean, true keeps the dragged item constrained to it's parent element, defaults to false.
*/
	
var Sortables = new Class({

	setOptions: function(options) {
		this.options = {
			handles: false,
			fxDuration: 250,
			fxTransition: Fx.Transitions.sineInOut,
			maxOpacity: 0.5,
			onComplete: Class.empty,
			onStart: Class.empty,
			contain: false
		};
		Object.extend(this.options, options || {});
	},

	initialize: function(elements, options){
		this.setOptions(options);
		this.options.handles = this.options.handles || elements;
		var trash = new Element('div').injectInside($(document.body));
		$A(elements).each(function(el, i){
			var copy = $(el).clone().setStyles({
				'position': 'absolute',
				'opacity': '0',
				'display': 'none'
			}).injectInside(trash);
			var elEffect = el.effect('opacity', {
				duration: this.options.fxDuration,
				wait: false,
				transition: this.options.fxTransition
			}).set(1);
			var copyEffects = copy.effects({
				duration: this.options.fxDuration,
				wait: false,
				transition: this.options.fxTransition,
				onComplete: function(){
					copy.setStyle('display', 'none');
				}
			});
			var yMax = false;
			var yMin = false;
			if (this.options.contain){
				yMax = $(el.parentNode).getTop()+el.parentNode.offsetHeight-el.offsetHeight;
				yMin = el.parentNode.getTop();
			}
			var dragger = new Drag.Move(copy, {
				handle: this.options.handles[i],
				yMax: yMax,
				yMin: yMin,
				xModifier: false,
				onStart: function(){
					this.options.onStart.bind(this).delay(10);
					copy.setHTML(el.innerHTML).setStyles({
						'display': 'block',
						'opacity': this.options.maxOpacity,
						'top': el.getTop()+'px',
						'left': el.getLeft()+'px'
					});
					elEffect.custom(elEffect.now, this.options.maxOpacity);
				}.bind(this),
				onComplete: function(){
					this.options.onComplete.bind(this).delay(10);
					copyEffects.custom({
						'opacity': [this.options.maxOpacity, 0],
						'top': [copy.getTop(), el.getTop()]
					});
					elEffect.custom(elEffect.now, 1);
				}.bind(this),
				onDrag: function(){
					if (el.getPrevious() && copy.getTop() < (el.getPrevious().getTop())) el.injectBefore(el.getPrevious());
					else if (el.getNext() && copy.getTop() > (el.getNext().getTop())) el.injectAfter(el.getNext());
				}
			});
		}, this);
	}

});