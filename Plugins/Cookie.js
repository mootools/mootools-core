/*	
Script: Cookie.js
	A cookie reader/creator

Credits: 
	based on the functions by Peter-Paul Koch (http://quirksmode.org)
	
Dependencies:
	<Moo.js>, <String.js>
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
		value - the value to set
		duration - optional, how long the cookie should remain (in days); defaults to 1 year.
		
	Example:
		>Cookie.set("username", "Aaron", 1) //save this for a day
		
	*/

	set: function(key, value, duration){
		var date = new Date();
		date.setTime(date.getTime()+((duration || 365)*86400000));
		document.cookie = key+"="+value+"; expires="+date.toGMTString()+"; path=/";
	},
	
	/*	
	Property: get
		Gets the value of a cookie.
		
	Arguments:
		key - the name of the cookie you wish to retrieve.
		
	Example:
		>Cookie.get("username") //returns Aaron
	*/
	
	get: function(key){
		var myValue, myVal;
		document.cookie.split(';').each(function(cookie){
			if(myVal = cookie.trim().test(key+'=(.*)')) myValue = myVal[1];
		});
		return myValue;
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