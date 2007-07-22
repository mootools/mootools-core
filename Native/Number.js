/*
Script: Number.js
	Contains the Number prototypes.

License:
	MIT-style license.
*/

/*
Class: Number
	A collection of the Number Object prototype methods.
	For more information on the JavaScript Number Object see <http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Number>.
*/

Number.extend({

	/*
	Property: limit
		Limits this number between two bounds.

	Syntax:
		>myNumber.limit(min, max);

	Arguments:
		min - (number) The minimum possible value.
		max - (number) The maximum possible value.

	Returns:
		(number) The number bounded between the given limits.

	Example:
		>(12).limit(2, 6.5); //returns 6.5
		>(-4).limit(2, 6.5); //returns 2
		>(4.3).limit(2, 6.5); //returns 4.3
	*/

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	/*
	Property: round
		Returns this number rounded to the specified precision.

	Syntax:
		>myNumber.round([precision]);

	Arguments:
		precision - (integer, optional) The number of digits after the decimal place (defaults to 0). Argument may also be negative.

	Returns:
		(number) The number, rounded.

	Example:
		>(12.45).round() //returns 12
		>(12.45).round(1) //returns 12.5
		>(12.45).round(-1) //returns 10
	*/

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	/*
	Property: times
		Executes the function passed in the specified number of times.

	Syntax:
		>myNumber.times(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each iteration of the loop. This function is passed the current iteration's index.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Example:
		(start code)
		(4).times(alert); //alerts 0, 1, 2, 3
		(end)
	*/

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	/*
	Property: toFloat
		Returns this number as a float. Useful because toFloat must work on both Strings and Numbers.

	Syntax:
		>myNumber.toFloat();

	Returns:
		(number) The number as a float.

	Example:
		(start code)
		(111).toFloat(); //returns 111
		(111.1).toFloat(); //returns 111.1
		(end)
	*/

	toFloat: function(){
		return parseFloat(this);
	},

	/*
	Property: toInt
		Returns this number as an integer in the base passed in. Useful because toInt must work on both Strings and Numbers.

	Syntax:
		>myNumber.toInt([base]);

	Arguments:
		base - (integer, optional) The base to use (defaults to 10).

	Returns:
		(integer) The number as an integer in the base provided.

	Example:
		(start code)
		(111).toInt(); //returns 111
		(111.1).toInt(); //returns 111
		(111).toInt(2); //returns 7
		(end)
	*/

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});