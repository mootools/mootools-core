/*
Script: Selectors.js
	Specs for Selectors.js

License:
	MIT-style license.
*/

var iframe, win, doc;

describe('$$', {

	'should return all divs on the page': function(){
		var divs1 = $$('div');
		var divs2 = Array.flatten(document.getElementsByTagName('div'));

		value_of(divs1).should_be(divs2);
	}

});