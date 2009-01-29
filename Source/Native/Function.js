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
	}
	
});

Function.implement({
	
	attempt: function(args, bind){
		return Function.stab(this.bind(bind, args));
	},
	
	bind: function(bind, args){
		var self = this;
		return function(){
			return self.apply(bind, Array.from(args));
		};
	},
	
	bindWithEvent: function(bind, args){
		var self = this;
		return function(event){
			return this.apply(bind, [event || window.event].concat(Array.from(args)));
		};
	},
	
	delay: function(delay, bind, args){
		return setTimeout(this.bind(bind, args), delay);
	},
	
	disguise: function(as){
		this.toString = function(){
			return as.toString();
		};
		return this;
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
