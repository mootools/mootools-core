/*
Script: Class.Extras.js
	Specs for Class.Extras.js

License:
	MIT-style license.
*/

describe('Chain Class', {

	'before all': function(){
		this.local.Chain = new Class({

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
		var myChain = new this.local.Chain(), chains = myChain.$chain;

		value_of(chains).should_not_be(undefined);
		value_of(chains[0]).should_not_be(undefined);
		chains[0]();
		value_of(myChain.arr[0]).should_be(0);
	},

	'should call and remove the chained function': function(){
		var myChain = new this.local.Chain();
		var firstFunction = myChain.$chain[0];
		myChain.callChain();

		(function(){
			value_of(myChain.arr).should_have(1).items;
			value_of(myChain.arr[0]).should_be(0);
			value_of(myChain.$chain).should_have(2).items;
			value_of(myChain.$chain.contains(firstFunction)).should_be_false();
		}).delay(100);
	},

	'should clear all chained functions': function(){
		var myChain = new this.local.Chain();
		var firstFunction = myChain.$chain[0];
		myChain.clearChain();
		myChain.callChain();

		(function(){
			value_of(myChain.$chain).should_have(0).items;
			value_of(myChain.$chain.contains(firstFunction)).should_be_false();
		}).delay(100);
	}

});


describe('Events Class', {

	'before all': function(){
		this.local.EventsTest = new Class({
			Implements: Events,

			called: 0,

			initialize: function(){
				this.called = 0;
			}
		});

		this.local.fn = function(){
			return this.local.EventsTest.called++;
		}
	},

	'should add an Event to the Class': function(){
		var myTest = new this.local.EventsTest();
		myTest.addEvent('onEvent', this.local.fn);

		var events = myTest.$events;
		var myEvent = events['onEvent'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(this.local.fn)).should_be_true();
	},

	'shoul add multiple Events to the Class': function(){
		var myTest = new this.local.EventsTest();
		myTest.addEvents({
			'onEvent1': this.local.fn,
			'onEvent2': this.local.fn
		});

		var events = myTest.$events;
		var myEvent1 = events['onEvent1'];
		value_of(myEvent1).should_not_be(undefined);
		value_of(myEvent1.contains(this.local.fn)).should_be_true();

		var myEvent2 = events['onEvent2'];
		value_of(myEvent2).should_not_be(undefined);
		value_of(myEvent2.contains(this.local.fn)).should_be_true();
	},

	'should add an internal event': function(){
		var myTest = new this.local.EventsTest();
		myTest.addEvent('onInternal', this.local.fn, true);

		var events = myTest.$events;
		var myEvent = events['onInternal'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(this.local.fn)).should_be_true();
		value_of(myEvent[0].internal).should_be_true();
	},

	'should remove a specific method for an event': function(){
		var myTest = new this.local.EventsTest();
		var fn = function(){ return true; };
		myTest.addEvent('onEvent', this.local.fn);
		myTest.addEvent('onEvent', fn);
		myTest.removeEvent('onEvent', this.local.fn);

		var events = myTest.$events;
		var myEvent = events['onEvent'];
		value_of(myEvent).should_not_be(undefined);
		value_of(myEvent.contains(fn)).should_be_true();
	},

	'should remove an event and its methods': function(){
		var myTest = new this.local.EventsTest();
		var fn = function(){ return true; };
		var fn2 = function() { return this.local.EventsTest.called++; };
		myTest.addEvent('onEventRemove', fn);
		myTest.addEvent('onEventRemove', fn2);
		myTest.removeEvents('onEventRemove');

		var events = myTest.$events;
		value_of(events['onEventRemove'].length).should_be(0);
	},

	'should remove all events': function(){
		var myTest = new this.local.EventsTest();
		var fn = function(){ return true; };
		var fn2 = function() { return this.local.EventsTest.called++; };
		myTest.addEvent('onEventRemove1', fn);
		myTest.addEvent('onEventRemove2', fn2);
		myTest.removeEvents();

		var events = myTest.$events;
		value_of(events['onEventRemove1'].length).should_be(0);
		value_of(events['onEventRemove2'].length).should_be(0);
	}

});

describe('Options Class', {

	'before all': function(){
		this.local.OptionsTest = new Class({
			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	'should set options': function(){
		var myTest = new this.local.OptionsTest({ a: 1, b: 2});
		value_of(myTest.options).should_not_be(undefined);
	},

	'should override default options': function(){
		this.local.OptionsTest.implement({
			options: {
				a: 1,
				b: 2
			}
		});
		var myTest = new this.local.OptionsTest({a: 3, b: 4});
		value_of(myTest.options.a).should_be(3);
		value_of(myTest.options.b).should_be(4);
	},

	'should add events in the options object if class has implemented the Events class': function(){
		this.local.OptionsTest.implement(new Events, {
			options: {
				onEvent1: function(){
					return true;
				},
				onEvent2: function(){
					return false;
				}
			}
		});
		var myTest = new this.local.OptionsTest({
			onEvent3: function(){
				return true;
			}
		});
		var events = myTest.$events;
		value_of(events).should_not_be(undefined);
		value_of(events['onEvent1'].length).should_be(1);
		value_of(events['onEvent2'].length).should_be(1);
		value_of(events['onEvent3'].length).should_be(1);
	}

});