/*
Script: Browser.js
	Public Specs for Browser.js 1.2

License:
	MIT-style license.
*/

describe('$exec', {

	'should evaluate on global scope': function(){
		$exec.call($exec, 'var execSpec = 42');
		expect(window.execSpec).toEqual(42);
	},

	'should return the evaluated script': function(){
		expect($exec('$empty();')).toEqual('$empty();');
	}

});

describe('Document', {

	'should hold the parent window': function(){
		expect(document.window).toEqual(window);
	},

	'should hold the head element': function(){
		expect(document.head.tagName.toLowerCase()).toEqual('head');
	}

});

describe('Window', {

	'should set the Element prototype': function(){
		expect($defined(window.Element.prototype)).toBeTruthy();
	}

});
