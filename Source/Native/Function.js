/*
Script: Function.js
	Contains Function Prototypes like create, bind, pass, and delay.

License:
	MIT-style license.
*/

Function.extend({

	argument: function(i){
		return function(){
			return arguments[i];
		};
	},

	clear: function(timer){
		clearInterval(timer);
		clearTimeout(timer);
		return null;
	},

	stab: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}
	
});

Function.implement({
	
	attempt: function(args, bind){
		try {
			return this.apply(bind, Array.from(args));
		} catch (e){
			return null;
		}
	},
	
	bind: function(bind, args){
		var self = this;
		args = nil(args) && Array.from(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function(delay, bind, args){
		return setTimeout(this.bind(bind, args), delay);
	},
	
	pass: function(args, bind){
		return this.bind(bind, args);
	},
	
	periodical: function(periodical, bind, args){
		return setInterval(this.bind(bind, args), periodical);
	},

	run: function(args, bind){
		return this.apply(bind, Array.from(args));
	}

});
