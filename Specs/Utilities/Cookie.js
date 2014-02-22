/*
---
name: Cookie
requires: ~
provides: ~
...
*/

describe('Cookie', function(){

	it("should set a cookie", function(){

		Cookie.write('test', 1);

	});

	it('should read and write a cookie', function(){
		var options = {
			duration: 1
		};

		Cookie.write('key', 'value', options);

		expect(Cookie.read('key', options)).toBe('value');

		Cookie.dispose('key', options);

		expect(Cookie.read('key', options)).toBeNull();
	});

});
