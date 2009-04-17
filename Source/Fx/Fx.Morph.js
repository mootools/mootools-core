/*
Script: Fx.Morph.js
	Effect to transition any CSS properties for an element.

License:
	MIT-style license.
*/

Fx.Morph = new Class({

	Extends: Fx,
	
	initialize: function(element, options){
		this.item = document.id(element);
		this.parent(options);
	}.protect(),
	
	start: function(styles){
		if (!this.check(styles)) return this;
		var all = {}, froms = {}, tos = {}, length = 0;
		for (var style in styles){
			var ss = Array.from(styles[style]);
			var prepared = Fx.CSS.prepare(this.item, style, ss[0], ss[1] || null);
			var camel = prepared[0], shortParser = Element.Style.shorts[camel];
			if (shortParser){
				var fv = shortParser(prepared[1]), tv = shortParser(prepared[2]);
				for (var p in fv) all[p] = [fv[p], tv[p]];
			} else {
				all[camel] = [prepared[1], prepared[2]];
			}
		}
		this.units = {};
		for (var s in all){
			var parsed = Fx.CSS.parse(this.item, s, all[s][0], all[s][1]);
			if (!parsed) continue;
			length++;
			froms[s] = parsed[0];
			tos[s] = parsed[1];
			this.units[s] = parsed[2] || '';
		}
		return (length) ? this.parent(froms, tos) : this.complete();
	},
	
	render: function(now){
		for (var style in now) Fx.CSS.render(this.item, style, now[style], this.units[style]);
	}.protect(),
	
	compute: function(delta){
		var all = {};
		for (var style in this.from){
			all[style] = Fx.CSS.compute(this.from[style], this.to[style], delta);
		}
		return all;
	}.protect()
	
});

Element.defineSetter('morph', function(options){
	this.get('morph').cancel().setOptions(options);
});

Element.defineGetter('morph', function(){
	if (!this.retrieve('morph')) this.store('morph', new Fx.Morph(this, {link: 'cancel'}));
	return this.retrieve('morph');
});

Element.implement('morph', function(styles){
	this.get('morph').start(styles);
	return this;
});
