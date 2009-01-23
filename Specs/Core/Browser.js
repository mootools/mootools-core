/*
Script: Browser.js
	Specs for Browser.js

License:
	MIT-style license.
*/

describe('Window.exec', {

	'should evaluate on global scope': function(){
		Window.exec.call(Window.exec, 'var execSpec = 42');
		value_of(window.execSpec).should_be(42);
	},

	'should return the evaluated script': function(){
		value_of(Window.exec('Function.empty();')).should_be('Function.empty();');
	}

});

describe('Document', {

	'should hold the parent window': function(){
		value_of(document.window).should_be(window);
	},

	'should hold the head element': function(){
		value_of(document.head.tagName.toLowerCase()).should_be('head');
	}

});

describe('Window', {

	'should set the Element prototype': function(){
		value_of(Object.defined(window.Element.prototype)).should_be_true();
	}

});