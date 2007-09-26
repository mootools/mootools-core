/*
Script: Array.js
	Specs for Array.js

License:
	MIT-style license.
*/

describe('$', {
	
	return_the_element_for_elements: function(){
		var container = document.createElement('div');

		document.body.appendChild(container);

		container.innerHTML = '<div id="dollar-test"></div>';
		
		var dt = document.getElementById('dollar-test');
		
		value_of($('dollar-test')).should_be(dt);
		value_of($type(container)).should_be('element');
		
		container.parentNode.removeChild(container);
	},
	
	return_window_on_window_and_document_on_document: function(){
		
		value_of($(window)).should_be(window);
		value_of($(document)).should_be(document);
	},
	
	return_null_if_string_not_found_or_type_mismatch: function(){
		
		value_of($(1)).should_be_null();
		value_of($('eedeeee')).should_be_null();
	}
	
});

describe('new Element', {
	
	crate_inputs_with_name_and_type_crossbrowser: function(){
		var el = new Element('input', {name: 'firstname', type: 'text', value: 'jack'});
		
		value_of($type(el)).should_be('element');
		value_of(el.name).should_be('firstname');
		value_of(el.type).should_be('text');
		value_of(el.value).should_be('jack');
	}
	
});