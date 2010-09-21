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
		var self = this, args = Array.slice(arguments, 1);
		return function(){
			return self.apply(bind, (args.length) ? args : arguments);
		};
	},

	attempt: function(args, bind){
		try {
			return this.run(args, bind);
		} catch (e){
			return null;
		}
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass(args, bind), delay);
	},

	pass: function(args, bind){
		return this.bind.apply(this, [bind].concat(args));
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass(args, bind), periodical);
	},

	run: function(args, bind){
		return this.apply(bind, Array.from(args));
	}

});
