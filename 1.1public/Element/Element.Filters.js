/*
Script: Element.Filters.js
	Specs for Element.Filters.js

License:
	MIT-style license.
*/

(function(){
	var div = new Element('div');
	var links = [], pars = [];
	(5).times(function(i){
		links.push(new Element('a', {'class': 'foo links bar', 'id': 'link_' + i, 'alt': 'alt ' + i}).inject(div));
		pars.push(new Element('p', {'class': 'para', 'id': 'para_' + i}).inject(div));
	});

	describe('Element.Filters', {
		
		'should get all the links in a div': function(){
			value_of(div.getElements('*').filterByTag('a')).should_be(links);
		},
		
		'should get all the items with a given class in a div': function(){
			value_of(div.getElements('*').filterByClass('links')).should_be(links);
		},
		
		'should get an item from a collection by id': function(){
			value_of(div.getElements('*').filterById('link_2')).should_be([links[2]]);
		},
		
		'should get an item from a collection by attribute': function(){
			value_of(div.getElements('*').filterByAttribute('alt', '=', 'alt 1')).should_be([links[1]]);
			value_of(div.getElements('*').filterByAttribute('alt')).should_be(links);
			value_of(div.getElements('*').filterByAttribute('alt', '^=', 'alt ')).should_be(links);
			value_of(div.getElements('*').filterByAttribute('alt', '!=', 'alt 0')).should_be(links.filter(function(link){ 
				return $(link).getAttribute('alt') != 'alt 0';
				})
			);
			value_of(div.getElements('*').filterByAttribute('id', '$=', '0')).should_be([links[0], pars[0]]);
			value_of(div.getElements('*').filterByAttribute('class', '!=', 'para')).should_be(links);
			value_of(div.getElements('*').filterByAttribute('class', '~=', 'bar')).should_be(links);
		}
		
	});
	
})();
