/*
Script: Class.Extras.js
	Specs for Class.Extras.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe('Chain Class', {

	'before all': function(){
		Local.Chain = new Class({

			Implements: Chain,

			initialize: function(){
				var self = this;
				this.arr = [];

				this.chain(function(){
					self.arr.push(0);
				}, function(){
					self.arr.push(1);
				}, function(){
					self.arr.push(2);
				});
			}

		});
	},

	'should chain any number of functions': function(){
		var myChain = new Local.Chain(), chains = myChain.$chain;

		value_of(chains).should_not_be(undefined);
		value_of(chains[0]).should_not_be(undefined);
		chains[0]();
		value_of(myChain.arr[0]).should_be(0);
	}

});


describe('Events Class', {

	'before all': function(){
		Local.EventsTest = new Class({
			Implements: Events,

			called: 0,

			initialize: function(){
				this.called = 0;
			}
		});
	},

	'before each': function(){
		Local.fn = function(){
			return Local.EventsTest.called++;
		};
	},

	'should add an Event to the Class': function(){
		var myTest = new Local.EventsTest();
		myTest.addEvent('event', Local.fn);

		var events = myTest.$events;
		var myEvent = events['event'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(Local.fn)).should_be_true();
	},

	'should add multiple Events to the Class': function(){
		var myTest = new Local.EventsTest();
		myTest.addEvents({
			'event1': Local.fn,
			'event2': Local.fn
		});

		var events = myTest.$events;
		var myEvent1 = events['event1'];
		value_of(myEvent1).should_not_be(undefined);
		value_of(myEvent1.contains(Local.fn)).should_be_true();

		var myEvent2 = events['event2'];
		value_of(myEvent2).should_not_be(undefined);
		value_of(myEvent2.contains(Local.fn)).should_be_true();
	},

	'should add an internal event': function(){
		var myTest = new Local.EventsTest();
		myTest.addEvent('internal', Local.fn, true);

		var events = myTest.$events;
		var myEvent = events['internal'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(Local.fn)).should_be_true();
		value_of(myEvent[0].internal).should_be_true();
	},

	'should remove a specific method for an event': function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent('event', Local.fn);
		myTest.addEvent('event', fn);
		myTest.removeEvent('event', Local.fn);

		var events = myTest.$events;
		var myEvent = events['event'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(fn)).should_be_true();
	},

	'should remove an event and its methods': function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent('event', Local.fn);
		myTest.addEvent('event', fn);
		myTest.removeEvents('event');

		var events = myTest.$events;
		value_of(events['event'].length).should_be(0);
	},

	'should remove all events': function(){
		var myTest = new Local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent('event1', Local.fn);
		myTest.addEvent('event2', fn);
		myTest.removeEvents();

		var events = myTest.$events;
		value_of(events['event1'].length).should_be(0);
		value_of(events['event2'].length).should_be(0);
	}

});

describe('Options Class', {

	'before all': function(){
		Local.OptionsTest = new Class({
			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	'should set options': function(){
		var myTest = new Local.OptionsTest({ a: 1, b: 2});
		value_of(myTest.options).should_not_be(undefined);
	},

	'should override default options': function(){
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

	'should add events in the options object if class has implemented the Events class': function(){
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
		value_of(events['event1'].length).should_be(1);
		value_of(events['event2'].length).should_be(1);
		value_of(events['event3'].length).should_be(1);
	}

});