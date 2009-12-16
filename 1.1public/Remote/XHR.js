/*
Script: XHR.js
	Public Specs for XHR.js 1.1.2

License:
	MIT-style license.
*/
describe('XHR', {

	'should create an XHR instance': function(){
		value_of($type(new XHR().onStateChange)).should_be('function');
	}

});
