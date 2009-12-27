/*
Script: Hash.Cookie.js
	Specs for Hash.Cookie.js

License:
	MIT-style license.
*/

describe("Hash.Cookie", {

	'should create a new hash cookie': function(){
		(function(){
			var fruits = new Hash.Cookie('hash_cookie_test');
			fruits.extend({
				'lemon': 'yellow',
				'apple': 'red'
			});
			fruits.set('melon', 'green');
		})();
		value_of(Cookie.get('hash_cookie_test')).should_be('{"lemon":"yellow","apple":"red","melon":"green"}');
	},
	
	'should retrieve a hash cookie': function(){
		value_of(new Hash.Cookie('hash_cookie_test').get('lemon')).should_be('yellow');
	},
	
	'should remove a hash cookie': function(){
		Cookie.remove('hash_cookie_test');
		value_of(Cookie.get('hash_cookie_test')).should_be_false();
	}

});