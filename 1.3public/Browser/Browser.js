/*
Script: Browser.js
	Public Specs for Browser.js 1.3

License:
	MIT-style license.
*/

describe('Browser', {

	'should think it is executed in a browser': function(){
		value_of(Browser.ie || Browser.safari || Browser.chrome || Browser.firefox || Browser.opera).should_be(true);
	}

});