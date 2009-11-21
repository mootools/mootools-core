/*
Script: Selectors.Children.js
	Specification Examples of Pseudo Selector :children.

License:
	MIT-style license.
*/

var Container, Children = [];

describe('PSeudo Selector :children', {

	'before all': function(){
		Container = new Element('div', {styles: {position: 'absolute', top: 0, left: 0, visibility: 'hidden'}});
		(10).times(function(i){
			Children.push(new Element('span', {id: 'child-' + i}).set('html', i));
		});
		Container.adopt(Children).inject(document.body);
	},

	'after all': function(){
		Container.destroy();
	},

	'should use zero-based indexing': function(){
		value_of(Container.getElement(':children(0)')).should_be(Children[0]);
	},

	'should use negative indexing': function(){
		value_of(Container.getElement(':children(-2)')).should_be(Children[8]);
	},

	'should return a range of child nodes': function(){
		value_of(Container.getElements(':children(0:2)')).should_be(Children.slice(0,3));
	},

	'should return a range of child nodes including negative index sorted from first to last node': function(){
		var children = Children.slice(0,3).extend(Children.slice(8));
		value_of(Container.getElements(':children(-2:2)')).should_be(children);
		value_of(Container.getElements(':children(2:-2)')).should_be(Children.slice(2,9));
	},

	'should return the node and n-number of child nodes to the right': function(){
		value_of(Container.getElements(':children(3+2)')).should_be(Children.slice(3,6));
	},

	'should return the node and n-number of child nodes to the right and wrap if necessary and sorting from first to last': function(){
		var children = Children.slice(0,3).extend(Children.slice(8));
		value_of(Container.getElements(':children(8+4)')).should_be(children);
	},

	'should return the node and n-number of child nodes to the left': function(){
		value_of(Container.getElements(':children(5-5)')).should_be(Children.slice(0,6));
	},

	'should return the node and n-number of child nodes to the left and wrap if necessary and sorting from first to last': function(){
		var children = Children.slice(0,3).extend(Children.slice(7));
		value_of(Container.getElements(':children(2-5)')).should_be(children);
	}

});