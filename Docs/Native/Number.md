Native: Number {#Number}
========================

A collection of the Number Object methods.

### See Also:

- [MDC Number][]

### Notes:

Every Math method is mirrored in the Number object, both as prototype and generic.


Number Method: limit {#Number:limit}
------------------------------------

Limits this number between two bounds.

### Syntax:

	myNumber.limit(min, max);

### Arguments:

1. min - (*number*) The minimum possible value.
2. max - (*number*) The maximum possible value.

### Returns:

* (*number*) The number bounded between the given limits.

### Examples:

	(12).limit(2, 6.5);  //Returns: 6.5
	(-4).limit(2, 6.5);  //Returns: 2
	(4.3).limit(2, 6.5); //Returns: 4.3



Number Method: round {#Number:round}
------------------------------------

Returns this number rounded to the specified precision.

### Syntax:

	myNumber.round([precision]);

### Arguments:

1. precision - (*number*, optional: defaults to 0) The number of digits after the decimal place.

### Returns:

* (number) The number, rounded.

### Notes:

- Argument may also be negative.

### Examples:

	(12.45).round()   //Returns: 12
	(12.45).round(1)  //Returns: 12.5
	(12.45).round(-1) //Returns: 10



Number Method: times {#Number:times}
------------------------------------

Executes the function passed in the specified number of times.

### Syntax:

	myNumber.times(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function which should be executed on each iteration of the loop. This function is passed the current iteration's index.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind](/Native/Function/#Function:bind).

### Examples:

	(4).times(alert); //Alerts "0", then "1", then "2", then "3".



Number Method: toFloat {#Number:toFloat}
----------------------------------------

Returns this number as a float. Useful because toFloat must work on both Strings and Numbers.

### Syntax:

	myNumber.toFloat();

### Returns:

* (*number*) The number as a float.

### Examples:

	(111).toFloat(); //returns 111
	(111.1).toFloat(); //returns 111.1



Number Method: toInt {#Number:toInt}
------------------------------------

Returns this number as another number with the passed in base. Useful because toInt must work on both Strings and Numbers.

### Syntax:

	myNumber.toInt([base]);

### Arguments:

1. base - (*number*, optional: defaults to 10) The base to use.

### Returns:

* (*number*) A number with the base provided.

### Examples:

	(111).toInt(); //returns 111
	(111.1).toInt(); //returns 111
	(111).toInt(2); //returns 7



[MDC Number]: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Number