/*
---
name: Element Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/
describe('Element', function(){

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

	describe('tabIndex', function(){

		it('should get and set the correct tabIndex', function(){
			var div = document.createElement('div');
			div.innerHTML = '<input tabindex="2">';
			expect($(div.firstChild).get('tabindex')).toEqual(2);
			expect($(div.firstChild).set('tabindex', 3).get('tabindex')).toEqual(3);
		});

	});

	if (document.createElement('video').canPlayType){
		describe('Video/Audio loop, controls, and autoplay set/get attributes', function(){

			it('should set/get the boolean value of loop, controls, and autoplay', function(){
				var div = new Element('div', {html: '<video loop controls autoplay>'}),
					video = div.getElement('video');

				if ('loop' in video){
					expect(video.getProperty('loop')).toBe(true);
					expect(video.setProperty('loop', false).getProperty('loop')).toBe(false);
				}
				expect(video.getProperty('controls')).toBe(true);
				expect(video.setProperty('controls', false).getProperty('controls')).toBe(false);
				expect(video.getProperty('autoplay')).toBe(true);
				expect(video.setProperty('autoplay', false).getProperty('autoplay')).toBe(false);
			});

		});
	}

	describe("Element.set('html')", function(){

		describe('HTML5 tags', function(){

			it('should create childNodes for html5 tags', function(){
				expect(new Element('div', {html: '<nav>Muu</nav><p>Tuuls</p><section>!</section>'}).childNodes.length).toEqual(3);
			});

		});

		describe('Numbers', function(){

			it('should set a number (so no string) as html', function(){
				expect(new Element('div', {html: 20}).innerHTML).toEqual('20');
			});
			
		});

		describe('Arrays', function(){

			it('should allow an Array as input, the text is concatenated', function(){
				expect(new Element('div', {html: ['moo', 'rocks', 'your', 'socks', 1]}).innerHTML).toEqual('moorocksyoursocks1');
			});
			
		});

	});

});
