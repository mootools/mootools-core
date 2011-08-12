
describe('Array', function(){

	describe('Array.map', function(){

		it('should return an array with the same length', function(){
			expect([1, 2, 3, undefined].map(function(v){
				return v;
			}).length).toEqual(4);
		});

	});

});
