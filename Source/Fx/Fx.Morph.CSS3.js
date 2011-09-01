/*
---
name: Fx.Tween.CSS3
script: Fx.Tween.CSS3.js
license: MIT-style license.
description: Provides a CSS3 implementaton of Fx.Morph
copyright: Copyright (c) 2010, Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>, based on code by eskimoblood (mootools users group)
copyright: Copyright (c) 2011 Fred Cox mcfedr@gmail.com
authors: [Fred Cox, André Fiedler, eskimoblood]

requires: [Fx.CSS3Funcs, Fx.Morph]

provides: [Fx.Morph.CSS3]
...
*/

var morphCSS2 = Fx.Morph;

Fx.Morph = new Class({
	
	Extends: morphCSS2,
	
	check: function(properties){
		return (this.css3Supported && !this.boundComplete && this.animatable().containsArray(Object.keys(properties))) || this.parent();
	},

	start: function(properties){
		if (this.css3Supported){
			if (!this.check(properties)) return this;
			if (typeof properties == 'string') properties = this.search(properties);
			var from = {}, to = {};
			for (var p in properties){
				var parsed = this.prepare(this.element, p, properties[p]);
				from[p] = parsed.from;
				to[p] = parsed.to;
			}
			var incomplete = Object.map(properties, function() { return false; });
			this.boundComplete = function(event){
				incomplete[event.getPropertyName()] = true;
				if(Object.every(incomplete, function(v) { return v; })) {
					this.element.removeEvent('transitionend', this.boundComplete);
					this.boundComplete = null;
					this.fireEvent('complete', this);
				}
			}.bind(this);
			
			this.element.addEvent('transitionend', this.boundComplete);
			var trans = function(){
				var transStyles = {};
				transStyles[this.transitionProperty] = Object.keys(properties).reduce(function(a, b) { return a + ', '  + b; });
				transStyles[this.transitionDuration] = this.options.duration + 'ms';
				transStyles[this.transitionTimingFunction] = 'cubic-bezier(' + this.transitionTimings()[this.options.transition] + ')';
				this.element.setStyles(transStyles);
				this.set(this.compute(from, to, 1));
			}.bind(this);
			this.element.setStyle(this.transitionProperty, 'none');
			this.set(this.compute(from, to, 0));
			trans.delay(0.1);
			this.fireEvent('start', this);
			return this;
		}
		return this.parent(properties);
	}
});

Fx.Morph.implement(Fx.CSS3Funcs);

Fx.Morph.CSS2 = morphCSS2;
Fx.Morph.CSS3 = Fx.Morph;