/*
Script: Browser.js
	Public Specs for Browser.js 1.3

License:
	MIT-style license.
*/

describe('Browser', {

	'should think it is executed in a browser': function(){
		expect(Browser.ie || Browser.safari || Browser.chrome || Browser.firefox || Browser.opera).toEqual(true);
	}

});