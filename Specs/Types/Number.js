/*
---
name: Number
requires: ~
provides: ~
...
*/

describe('Number Method', function(){

	describe('Number.toInt', function(){

		it('should convert a number to an integer', function(){
			expect((111).toInt()).to.equal(111);
		});

		it('should convert a number depending on the radix provided', function(){
			expect((111).toInt(2)).to.equal(7);
			expect((0x16).toInt(10)).to.equal(22); // ECMA standard, radix is optional so if starts with 0x then parsed as hexadecimal.
			expect((016).toInt(10)).to.equal(14); // ECMA standard, radix is optional so if starts with 0 then parsed as octal.
		});

	});

	describe('Number.toFloat', function(){

		it('should convert a number to a float', function(){
			expect((1.00).toFloat()).to.equal(1);
			expect((1.12 - 0.12).toFloat()).to.equal(1);
			expect((0.0010).toFloat()).to.equal(0.001);
			expect((Number.MIN_VALUE).toFloat()).to.equal(Number.MIN_VALUE);
		});
	});

	describe('Number.limit', function(){

		it('should limit a number within a range', function(){
			expect((-1).limit(0, 1)).to.equal(0);
			expect((3).limit(1, 2)).to.equal(2);
		});

		it('should not limit a number if within the range', function(){
			expect((2).limit(0, 4)).to.equal(2);
		});

	});

	describe('Number.round', function(){

		it('should round a number to the nearest whole number if units place is not specified', function(){
			expect((0.01).round()).to.equal(0);
		});

		it('should round a number according the units place specified', function(){
			expect((0.01).round(2)).to.equal(0.01);
			expect((1).round(3)).to.equal(1);
			expect((-1.01).round()).to.equal(-1);
			expect((-1.01).round(2)).to.equal(-1.01);
			expect((111).round(-1)).to.equal(110);
			expect((-111).round(-2)).to.equal(-100);
			expect((100).round(-5)).to.equal(0);
		});

	});

	describe('Number.times', function(){

		it('should call the function for the specified number of times', function(){
			var found = 0;
			(3).times(function(i){
				found = i;
			});

			var found2 = -1;
			(0).times(function(i){
				found2 = i;
			});

			expect(found).to.equal(2);
			expect(found2).to.equal(-1);
		});

		it('should bind and call the function for the specified number of times', function(){
			var aTest = 'hi';
			var found3 = false;
			(1).times(function(){
				found3 = (this == aTest);
			}, aTest);
			expect(found3).to.equal(true);
		});

	});

});

(function(math){

describe('Number Math Methods', function(){

	Object.each(math, function(value, key){
		var b = value.test[1];
		it('should return the ' + value.title + ' value of the number' + ((b) ? ' and the passed number' : ''), function(){
			expect(value.test[0][key](b)).to.equal(Math[key].apply(null, value.test));
		});
	});

});

})({
	abs: { test: [-1], title: 'absolute' },
	acos: { test: [0], title: 'arc cosine' },
	asin: { test: [0.5], title: 'arc sine' },
	atan: { test: [0.5], title: 'arc tangent' },
	atan2: { test: [0.1, 0.5], title: 'arc tangent' },
	ceil: { test: [0.6], title: 'number closest to and not less than the' },
	cos: { test: [30], title: 'cosine' },
	exp: { test: [2], title: 'exponent' },
	floor: { test: [2.4], title: 'integer closet to and not greater than' },
	log: { test: [2], title: 'log' },
	max: { test: [5, 3], title: 'maximum' },
	min: { test: [-4, 2], title: 'minimum' },
	pow: { test: [2, 2], title: 'power' },
	sin: { test: [0.5], title: 'sine' },
	sqrt: { test: [4], title: 'square root' },
	tan: { test: [0.3], title: 'tangent' }
});
