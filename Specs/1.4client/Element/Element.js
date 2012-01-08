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

		it('should ignore expandos', function(){
			var div = new Element('div');
			expect(div.getProperty('inject')).toBeNull();
		});

		it('should work in collaboration with setProperty', function(){
			var div = new Element('div', {random: 'attribute'});
			expect(div.getProperty('random')).toEqual('attribute');
		});

	});

	describe('Element.set', function(){

		describe('value', function(){

			it('should return `null` when the value of a input element is set to `undefined`', function(){
				var value;
				expect(new Element('input', {value: value}).get('value')).toEqual('');
			});

		});

		describe('type', function(){

			it('should set the type of a button', function(){
				expect(new Element('button', {type: 'button'}).get('type')).toEqual('button');
			});

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

		describe('text', function(){

			it('should return the original text with `text-transform: uppercase`', function(){
				var div = new Element('div', {html: '<div style="text-transform: uppercase">text</div>'});
				div.inject(document.body);
				expect($(div.firstChild).get('text')).toEqual('text');
				div.destroy();
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

	describe("Element.erase('html')", function(){

		it('should empty the html inside an element', function(){
			expect(new Element('div', {html: '<p>foo bar</p>'}).erase('html').innerHTML).toEqual('');
		});

	});

	describe('Element.clone', function(){

		it('should not crash IE for multiple clones', function(){
			new Element('div', {
				html: '<ul id="testContainer"><li id="template"></li></ul>'
			}).inject(document.body);

			var container = $('testContainer'),
			template = container.getElement('li#template').dispose();

			template.clone().set('html', 'Clone #1').inject('testContainer');
			template.clone().set('html', 'Clone #2').inject('testContainer');

			container.destroy();
		});

	});

	describe('Element.erase', function(){

		var elements, subject, image, textarea;

		beforeEach(function(){
			elements = [
				subject = new Element('div'),
				image = new Element('img'),
				textarea = new Element('div', {html: '<textarea id="t1">hello</textarea>'}).getFirst()
			].invoke('inject', document.body);
		});

		afterEach(function(){
			elements.invoke('destroy');
		});

		it('should erase the class of an Element', function(){
			subject.set('class', 'test');
			subject.erase('class');
			expect(subject.get('class')).toEqual(null);
		});

		it('should erase the id of an Element', function(){
			subject.set('id', 'test');
			subject.erase('id');
			expect(subject.get('id')).toEqual(null);
		});

		it('should erase the random attribute of an Element', function(){
			subject.set('random', 'test');
			subject.erase('random');
			expect(subject.get('random')).toEqual(null);
		});

		it('should erase the value attribute of a textarea', function(){
			textarea.erase('value');
			expect(textarea.get('value')).toEqual('');
		});

	});

});
