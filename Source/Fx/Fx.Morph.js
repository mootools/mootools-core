/*
Script: Fx.Morph.js
	Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules,
		or CSS based selector rules.

License:
	MIT-style license.
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		this.parent(options);
	},

	set: function(now){
		if (typeOf(now) == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.getOption('unit'));
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		if (typeOf(properties) == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.defineSetter('morph', function(options){
	this.get('morph').cancel().setOptions(options);
});

Element.defineGetter('morph', function(){
	if (!this.retrieve('morph')) this.store('morph', new Fx.Morph(this, {link: 'cancel'}));
	return this.retrieve('morph');
});

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	}

});
