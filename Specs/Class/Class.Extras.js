/*
---
name: Class.Extras
requires: ~
provides: ~
...
*/

(function(){

var Local = Local || {};

describe('Chain', function(){

	beforeEach(function(){
		Local.Chain = new Class({

			Implements: Chain

		});
	});

	it('callChain should not fail when nothing was added to the chain', function(){
		var chain = new Local.Chain();
		chain.callChain();
	});

	it('should pass arguments to the function and return values', function(){
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
	});

	it('should chain any number of functions', function(){
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
	});

	it('should allow an array of functions', function(){
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
	});

	it('each instance should have its own chain', function(){
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
	});

	it('should be able to clear the chain', function(){
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
	});

	it('should be able to clear the chain from within', function(){
		var foo = new Local.Chain();

		var test = 0;
		foo.chain(function(){
			test++;
			foo.clearChain();
		}).chain(function(){
			test++;
		}).callChain();

		expect(test).toEqual(1);
	});

});

var fire = 'fireEvent';

var runEventSpecs = function(type, create){
	describe('Events API: ' + type.capitalize(), function(){

		beforeEach(function(){
			Local.called = 0;
			Local.fn = function(){
				return Local.called++;
			};
		});

		it('should add an Event to the Class', function(){
			var object = create();

			object.addEvent('event', Local.fn)[fire]('event');

			expect(Local.called).toEqual(1);
		});

		it('should add multiple Events to the Class', function(){
			create().addEvents({
				event1: Local.fn,
				event2: Local.fn
			})[fire]('event1')[fire]('event2');

			expect(Local.called).toEqual(2);
		});

		it('should remove a specific method for an event', function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn)[fire]('event');

			expect(x).toEqual(1);
			expect(Local.called).toEqual(0);
		});

		it('should remove an event and its methods', function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvents('event')[fire]('event');

			expect(x).toEqual(0);
			expect(Local.called).toEqual(0);
		});

		it('should remove all events', function(){
			var object = create();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event1', Local.fn).addEvent('event2', fn).removeEvents();
			object[fire]('event1')[fire]('event2');

			// Should not fail
			object.removeEvents()[fire]('event1')[fire]('event2');

			expect(x).toEqual(0);
			expect(Local.called).toEqual(0);
		});

		it('should remove events with an object', function(){
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
		});

		it('should remove an event immediately', function(){
			var object = create();

			var methods = [];

			var three = function(){
				methods.push(3);
			};

			object.addEvent('event', function(){
				methods.push(1);
				this.removeEvent('event', three);
			}).addEvent('event', function(){
				methods.push(2);
			}).addEvent('event', three);

			object[fire]('event');
			expect(methods).toEqual([1, 2]);

			object[fire]('event');
			expect(methods).toEqual([1, 2, 1, 2]);
		});

		it('should be able to remove itself', function(){
			var object = create();

			var methods = [];

			var one = function(){
				object.removeEvent('event', one);
				methods.push(1);
			};
			var two = function(){
				object.removeEvent('event', two);
				methods.push(2);
			};
			var three = function(){
				methods.push(3);
			};

			object.addEvent('event', one).addEvent('event', two).addEvent('event', three);

			object[fire]('event');
			expect(methods).toEqual([1, 2, 3]);

			object[fire]('event');
			expect(methods).toEqual([1, 2, 3, 3]);
		});

	});
};

runEventSpecs('mixin', function(){
	return new Events();
});

runEventSpecs('element', function(){
	return new Element('div');
});

describe('Options Class', function(){

	beforeEach(function(){
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
	});

	it('should set options', function(){
		var myTest = new Local.OptionsTest({a: 1, b: 3});
		expect(myTest.options).not.toEqual(undefined);
	});

	it('should override default options', function(){
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		expect(myTest.options.a).toEqual(3);
		expect(myTest.options.b).toEqual(4);
	});

});

describe('Options Class with Events', function(){

	beforeEach(function(){
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
	});

	it('should add events in the options object if class has implemented the Events class', function(){
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
	});

});

})();

describe('setOptions', function(){

	it('should allow to pass the document', function(){

		var A = new Class({

			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}

		});

		expect(new A({document: document}).options.document == document).toBeTruthy();
	});

});
