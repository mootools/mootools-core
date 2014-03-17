# Object: JSON {#JSON}

JSON decoder and encoder.

## JSON Method: encode {#JSON:encode}

Converts an object or array to a JSON string.

### Syntax:

	var myJSON = JSON.encode(obj);

### Arguments:

1. obj - (*object*) The object to convert to string.

### Returns:

* (*string*) A JSON string.

### Examples:

	var fruitsJSON = JSON.encode({apple: 'red', lemon: 'yellow'}); // returns: '{"apple":"red","lemon":"yellow"}'

## JSON Method: decode {#JSON:decode}

Converts a JSON string into a JavaScript object.

### Syntax:

	var object = JSON.decode(string[, secure]);

### Arguments:

1. string - (*string*) The string to evaluate.
2. secure - (*boolean*, optional: defaults to true) If set to true, checks for any hazardous syntax and returns null if any found.

There is also a global option `JSON.secure` (*boolean*: defaults to true). If the optional `secure` argument is not defined, the value of `JSON.secure` will be used.

### Returns:

* (*object*) The object represented by the JSON string.

### Examples:

	var myObject = JSON.decode('{"apple":"red","lemon":"yellow"}'); // returns: {apple: 'red', lemon: 'yellow'}

### See Also:

- [JSON (JavaScript Object Notation)][]

### Credits:

- JSON test regular expression by [Douglas Crockford][] and [Tobie Langel][].

[Douglas Crockford]: http://crockford.com/
[JSON (JavaScript Object Notation)]: http://www.json.org/
[Tobie Langel]: http://tobielangel.com/
