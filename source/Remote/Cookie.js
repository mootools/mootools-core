/*
Script: Cookie.js
	A cookie reader/creator

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
		domain - the domain the Cookie belongs to. Defaults to current domain.
		duration - the duration in days of the Cookie. Defaults to 365 days.

	Example:
		>Cookie.set("username", "Aaron", {duration: 5}); //save this for 5 days

	*/

	set: function(key, value, options){
		options = Object.extend({
			domain: '/', duration: 365
		}, options || {});
		var date = new Date();
		date.setTime(date.getTime() + ((options.duration) * 86400000));
		document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path="+options.domain;
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
		return value ? value[1] : false;
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
		this.set(key, '', -1);
	}

};