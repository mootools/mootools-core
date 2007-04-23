/*
Script: Hash.Cookie.js
	Stores and loads an Hash as a cookie using Json format.
*/

/*
Class: Hash.Cookie
	Inherits all the methods from <Hash>, additional methods are save and load.
	Hash json string has a limit of 4kb (4096byte), so be careful with your Hash size.
	Creating a new instance automatically loads the data from the Cookie.
	The cookie is actually saved on page unload, or by directly calling save. If the Hash is empty, the cookie is removed.

Arguments:
	name - the key (name) for the cookie
	options - options are identical to <Cookie> and are simply passed along to it.

Example:
	(start code)
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
	(end)
*/

Hash.Cookie = Hash.extend({

	initialize: function(name, options){
		this.name = name;
		this.options = options || {};
		window.addEvent('unload', this.save.bind(this));
		this.load();
	},

	/*
	Property: save
		Saves the Hash to the cookie. If the hash is empty, removes the cookie.

	Returns:
		Returns false when the JSON string cookie is too long (4kb), otherwise true.

	Example:
		(start code)
		var login = new Hash.Cookie('userstatus', {autoSave: false});

		login.extend({
			'username': 'John',
			'credentials': [4, 7, 9]
		});
		login.set('last_message', 'User logged in!');

		login.save(); // finally save the Hash
		(end)
	*/

	save: function(){
		if (this.length == 0){
			Cookie.remove(this.name, this.options);
			return true;
		}
		var str = Json.toString(this.obj);
		if (str.length > 4096) return false; //cookie would be truncated!
		Cookie.set(this.name, str, this.options);
		return true;
	},
	
	/*
	Property: load
		Loads the cookie and assigns it to the Hash.
	*/

	load: function(){
		this.obj = Json.evaluate(Cookie.get(this.name), true) || {};
		this.setLength();
	}

});