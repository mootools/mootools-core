/*
Script: Class.Extras.js
	Public specs for Class.Extras.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe("Chain Class", {

	"before all": function(){
		Local.Chain = new Class({});
		Local.Chain.implement(new Chain);
	},

	"callChain should not fail when nothing was added to the chain": function(){
		var chain = new Local.Chain();
		chain.callChain();
	}

});

describe('Events', {

	'before each': function(){
		Local.called = 0;
		Local.fn = function(){
			return Local.called++;
		};
	},

	'should add an Event to the Class': function(){
		var object = new Events();

		object.addEvent('event', Local.fn).fireEvent('event');

		value_of(Local.called).should_be(1);
	},

	'should add multiple Events to the Class': function(){
		new Events().addEvent('event1', Local.fn).addEvent('event2', Local.fn).fireEvent('event1').fireEvent('event2');

		value_of(Local.called).should_be(2);
	},


	'should remove a specific method for an event': function(){
		var object = new Events();
		var x = 0, fn = function(){ x++; };

		object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn).fireEvent('event');

		value_of(x).should_be(1);
		value_of(Local.called).should_be(0);
	},

	'should remove an event immediately': function(){
		var object = new Events();

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
		
		object.fireEvent('event');
		value_of(methods).should_be([1, 2]);

		object.fireEvent('event');
		value_of(methods).should_be([1, 2, 1, 2]);
	}

});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({
			
			options: {
				a: 1,
				b: 2
			},

			initialize: function(options){
				this.setOptions(options);
			}
		});
		Local.OptionsTest.implement(new Options, new Events);
	},

	"should set options": function(){
		var myTest = new Local.OptionsTest({a: 1, b: 3});
		value_of(myTest.options).should_not_be(undefined);
	},

	"should override default options": function(){
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		value_of(myTest.options.a).should_be(3);
		value_of(myTest.options.b).should_be(4);
	}

});

describe("Options Class with Events", {

	"before all": function(){
		Local.OptionsTest = new Class({
			
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
		Local.OptionsTest.implement(new Options, new Events);
	}

});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({

			initialize: function(options){
				this.setOptions(options);
			}
		});
		Local.OptionsTest.implement(new Options);
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
	}

});