/*
Script: Mixins.js
	Contains Utility Classes that can be implemented / extended into your own Classes / Functions / Objects
	to ease the execution of many common tasks.

License:
	MIT-style license.
*/

// Storage

(function(){

var Storage = this.Storage = new Native('Storage', function(){});

var storageOf = function(item){
	return item._storage_ || (item._storage_ = {});
};

Storage.implement({

	store: function(key, value){
		storageOf(this)[key] = value;
		return this;
	}.setMany(),

	retrieve: function(key, dflt){
		var value = storageOf(this)[key];
		if (dflt != null && value == null) value = (storageOf(this)[key] = dflt);
		return nil(value);
	}.getMany(),

	dump: function(key){
		var store = storageOf(this), prop = store[key];
		delete store[key];
		return prop;
	}.getMany()

});

// Accessor

this.Accessor = new Native('Accessor', function(name){
	
	var Name = (name || '').capitalize();
	
	var accessor = {};
	
	this['define' + Name] = function(key, value){
		accessor[key] = value;
		return this;
	}.setMany();
	
	this['lookup' + Name] = function(key, value){
		return accessor[key] || null;
	}.getMany();
	
});

// Events

this.Events = new Native('Events', function(){});
	
var replacer = function(full, first){
	return first.toLowerCase();
};

var eventsOf = function(object, type){
	return Storage.retrieve(object, 'events.type.' + type.replace(/^on([A-Z])/, replacer), []);
};

Events.implement({
	
	setEvents: function(){
		if (!Storage.retrieve(this, 'events.set')) Storage.store(this, 'events.set', true).addEvent(this.events);
		Array.forEach(arguments, this.addEvent, this);
		return this;
	},

	addEvent: function(type, fn){
		eventsOf(this, type).include(fn);
		return this;
	}.setMany(),

	fireEvent: function(type, args){
		args = Array.from(args);
		eventsOf(this, type).forEach(function(fn){
			fn.apply(this, args);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		if (!fn._protected_) eventsOf(this, type).erase(fn);
		return this;
	}.setMany(),

	removeEvents: function(type){
		if (typeOf(type) == 'string'){
			var events = eventsOf(this, type), l = events.length;
			if (l) do {
				this.removeEvent(type, events[--l]);
			} while(l);
		} else {
			for (var i in type) this.removeEvent(i, type[i]);
		}
		return this;
	}

});

// Options

this.Options = new Native('Options', function(){});
	
var optionsOf = function(object){
	return Storage.retrieve(object, 'options', {});
};

Options.implement({
	
	setOptions: function(options){
		Storage.retrieve(this, 'options', {});
		options = Object.append(this.options, options);
		for (var option in options) this.setOption(option, options[option]);
		return this;
	},
	
	setOption: function(key, value){
		if (this.addEvent && typeOf(value) == 'function' && (/^on[A-Z]/).test(key)) this.addEvent(key, value);
		else optionsOf(this)[key] = value;
		return this;
	},

	getOption: function(key){
		return optionsOf(this)[key];
	},
	
	getOptions: Function.getMany('getOption')

});

// Chain

this.Chain = new Native('Chain', function(){}).implement({
	
	chain: function(){
		var chain = Storage.retrieve(this, 'chain', []);
		chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		var chain = Storage.retrieve(this, 'chain', []);
		return (chain.length) ? chain.shift().apply(this, arguments) : null;
	},

	clearChain: function(){
		Storage.store(this, 'chain', []);
		return this;
	}

});

})();
