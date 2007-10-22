/*
Script: Selectors.js
	Specs for Selectors.js

License:
	MIT-style license.
*/

var iframe, win, doc;

describe('$$', {

	'should return all divs on the page': function(){
		var divs1 = win.$$('div');
		var divs2 = Array.flatten(doc.getElementsByTagName('div'));

		value_of(divs1).should_be(divs2);
	}

});

window.addEvent('load', function(){

	iframe = new IFrame({
		src: 'Selectors/index.html',
		styles: {
			height: '1px',
			width: '1px',
			visibility: 'hidden'
		},
		onload: function(){
			win = iframe.window;
			doc = iframe.window.document;

			console.log(this, win, doc);
			// console.log(this.$$('div')); //this dies
		}
	}).injectInside(document.body);

});
