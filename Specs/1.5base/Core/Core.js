
describe('Core', function(){

	describe('typeOf', function(){
		it('should correctly report the type of arguments when using "use strict"', function(){
			"use strict";
			expect(typeOf(arguments)).toEqual('arguments');
		});
	});

});
