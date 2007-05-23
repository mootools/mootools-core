/*
Script: Number.js
	Contains the Number prototypes.

License:
	MIT-style license.
*/

/*
Class: Number
	A collection of The Number Object prototype methods.
*/

Number.extend({

	/*
	Property: toInt
		Returns this number; useful because toInt must work on both Strings and Numbers.
	*/

	toInt: function(){
		return parseInt(this);
	},

	/*
	Property: toFloat
		Returns this number as a float; useful because toFloat must work on both Strings and Numbers.
	*/

	toFloat: function(){
		return parseFloat(this);
	},

	/*
	Property: limit
		Limits the number.

	Arguments:
		min - number, minimum value
		max - number, maximum value

	Returns:
		the number in the given limits.

	Example:
		>(12).limit(2, 6.5)  // returns 6.5
		>(-4).limit(2, 6.5)  // returns 2
		>(4.3).limit(2, 6.5) // returns 4.3
	*/

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	/*
	Property: round
		Returns the number rounded to specified precision.

	Arguments:
		precision - integer, number of digits after the decimal point. Can also be negative or zero (default).

	Example:
		>12.45.round() // returns 12
		>12.45.round(1) // returns 12.5
		>12.45.round(-1) // returns 10

	Returns:
		The rounded number.
	*/

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	/*
	Property: times
		Executes a passed in function the specified number of times

	Arguments:
		function - the function to be executed on each iteration of the loop

	Example:
		>(4).times(alert);
	*/

	times: function(fn){
		for (var i = 0; i < this; i++) fn(i);
	}

});