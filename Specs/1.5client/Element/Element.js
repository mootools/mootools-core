
describe('Element', function(){

	describe('classList', function(){

		it('should not fail for empty strings', function(){
			var element = new Element('div');
			element.addClass('');
			expect(element.className).toEqual('');
		});

		it('should trim whitespaces', function(){
			var element = new Element('div');
			element.addClass(' bar ');
			expect(element.className).toEqual('bar');
		});

		it('should add multiple classes', function(){
			var element = new Element('div');
			element.addClass(' bar foo');
			expect(element.className).toEqual('bar foo');
		});

	});

});
