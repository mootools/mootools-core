/*
Script: Hash.Cookie.js
	Stores and loads a Hash as a Cookie using JSON format.

License:
	MIT-style license.
*/

/*
Class: Hash.Cookie
	Stores and loads a Hash as a Cookie using JSON format.

Extends:
	<Hash>

Syntax:
	>var myHashCookie = new Hash.Cookie(name[, options]);

Arguments:
	name    - (string) The key (name) for the cookie
	options - (object) All of <Cookie> options in addition an autoSave option.

	options (continued):
		autoSave - (boolean: defaults to true) An option to save the cookie at every operation.

Returns:
	(class) A new Hash.Cookie instance.

Example:
	[javascript]
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
	[/javascript]

Note:
	- Hash JSON string has a limit of 4kb (4096 bytes). Therefore, be careful with your Hash size.
	- Creating a new instance automatically loads the data from the Cookie into the Hash.
	- If the Hash is emptied, the cookie is also removed.

See Also:
	<Hash>
*/

Hash.Cookie = new Class({
	
	Implements: Options,
	
	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.name = name;
		this.setOptions(options);
		this.load();
	},

	/*
	Method: save
		Saves the Hash to the cookie. If the hash is empty, removes the cookie.

	Syntax:
		>myHashCookie.save();

	Returns:
		(boolean) Returns false when the JSON string cookie is too long (4kb), otherwise true.

	Example:
		[javascript]
			var login = new Hash.Cookie('userstatus', {autoSave: false});

			login.extend({
				'username': 'John',
				'credentials': [4, 7, 9]
			});
			login.set('last_message', 'User logged in!');

			login.save(); // finally save the Hash
		[/javascript]
	*/

	save: function(){
		var str = Json.encode(this.hash);
		if (str.length > 4096) return false; //cookie would be truncated!
		Cookie.set(this.name, str, this.options);
		return true;
	},

	/*
	Method: load
		Loads the cookie and assigns it to the Hash.

	Syntax:
		>myHashCookie.load();

	Returns:
		(class) This Hash.Cookie instance.

	Example:
		[javascript]
			var myHashCookie = new Hash.Cookie('myCookie');

			(function(){
				myHashCookie.load();
				if(!myHashCookie.length) alert('Cookie Monster must of eaten it!');
			}).periodical(5000);
		[/javascript]

	Note:
		Useful when polling.
	*/

	load: function(){
		this.hash = new Hash(Json.decode(Cookie.get(this.name), true));
	}

});

(function(){
	var methods = {};
	['extend', 'set', 'merge', 'empty', 'remove'].each(function(method){
		methods[method] = function(){
			this.hash[method].apply(this.hash, arguments);
			if (this.options.autoSave) this.save();
			return this;
		};
	});
	Hash.Cookie.implement(methods);
})();