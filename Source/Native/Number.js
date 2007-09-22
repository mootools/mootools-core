/*
Script: Number.js
	Contains the Number prototypes.

License:
	MIT-style license.
*/

/*
Native: Number
	A collection of the Number Object prototype methods.

See Also:
	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Number>
*/

Number.implement({

	/*
	Method: limit
		Limits this number between two bounds.

	Syntax:
		>myNumber.limit(min, max);

	Arguments:
		min - (number) The minimum possible value.
		max - (number) The maximum possible value.

	Returns:
		(number) The number bounded between the given limits.

	Example:
		[javascript]
			(12).limit(2, 6.5); //returns 6.5
			(-4).limit(2, 6.5); //returns 2
			(4.3).limit(2, 6.5); //returns 4.3
		[/javascript]
	*/

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	/*
	Method: round
		Returns this number rounded to the specified precision.

	Syntax:
		>myNumber.round([precision]);

	Arguments:
		precision - (number, optional: defaults to 0) The number of digits after the decimal place.

	Returns:
		(number) The number, rounded.

	Note:
		Argument may also be negative.

	Example:
		[javascript]
			(12.45).round() //returns 12
			(12.45).round(1) //returns 12.5
			(12.45).round(-1) //returns 10
		[/javascript]
	*/

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	/*
	Method: times
		Executes the function passed in the specified number of times.

	Syntax:
		>myNumber.times(fn[, bind]);

	Arguments:
		fn   - (function) The function which should be executed on each iteration of the loop. This function is passed the current iteration's index.
		bind - (object, optional) The object to use as 'this' in the function. For more information see <Function.bind>.

	Example:
		[javascript]
			(4).times(alert); //alerts 0, 1, 2, 3
		[/javascript]
	*/

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	/*
	Method: toFloat
		Returns this number as a float. Useful because toFloat must work on both Strings and Numbers.

	Syntax:
		>myNumber.toFloat();

	Returns:
		(number) The number as a float.

	Example:
		[javascript]
			(111).toFloat(); //returns 111
			(111.1).toFloat(); //returns 111.1
		[/javascript]
	*/

	toFloat: function(){
		return parseFloat(this);
	},

	/*
	Method: toInt
		Returns this number as another number with the passed in base. Useful because toInt must work on both Strings and Numbers.

	Syntax:
		>myNumber.toInt([base]);

	Arguments:
		base - (number, optional: defaults to 10) The base to use.

	Returns:
		(number) A number with the base provided.

	Example:
		[javascript]
			(111).toInt(); //returns 111
			(111.1).toInt(); //returns 111
			(111).toInt(2); //returns 7
		[/javascript]
	*/

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('times', 'each');