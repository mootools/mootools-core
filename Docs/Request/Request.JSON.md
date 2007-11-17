Class: Request.JSON {#Request.JSON}
=================================

Wrapped Request with automated sending and receiving of JavaScript Objects in JSON Format.

### Extends:

[Request](/Request/Request)

### Syntax:

	var myJSONRemote = new Request.JSON(url[, options]);

### Arguments:

1. options - (object, optional) See below.

###	Options:

* secure  - (boolean: defaults to true) If set to true, a syntax check will be done on the result JSON (see <JSON.decode>).

### Events:

### onComplete

(function) Executes when the JSON returns successfully.

#### Signature:

	onComplete(responseJSON)

#### Arguments:

1. responseJSON - (mixed) The JSON response object from the remote request.

#### Returns:

* (object) A new Request.JSON instance.

### Example:

	//This code will send a data object via a GET request and alert the retrieved data.
	var jsonRequest = new Request.JSON({url: "http://site.com/tellMeAge.php", onComplete: function(person){
		alert(person.age);    //Alerts "25 years".
		alert(person.height); //Alerts "170 cm".
		alert(person.weight); //Alerts "120 kg".
	}}).POST({'firstName': 'John', 'lastName': 'Doe'});
