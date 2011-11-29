
describe('Array', function(){

	describe('Array.map', function(){

		it('should return an array with the same length', function(){
			expect([1, 2, 3, undefined].map(function(v){
				return v;
			}).length).toEqual(4);
		});

		it('shoud return an empty array when the thisArg does not has a length property', function(){
			expect([].map.call({}, function(){
				return 1;
			})).toEqual([]);
		});

	});

	it('should accept thisArgs without length property', function(){
		var object = {}, fn = function(){};
		expect([].every.call(object, fn)).toBe(true);
		expect([].filter.call(object, fn)).toEqual([]);
		expect([].indexOf.call(object)).toEqual(-1);
		expect([].map.call(object, fn)).toEqual([]);
		expect([].some.call(object, fn)).toBe(false);
	});

});
