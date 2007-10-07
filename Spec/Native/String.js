/*
Script: String.js
	Specs for String.js

License:
	MIT-style license.
*/

describe('String', {

	'should `capitalize` each word': function(){
		value_of('i like cookies'.capitalize()).should_be('I Like Cookies');
		value_of('I Like cOOKIES'.capitalize()).should_be('I Like COOKIES');
	},

	'should convert a hyphenated string into a `camelCase`d string': function(){
		value_of('i-like-cookies'.camelCase()).should_be('iLikeCookies');
		value_of('I-Like-Cookies'.camelCase()).should_be('ILikeCookies');
	},

	'should convert a camelCased string into a `hyphenate`d string': function(){
		value_of('iLikeCookies'.hyphenate()).should_be('i-like-cookies');
		value_of('ILikeCookies'.hyphenate()).should_be('-i-like-cookies');
	},

	'should `clean` all extraneous whitespace from the string': function(){
		value_of('  i     like    cookies   '.clean()).should_be("i like cookies");
		value_of('  i \n like \n cookies \n\t  '.clean()).should_be("i like cookies");
	},

	'should `trim` left and right whitespace from the string': function(){
		value_of('  i like cookies  '.trim()).should_be('i like cookies');
		value_of('  i  like  cookies  '.trim()).should_be('i  like  cookies');
	},

	'should return true if the string `contains` the string, otherwise false': function(){
		value_of('i like cookies'.contains('cookies')).should_be_true();
		value_of('i,like,cookies'.contains('cookies')).should_be_true();
		value_of('mootools'.contains('inefficient javascript')).should_be_false();
	},

	'should return true if the string `constains` the string and separator, otherwise false': function(){
		value_of('i like cookies'.contains('cookies', ' ')).should_be_true();
		value_of('i like cookies'.contains('cookies', ',')).should_be_false();

		value_of('i,like,cookies'.contains('cookies', ' ')).should_be_false();
		value_of('i,like,cookies'.contains('cookies', ',')).should_be_true();
	},

	'should return true if the `test` matches the string, otherwise false': function(){
		value_of('i like teh cookies'.test('cookies')).should_be_true();
		value_of('i like cookies'.test('ke coo')).should_be_true();
		value_of('I LIKE COOKIES'.test('cookie', 'i')).should_be_true();
		value_of('i like cookies'.test('cookiez')).should_be_false();
	},

	'should return true if the regular expression `test` matches the string, otherwise false': function(){
		value_of('i like cookies'.test(/like/)).should_be_true();
		value_of('i like cookies'.test(/^l/)).should_be_false();
	},

	'should `toInt` the string': function(){
		value_of('10'.toInt()).should_be(10);
		value_of('10px'.toInt()).should_be(10);
		value_of('10.10em'.toInt()).should_be(10);
	},

	'should `toInt` the string and change the base': function(){
		value_of('10'.toInt(5)).should_be(5);
	},

	'should `toFloat` the string': function(){
		value_of('10.11'.toFloat()).should_be(10.11);
		value_of('10.55px'.toFloat()).should_be(10.55);
	},

	'should `rgbToHex` a CSS rgb string into a CSS hex string': function(){
		value_of('rgb(255,255,255)'.rgbToHex()).should_be('#ffffff');
		value_of('rgb(255,255,255,0)'.rgbToHex()).should_be('transparent');
	},

	'should `hexToRgb` a CSS hex string into a CSS rgb string': function(){
		value_of('#fff'.hexToRgb()).should_be('rgb(255,255,255)');
		value_of('ff00'.hexToRgb()).should_be('rgb(255,0,0)');
		value_of('#000000'.hexToRgb()).should_be('rgb(0,0,0)');
	}

});