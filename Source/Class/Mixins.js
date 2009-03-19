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

function Accessors(){};

(function(){
	
	function accessorOf(object, key){
		var accessor = Storage.retrieve(object, 'accessors', {});
		return accessor[key] || (accessor[key] = {});
	};

	new Native(Accessors).implement({

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
		}

	}).implement({
		
		defineGetters: Accessors.prototype.defineGetter.setMany(true),
		defineSetters: Accessors.prototype.defineSetter.setMany(true)

	});
	
})();

// Events

function Events(){};

(function(){
	
	function replacer(full, first){
		return first.toLowerCase();
	};
	
	function eventsOf(object, type){
		return Storage.retrieve(object, 'events.type.' + type.replace(/^on([A-Z])/, replacer), []);
	};
	
	new Native(Events).implement({
		
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

		removeEvent: function(type, fn){
			if (!fn[':protected']) eventsOf(this, type).erase(fn);
			return this;
		},

		removeEvents: function(type){
			eventsOf(this, type).each(function(event){
				this.removeEvent(type, event);
			}, this);
			return this;
		}

	}).implement({

		addEvents: Events.prototype.addEvent.setMany(true)

	});
	
})();

// Options

function Options(){};

(function(){
	
	function optionsOf(object){
		return Storage.retrieve(object, 'options', {});
	};
	
	new Native(Options).implement({
		
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
		}

	}).implement({
		
		getOptions: Options.prototype.getOption.getMany(true)
		
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
