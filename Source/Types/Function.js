/*
---
name: Function
description: Function prototypes and generics.
requires: Type
provides: Function
...
*/

Function.extend({

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
		if (args != null) args = Array.from(args);
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
