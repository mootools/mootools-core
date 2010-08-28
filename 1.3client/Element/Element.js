describe('Elements implement order', function(){

	it('should give precedence to Array over Element', function(){
		var anchor = new Element('a');

		expect(new Element('div').adopt(
			new Element('span'),
			anchor
		).getLast()).toBe(anchor);
	});

});