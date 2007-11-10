/*
Script: Fx.Morph.js
	Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules, or CSS based selector rules.

License:
	MIT-style license.
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.pass = $(element);
		arguments.callee.parent(options);
	},

	set: function(now){
		for (var p in now) this.render(this.element, p, now[p]);
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = arguments.callee.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		if ($type(properties) == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return arguments.callee.parent(from, to);
	}

});

Element.Properties.morph = {

	set: function(options){
		var morph = this.retrieve('morph');
		if (morph) morph.cancel();
		return this.store('morph', new Fx.Morph(this, $extend({link: 'cancel'}, options)));
	},

	get: function(options){
		if (options || !this.retrieve('morph')) this.set('morph', options);
		return this.retrieve('morph');
	}

};

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	},
	
	effects: function(options){
		return new Fx.Morph(this, options);
	}

});
