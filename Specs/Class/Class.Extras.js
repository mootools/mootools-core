/*
Script: Class.Extras.js
	Specs for Class.Extras.js

License:
	MIT-style license.
*/

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
		value_of(arr).should_be([]);
		ret = chain.callChain("a", "A");
		value_of(ret).should_be("0Aa");
		value_of(arr).should_be(["0Aa"]);

		ret = chain.callChain("b", "B");
		value_of(ret).should_be("1Bb");
		value_of(arr).should_be(["0Aa", "1Bb"]);

		ret = chain.callChain();
		value_of(ret).should_be(false);
		value_of(arr).should_be(["0Aa", "1Bb"]);
	},

	"should chain any number of functions": function(){
		var chain = new Local.Chain();
		var arr = [];

		chain.chain(function(){
			arr.push(0);
		}, function(){
			arr.push(1);
		});

		value_of(arr).should_be([]);
		chain.callChain();
		value_of(arr).should_be([0]);
		chain.chain(function(){
			arr.push(2);
		});
		chain.callChain();
		value_of(arr).should_be([0, 1]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
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

		value_of(arr).should_be([]);
		chain.callChain();
		value_of(arr).should_be([0]);
		chain.callChain();
		value_of(arr).should_be([0, 1]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
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
		value_of(foo.val).should_be('F');
		value_of(bar.val).should_be('B');
		foo.callChain();
		bar.callChain();
		value_of(foo.val).should_be('FOO');
		value_of(bar.val).should_be('BAR');
	}

});


describe("Events Class", {

	"before all": function(){
		Local.EventsTest = new Class({
			Implements: Events,

			called: 0,

			initialize: function(){
				this.called = 0;
			}
		});
	},

	"before each": function(){
		Local.called = 0;
		Local.fn = function(){
			return Local.called++;
		};
	},

	"should add an Event to the Class": function(){
		var myTest = new Local.EventsTest();
		myTest.addEvent("event", Local.fn);

		var events = myTest.$events;
		var myEvent = events["event"];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(Local.fn)).should_be_true();
	},

	"should add multiple Events to the Class": function(){
		var myTest = new Local.EventsTest();
		myTest.addEvents({
			"event1": Local.fn,
			"event2": Local.fn
		});

		var events = myTest.$events;
		var myEvent1 = events["event1"];
		value_of(myEvent1).should_not_be(undefined);
		value_of(myEvent1.contains(Local.fn)).should_be_true();

		var myEvent2 = events["event2"];
		value_of(myEvent2).should_not_be(undefined);
		value_of(myEvent2.contains(Local.fn)).should_be_true();
	},

	"should add an internal event": function(){
		var myTest = new Local.EventsTest();
		myTest.addEvent("internal", Local.fn, true);

		var events = myTest.$events;
		var myEvent = events["internal"];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(Local.fn)).should_be_true();
		value_of(myEvent[0].internal).should_be_true();
	},

	"should remove a specific method for an event": function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent("event", Local.fn);
		myTest.addEvent("event", fn);
		myTest.removeEvent("event", Local.fn);

		var events = myTest.$events;
		var myEvent = events["event"];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(fn)).should_be_true();
	},

	"should remove an event and its methods": function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent("event", Local.fn);
		myTest.addEvent("event", fn);
		myTest.removeEvents("event");

		var events = myTest.$events;
		value_of(events["event"].length).should_be(0);
	},

	"should remove all events": function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent("event1", Local.fn);
		myTest.addEvent("event2", fn);
		myTest.removeEvents();

		var events = myTest.$events;
		value_of(events["event1"].length).should_be(0);
		value_of(events["event2"].length).should_be(0);
	},

	"should remove events with an object": function(){
		var myTest = new Local.EventsTest();
		var events = {
			event1: Local.fn.create(),
			event2: Local.fn.create()
		};
		myTest.addEvent('event1', Local.fn.create()).addEvents(events);
		myTest.fireEvent('event1');
		value_of(Local.called).should_be(2);
		myTest.removeEvents(events);
		myTest.fireEvent('event1');
		value_of(Local.called).should_be(3);
		myTest.fireEvent('event2');
		value_of(Local.called).should_be(3);
	}

});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	"should set options": function(){
		var myTest = new Local.OptionsTest({ a: 1, b: 2});
		value_of(myTest.options).should_not_be(undefined);
	},

	"should override default options": function(){
		Local.OptionsTest.implement({
			options: {
				a: 1,
				b: 2
			}
		});
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		value_of(myTest.options.a).should_be(3);
		value_of(myTest.options.b).should_be(4);
	},

	"should add events in the options object if class has implemented the Events class": function(){
		Local.OptionsTest.implement(new Events, {
			options: {
				onEvent1: function(){
					return true;
				},
				onEvent2: function(){
					return false;
				}
			}
		});
		var myTest = new Local.OptionsTest({
			onEvent3: function(){
				return true;
			}
		});
		var events = myTest.$events;
		value_of(events).should_not_be(undefined);
		value_of(events["event1"].length).should_be(1);
		value_of(events["event2"].length).should_be(1);
		value_of(events["event3"].length).should_be(1);
	}

});