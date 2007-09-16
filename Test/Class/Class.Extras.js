/*
Script: Class.js
	Unit Tests for Class.js

License:
	MIT-style license.
*/

Tests.Chain = new Test.Suite('Class.Extras.js, Chain', {

	chain: function(){
		var ChainTest = new Class({
			Implements: Chain,

			initialize: function(){
				this.res = this.chain(function(){
					return true;
				});
			}
		});

		var myChain = new ChainTest();

		this.end(
			Assert.isDefined(myChain.$chain),
			Assert.isType(myChain.$chain[0], 'function'),
			Assert.isTrue(myChain.$chain[0]())
		);
	},

	callChain: function(){
		var ChainTest = new Class({
			Implements: Chain,
			initialize: function(){
				var self = this;
				this.arr = [];

				this.chain(function(){
					self.arr.push(0);
				}).chain(function(){
					self.arr.push(1);
				}).chain(function(){
					self.arr.push(2);
				});
			}
		});

		var myChain = new ChainTest();

		for(var i = 0; i < 3; i++) myChain.callChain();

		(function(){
			this.end(
				Assert.equals(myChain.arr.length, 3),
				Assert.equals(myChain.arr[0], 0),
				Assert.equals(myChain.arr[1], 1),
				Assert.equals(myChain.arr[2], 2)
			);
		}).delay(100, this);
	},
	
	clearChain: function(){
		var ChainTest = new Class({
			Implements: Chain,
			initialize: function(){
				var self = this;
				this.arr = [];

				this.chain(function(){
					self.arr.push(0);
				}).chain(function(){
					self.arr.push(1);
				}).chain(function(){
					self.arr.push(2);
				});
			}
		});

		var myChain = new ChainTest();
		myChain.clearChain();
		myChain.callChain();

		(function(){
			this.end(
				Assert.equals(myChain.$chain.length, 0),
				Assert.isFalse($chk(myChain.arr[0]))
			);
		}).delay(100, this);
	}
	
});


Tests.Events = new Test.Suite('Class.Extras.js, Events', {

	addEvent: function(){
		var ClassEvents = new Class({ Implements: Events,
			initialize: function(){
				var self = this;
				var called = 0;
				var fn = function(){ return called++; };

				this.addEvent('onFirst', fn);
				this.addEvent('onFirst', fn);

				this.addEvent('onSecond', fn, true);
				this.addEvent('onSecond', function(){
					return called++;
				});
			}
		});

		var TestAddEvent = new ClassEvents();
		
		this.end(
			Assert.isDefined(TestAddEvent.$events),
			Assert.isDefined(TestAddEvent.$events['onFirst']),
			Assert.isDefined(TestAddEvent.$events['onFirst'][0]),
			Assert.notDefined(TestAddEvent.$events['onFirst'][1]),

			Assert.isDefined(TestAddEvent.$events['onSecond']),
			Assert.isDefined(TestAddEvent.$events['onSecond'][0]),
			Assert.equals(TestAddEvent.$events['onSecond'].length, 2),

			Assert.isTrue(TestAddEvent.$events['onSecond'][0].internal),
			Assert.equals(TestAddEvent.$events['onFirst'][0](), 0),
			Assert.equals(TestAddEvent.$events['onSecond'][0](), 1),
			Assert.equals(TestAddEvent.$events['onSecond'][1](), 2)
		);
	},
	
	addEvents: function(){
		var ClassEvents = new Class({
			Implements: Events,
			initialize: function(){
				var self = this;
				var called = 0;
				var fn = function(){ return called++; };

				this.addEvents({
					'onFirst': fn,
					'onSecond': fn
				});

				this.addEvents({
					'onFirst': fn,
					'onSecond': function(){
						return called++;
					}
				});
			}
		});

		var TestAddEvents = new ClassEvents();

		this.end(
			Assert.isDefined(TestAddEvents.$events),
			Assert.isDefined(TestAddEvents.$events['onFirst']),
			Assert.isDefined(TestAddEvents.$events['onFirst'][0]),
			Assert.notDefined(TestAddEvents.$events['onFirst'][1]),

			Assert.isDefined(TestAddEvents.$events['onSecond']),
			Assert.isDefined(TestAddEvents.$events['onSecond'][0]),
			Assert.equals(TestAddEvents.$events['onSecond'].length, 2),

			Assert.equals(TestAddEvents.$events['onFirst'][0](), 0),
			Assert.equals(TestAddEvents.$events['onSecond'][0](), 1),
			Assert.equals(TestAddEvents.$events['onSecond'][1](), 2)
		);
	},

	fireEvent: function(){
		var FireEvent = new Class({
			Implements: Events,
			initialize: function(){
				var self = this;
				this.called = 0;
				var fn = function(){ self.called++; };

				this.addEvents({
					'onFirst': fn,
					'onSecond': fn
				});

				this.addEvent('onSecond', function(){
					self.called++;
				});
			}
		});

		var firstEvent = new FireEvent();
		firstEvent.fireEvent('onFirst');

		var allEvents = new FireEvent();
		allEvents.fireEvent('onFirst');
		allEvents.fireEvent('onSecond');

		this.end(
			Assert.equals(firstEvent.called, 1),
			Assert.equals(allEvents.called, 3)
		);
	},

	removeEvent: function(){
		var fn;
		var RemoveEvent = new Class({
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

		var firstRemove = new RemoveEvent();
		firstRemove.removeEvent('onFirst', fn);
		firstRemove.fireEvent('onFirst');

		var secondRemove = new RemoveEvent();
		secondRemove.removeEvent('onSecond', fn);
		secondRemove.fireEvent('onFirst');
		secondRemove.fireEvent('onSecond');

		this.end(
			Assert.equals(firstRemove.called, 0),
			Assert.equals(secondRemove.called, 2)
		);
	},

	removeEvents: function(){
		var fn;
		var RemoveEvent = new Class({
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

		var firstRemove = new RemoveEvent();
		firstRemove.removeEvents('onFirst');
		firstRemove.fireEvent('onFirst');

		var secondRemove = new RemoveEvent();
		secondRemove.removeEvents();
		secondRemove.fireEvent('onFirst');
		secondRemove.fireEvent('onSecond');
		

		this.end(
			Assert.equals(firstRemove.called, 0),
			Assert.equals(secondRemove.called, 0),

			Assert.notDefined(firstRemove.$events['onFirst'][0]),
			Assert.isDefined(firstRemove.$events['onSecond']),

			Assert.notDefined(secondRemove.$events['onFirst'][0]),
			Assert.notDefined(secondRemove.$events['onSecond'][0])
		);
	}
	
});

Tests.Options = new Test.Suite('Class.Extras.js, Options', {

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

		this.end(
			Assert.isDefined(NullInput.options),
			Assert.isType(NullInput.options, 'object'),
			Assert.equals(NullInput.options.a, 1),

			Assert.equals(MergedInput.options.a, 2),
			Assert.equals(MergedInput.options.b, 3),

			Assert.isDefined(NullInputE.options),
			Assert.isType(NullInputE.options, 'object'),
			Assert.equals(NullInputE.options.a, 1),
			Assert.isType(NullInputE.options.onStart, 'function'),
			Assert.isTrue(NullInputE.options.onEnd()),

			Assert.equals(MergedInputE.options.a, 3),
			Assert.equals(MergedInputE.options.b, 4),
			Assert.equals(MergedInputE.options.onStart(), 'started'),
			Assert.isFalse(MergedInputE.options.onComplete())
		);
	}

});