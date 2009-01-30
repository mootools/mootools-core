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
	
	__events__: {},

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
		if (this.__events__[type]) this.__events__[type].each(function(fn){
			(delay) ? fn.delay(delay, this, args) : fn.run(args, this);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = Events.on(type);
		if (this.__events__[type] && !fn.internal) this.__events__[type].erase(fn);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = Events.on(events);
		for (type in this.__events__){
			if (events && events != type) continue;
			var fns = this.__events__[type];
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
			if (!object.__events__) object.__events__ = {};
			if (!object.__events__[type]) object.__events__[type] = [];
			object.__events__[type].include(fn);
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
	properties.__options__ = options;
};

var Options = new Class({
	
	__options__: {},

	setOptions: function(options){
		Event.fromOptions(this, options);
		Object.mixin(this.__options__, options);
		return this;
	},
	
	setOption: function(key, value){
		return this.setOptions(Object.from(key, value));
	},
	
	getOption: function(key){
		return this.__options__[key];
	},
	
	getOptions: function(){
		return this.__options__;
	},
			
	resetOption: function(key){
		Object.reset(this.__options__, key);
	},
	
	resetOptions: function(){
		Object.reset(this.__options__);
	}

});

var Chain = new Class({
	
	__chain__: [],

	chain: function(){
		this.__chain__.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.__chain__.length) ? this.__chain__.shift().apply(this, arguments) : null;
	},

	clearChain: function(){
		this.__chain__.empty();
		return this;
	}

});
