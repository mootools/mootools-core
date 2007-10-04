/*
Script: Element.js
	Specs for Element.js

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
		value_of($('nonexistant')).should_be_null();
	}

});

describe('new Element', {
	
	create_inputs_with_name_and_type_attributes: function(){
		var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
		var password = new Element('input', { type: 'password', name: 'password', value: 'password' });
		
		value_of($type(username)).should_be('element');
		value_of(username.type).should_be('text');
		value_of(username.name).should_be('username');
		value_of(username.value).should_be('username');
		
		value_of($type(password)).should_be('element');
		value_of(password.type).should_be('password');
		value_of(password.name).should_be('password');
		value_of(password.value).should_be('password');
	},
	
	get_disabled_attribute_from_created_inputs: function(){
		var disabled1 = new Element('input', { type: 'text', disabled: 'disabled' });
		var disabled2 = new Element('input', { type: 'text', disabled: true });
		var disabled3 = new Element('input', { type: 'text', disabled: false });
		
		value_of(disabled1.getProperty('disabled')).should_be_true();
		value_of(disabled2.getProperty('disabled')).should_be_true();
		value_of(disabled3.getProperty('disabled')).should_be_false();
	},
	
	get_readonly_attribute_from_created_inputs: function(){
		var readonly1 = new Element('input', { type: 'text', readonly: 'readonly' });
		var readonly2 = new Element('input', { type: 'text', readonly: true });
		var readonly3 = new Element('input', { type: 'text', readonly: false });
		
		value_of(readonly1.getProperty('readonly')).should_be_true();
		value_of(readonly2.getProperty('readonly')).should_be_true();
		value_of(readonly3.getProperty('readonly')).should_be_false();
	},
	
	get_checked_attribute_from_created_inputs: function(){
		var checked1 = new Element('input', { type: 'checkbox', checked: 'checked' });
		var checked2 = new Element('input', { type: 'checkbox', checked: true });
		var checked3 = new Element('input', { type: 'checkbox', checked: false });
		
		value_of(checked1.getProperty('checked')).should_be_true();
		value_of(checked2.getProperty('checked')).should_be_true();
		value_of(checked3.getProperty('checked')).should_be_false();
	}
	
});