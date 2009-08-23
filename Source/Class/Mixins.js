/*=
name: Mixins
description: Utility classes Storage, Accessor, Events, Options and Chain.
requires:
  - Array
  - Function
  - Number
  - String
  - Object
  - Table
=*/

(function(){

/* Events */

var eventsOf = function(object, type){
	type = type.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
	var events = object.events;
	return events[type] || (events[type] = []);
};

var removeEventsOfType = function(object, type){
	var events = eventsOf(object, type);
	for (var i = events.length; i--; ) object.removeEvent(type, events[i]);
};

this.Events = new Class({
	
	events: {},

	addEvent: function(type, fn){
		eventsOf(this, type).include(fn);
		return this;
	},
	
	addEvents: function(events){
		for (var name in events) this.addEvent(name, events[name]);
		return this;
	},

	fireEvent: function(type, args){
		args = Array.from(args);
		eventsOf(this, type).each(function(fn){
			fn.apply(this, args);
		}, this);
		return this;
	},
	
	fireEvents: function(events){
		for (var i = 0; i < events.length; i++) this.fireEvent(events[i]);
		return this;
	},

	removeEvent: function(type, fn){
		if (!fn.$protected) eventsOf(this, type).erase(fn);
		return this;
	},

	removeEvents: function(option){
		switch (typeOf(option)){
			case 'string': removeEventsOfType(this, option); break;
			case 'object': for (var name in option) this.removeEvent(name, option[name]); break;
			case 'null':
				var events = this.events;
				for (var type in events) removeEventsOfType(this, type);
		}
		return this;
	}

});

/* Options */

this.Options = new Class({
	
	options: {},
	
	setOption: function(key, value){
		if ((/^on[A-Z]/).test(key) && this.addEvent && typeOf(value) == 'function') this.addEvent(key, value);
		else Object.merge(this.options, key, value);
		
		return this;
	},
	
	setOptions: function(options){
		for (var key in options) this.setOption(key, options[key]);
		return this;
	},

	getOption: function(key){
		return nil(this.options[key]);
	},
	
	getOptions: function(keys){
		return Object.subset(this.options, keys);
	}
	
});

/* Chain */

this.Chain = new Class({
	
	$chain: [],
	
	chain: function(){
		this.$chain.append(Array.flatten(arguments));
		return this;
	},
	
	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : null;
	},
	
	clearChain: function(){
		this.$chain = [];
		return this;
	}
	
});

})();
