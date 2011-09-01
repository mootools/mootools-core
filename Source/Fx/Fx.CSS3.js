/*
---
name: Fx.CSS3
script: Fx.CSS3.js
license: MIT-style license.
description: Provides the base functionality of the CSS3 Fx classes
copyright: Copyright (c) 2010, Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>, based on code by eskimoblood (mootools users group)
copyright: Copyright (c) 2011 Fred Cox mcfedr@gmail.com
authors: [Fred Cox, André Fiedler, eskimoblood]

requires: [Core/Class.Extras, Core/Element.Event, Core/Element.Style, Core/Fx]

provides: [Fx.CSS3Funcs]
...
*/

(function() {

	Element.NativeEvents.transitionend = 2;
	Element.NativeEvents.webkitTransitionEnd = 2;
	Element.NativeEvents.oTransitionEnd = 2;
	Element.NativeEvents.msTransitionEnd = 2;

	Element.Events.transitionend = {
		base: Browser.safari || Browser.chrome ? 'webkitTransitionEnd' : (Browser.opera ? 'oTransitionEnd' : (Browser.ie && Browser.version > 8 ? 'msTransitionEnd' : 'transitionend'))
	};

	Event.implement({

		getPropertyName: function(){
			return this.event.propertyName;
		},

		getElapsedTime: function(nativeTime){
			return nativeTime ? this.event.elapsedTime : (this.event.elapsedTime * 1000).toInt();
		}

	});

	Element.implement({

		supportStyle: function(style){
			var value = this.style[style];
			return !!(value || value === '');
		},

		supportVendorStyle: function(style){
			var prefixedStyle = null;
			return this.supportStyle(style) ? style : ['webkit', 'Moz', 'o', 'ms'].some(function(prefix){
				prefixedStyle = prefix + style.camelCase().capitalize();
				return this.supportStyle(prefixedStyle);
			}, this) ? prefixedStyle : null;
		}

	});

	Array.implement({
		reduce: function(func) {
			var result = null;
			this.each(function(el) {
				result = func(result, el);
			});
			return result;
		},
		containsArray: function(array) {
			return array.every(function(v) {
				return this.contains(v);
			}, this);
		}
	});

	var transitionTimings = {
		'linear'		: '0,0,1,1',
		'expo:in'		: '0.71,0.01,0.83,0',
		'expo:out'		: '0.14,1,0.32,0.99',
		'expo:in:out'	: '0.85,0,0.15,1',
		'circ:in'		: '0.34,0,0.96,0.23',
		'circ:out'		: '0,0.5,0.37,0.98',
		'circ:in:out'	: '0.88,0.1,0.12,0.9',
		'sine:in'		: '0.22,0.04,0.36,0',
		'sine:out'		: '0.04,0,0.5,1',
		'sine:in:out'	: '0.37,0.01,0.63,1',
		'quad:in'		: '0.14,0.01,0.49,0',
		'quad:out'		: '0.01,0,0.43,1',
		'quad:in:out'	: '0.47,0.04,0.53,0.96',
		'cubic:in'		: '0.35,0,0.65,0',
		'cubic:out'		: '0.09,0.25,0.24,1',
		'cubic:in:out'	: '0.66,0,0.34,1',
		'quart:in'		: '0.69,0,0.76,0.17',
		'quart:out'		: '0.26,0.96,0.44,1',
		'quart:in:out'	: '0.76,0,0.24,1',
		'quint:in'		: '0.64,0,0.78,0',
		'quint:out'		: '0.22,1,0.35,1',
		'quint:in:out'	: '0.9,0,0.1,1'
	};

	var animatable = ['background-color', 'background-image', 'background-position', 'border-bottom-color', 'border-bottom-width',
		'border-color', 'border-left-color', 'border-left-width', 'border-right-color', 'border-right-width', 'border-spacing',
		'border-top-color', 'border-top-width', 'border-width', 'bottom', 'color', 'crop', 'font-size', 'font-weight',
		'grid-*', 'height', 'left', 'letter-spacing', 'line-height', 'margin-bottom', 'margin-left', 'margin-right',
		'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'opacity', 'outline-color', 'outline-offset',
		'outline-width', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'right', 'text-indent', 'text-shadow',
		'top', 'vertical-align', 'visibility', 'width', 'word-spacing', 'z-index', 'zoom'];


	Fx.CSS3Funcs = {
		initialize: function(element, options){
			options.transition = options.transition || 'sine:in:out';
			this.parent(element, options);
			if (typeof this.options.transition != 'string') alert('Only short notated transitions (like \'sine:in\') are supported by Fx.Tween.CSS3');
			this.options.transition = this.options.transition.toLowerCase();
			var e = this.element || this.elements[0];
			this.transition = e.supportVendorStyle('transition');
			this.transitionProperty = e.supportVendorStyle('transition-property');
			this.transitionDuration = e.supportVendorStyle('transition-duration');
			this.transitionTimingFunction = e.supportVendorStyle('transition-timing-function');
			this.css3Supported = !!this.transition && !!transitionTimings[this.options.transition];
		},

		cancel: function(){
			if (this.css3Supported){
				this.element.setStyle(this.transition, 'none');
				this.element.removeEvent('transitionend', this.boundComplete);
				this.boundComplete = null;
			}
			this.parent();
			return this;
		},

		stop: function() {
			if (this.css3Supported){
				return this;
			}
			return this.parent();
		},

		pause: function() {
			if (this.css3Supported){
				return this;
			}
			return this.parent();
		},

		resume: function() {
			if (this.css3Supported){
				return this;
			}
			return this.parent();
		},

		isRunning: function() {
			if (this.css3Supported){
				return !!this.boundComplete;
			}
			return this.parent();
		},

		animatable: function() {
			return animatable;
		},

		transitionTimings: function() {
			return transitionTimings;
		}
	};

})();