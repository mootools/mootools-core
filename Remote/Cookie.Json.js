/*	
Script: Cookie.Json.js
	A cookie reader/creator that allows for the storage and retrieval of JSON data and collections of items.

Credits:
	based on the CookieJar class by Lalit Patel (http://www.lalit.org/lab/jsoncookies)
*/
	
/*
Class: Cookie.Json
	Stores an object as a cookie using json format.
	
Arguments:
	name - (string) a unique name for all the items in this jar; required.
	options - an object with options names as keys. See options below.

Options:
	These options are identical to <Cookie> and are simply passed along to it.
		
	domain - the domain the Cookie belongs to. If you want to share the cookie with pages located on a different domain, you have to set this value. Defaults to the current domain.
	path - the path the Cookie belongs to. If you want to share the cookie with pages located in a different path, you have to set this value, for example to "/" to share the cookie with all pages on the domain. Defaults to the current path.
	duration - the duration of the Cookie before it expires, in seconds. If set to false or 0, the cookie will be a session cookie that expires when the browser is closed. This is default.
	secure - Stored cookie information can be accessed only from a secure environment.

Example:
	(start code)
	var cookieJar = new Cookie.Json('myCookieName');
	var myObject = {
		lemon: 'yellow',
		apple: 'red'
	}
	cookieJar.put('myObject', myObject);
	cookieJar.get('lemon'); //returns yellow
	
	var myOtherObject = {
		apple: {
			sour: 'green',
			sweet: 'red'
		}
		lime: 'green',
		grape: 'purple'
	}
	cookieJar.merge(myOtherObject);
	cookieJar.get('apple').sour; //returns green
	(end)
*/

Cookie.Json = new Class({

	initialize: function(name, options){
		this.name = name;
		this.options = options;
		return;
	},

	/*	
	Property: set
		Puts an item into the collection (and stores it as a cookie with the name prefix).

	Arguments: 	
		key - (string) the name of the item
		value - (object) the object to store (can be a string, number, object, etc.)
	*/

	set: function(key, value){
		var object = this.get() || {};
		object[key] = value;
		this.save(object);
		return this;
	},
	
	/*	
	Property: save
		Saves an object for the entire value of this Json.Cookie, overwriting any previous data.

	Arguments: 	
		object - the value to save
	*/

	save: function(object){
		object = Json.toString(object);
		if (object.length > 4096) return false; //cookie would be truncated!
		Cookie.set(this.name, object, this.options);
		return this;
	},

	/*	
	Property: remove
		Removes an item from the collection.

	Arguments: 	
		key - (string) the name of the item
	*/

	remove: function(key){
		var object = this.get();
		delete object[key];
		this.save(object);
		return this;
	},

	/*	
	Property: get
		Returns the value of an item in the collection, or the entire collection.
	
	Arguments:
		key - (string) the name of the item; if not provided, the entire object is returned.
	*/

	get: function(key){
		var value = Cookie.get(this.name);
		if (value){
			var object = Json.evaluate(value, true);
			value = (object && key) ? object[key] : object;
		}
		return value;
	},

	/*
	Property: empty
		Removes the cookie.
	*/

	empty: function(){
		this.save(null);
	},

	/*
	Property: merge
		Merges an object with the values in the cookie, *overwritting the cookie* values where namespaces overlap.
	*/
	
	merge: function(obj){
		this.save($merge(this.get(), obj));
	},

	/*
	Property: fill
		Merges an object with the values in the cookie, *overwritting the passed in values* where namespaces overlap.
	*/
	
	fill: function(obj){
		this.save($merge(obj, this.get()));
	}

});