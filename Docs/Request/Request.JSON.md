Class: Request.JSON {#Request-JSON}
=================================

Wrapped Request with automated receiving of JavaScript Objects in JSON Format.

### Extends:

[Request](/Request/Request)

### Syntax:

	var myJSONRemote = new Request.JSON([options]);

### Arguments:

1. options - (*object*, optional) See below.

### Options:

* secure  - (*boolean*: defaults to true) If set to true, a syntax check will be done on the result JSON (see [JSON.decode](/Utilities/JSON#JSON:decode)).

### Events:

#### success

Fired when the request completes. This overrides the signature of the Request success event.

##### Signature:

	onSuccess(responseJSON, responseText)

##### Arguments:

1. responseJSON - (*object*) The JSON response object from the remote request.
2. responseText - (*string*) The JSON response as string.

#### error

Fired when the parsed JSON is not valid and the secure option is set.

##### Signature:

	onError(text, error)

##### Arguments:

1. text - (string) The response text.
2. error - (string) The error message.

#### failure

Fired when the request failed (error status code), or when JSON string could not be parsed.

##### Signature:

	onFailure(xhr)

##### Arguments:

xhr - (XMLHttpRequest) The transport instance.

### Returns:

* (*object*) A new Request.JSON instance.

### Example:

	// this code will send a data object via a GET request and alert the retrieved data.
	var jsonRequest = new Request.JSON({url: 'http://site.com/tellMeAge.php', onSuccess: function(person){
		alert(person.age);    // alerts "25 years".
		alert(person.height); // alerts "170 cm".
		alert(person.weight); // alerts "120 kg".
	}}).get({'firstName': 'John', 'lastName': 'Doe'});

### See Also:

[Request](/core/Request/Request)
