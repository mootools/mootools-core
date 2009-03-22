/*
Script: Mixins.js
	Contains Utility Classes that can be implemented / extended into your own Classes / Functions / Objects
	to ease the execution of many common tasks.

License:
	MIT-style license.
*/

// Storage

var Storage = new Native('Storage', function(){});

(function(){
	
	var storage = {};
	
	var storageOf = function(item){
		var uid = UID.uidOf(item);
		return (storage[uid] || (storage[uid] = {}));
	};
	
	Storage.implement({

		store: function(key, value){
			storageOf(this)[key] = value;
			return this;
		}.setMany(),

		retrieve: function(key, dflt){
			var value = storageOf(this)[key];
			if (dflt != null && value == null) value = (storageOf(this)[key] = dflt);
			return Object.pick(value);
		}.getMany(),

		dump: function(key){
			var store = storageOf(this), prop = store[key];
			delete store[key];
			return prop;
		}.getMany()

	});
	
})();

// Accessors

var Accessors = new Native('Accessors', function(){});

(function(){
	
	var accessorOf = function(object, key){
		var accessor = Storage.retrieve(object, 'accessors', {});
		return accessor[key] || (accessor[key] = {});
	};

	Accessors.implement({

		defineGetter: function(key, fn){
			accessorOf(this, key).get = fn;
			return this;
		},

		defineSetter: function(key, fn){
			accessorOf(this, key).set = fn;
			return this;
		},

		lookupGetter: function(key){
			return accessorOf(this, key).get || null;
		},

		lookupSetter: function(key){
			return accessorOf(this, key).set || null;
		},
		
		defineGetters: Function.setMany('defineGetter'),
		defineSetters: Function.setMany('defineSetter')

	});
	
})();

// Events

var Events = new Native('Events', function(){});

(function(){
	
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
		},

		fireEvent: function(type, args){
			args = Array.from(args);
			eventsOf(this, type).each(function(fn){
				fn.apply(this, args);
			}, this);
			return this;
		},

		removeEvent: function(type, fn){console.log(type, fn);
			if (!fn[':protected']) eventsOf(this, type).erase(fn);
			return this;
		}.setMany(),

		removeEvents: function(type){
			var events = eventsOf(this, type), l = events.length;
			if(l) do { this.removeEvent(type, events[--l]); } while(l);
			return this;
		},
		
		addEvents: Function.setMany('addEvent')

	});
	
})();

// Options

var Options = new Native('Options', function(){});

(function(){
	
	var optionsOf = function(object){
		return Storage.retrieve(object, 'options', {});
	};
	
	Options.implement({
		
		setOptions: function(options){
			if (!Storage.retrieve(this, 'options')) Storage.store(this, 'options', this.options || {});
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
	
})();

// Chain

var Chain = new Native('Chain', function(){}).implement({
	
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
