Type: Number {#Number}
======================

A collection of the Number Object methods and functions.

### See Also:

- [MDC Number][]

### Notes:

Every Math method is mirrored in the Number object, both as prototype and generic.



Function: Number.from {#Number:Number-from}
------------------------------------

Returns the passed parameter as a Number, or null if not a number.

### Syntax:

	Number.from(arg);

### Arguments:

1. arg - (*mixed*) The argument to return as a number.

### Returns:

* (*number*) The argument as a number.
* (*null*) Returns null if the number cannot be converted.

### Example:

	Number.from('12')		// returns 12
	Number.from('hello')	// returns null



Function: Number.random {#Number:Number-random}
----------------------------------------

Returns a random integer between the two passed in values.

### Syntax:

	var random = Number.random(min, max);

### Arguments:

1. min - (*number*) The minimum value (inclusive).
2. max - (*number*) The maximum value (inclusive).

### Returns:

* (*number*) A random number between min and max.

### Example:

	Number.random(5, 20); // returns a random number between 5 and 20.



Number method: limit {#Number:limit}
-----------------------------

Limits this number between two bounds.

### Syntax:

	myNumber.limit(min, max);

### Arguments:

1. min - (*number*) The minimum possible value.
2. max - (*number*) The maximum possible value.

### Returns:

* (*number*) The number bounded between the given limits.

### Examples:

	(12).limit(2, 6.5);  // returns 6.5
	(-4).limit(2, 6.5);  // returns 2
	(4.3).limit(2, 6.5); // returns 4.3



Number method: round {#Number:round}
-----------------------------

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

	(12.45).round()   // returns 12
	(12.45).round(1)  // returns 12.5
	(12.45).round(-1) // returns 10



Number method: times {#Number:times}
-----------------------------

Executes the function passed in the specified number of times.

### Syntax:

	myNumber.times(fn[, bind]);

### Arguments:

1. fn   - (*function*) The function which should be executed on each iteration of the loop. This function is passed the current iteration's index.
2. bind - (*object*, optional) The object to use as 'this' in the function. For more information see [Function:bind][].

### Examples:

	(4).times(alert); // alerts "0", then "1", then "2", then "3".



Number method: toFloat {#Number:toFloat}
---------------------------------

Returns this number as a float. Useful because toFloat must work on both Strings and Numbers.

### Syntax:

	myNumber.toFloat();

### Returns:

* (*number*) The number as a float.

### Examples:

	(111).toFloat(); // returns 111
	(111.1).toFloat(); // returns 111.1



Number method: toInt {#Number:toInt}
-----------------------------

Returns this number as another number with the passed in base. Useful because toInt must work on both Strings and Numbers.

### Syntax:

	myNumber.toInt([base]);

### Arguments:

1. base - (*number*, optional: defaults to 10) The base to use.

### Returns:

* (*number*) A number with the base provided.

### Examples:

	(111).toInt(); // returns 111
	(111.1).toInt(); // returns 111
	(111).toInt(2); // returns 7


Math Methods {#Number-Math}
--------------------

There are several methods available from the Math object that can be used as Number Methods.

- abs
- acos
- asin
- atan2
- ceil
- cos
- exp
- floor
- log
- max
- min
- pow
- sin
- sqrt
- tan

### Examples:

	(-1).abs(); // returns 1
	(3).pow(4); // returns 81


[Function:bind]: /core/Types/Function/#Function:bind
[MDC Number]: https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Number
