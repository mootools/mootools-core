/*
Script: Test.js
	Main file for the unit test plug-in.

License:
	MIT-style license.
*/

var Test = {};

var Tests = {};

Test.Output = {

	group: function(name){
		return console.group(name);
	},

	groupEnd: function(name){
		return console.groupEnd(name);
	},

	info: function(data){
		return console.info(data);
	},

	error: function(data){
		console.error(data);
		return false;
	},

	success: function(data){
		console.info(data);
		return true;
	},

	log: function(data){
		return console.log(data);
	},

	warn: function(data){
		return console.warn(data);
	}

};

Test.Case = function(name, test, options){

	options = options || {};

	this.options = {

		onStart: function(){
			Test.Output.group('Test Case: ' + this.name);
		},

		onComplete: function(time){
			if (this.failed) Test.Output.error('Test Case failed.');
			else Test.Output.success('Test Case succeeded. Time taken: ' + time + ' ms');
			Test.Output.groupEnd('Test Case: ' + this.name);
		},

		onException: function(e){
			Test.Output.error('Exception occurred: ' + e);
		}

	};

	for (var option in options) this.options[option] = options[option];

	this.onCaseEnd = function(){};

	this.test = test;
	this.name = name;
};

Test.Case.prototype = {

	start: function(){

		this.options.onStart.call(this);
		this.startTime = new Date().getTime();

		try {
			this.test();
		} catch(e){
			this.options.onException.call(this, e);
		}

	},

	check: function(result){
		var endTime = new Date().getTime();
		this.failed = (result === false);
		this.options.onComplete.call(this, endTime - this.startTime);
	},

	end: function(){
		var allOk = true;
		for (var i = 0, l = arguments.length; i < l; i++){
			if (arguments[i] === false) allOk = false;
		}
		this.check(allOk);
		this.onCaseEnd.call(this);
	}

};

Test.Suite = function(name, cases, options){

	options = options || {};

	this.errors = 0;

	this.options = {

		onStart: function(){
			Test.Output.group('Test Suite: ' + this.name);
		},

		onComplete: function(time){
			if (!this.errors) Test.Output.success('Test Suite succeeded. Time taken: ' + time + ' ms');
			else Test.Output.error('Test Suite failed. There were ' + this.errors + ' errors.');
			Test.Output.groupEnd('Test Suite: ' + this.name);
		}

	};

	for (var option in options) this.options[option] = options[option];

	this.onSuiteEnd = function(){};

	this.name = name;

	this.testCases = [];

	var self = this;

	for (var caseName in cases){
		var current = new Test.Case(caseName, cases[caseName]);

		var oldComplete = current.options.onComplete;

		current.options.onComplete = function(time){
			oldComplete.call(this, time);
			if (this.failed) self.errors++;
		};

		this.testCases.push(current);
	}

};

Test.Suite.prototype = {

	start: function(){
		this.options.onStart.call(this);

		this.startTime = new Date().getTime();

		for (var i = 0, l = this.testCases.length; i < l; i++) this.testCases[i].onCaseEnd = this.make(i);

		this.testCases[0].start();
	},

	make: function(i){
		var self = this;

		if (this.testCases[i + 1]) return function(){
			self.testCases[i + 1].start();
		};
		return function(){
			self.end();
		};
	},

	end: function(){
		var endTime = new Date().getTime();
		this.options.onComplete.call(this, endTime - this.startTime);
		this.onSuiteEnd.call(this);
	}

};

var Assert = {

	type: function(a, type){
		var aType = $type(a);
		return (aType != type) ? Test.Output.error('Expecting type of "' + a + '" to be "' + type + '" but was "' + b + '" instead.') : true;
	},

	equals: function(a, b){
		return (a !== b) ? Test.Output.error('Expecting "' + a + '" but found "' + b + '".') : true;
	},

	isTrue: function(a){
		return (a !== true) ? Test.Output.error('Object "' + a + '" is not true.') : true;
	},

	isFalse: function(a){
		return (a !== false) ? Test.Output.error('Object "' + a + '" is not false.') : true;
	},

	stringEquals: function(a, b){
		a = String(a);
		b = String(b);
		return (a != b) ? Test.Output.error('String representation "' + a + '" is different than String representation "' + b + '".') : true;
	},

	enumEquals: function(a, b) {
		var isEqual = (a.length == b.length);
		for (var i = 0, j = a.length; i < j; i++) {
			if (a[i] != b[i]) isEqual = false;
		}
		return (!isEqual) ? Test.Output.error('Enumerable ["' + a + '"] is different than Enumerable ["' + b + '"].') : true;
	}

};

Tests.start = function(){
	Tests.all = [];
	var make = function(i){
		if (!Tests.all[i + 1]) return function(){};
		return function(){
			Tests.all[i + 1].start();
		};
	};

	for (var suite in Tests){
		if (Tests[suite].start) Tests.all.push(Tests[suite]);
	}

	for (var i = 0, l = Tests.all.length; i < l; i++) Tests.all[i].onSuiteEnd = make(i);

	Tests.all[0].start();

};