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
	
	_events: {},

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
		if (this._events[type]) this._events[type].each(function(fn){
			(delay) ? fn.delay(delay, this, args) : fn.run(args, this);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = Events.on(type);
		if (this._events[type] && !fn.internal) this._events[type].erase(fn);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = Events.on(events);
		for (type in this._events){
			if (events && events != type) continue;
			var fns = this._events[type];
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
			if (!object._events) object._events = {};
			if (!object._events[type]) object._events[type] = [];
			object._events[type].include(fn);
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
	properties._options = options;
};

var Options = new Class({
	
	_options: {},

	setOptions: function(options){
		Events.fromOptions(this, options);
		Object.mixin(this._options, options);
		return this;
	},
	
	setOption: function(key, value){
		return this.setOptions(Object.from(key, value));
	},
	
	getOption: function(key){
		return this._options[key];
	},
	
	getOptions: function(){
		return this._options;
	},
			
	resetOption: function(key){
		Object.reset(this._options, key);
	},
	
	resetOptions: function(){
		Object.reset(this._options);
	}

});

var Chain = new Class({
	
	_chain: [],

	chain: function(){
		this._chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this._chain.length) ? this._chain.shift().apply(this, arguments) : null;
	},

	clearChain: function(){
		this._chain.empty();
		return this;
	}

});
