Class: Hash.Cookie {#Hash-Cookie}
=================================

Stores and loads a Hash as a Cookie using JSON format.

### Extends:

- [Hash][]

### Syntax:

	var myHashCookie = new Hash.Cookie(name[, options]);

### Arguments:

1. name    - (*string*) The key (name) for the cookie
2. options - (*object*) All of [Cookie][] options in addition an autoSave option.

#### Options:

1. autoSave - (*boolean*: defaults to true) An option to save the cookie at every operation.

### Returns:

* (*object*) A new Hash.Cookie instance.

### Examples:

	var fruits = new Hash.Cookie('myCookieName', {duration: 3600});
	fruits.extend({
		'lemon': 'yellow',
		'apple': 'red'
	});
	fruits.set('melon', 'green');
	fruits.get('lemon'); // yellow

	// ... on another page ... values load automatically

	var fruits = new Hash.Cookie('myCookieName', {duration: 365});
	fruits.get('melon'); // green

	fruits.erase(); // delete cookie

### Notes:

- All Hash methods are available in your Hash.Cookie instance. if autoSave options is set, every method call will result in your Cookie being saved.
- Cookies have a limit of 4kb (4096 bytes). Therefore, be careful with your Hash size.
- All Hash methods used on Hash.Cookie return the return value of the Hash method, unless you exceeded the Cookie size limit. In that case the result will be false.
- If you plan to use large Cookies consider turning autoSave to off, and check the status of .save() everytime.
- Creating a new instance automatically loads the data from the Cookie into the Hash. Cool Huh?

### See Also:

- [Hash][]



Hash.Cookie Method: save {#Hash-Cookie:save}
--------------------------------------------

Saves the Hash to the cookie. If the hash is empty, removes the cookie.

###	Syntax:

	myHashCookie.save();

###	Returns:

* (*boolean*) Returns false when the JSON string cookie is too long (4kb), otherwise true.

###	Examples:

	var login = new Hash.Cookie('userstatus', {autoSave: false});

	login.extend({
		'username': 'John',
		'credentials': [4, 7, 9]
	});
	login.set('last_message', 'User logged in!');

	login.save(); // finally save the Hash



Hash.Cookie Method: load {#Hash-Cookie:load}
--------------------------------------------

Loads the cookie and assigns it to the Hash.

###	Syntax:

	myHashCookie.load();

###	Returns:

* (*object*) This Hash.Cookie instance.

###	Examples:

	var myHashCookie = new Hash.Cookie('myCookie');

	(function(){
		myHashCookie.load();
		if(!myHashCookie.length) alert('Cookie Monster must of eaten it!');
	}).periodical(5000);

###	Notes:

- Useful when polling.



[Hash]: /Native/Hash/#Hash
[Cookie]: /Utilities/Cookie