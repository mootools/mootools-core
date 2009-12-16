/*
Script: Number.js
	Specs for Number.js

License:
	MIT-style license.
*/

describe("Number Methods", {

	// Number.toInt

	'should convert a number to an integer': function(){
		value_of((111).toInt()).should_be(111);
	},

	// Number.toFloat

	'should convert a number to a float': function(){
		value_of((1.00).toFloat()).should_be(1);
		value_of((1.12 - 0.12).toFloat()).should_be(1);
		value_of((0.0010).toFloat()).should_be(0.001);
		value_of((Number.MIN_VALUE).toFloat()).should_be(Number.MIN_VALUE);
	},

	// Number.limit

	'should limit a number within a range': function(){
		value_of((-1).limit(0, 1)).should_be(0);
		value_of((3).limit(1, 2)).should_be(2);
	},

	'should not limit a number if within the range': function(){
		value_of((2).limit(0,4)).should_be(2);
	},

	// Number.round

	'should round a number to the nearest whole number if units place is not specified': function(){
		value_of((0.01).round()).should_be(0);
	},

	'should round a number according the units place specified': function(){
		value_of((0.01).round(2)).should_be(0.01);
		value_of((1).round(3)).should_be(1);
		value_of((-1.01).round()).should_be(-1);
		value_of((-1.01).round(2)).should_be(-1.01);
		value_of((111).round(-1)).should_be(110);
		value_of((-111).round(-2)).should_be(-100);
		value_of((100).round(-5)).should_be(0);
	},

	// Number.times

	'should call the function for the specified number of times': function(){
		var found = 0;
		(3).times(function(i){
			found = i;
		});

		var found2 = -1;
		(0).times(function(i){
			found2 = i;
		});

		value_of(found).should_be(2);
		value_of(found2).should_be(-1);
	}

});