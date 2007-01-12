/*
Script: Cookie.js
	A cookie reader/creator

Author:
	Christophe Beyls, <http://www.digitalia.be>

Credits: 
	based on the functions by Peter-Paul Koch (http://quirksmode.org)
*/

/*
Class: Cookie
	Class for creating, getting, and removing cookies.
*/

var Cookie = {

	/*
	Property: set
		Sets a cookie in the browser.

	Arguments:
		key - the key (name) for the cookie
		value - the value to set, cannot contain semicolons
		options: an object representing the Cookie options. See Options below:

	Options:
		domain - the domain the Cookie belongs to. Defaults to current domain ('/').
		duration - the duration of the Cookie before it expires, in days. Defaults to 365 days.
		session - boolean: if set to true, the cookie will expire when the browser is closed (duration will be ignored). Defaults to false.

	Example:
		>Cookie.set("username", "Aaron", {duration: 5}); //save this for 5 days

	*/

	set: function(key, value, options){
		options = Object.extend({
			domain: '/',
			duration: 365,
			session: false
		}, options || {});
		var cookie = key + "=" + escape(value) + "; path=" + options.domain;
		if (!options.session){
			var date = new Date();
			date.setTime(date.getTime() + (options.duration * 86400000));
			cookie += "; expires=" + date.toGMTString();
		}
		document.cookie = cookie;
	},

	/*
	Property: get
		Gets the value of a cookie.

	Arguments:
		key - the name of the cookie you wish to retrieve.

	Returns:
		The cookie string value, or false if not found.

	Example:
		>Cookie.get("username") //returns Aaron
	*/

	get: function(key){
		var value = document.cookie.match('(?:^|;)\\s*'+key+'=([^;]*)');
		return value ? unescape(value[1]) : false;
	},

	/*
	Property: remove
		Removes a cookie from the browser.

	Arguments:
		key - the name of the cookie to remove

	Examples:
		>Cookie.remove("username") //bye-bye Aaron
	*/

	remove: function(key){
		this.set(key, '', {duration: -1});
	}

};