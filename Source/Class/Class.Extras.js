/*
Script: Class.Extras.js
	Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

License:
	MIT-style license.
*/

Class.Mutators.Events = function(events, properties){
	for (var type in events) Events.add(properties, type, events[type]);
};


var Events = new Class({
	
	$events: {},

	addEvent: function(type, fn, internal){
		Events.add(this, type, fn, internal);
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = Events.on(type);
		if (this.$events[type]) this.$events[type].each(function(fn){
			(delay) ? fn.delay(delay, this, args) : fn.run(args, this);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = Events.on(type);
		if (this.$events[type] && !fn.internal) this.$events[type].erase(fn);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = Events.on(events);
		for (type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--; i) this.removeEvent(type, fns[i]);
		}
		return this;
	}

});

Events.extend({
	
	on: function(string){
		return string.replace(/^on([A-Z])/, function(full, first){
			return first.toLowerCase();
		});
	},
	
	add: function(object, type, fn, internal){
		type = Events.on(type);
		if (fn != Function.empty){
			if (!object.$events) object.$events = {};
			if (!object.$events[type]) object.$events[type] = [];
			object.$events[type].include(fn);
			if (internal) fn.internal = true;
		}
	},
	
	fromOptions: function(object, options){
		for (var option in options){
			if (typeOf(options[option]) == 'function' && (/^on[A-Z]/).test(option)){
				Events.add(object, option, options[option]);
				delete options[option];
			};
		}
	}

});

Class.Mutators.Options = function(options, properties){
	Events.fromOptions(properties, options);
	properties.$options = options;
};

var Options = new Class({
	
	$options: {},

	setOptions: function(options){
		Event.fromOptions(this, options);
		Object.mixin(this.$options, options);
		return this;
	},
	
	setOption: function(key, value){
		return this.setOptions(Object.from(key, value));
	},
	
	getOption: function(key){
		return this.$options[key];
	},
	
	getOptions: function(){
		return this.$options;
	},
			
	resetOption: function(key){
		Object.reset(this.$options, key);
	},
	
	resetOptions: function(){
		Object.reset(this.$options);
	}

});

var Chain = new Class({
	
	$chain: [],

	chain: function(){
		this.$chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : null;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});
