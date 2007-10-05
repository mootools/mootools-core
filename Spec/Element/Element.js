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
	
	create_elements_with_for_attribute: function(){
		var label = new Element('label', { 'for': 'myId' });
		
		value_of(label.htmlFor).should_be('myId');
	},
	
	create_elements_with_class_attribute: function(){
		var div1 = new Element('div', { 'class': 'myClass' });
		var div2 = new Element('div', { 'class': 'myClass myOtherClass' });
		
		value_of(div1.className).should_be('myClass');
		value_of(div2.className).should_be('myClass myOtherClass');
	},
	
	create_elements_with_various_attributes: function(){
		var element1 = new Element('div', { 'id': 'myDiv', 'title': 'myDiv' });
		var element2 = new Element('span', { 'id': 'mySpan', 'title': 'mySpan' });
		var element3 = new Element('ul', { 'id': 'myList', 'title': 'myList' });
		var element4 = new Element('li', { 'id': 'myItem', 'title': 'myItem' });
		var element5 = new Element('a', { 'id': 'myAnchor', 'title': 'myAnchor' });
		
		value_of($type(element1)).should_be('element');
		value_of(element1.getTag()).should_be('div');
		value_of(element1.id).should_be('myDiv');
		value_of(element1.title).should_be('myDiv');
		
		value_of($type(element2)).should_be('element');
		value_of(element2.getTag()).should_be('span');
		value_of(element2.id).should_be('mySpan');
		value_of(element2.title).should_be('mySpan');
		
		value_of($type(element3)).should_be('element');
		value_of(element3.getTag()).should_be('ul');
		value_of(element3.id).should_be('myList');
		value_of(element3.title).should_be('myList');
		
		value_of($type(element4)).should_be('element');
		value_of(element4.getTag()).should_be('li');
		value_of(element4.id).should_be('myItem');
		value_of(element4.title).should_be('myItem');
		
		value_of($type(element5)).should_be('element');
		value_of(element5.getTag()).should_be('a');
		value_of(element5.id).should_be('myAnchor');
		value_of(element5.title).should_be('myAnchor');
	},
	
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
	}

});

describe('Element Properties', {
	
	get_and_set_href_attribute_from_anchor_elements: function(){
		var anchor1 = new Element('a', { href: 'http://mootools.net' });
		var anchor2 = new Element('a', { href: '#someLink' });
		
		value_of(anchor1.getProperty('href')).should_be('http://mootools.net');
		value_of(anchor2.getProperty('href')).should_be('#someLink');
	},
	
	get_and_set_checked_attribute_from_input_elements: function(){
		var checked1 = new Element('input', { type: 'checkbox', checked: 'checked' });
		var checked2 = new Element('input', { type: 'checkbox', checked: true });
		var checked3 = new Element('input', { type: 'checkbox', checked: false });
		
		value_of(checked1.getProperty('checked')).should_be_true();
		value_of(checked2.getProperty('checked')).should_be_true();
		value_of(checked3.getProperty('checked')).should_be_false();
		
		checked1.removeProperty('checked');
		checked2.setProperty('checked', false);
		
		value_of(checked1.getProperty('checked')).should_be_false();
		value_of(checked2.getProperty('checked')).should_be_false();
		
		checked1.setProperty('checked', 'checked');
		checked2.setProperty('checked', true);
		
		value_of(checked1.getProperty('checked')).should_be_true();
		value_of(checked2.getProperty('checked')).should_be_true();
	},
	
	get_and_set_disabled_attribute_from_input_elements: function(){
		var disabled1 = new Element('input', { type: 'text', disabled: 'disabled' });
		var disabled2 = new Element('input', { type: 'text', disabled: true });
		var disabled3 = new Element('input', { type: 'text', disabled: false });
		
		value_of(disabled1.getProperty('disabled')).should_be_true();
		value_of(disabled2.getProperty('disabled')).should_be_true();
		value_of(disabled3.getProperty('disabled')).should_be_false();
		
		disabled1.removeProperty('disabled');
		disabled2.setProperty('disabled', false);
		
		value_of(disabled1.getProperty('disabled')).should_be_false();
		value_of(disabled2.getProperty('disabled')).should_be_false();
		
		disabled1.setProperty('disabled', 'disabled');
		disabled2.setProperty('disabled', true);
		
		value_of(disabled1.getProperty('disabled')).should_be_true();
		value_of(disabled2.getProperty('disabled')).should_be_true();
	},
	
	get_and_set_readonly_attribute_from_input_elements: function(){
		var readonly1 = new Element('input', { type: 'text', readonly: 'readonly' });
		var readonly2 = new Element('input', { type: 'text', readonly: true });
		var readonly3 = new Element('input', { type: 'text', readonly: false });
		
		value_of(readonly1.getProperty('readonly')).should_be_true();
		value_of(readonly2.getProperty('readonly')).should_be_true();
		value_of(readonly3.getProperty('readonly')).should_be_false();
		
		readonly1.removeProperty('readonly');
		readonly2.setProperty('readonly', false);
		
		value_of(readonly1.getProperty('readonly')).should_be_false();
		value_of(readonly2.getProperty('readonly')).should_be_false();
		
		readonly1.setProperty('readonly', 'readonly');
		readonly2.setProperty('readonly', true);
		
		value_of(readonly1.getProperty('readonly')).should_be_true();
		value_of(readonly2.getProperty('readonly')).should_be_true();
	}
	
});

describe('Element Methods', {
	
	add_and_remove_class_names_from_an_element: function(){
		var element = new Element('div');
		
		element.addClass('class1');
		value_of(element.className).should_be('class1');
		value_of(element.hasClass('class1')).should_be_true();
		value_of(element.hasClass('class2')).should_be_false();
		
		element.addClass('class2');		
		value_of(element.className).should_be('class1 class2');
		value_of(element.hasClass('class1')).should_be_true();
		value_of(element.hasClass('class2')).should_be_true();
		
		element.removeClass('class1');
		value_of(element.className).should_be('class2');
		value_of(element.hasClass('class1')).should_be_false();
		value_of(element.hasClass('class2')).should_be_true();
		
		element.addClass('class3 class4');
		value_of(element.className).should_be('class2 class3 class4');
		value_of(element.hasClass('class1')).should_be_false();
		value_of(element.hasClass('class2')).should_be_true();
		value_of(element.hasClass('class3')).should_be_true();
		value_of(element.hasClass('class4')).should_be_true();
		
		element.removeClass('class3');
		value_of(element.className).should_be('class2 class4');
		value_of(element.hasClass('class1')).should_be_false();
		value_of(element.hasClass('class2')).should_be_true();
		value_of(element.hasClass('class3')).should_be_false();
		value_of(element.hasClass('class4')).should_be_true();
	}
	
});
