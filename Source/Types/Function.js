/*
---
name: Function
description: Function prototypes and generics.
requires: Type
provides: Function
...
*/

Function.extend('attempt', function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch (e){}
	}
	return null;
});

Function.implement({
	
	bind: function(bind){
		var self = this,
			args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;

		return function(){
			if (!args && !arguments.length) return self.call(bind);
			if (args && arguments.length) return self.apply(bind, args.concat(Array.from(arguments)));
			return self.apply(bind, args || arguments);
		};
	},

	attempt: function(args, bind){
		try {
			return this.apply(bind, args);
		} catch (e){}

		return null;
	},

	pass: function(args, bind){
		args = (args != null) ? Array.from(args) : [];
		args.unshift(bind);
		return this.bind.apply(this, args);
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	}

});
