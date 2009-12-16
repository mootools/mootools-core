/*
Script: Cookie.js
	Public Specs for Cookie.js 1.2

License:
	MIT-style license.
*/

describe('Cookie', {
	
	"should set a cookie": function(){
		Cookie.set('test', 1);
		value_of(document.cookie).should_match(/test=1/);
	},
	
	"should get a cookie": function(){
		Cookie.set('test', 2);
		value_of(Cookie.get('test')).should_be(2);
	},

	"should remove a cookie": function(){
		Cookie.remove('test');
		value_of(Cookie.get('test')).should_be_false();
	},
	
	"should set a cookie with path option": function(){
		var uri = {
			regex: /^(?:(\w+):)?(?:\/\/(?:(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
			parts: ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment']
		};
		var match = window.location.href.match(uri.regex)
		match.shift();
		var location = match.associate(uri.parts);
		
		Cookie.set('test', 3, {
			path: location.directory
		});
		value_of(document.cookie).should_match(/test=3/);

	}
	
});