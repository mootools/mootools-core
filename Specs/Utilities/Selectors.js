/*
Script: Selectors.js
	Specs for Selectors.js

License:
	MIT-style license.
*/

describe('Utilities.Selectors', {

	'should not return comment nodes': function(){
		var div = new Element('div');
		div.appendChild(document.createComment(''));
		value_of(div.getElements('*').length).should_be(0);
	}

});
