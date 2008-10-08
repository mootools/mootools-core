Class: Request.JSON {#Request-JSON}
=================================

Wrapped Request with automated sending and receiving of JavaScript Objects in JSON Format.

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

### Returns:

* (*object*) A new Request.JSON instance.

### Example:

	//This code will send a data object via a GET request and alert the retrieved data.
	var jsonRequest = new Request.JSON({url: "http://site.com/tellMeAge.php", onComplete: function(person){
		alert(person.age);    //Alerts "25 years".
		alert(person.height); //Alerts "170 cm".
		alert(person.weight); //Alerts "120 kg".
	}}).get({'firstName': 'John', 'lastName': 'Doe'});
