/*
Script: Class.Extras.js
	Specs for Class.Extras.js

License:
	MIT-style license.
*/

describe('Class.Chain', {

	chain: function(){
		var ChainTest = new Class({
			Implements: Chain,

			initialize: function(){
				this.chain(function(){
					return true;
				});
			}
		});

		var myChainTest = new ChainTest(), chains = myChainTest.$chain;

		value_of(chains).should_not_be(undefined);
		value_of(chains[0]).should_not_be(undefined);
		//value_of(chains[0]).should_be_a('function');
		value_of(chains[0]()).should_be_true();
	}

});


describe('Class.Events', {

	addEvent: function(){
		var AddEventTest = new Class({
			Implements: Events,

			initialize: function(){
				var called = 0;
				var self = this;
				var fn = function(){ return called++; };

				this.addEvent('onFirst', fn);
				this.addEvent('onFirst', fn);

				this.addEvent('onSecond', fn, true);
				this.addEvent('onSecond', function(){
					return called++;
				});
			}
		});

		var myEventsTest = new AddEventTest(), events = myEventsTest.$events;

		value_of(events).should_not_be(undefined);
		value_of(events['onFirst']).should_not_be(undefined);
		value_of(events['onFirst'][0]).should_not_be(undefined);
		value_of(events['onFirst'][1]).should_be(undefined);

		value_of(events['onSecond']).should_not_be(undefined);
		value_of(events['onSecond'][0]).should_not_be(undefined);
		value_of(events['onSecond']).should_have(2, "items");

		value_of(events['onSecond'][0].internal).should_be_true();
		value_of(events['onFirst'][0]()).should_be(0);
		value_of(events['onSecond'][0]()).should_be(1);
		value_of(events['onSecond'][1]()).should_be(2);
	},

	addEvents: function(){
		var AddEventsTest = new Class({
			Implements: Events,
			initialize: function(){
				var called = 0;
				var self = this;
				var fn = function(){ return called++; };

				this.addEvents({
					onFirst: fn,
					onSecond: fn
				});

				this.addEvents({
					onFirst: fn,
					onSecond: function(){
						return called++;
					}
				});
			}
		});

		var myEventsTest = new AddEventsTest(), events = myEventsTest.$events;

		value_of(events).should_not_be(undefined);
		value_of(events['onFirst']).should_not_be(undefined);
		value_of(events['onFirst'][0]).should_not_be(undefined);
		value_of(events['onFirst'][1]).should_be(undefined);

		value_of(events['onSecond']).should_not_be(undefined);
		value_of(events['onSecond'][0]).should_not_be(undefined);
		value_of(events['onSecond']).should_have(2, "items");

		value_of(events['onFirst'][0]()).should_be(0);
		value_of(events['onSecond'][0]()).should_be(1);
		value_of(events['onSecond'][1]()).should_be(2);
	},

	fireEvent: function(){
		var FireEventTest = new Class({
			Implements: Events,
			initialize: function(){
				this.called = 0;
				var self = this;
				var fn = function(){ self.called++; };

				this.addEvents({
					onFirst: fn,
					onSecond: fn
				});

				this.addEvent('onSecond', function(){
					self.called++;
				});
			}
		});

		var firstEvent = new FireEventTest();
		firstEvent.fireEvent('onFirst');

		var allEvents = new FireEventTest();
		allEvents.fireEvent('onFirst');
		allEvents.fireEvent('onSecond');

		value_of(firstEvent.called).should_be(1);
		value_of(allEvents.called).should_be(3);
	},

	removeEvent: function(){
		var fn;
		var RemoveEventTest = new Class({
			Implements: Events,
			initialize: function(){
				this.called = 0;
				var self = this;
				fn = function(){ self.called++; };

				this.addEvents({
					'onFirst': fn,
					'onSecond': fn
				});

				this.addEvent('onSecond', function(){
					self.called++;
				});
			}
		});

		var firstRemove = new RemoveEventTest();
		firstRemove.removeEvent('onFirst', fn);
		firstRemove.fireEvent('onFirst');

		var secondRemove = new RemoveEventTest();
		secondRemove.removeEvent('onSecond', fn);
		secondRemove.fireEvent('onFirst');
		secondRemove.fireEvent('onSecond');

		value_of(firstRemove.called).should_be(0);
		value_of(secondRemove.called).should_be(2);
	},

	removeEvents: function(){
		var fn;
		var RemoveEventsTest = new Class({
			Implements: Events,
			initialize: function(){
				var self = this;
				this.called = 0;
				fn = function(){ self.called++; };

				this.addEvents({
					'onFirst': fn,
					'onSecond': fn
				});

				this.addEvent('onSecond', function(){
					self.called++;
				});
			}
		});

		var firstRemove = new RemoveEventsTest();
		firstRemove.removeEvents('onFirst');
		firstRemove.fireEvent('onFirst');

		var secondRemove = new RemoveEventsTest();
		secondRemove.removeEvents();
		secondRemove.fireEvent('onFirst');
		secondRemove.fireEvent('onSecond');


		value_of(firstRemove.called).should_be(0);
		value_of(secondRemove.called).should_be(0);

		value_of(firstRemove.$events['onFirst'][0]).should_be(undefined);
		value_of(firstRemove.$events['onSecond']).should_not_be(undefined);

		value_of(secondRemove.$events['onFirst'][0]).should_be(undefined);
		value_of(secondRemove.$events['onSecond'][0]).should_be(undefined);
	}

});

describe('Class.Options', {

	setOptions: function(){
		var TestSetOptions = new Class({
			Implements: Options,
			options: {
				a: 1
			},
			initialize: function(options){
				this.setOptions(options);
			}
		});

		var NullInput = new TestSetOptions();
		var MergedInput = new TestSetOptions({
			a: 2,
			b: 3
		});

		var TestSetOptionsEvents = new Class({
			Implements: [Events, Options],
			options: {
				a: 1,
				onStart: $empty,
				onEnd: function(){
					return true;
				}
			},
			initialize: function(options){
				this.setOptions(options);
			}
		});
		var NullInputE = new TestSetOptionsEvents();
		var MergedInputE = new TestSetOptionsEvents({
			a: 3,
			b: 4,
			onStart: function(){
				return 'started';
			},
			onComplete: function(){
				return false;
			}
		});

		value_of(NullInput.options).should_not_be(undefined);
		//value_of(NullInput.options).should_be_an('object');
		value_of(NullInput.options.a).should_be(1);

		value_of(MergedInput.options.a).should_be(2);
		value_of(MergedInput.options.b).should_be(3);

		value_of(NullInputE.options).should_not_be(undefined);
		//value_of(NullInputE.options).should_be_an('object');
		value_of(NullInputE.options.a).should_be(1);
		//value_of(NullInputE.options.onStart).should_be_a('function');
		value_of(NullInputE.options.onEnd()).should_be_true();

		value_of(MergedInputE.options.a).should_be(3);
		value_of(MergedInputE.options.b).should_be(4);
		value_of(MergedInputE.options.onStart()).should_be('started');
		value_of(MergedInputE.options.onComplete()).should_be_false();
	}

});