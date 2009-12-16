/*
Script: Element.Selectors.js
	Specs for Element.Selectors.js

License:
	MIT-style license.
*/

(function(){
	var ready;
	var div, links = [], pars = [];
	var setup = function(){
		if (ready) return;
		div = new Element('div', {'id':'selectorsTest'}).inject(document.body);
		(5).times(function(i){
			links.push(new Element('a', {'class': 'foo links bar', 'id': 'link_' + i, 'alt': 'alt ' + i}).inject(div));
			pars.push(new Element('p', {'class': 'para', 'id': 'para_' + i}).inject(div));
		});
		ready = true;
	};
	describe('Element.Selectors', {
		
		'$E': function(){
			setup();
			value_of($E('div#selectorsTest')).should_be(div);
			value_of($E('a', 'selectorsTest')).should_be(links[0]);
		},
		
		'$ES': function(){
			setup();
			value_of($ES('a', 'selectorsTest')).should_be(links);
		},
		
		'$$': function(){
			value_of($$('#selectorsTest a')).should_be(links);
			value_of($$('#selectorsTest a[alt^=alt]')).should_be(links);
			value_of($$('#selectorsTest a[alt$=1]')).should_be([links[1]]);
			value_of($$('#selectorsTest *[id$=1]')).should_be([links[1], pars[1]]);
			value_of($$('#selectorsTest *[id$=1]').each).should_be([].each);
		},
		
		'getElements and getElement': function(){
			value_of(div.getElements('a')).should_be(links);
			value_of(div.getElement('a')).should_be(links[0]);
		},
		
		'getElementsById, getElementsByClassName, and getElementBySelector': function(){
			value_of(div.getElementById('link_1')).should_be(links[1]);
			value_of(div.getElementsBySelector('*[id$=1], *[id$=2]')).should_be($$([links[1], pars[1], links[2], pars[2]]));
			var success = $A(div.getElementsByClassName('para')).every(function(p, i) { return pars[i] == p; });
			value_of(success).should_be_true();
		}
		
	});
	
})();
