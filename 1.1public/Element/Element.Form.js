/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){
	var form, email, zip, select;
	var setup = function(){
		if (zip) return;
		form = new Element('form');
		
		email = new Element('input', {
			name: 'email',
			type: 'text'
		}).inject(form).set({'value': 'bob@bob.com'});
		
		zip = new Element('input', {
			name: 'zip',
			type: 'text'
		}).inject(form).set({'value': '90210'});
		
		select = new Element('select', {
			name: 'fruits',
			multiple: true
		}).inject(form);
		
		new Element('option', {
			value: 'apple',
			selected: true
		}).inject(select).text = "apple";
		
		new Element('option', {
			value: 'lemon'
		}).inject(select).text = "lemon";
		
		new Element('option', {
			value: 'pear',
			selected: true
		}).inject(select).text = "pear";
		
		div = new Element('div').inject(form);
	
	};
	window.addEvent('domready', setup);

	describe('Element.getValue', {
		
		'should get the value of an input element': function(){
			if (!zip) setup();
			value_of(zip.getValue()).should_be('90210');
			value_of(select.getValue()).should_be(['apple', 'pear']);
		}
		
	});
	
	describe('Element.getFormElements', {
		
		'should get the form inputs inside a form': function(){
			value_of(form.getFormElements()).should_be($$([email, zip, select]));
		}
		
	});

	describe('Element.toQueryString', {
		
		'should get the top the element': function(){
			value_of(form.toQueryString()).should_be('email=bob%40bob.com&zip=90210&fruits=apple&fruits=pear');
		}
		
	});

})();
