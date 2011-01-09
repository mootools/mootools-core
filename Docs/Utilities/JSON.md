Object: JSON {#JSON}
====================

JSON decoder and encoder.

### See Also:

- [JSON (JavaScript Object Notation)][]

JSON Method: encode {#JSON:encode}
----------------------------------

Converts an object or array to a JSON string.

### Syntax:

	var myJSON = JSON.encode(obj);

### Arguments:

1. obj - (*object*) The object to convert to string.

### Returns:

* (*string*) A JSON string.

### Examples:

	var fruitsJSON = JSON.encode({apple: 'red', lemon: 'yellow'}); // returns: '{"apple":"red","lemon":"yellow"}'



JSON Method: decode {#JSON:decode}
----------------------------------

Converts a JSON string into a JavaScript object.

### Syntax:

	var object = JSON.decode(string[, secure]);

### Arguments:

1. string - (*string*) The string to evaluate.
2. secure - (*boolean*, optional: defaults to false) If set to true, checks for any hazardous syntax and returns null if any found.

### Returns:

* (*object*) The object represented by the JSON string.

### Examples:

	var myObject = JSON.decode('{"apple":"red","lemon":"yellow"}'); // returns: {apple: 'red', lemon: 'yellow'}

### Credits:

- JSON test regular expression by [Douglas Crockford][] and [Tobie Langel][].

[JSON (JavaScript Object Notation)]: http://www.json.org/
[Douglas Crockford]: http://crockford.com/
[Tobie Langel]: http://tobielangel.com/
