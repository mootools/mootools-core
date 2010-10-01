describe('JSON', function(){

	it('should encode and decode an object', function(){
		var object = {
			a: [0, 1, 2],
			s: "It's-me-Valerio!",
			u: '\x01',
			n: 1,
			f: 3.14,
			b: false,
			n: null
		};

		expect(JSON.decode(JSON.encode(object))).toEqual(object);
	});

});