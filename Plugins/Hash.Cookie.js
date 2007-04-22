/*
Script: Cookie.Json.js
	Stores and loads an Hash as a cookie using json format.

Credits:
	based on the CookieJar class by Lalit Patel (http://www.lalit.org/lab/jsoncookies)
*/

/*
Class: Cookie.Json
	Extends <Hash>, additional functions are save and load. Cookie json string has a limit of 4kb (4096byte), so be careful with your Hash size.
	Creating a new instance automatically loads the data from the Cookie. When the option autoSave is true (default), every set/remove/extend/empty
	invokes save, these methods also return false then when the Cookie is too long.
	When autoSave is false, call Hash.Cookie::save to invoke the save.

Arguments:
	name - the key (name) for the cookie
	options - an object with options names as keys. See options below.

Options:
	autoSave - Save cookie on every Hash manipulation, Default to true

	Other options are identical to <Cookie> and are simply passed along to it.

	domain - the domain the Cookie belongs to. If you want to share the cookie with pages located on a different domain, you have to set this value. Defaults to the current domain.
	path - the path the Cookie belongs to. If you want to share the cookie with pages located in a different path, you have to set this value, for example to "/" to share the cookie with all pages on the domain. Defaults to the current path.
	duration - the duration of the Cookie before it expires, in seconds. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed. This is default.
	secure - Stored cookie information can be accessed only from a secure environment.

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

	var fruits = new Hash.Cookie('myCookieName', {duration: 3600});
	fruits.get('melon'); // green

	fruits.erase(); // delete cookie
	(end)
*/

Hash.Cookie = Hash.extend({

	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.name = name;
		this.setOptions(options);
		this.obj = {};
		return this.load();
	},

	/*
	Property: save
		Saves the Hash to the cookie.

	Returns:
		Returns false when the JSON string cookie is too long (4kb), otherwise this.

	Example:
		(start code)
		var login = new Hash.Cookie('userstatus', {autoSave: false});

		login.empty(); // make sure Hash is empty

		login.extend({
			'username': 'John',
			'credentials': [4, 7, 9]
		});
		login.set('last_message', 'User logged in!');

		login.save(); // finally save the Hash
		(end)
	*/

	save: function(auto){
		if (auto && !this.options.autoSave) return this;
		var val = Json.toString(this.obj);
		if (val.length > 4096) return false; //cookie would be truncated!
		Cookie.set(this.name, val, this.options);
		return this;
	},

	load: function(){
		return this.empty(true).extend(Json.evaluate(Cookie.get(this.name), true));
	},

	/*
	Property: save
		Saves the Hash to the cookie.

	Returns:
		Returns false when the JSON string cookie is too long (4kb), otherwise this.

	Example:
		(start code)
		var login = new Hash.Cookie('userstatus');
		login.erase(); // delete cookie
		(end)
	*/

	erase: function(){
		this.empty(true);
		Cookie.remove(this.name, this.options);
		return this;
	},

	set: function(key, value, skipSave){
		this.parent(key, value);
		return skipSave ? this : this.save(true);
	},

	remove: function(key){
		this.parent(key);
		return this.save(true);
	},

	empty: function(skipSave){
		this.parent();
		return skipSave ? this : this.save(true);
	},

	extend: function(obj, skipSave){
		for (var key in obj) this.set(key, obj[key], true);
		return skipSave ? this : this.save(true);
	}

});

Hash.Cookie.implement(new Options);