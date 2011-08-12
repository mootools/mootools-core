/*
---
name: Element Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

describe('Element.getProperty', function(){

	it('should get the attrubte of a form when the form has an input with as ID the attribute name', function(){
		var div = new Element('div');
		div.innerHTML = '<form action="s"><input id="action"></form>';
		expect($(div.firstChild).getProperty('action')).toEqual('s');
	});

});

describe('Element.get', function(){

	describe('value', function(){

		it('should get the value of a option element when it does not have the value attribute', function(){
			var select = new Element('select').set('html', '<option>s</option>');
			expect(select.getElement('option').get('value')).toEqual('s');
		});

		it('should return the text of the selected option for a select element', function(){
			var form = new Element('form');
			form.set('html', '<select>\
				<option>value 1</option>\
				<option>value 2</option>\
				<option selected>value 3</option>\
				<option>value 4</option>\
				</select>');
			expect(form.getElement('select').get('value')).toEqual('value 3');
		});

		it('should return the text of the selected option for a multiple select element', function(){
			var form = new Element('form');
			form.set('html', '<select multiple>\
				<option>value 1</option>\
				<option selected>value 2</option>\
				<option selected>value 3</option>\
				<option>value 4</option>\
				</select>');
			expect(form.getElement('select').get('value')).toEqual('value 2');
		});

		it('should return the text of the first option of aselect element', function(){
			var form = new Element('form');
			form.set('html', '<select>\
				<option>value 1</option>\
				<option>value 2</option>\
				</select>');
			expect(form.getElement('select').get('value')).toEqual('value 1');
		});

		it('should return value of a select element', function(){
			var form = new Element('form');
			form.set('html', '<select multiple>\
				<option value="one">value 1</option>\
				<option selected value="two">value 2</option>\
				</select>');
			expect(form.getElement('select').get('value')).toEqual('two');
		});

	});

});
