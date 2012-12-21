
describe('creating new Elements', function(){

	it('should create an element with type="email"', function(){
		var el = new Element('input', {type: 'email'});
		expect(el.get('type')).toBe('email');
	});

});
