/*
Script: Mixins.js
	Contains Utility Classes that can be implemented / extended into your own Classes / Functions / Objects
	to ease the execution of many common tasks.

License:
	MIT-style license.
*/

// Storage

function Storage(){};

(function(){
	
	var storage = {};
	
	function storageOf(item){
		var uid = UID.uidOf(item);
		return (storage[uid] || (storage[uid] = {}));
	};
	
	new Native(Storage).implement({

		store: function(key, value){
			storageOf(this)[key] = value;
		}.asSetter(),

		retrieve: function(key, dflt){
			var value = storageOf(this)[key];
			if (dflt != null && value == null) value = (storageOf(this)[key] = dflt);
			return Object.pick(value);
		}.asGetter(),

		dump: function(key){
			var prop = storageOf(this)[key];
			delete storageOf(this)[key];
			return prop;
		}.asGetter()

	});
	
})();

// Events

function Events(){};

(function(){
	
	function eventsOf(object, type){
		type = type.replace(/^on([A-Z])/, function(full, first){
			return first.toLowerCase();
		});
		var events = Storage.retrieve(object, 'events', {});
		return (events[type]) ? events[type] : events[type] = [];
	};
	
	new Native(Events).implement({
		
		setEvents: function(){
			if (!Storage.retrieve(this, 'events')) Storage.store(this, 'events', this.events || {});
			Array.forEach(arguments, this.addEvent, this);
		},

		addEvent: function(type, fn){
			eventsOf(this, type).include(fn);
		}.asSetter(),

		fireEvent: function(type, args){
			eventsOf(this, type).each(function(fn){
				fn.run(args, this);
			});
		}.asSetter(),

		removeEvent: function(type, fn){
			if (!fn[':protected']) eventsOf(this, type).erase(fn);
		}.asSetter(),

		removeEvents: function(type){
			var events = eventsOf(this, type);
			for (var e in events) this.removeEvent(e, events[e]);
		}.asSetter()

	});
	
})();

// Options

function Options(){};

(function(){
	
	function optionsOf(object){
		return Storage.retrieve(object, 'options', {});
	};
	
	new Native(Options).implement({
		
		setOptions: function(){
			if (!Storage.retrieve(this, 'options')) Storage.store(this, 'options', this.options || {});
			Array.forEach(arguments, this.setOption, this);
			return this;
		},
		
		setOption: function(key, value){
			if (this.addEvent && typeOf(value) == 'function' && (/^on[A-Z]/).test(key)) this.addEvent(key, value);
			else optionsOf(this)[key] = value;
		}.asSetter(),

		getOption: function(key){
			return optionsOf(this)[key];
		}.asGetter()

	});
	
})();

// Chain

function Chain(){};

new Native(Chain).implement({
	
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
