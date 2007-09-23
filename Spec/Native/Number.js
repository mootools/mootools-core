/*
Script: Number.js
	Specs for Number.js

License:
	MIT-style license.
*/

describe('Number', {

	toInt: function(){
		value_of((111).toInt()).should_be(111);
		value_of((111).toInt(2)).should_be(7);
		value_of((0x16).toInt(10)).should_be(22); //ECMA standard, radix is optional so if starts with 0x then parsed as hexadecimal
		value_of((016).toInt(10)).should_be(14); //ECMA standard, radix is optional so if starts with 0 then parsed as octal
	},

	toFloat: function(){
		value_of((1.00).toFloat()).should_be(1);
		value_of((1.12 - 0.12).toFloat()).should_be(1);
		value_of((0.0010).toFloat()).should_be(0.001);
		value_of((Number.MIN_VALUE).toFloat()).should_be(Number.MIN_VALUE);
	},

	limit: function(){
		value_of((-1).limit(0,1)).should_be(0);
		value_of((3).limit(1,2)).should_be(2);
	},

	round: function(){
		value_of((0.01).round()).should_be(0);
		value_of((0.01).round(2)).should_be(0.01);
		value_of((1).round(3)).should_be(1);
		value_of((-1.01).round()).should_be(-1);
		value_of((-1.01).round(2)).should_be(-1.01);
		value_of((111).round(-1)).should_be(110);
		value_of((-111).round(-2)).should_be(-100);
		value_of((100).round(-5)).should_be(0);
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

		value_of(found).should_be(2);
		value_of(found2).should_be(-1);
		value_of(found3).should_be_true();
	}
	
});