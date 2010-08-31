describe('Elements implement order', function(){

	it('should give precedence to Array over Element', function(){
		var anchor = new Element('a');

		var element = new Element('div').adopt(
			new Element('span'),
			anchor
		);

		expect(element.getLast()).toBe(anchor);
		
		expect(new Elements([element, anchor]).getLast()).toBe(anchor);
	});

});

describe('Element traversal', function(){

	it('should match against all provided selectors', function(){
		var div = new Element('div').adopt(
			new Element('span').adopt(
				new Element('a')
			)
		);

		var span = div.getElement('span');
		var anchor = span.getElement('a');

		expect(anchor.getParent('div, span')).toBe(div);
		expect(anchor.getParent('span, div')).toBe(span);

		expect(anchor.getParent('tagname, div')).toBe(div);
		expect(anchor.getParent('div > span')).toBe(span);
	});

});