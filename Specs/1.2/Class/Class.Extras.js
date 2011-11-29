/*
Script: Class.Extras.js
	Public specs for Class.Extras.js

License:
	MIT-style license.
*/

(function(){

var Local = Local || {};

describe("Chain Class", {

	"before all": function(){
		Local.Chain = new Class({

			Implements: Chain

		});
	},

	"callChain should not fail when nothing was added to the chain": function(){
		var chain = new Local.Chain();
		chain.callChain();
	},

	"should pass arguments to the function and return values": function(){
		var chain = new Local.Chain();
		var arr = [];
		chain.chain(function(a, b){
			var str = "0" + b + a;
			arr.push(str);
			return str;
		});
		chain.chain(function(a, b){
			var str = "1" + b + a;
			arr.push(str);
			return str;
		});
		var ret;
		expect(arr).toEqual([]);
		ret = chain.callChain("a", "A");
		expect(ret).toEqual("0Aa");
		expect(arr).toEqual(["0Aa"]);

		ret = chain.callChain("b", "B");
		expect(ret).toEqual("1Bb");
		expect(arr).toEqual(["0Aa", "1Bb"]);

		ret = chain.callChain();
		expect(ret).toEqual(false);
		expect(arr).toEqual(["0Aa", "1Bb"]);
	},

	"should chain any number of functions": function(){
		var chain = new Local.Chain();
		var arr = [];

		chain.chain(function(){
			arr.push(0);
		}, function(){
			arr.push(1);
		});

		expect(arr).toEqual([]);
		chain.callChain();
		expect(arr).toEqual([0]);
		chain.chain(function(){
			arr.push(2);
		});
		chain.callChain();
		expect(arr).toEqual([0, 1]);
		chain.callChain();
		expect(arr).toEqual([0, 1, 2]);
		chain.callChain();
		expect(arr).toEqual([0, 1, 2]);
	},

	"should allow an array of functions": function(){
		var chain = new Local.Chain();
		var arr = [];

		chain.chain([function(){
			arr.push(0);
		}, function(){
			arr.push(1);
		}, function(){
			arr.push(2);
		}]);

		expect(arr).toEqual([]);
		chain.callChain();
		expect(arr).toEqual([0]);
		chain.callChain();
		expect(arr).toEqual([0, 1]);
		chain.callChain();
		expect(arr).toEqual([0, 1, 2]);
		chain.callChain();
		expect(arr).toEqual([0, 1, 2]);
	},

	"each instance should have its own chain": function(){
		var foo = new Local.Chain();
		var bar = new Local.Chain();
		foo.val = "F";
		bar.val = "B";
		foo.chain(function(){
			this.val += 'OO';
		});
		bar.chain(function(){
			this.val += 'AR';
		});
		expect(foo.val).toEqual('F');
		expect(bar.val).toEqual('B');
		foo.callChain();
		bar.callChain();
		expect(foo.val).toEqual('FOO');
		expect(bar.val).toEqual('BAR');
	},

	"should be able to clear the chain": function(){
		var called;
		var fn = function(){
			called = true;
		};

		var chain = new Local.Chain();
		chain.chain(fn, fn, fn, fn);

		chain.callChain();
		expect(called).toBeTruthy();
		called = false;

		chain.clearChain();

		chain.callChain();
		expect(called).toBeFalsy();
		called = false;
	},

	"should be able to clear the chain from within": function(){
		var foo = new Local.Chain();

		var test = 0;
		foo.chain(function(){
			test++;
			foo.clearChain();
		}).chain(function(){
			test++;
		}).callChain();

		expect(test).toEqual(1);
	}

});

var fire = 'fireEvent';

var runEventSpecs = function(type, create){
	describe('1.2 Events API: ' + type.capitalize(), {

		'before each': function(){
			Local.called = 0;
			Local.fn = function(){
				return Local.called++;
			};
		},

		'should add an Event to the Class': function(){
			var object = create();

			object.addEvent('event', Local.fn)[fire]('event');

			expect(Local.called).toEqual(1);
		},

		'should add multiple Events to the Class': function(){
			create().addEvents({
				event1: Local.fn,
				event2: Local.fn
			})[fire]('event1')[fire]('event2');

			expect(Local.called).toEqual(2);
		},

		// TODO 2.0only
		/*'should be able to remove event during firing': function(){
			create().addEvent('event', Local.fn).addEvent('event', function(){
				Local.fn();
				this.removeEvent('event', arguments.callee);
			}).addEvent('event', function(){ Local.fn(); })[fire]('event')[fire]('event');

			expect(Local.called).toEqual(5);
		},*/

		'should remove a specific method for an event': function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn)[fire]('event');

			expect(x).toEqual(1);
			expect(Local.called).toEqual(0);
		},

		'should remove an event and its methods': function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvents('event')[fire]('event');

			expect(x).toEqual(0);
			expect(Local.called).toEqual(0);
		},

		'should remove all events': function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event1', Local.fn).addEvent('event2', fn).removeEvents();
			object[fire]('event1')[fire]('event2');

			expect(x).toEqual(0);
			expect(Local.called).toEqual(0);
		},

		'should remove events with an object': function(){
			var object = create();
			var events = {
				event1: Local.fn,
				event2: Local.fn
			};

			object.addEvent('event1', function(){ Local.fn(); }).addEvents(events)[fire]('event1');
			expect(Local.called).toEqual(2);

			object.removeEvents(events);
			object[fire]('event1');
			expect(Local.called).toEqual(3);

			object[fire]('event2');
			expect(Local.called).toEqual(3);
		}

	});
};

runEventSpecs('mixin', function(){
	return new Events
});

runEventSpecs('element', function(){
	return new Element('div');
});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: [Options, Events],

			options: {
				a: 1,
				b: 2
			},

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	"should set options": function(){
		var myTest = new Local.OptionsTest({a: 1, b: 3});
		expect(myTest.options).not.toEqual(undefined);
	},

	"should override default options": function(){
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		expect(myTest.options.a).toEqual(3);
		expect(myTest.options.b).toEqual(4);
	}

});

describe("Options Class with Events", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: [Options, Events],

			options: {
				onEvent1: function(){
					return true;
				},
				onEvent2: function(){
					return false;
				}
			},

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	"should add events in the options object if class has implemented the Events class": function(){
		var myTest = new Local.OptionsTest({
			onEvent2: function(){
				return true;
			},

			onEvent3: function(){
				return true;
			}
		});

		expect(myTest.$events.event1.length).toEqual(1);
		expect(myTest.$events.event2.length).toEqual(1);
		expect(myTest.$events.event3.length).toEqual(1);
	}

});

})();
