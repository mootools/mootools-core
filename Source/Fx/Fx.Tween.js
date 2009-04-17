/*
Script: Fx.Tween.js
	Effect to transition one CSS property for an element.

License:
	MIT-style license.
*/

Fx.Tween = new Class({

	Extends: Fx,
	
	initialize: function(element, options){
		this.item = document.id(element);
		this.parent(options);
	}.protect(),
	
	start: function(style, from, to){
		if (!this.check(style, from, to)) return this;
		var prepared = Fx.CSS.prepare(this.item, style, from, to);
		this.style = prepared[0];
		var parsed = Fx.CSS.parse(this.item, this.style, prepared[1], prepared[2]);
		if (!parsed) return this.complete();
		this.unit = parsed[2] || '';
		return this.parent(parsed[0], parsed[1]);
	},
	
	render: function(now){
		Fx.CSS.render(this.item, this.style, now, this.unit);
	}.protect(),
	
	compute: function(delta){
		return Fx.CSS.compute(this.from, this.to, delta);
	}.protect()
	
});

Element.defineSetter('tween', function(options){
	this.get('tween').cancel().setOptions(options);
});

Element.defineGetter('tween', function(){
	if (!this.retrieve('tween')) this.store('tween', new Fx.Tween(this, {link: 'cancel'}));
	return this.retrieve('tween');
});

Element.implement('tween', function(style, from, to){
	this.get('tween').start(style, from, to);
	return this;
});
