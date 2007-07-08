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

	this.test = test;
	this.name = name;
};

Test.Case.prototype.start = function(){
		
	this.options.onStart.call(this);
	var result = true;
	var startTime = new Date().getTime();
	try {
		result = this.test();
	} catch(e){
		this.options.onException.call(this, e);
		result = false;
	}
	var endTime = new Date().getTime();
	
	this.failed = (result === false);
	
	this.options.onComplete.call(this, endTime - startTime);

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

Test.Suite.prototype.start = function(){
	this.options.onStart.call(this);
	
	var startTime = new Date().getTime();
	
	for (var i = 0, l = this.testCases.length; i < l; i++) this.testCases[i].start();
	
	var endTime = new Date().getTime();
	
	this.options.onComplete.call(this, endTime - startTime);
};

Test.Messages = {
	
	expected: function(a, b){
		return 'Expecting "' + a + '" but found "' + b + '".';
	},
	
	type: function(a, type, aType){
		return 'Expecting type of "' + a + '" to be "' + type + '" but was "' + b + '" instead.';
	}

};

Test.Assert = {

	type: function(a, type){
		var aType = $type(a);
		return (aType != type) ? Test.Output.error(Test.Messages.type(a, type, aType)) : true;
	},
	
	equals: function(a, b){
		return (a != b) ? Test.Output.error(Test.Messages.expected(b, a)) : true;
	}

};

Test.all = function(){
	var allOk = true;
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] === false) allOk = false;
	}
	return allOk;
};

var $equals = Test.Assert.equals;