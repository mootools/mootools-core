/*
---

name: Class.Thenable

description: Contains a Utility Class that can be implemented into your own Classes to make them "thenable".

license: MIT-style license.

requires: Class

provides: [Class.Thenable]

...
*/

(function(){

var STATE_PENDING = 0,
	STATE_FULFILLED = 1,
	STATE_REJECTED = 2;

var Thenable = Class.Thenable = new Class({

	$thenableState: STATE_PENDING,
	$thenableResult: null,
	$thenableReactions: [],

	resolve: function(value){
		resolve(this, value);
		return this;
	},

	reject: function(reason){
		reject(this, reason);
		return this;
	},

	getThenableState: function(){
		switch (this.$thenableState){
			case STATE_PENDING:
				return 'pending';

			case STATE_FULFILLED:
				return 'fulfilled';

			case STATE_REJECTED:
				return 'rejected';
		}
	},

	resetThenable: function(reason){
		reject(this, reason);
		reset(this);
		return this;
	},

	then: function(onFulfilled, onRejected){
		if (typeof onFulfilled !== 'function') onFulfilled = 'Identity';
		if (typeof onRejected !== 'function') onRejected = 'Thrower';

		var thenable = new Thenable();

		this.$thenableReactions.push({
			thenable: thenable,
			fulfillHandler: onFulfilled,
			rejectHandler: onRejected
		});

		if (this.$thenableState !== STATE_PENDING){
			react(this);
		}

		return thenable;
	},

	'catch': function(onRejected){
		return this.then(null, onRejected);
	}

});

Thenable.extend({
	resolve: function(value){
		var thenable;
		if (value instanceof Thenable){
			thenable = value;
		} else {
			thenable = new Thenable();
			resolve(thenable, value);
		}
		return thenable;
	},
	reject: function(reason){
		var thenable = new Thenable();
		reject(thenable, reason);
		return thenable;
	}
});

// Private functions

function resolve(thenable, value){
	if (thenable.$thenableState === STATE_PENDING){
		if (thenable === value){
			reject(thenable, new TypeError('Tried to resolve a thenable with itself.'));
		} else if (value && (typeof value === 'object' || typeof value === 'function')){
			var then;
			try {
				then = value.then;
			} catch (exception){
				reject(thenable, exception);
			}
			if (typeof then === 'function'){
				var resolved = false;
				defer(function(){
					try {
						then.call(
							value,
							function(nextValue){
								if (!resolved){
									resolved = true;
									resolve(thenable, nextValue);
								}
							},
							function(reason){
								if (!resolved){
									resolved = true;
									reject(thenable, reason);
								}
							}
						);
					} catch (exception){
						if (!resolved){
							resolved = true;
							reject(thenable, exception);
						}
					}
				});
			} else {
				fulfill(thenable, value);
			}
		} else {
			fulfill(thenable, value);
		}
	}
}

function fulfill(thenable, value){
	if (thenable.$thenableState === STATE_PENDING){
		thenable.$thenableResult = value;
		thenable.$thenableState = STATE_FULFILLED;

		react(thenable);
	}
}

function reject(thenable, reason){
	if (thenable.$thenableState === STATE_PENDING){
		thenable.$thenableResult = reason;
		thenable.$thenableState = STATE_REJECTED;

		react(thenable);
	}
}

function reset(thenable){
	if (thenable.$thenableState !== STATE_PENDING){
		thenable.$thenableResult = null;
		thenable.$thenableState = STATE_PENDING;
	}
}

function react(thenable){
	var state = thenable.$thenableState,
		result = thenable.$thenableResult,
		reactions = thenable.$thenableReactions,
		type;

	if (state === STATE_FULFILLED){
		thenable.$thenableReactions = [];
		type = 'fulfillHandler';
	} else if (state == STATE_REJECTED){
		thenable.$thenableReactions = [];
		type = 'rejectHandler';
	}

	if (type){
		defer(handle.pass([result, reactions, type]));
	}
}

function handle(result, reactions, type){
	for (var i = 0, l = reactions.length; i < l; ++i){
		var reaction = reactions[i],
			handler = reaction[type];

		if (handler === 'Identity'){
			resolve(reaction.thenable, result);
		} else if (handler === 'Thrower'){
			reject(reaction.thenable, result);
		} else {
			try {
				resolve(reaction.thenable, handler(result));
			} catch (exception){
				reject(reaction.thenable, exception);
			}
		}
	}
}

var defer;
if (typeof process !== 'undefined' && typeof process.nextTick === 'function'){
	defer = process.nextTick;
} else if (typeof setImmediate !== 'undefined'){
	defer = setImmediate;
} else {
	defer = function(fn){
		setTimeout(fn, 0);
	};
}

})();
