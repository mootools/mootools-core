/*
Script: NewElement.js
	Behavior Spec for new Element(expression)

License:
	MIT-style license.
*/

describe('new Element(expression)', {
	
	'should create a new div element': function(){
		var div = new Element('div');
		
		value_of(div.tagName.toLowerCase()).should_be('div');
		value_of(div.className).should_be_empty();
		value_of(div.id).should_be_empty();
		value_of(typeOf(div)).should_be('element');
	},
	
	'should create a new element with id and class': function(){
		var p = new Element('p', {
			id: 'myParagraph',
			'class': 'test className'
		});
		
		value_of(p.tagName.toLowerCase()).should_be('p');
		value_of(p.className).should_be('test className');
	},
	
	'should create a new element with id and class from css expression': function(){
		var p = new Element('p#myParagraph.test.className');
		
		value_of(p.tagName.toLowerCase()).should_be('p');
		value_of(p.className).should_be('test className');
	},
	
	'should create attributes from css expression': function(){
		var input = new Element('input[type=text][readonly=true][value=Some Text]');
		
		value_of(input.tagName.toLowerCase()).should_be('input');
		value_of(input.type).should_be('text');
		value_of(input.readOnly).should_be(true);
		value_of(input.value).should_be('Some Text');
	},
	
	'should overwrite ids and classes': function(){
		var div = new Element('div#myDiv.myClass', {
			id: 'myOverwrittenId',
			'class': 'overwrittenClass'
		});
		
		value_of(div.tagName.toLowerCase()).should_be('div');
		value_of(div.id).should_be('myOverwrittenId');
		value_of(div.className).should_be('overwrittenClass');
	},
	
	'should overwrite attributes': function(){
		var a = new Element('a[href=http://dojotoolkit.org/]', {
			href: 'http://mootools.net/'
		});
		
		value_of(a.tagName.toLowerCase()).should_be('a');
		value_of(a.href).should_be('http://mootools.net/');
	},
	
	'should reset attributes and classes with empty string': function(){
		var div = new Element('div#myDiv.myClass', {
			id: '',
			'class': ''
		});
		
		value_of(div.tagName.toLowerCase()).should_be('div');
		value_of(div.id).should_be('');
		value_of(div.className).should_be('');
	},
	
	'should not reset attributes and classes with null': function(){
		var div = new Element('div#myDiv.myClass', {
			id: null,
			'class': null
		});
		
		value_of(div.tagName.toLowerCase()).should_be('div');
		value_of(div.id).should_be('myDiv');
		value_of(div.className).should_be('myClass');
	},
	
	'should not reset attributes and classes with undefined': function(){
		var div = new Element('div#myDiv.myClass', {
			id: undefined,
			'class': undefined
		});
		
		value_of(div.tagName.toLowerCase()).should_be('div');
		value_of(div.id).should_be('myDiv');
		value_of(div.className).should_be('myClass');
	},
	
	'should fall back to a div tag': function(){
		var someElement = new Element('#myId');
		
		value_of(someElement.tagName.toLowerCase()).should_be('div');
		value_of(someElement.id).should_be('myId');
	},
	
	'should allow zero (0) values': function(){
		var table = new Element('table[cellpadding=0]');
		
		value_of(table.tagName.toLowerCase()).should_be('table');
		value_of(table.cellPadding == 0).should_be_true();
	}
	
});