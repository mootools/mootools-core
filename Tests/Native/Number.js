/*
Script: Number.js
	Unit Tests for Number.js

License:
	MIT-style license.
*/

Tests.Number = new Test.Suite('Number', {
	
	toInt: function(){
		return Assert.all(
			Assert.equals((111).toInt(), 111),
			Assert.equals((111).toInt(2), 7),
			Assert.equals((0x16).toInt(10), 22), // ECMA standard, radix is optional so if starts with 0x then parsed as hexadecimal
			Assert.equals((016).toInt(10), 14) // ECMA standard, radix is optional so if starts with 0 then parsed as octal
		);
	},
	
	toFloat: function(){
		return Assert.all(
			Assert.equals((1.00).toFloat(), 1),
			Assert.equals((1.12 - 0.12).toFloat(), 1),
			Assert.equals((0.0010).toFloat(), 0.001),
			Assert.equals((Number.MIN_VALUE).toFloat(), Number.MIN_VALUE)
		);
	},
	
	limit: function(){
		return Assert.all(
			Assert.equals((-1).limit(0,1), 0),
			Assert.equals((3).limit(1,2), 2)
		);
	},
	
	round: function(){
		return Assert.all(
			Assert.equals((0.01).round(), 0),
			Assert.equals((0.01).round(2), 0.01),
			Assert.equals((1).round(3), 1),
			Assert.equals((-1.01).round(), -1),
			Assert.equals((-1.01).round(2), -1.01),
			Assert.equals((111).round(-1), 110),
			Assert.equals((-111).round(-2), -100),
			Assert.equals((100).round(-5), 0)
		);
	},
	
	times: function(){
		var found = 0;
		(3).times(function(i){
			found = i;
		});
		
		var found2 = -1;
		(0).times(function(i){
			found2 = i;
		});
		
		var aTest = 'hi';
		var found3 = false;
		(1).times(function(i){
			found3 = (this == aTest);
		}, aTest);
		
		return Assert.all(
			Assert.equals(found, 2),
			Assert.equals(found2, -1),
			Assert.isTrue(found3)
		);
	}
	
});